/**
 * Vercel Serverless Function - BMAD Badge API
 * Dynamic route: /{owner}/{repo}.svg
 */

const { getBMADVersion } = require('../../lib/github');
const { generateBadge } = require('../../lib/badge');

module.exports = async (req, res) => {
  const { owner, repo } = req.query;
  const { style, color, label } = req.query;

  // Validate parameters
  if (!owner || !repo) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(400).send(
      generateBadge({ error: 'invalid_params', style, color, label })
    );
  }

  // Remove .svg extension from repo if present
  const cleanRepo = repo.replace(/\.svg$/i, '');

  try {
    // Fetch BMAD version from GitHub
    const { version, error } = await getBMADVersion(owner, cleanRepo);

    // Generate badge SVG
    const svg = generateBadge({
      version,
      error,
      style: style || 'flat',
      color,
      label: label || 'BMAD',
    });

    // Set cache headers (1 hour)
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return res.status(200).send(svg);
  } catch (err) {
    console.error('Badge generation error:', err);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');

    return res.status(500).send(
      generateBadge({ error: 'server_error', style, color, label })
    );
  }
};
