/**
 * GitHub API module for fetching BMAD manifest files
 * Supports both BMAD v4 and v6 formats
 */

const GITHUB_API_BASE = 'https://api.github.com';

// Manifest paths for different BMAD versions
const MANIFEST_PATHS = {
  v6: '_bmad/_config/manifest.yaml',
  v4: '.bmad-core/install-manifest.yaml',
};

/**
 * Fetch a file from GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @returns {Promise<{content: string|null, error: string|null}>}
 */
async function fetchFile(owner, repo, path) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'BMAD-Badge/1.0',
      },
    });

    if (response.status === 404) {
      return { content: null, error: 'not_found' };
    }

    if (response.status === 403) {
      return { content: null, error: 'rate_limited' };
    }

    if (!response.ok) {
      return { content: null, error: 'fetch_error' };
    }

    const data = await response.json();

    if (!data.content) {
      return { content: null, error: 'invalid_content' };
    }

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return { content, error: null };
  } catch (error) {
    return { content: null, error: 'network_error' };
  }
}

/**
 * Parse version from v6 manifest YAML content
 * Format: installation.version: x.x.x
 * @param {string} content - YAML content
 * @returns {{version: string|null, error: string|null}}
 */
function parseV6Version(content) {
  if (!content) {
    return { version: null, error: 'no_content' };
  }

  try {
    // Match: version: x.x.x under installation:
    const lines = content.split('\n');
    let inInstallation = false;

    for (const line of lines) {
      if (line.startsWith('installation:')) {
        inInstallation = true;
        continue;
      }
      if (inInstallation && line.startsWith('  version:')) {
        const match = line.match(/version:\s*["']?([^"\n]+)["']?/);
        if (match && match[1]) {
          return { version: match[1].trim(), error: null };
        }
      }
      // Exit installation block when hitting another top-level key
      if (inInstallation && line.match(/^[a-zA-Z]/)) {
        break;
      }
    }

    return { version: null, error: 'version_not_found' };
  } catch (error) {
    return { version: null, error: 'parse_error' };
  }
}

/**
 * Parse version from v4 manifest YAML content
 * Format: version: x.x.x (top level)
 * @param {string} content - YAML content
 * @returns {{version: string|null, error: string|null}}
 */
function parseV4Version(content) {
  if (!content) {
    return { version: null, error: 'no_content' };
  }

  try {
    // Match top-level version: x.x.x
    const match = content.match(/^version:\s*["']?([^"\n]+)["']?/m);
    if (match && match[1]) {
      return { version: match[1].trim(), error: null };
    }
    return { version: null, error: 'version_not_found' };
  } catch (error) {
    return { version: null, error: 'parse_error' };
  }
}

/**
 * Get BMAD version from a GitHub repository
 * Tries v6 format first, then v4 format
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<{version: string|null, error: string|null}>}
 */
async function getBMADVersion(owner, repo) {
  // Try v6 format first (newer projects)
  const v6Result = await fetchFile(owner, repo, MANIFEST_PATHS.v6);
  if (v6Result.content) {
    const parsed = parseV6Version(v6Result.content);
    if (parsed.version) {
      return { version: parsed.version, error: null, format: 'v6' };
    }
  }

  // Try v4 format (older projects)
  const v4Result = await fetchFile(owner, repo, MANIFEST_PATHS.v4);
  if (v4Result.content) {
    const parsed = parseV4Version(v4Result.content);
    if (parsed.version) {
      return { version: parsed.version, error: null, format: 'v4' };
    }
  }

  // Determine appropriate error
  if (v6Result.error === 'rate_limited' || v4Result.error === 'rate_limited') {
    return { version: null, error: 'rate_limited' };
  }

  // Neither format found
  return { version: null, error: 'not_installed' };
}

module.exports = {
  fetchFile,
  parseV6Version,
  parseV4Version,
  getBMADVersion,
  MANIFEST_PATHS,
};
