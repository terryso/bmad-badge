/**
 * GitHub API module for fetching BMAD manifest files
 */

const MANIFEST_PATH = '_bmad/_config/manifest.yaml';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch BMAD manifest from a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<{version: string, error?: string}>}
 */
async function fetchManifest(owner, repo) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${MANIFEST_PATH}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'BMAD-Badge/1.0',
      },
    });

    if (response.status === 404) {
      return { version: null, error: 'not_installed' };
    }

    if (response.status === 403) {
      return { version: null, error: 'rate_limited' };
    }

    if (!response.ok) {
      return { version: null, error: 'fetch_error' };
    }

    const data = await response.json();

    if (!data.content) {
      return { version: null, error: 'invalid_config' };
    }

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return { version: null, content, error: null };
  } catch (error) {
    return { version: null, error: 'network_error' };
  }
}

/**
 * Parse version from manifest YAML content
 * @param {string} content - YAML content
 * @returns {{version: string, error?: string}}
 */
function parseVersion(content) {
  if (!content) {
    return { version: null, error: 'no_content' };
  }

  try {
    // Simple YAML parsing for the version field
    const versionMatch = content.match(/version:\s*["']?([^"\n]+)["']?/);
    if (versionMatch && versionMatch[1]) {
      return { version: versionMatch[1].trim(), error: null };
    }
    return { version: null, error: 'version_not_found' };
  } catch (error) {
    return { version: null, error: 'parse_error' };
  }
}

/**
 * Get BMAD version from a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<{version: string|null, error: string|null}>}
 */
async function getBMADVersion(owner, repo) {
  const result = await fetchManifest(owner, repo);

  if (result.error) {
    return { version: null, error: result.error };
  }

  return parseVersion(result.content);
}

module.exports = {
  fetchManifest,
  parseVersion,
  getBMADVersion,
};
