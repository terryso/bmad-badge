/**
 * SVG Badge generator for BMAD version
 */

// Color schemes based on version type
const COLORS = {
  stable: '#97ca00',   // Green
  beta: '#007ec6',     // Blue
  alpha: '#fe7d37',    // Orange
  rc: '#007ec6',       // Blue
  error: '#e05d44',    // Red
  notInstalled: '#9f9f9f', // Gray
  rateLimited: '#dfb317',  // Yellow
};

/**
 * Determine version type and return appropriate color
 * @param {string} version - Version string
 * @returns {string} - Hex color code
 */
function getVersionColor(version) {
  if (!version) return COLORS.error;

  const v = version.toLowerCase();

  if (v.includes('alpha')) return COLORS.alpha;
  if (v.includes('beta')) return COLORS.beta;
  if (v.includes('rc')) return COLORS.rc;

  return COLORS.stable;
}

/**
 * Get error color based on error type
 * @param {string} error - Error type
 * @returns {string} - Hex color code
 */
function getErrorColor(error) {
  switch (error) {
    case 'not_installed':
      return COLORS.notInstalled;
    case 'rate_limited':
      return COLORS.rateLimited;
    default:
      return COLORS.error;
  }
}

/**
 * Get display text for error
 * @param {string} error - Error type
 * @returns {string} - Human readable error message
 */
function getErrorText(error) {
  switch (error) {
    case 'not_installed':
      return 'not installed';
    case 'rate_limited':
      return 'rate limited';
    case 'fetch_error':
      return 'fetch error';
    case 'invalid_config':
      return 'invalid config';
    case 'network_error':
      return 'network error';
    default:
      return 'error';
  }
}

/**
 * Calculate text width (approximate)
 * @param {string} text - Text to measure
 * @param {number} padding - Extra padding on sides
 * @returns {number} - Approximate width in pixels
 */
function calculateTextWidth(text, padding = 10) {
  // Approximate: 6.5px per character for Verdana 11px
  return Math.ceil(text.length * 6.5) + padding;
}

/**
 * Generate flat style SVG badge
 * @param {string} label - Left label (e.g., "BMAD")
 * @param {string} message - Right message (e.g., version)
 * @param {string} color - Hex color for message background
 * @returns {string} - SVG string
 */
function generateFlatBadge(label, message, color) {
  const labelWidth = calculateTextWidth(label, 8);
  const messageWidth = calculateTextWidth(message, 8);
  const totalWidth = labelWidth + messageWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="${totalWidth}" height="20" fill="#555"/>
  <rect rx="3" x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
  <path fill="url(#a)" d="M0 0h${totalWidth}v20H0z"/>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(label)}</text>
    <text x="${labelWidth / 2}" y="14">${escapeXml(label)}</text>
    <text x="${labelWidth + messageWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(message)}</text>
    <text x="${labelWidth + messageWidth / 2}" y="14">${escapeXml(message)}</text>
  </g>
</svg>`;
}

/**
 * Generate flat-square style SVG badge
 * @param {string} label - Left label
 * @param {string} message - Right message
 * @param {string} color - Hex color for message background
 * @returns {string} - SVG string
 */
function generateFlatSquareBadge(label, message, color) {
  const labelWidth = calculateTextWidth(label, 8);
  const messageWidth = calculateTextWidth(message, 8);
  const totalWidth = labelWidth + messageWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <rect width="${labelWidth}" height="20" fill="#555"/>
  <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="14">${escapeXml(label)}</text>
    <text x="${labelWidth + messageWidth / 2}" y="14">${escapeXml(message)}</text>
  </g>
</svg>`;
}

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate badge SVG
 * @param {object} options - Badge options
 * @param {string} options.version - BMAD version
 * @param {string} options.error - Error type (if any)
 * @param {string} options.style - Badge style (flat, flat-square)
 * @param {string} options.color - Custom color (optional)
 * @param {string} options.label - Custom label (default: "BMAD")
 * @returns {string} - SVG string
 */
function generateBadge({ version, error, style = 'flat', color, label = 'BMAD' }) {
  let message;
  let badgeColor;

  if (error) {
    message = getErrorText(error);
    badgeColor = color || getErrorColor(error);
  } else if (version) {
    message = `v${version.replace(/^v/, '')}`;
    badgeColor = color || getVersionColor(version);
  } else {
    message = 'unknown';
    badgeColor = color || COLORS.error;
  }

  if (style === 'flat-square') {
    return generateFlatSquareBadge(label, message, badgeColor);
  }

  return generateFlatBadge(label, message, badgeColor);
}

module.exports = {
  generateBadge,
  getVersionColor,
  getErrorColor,
  COLORS,
};
