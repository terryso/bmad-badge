# BMAD Badge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Dynamic version badge for projects using [BMAD METHOD](https://github.com/bmad-code-org/BMAD-METHOD).

## Live Demo

| Repository | Badge |
|------------|-------|
| [terryso/bmad-starter-kit](https://github.com/terryso/bmad-starter-kit) | [![BMAD](https://bmad-badge.vercel.app/terryso/bmad-starter-kit.svg)](https://github.com/bmad-code-org/BMAD-METHOD) |

## Usage

Add this to your README.md:

```markdown
[![BMAD](https://bmad-badge.vercel.app/{owner}/{repo}.svg)](https://github.com/bmad-code-org/BMAD-METHOD)
```

Replace `{owner}` and `{repo}` with your GitHub username and repository name.

### Example

```markdown
[![BMAD](https://bmad-badge.vercel.app/terryso/bmad-starter-kit.svg)](https://github.com/bmad-code-org/BMAD-METHOD)
```

Result: [![BMAD](https://bmad-badge.vercel.app/terryso/bmad-starter-kit.svg)](https://github.com/bmad-code-org/BMAD-METHOD)

## Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `style` | Badge style: `flat` or `flat-square` | `flat` |
| `color` | Custom color (hex without #) | Auto (based on version) |
| `label` | Custom label text | `BMAD` |

### Examples

```markdown
<!-- Flat style (default) -->
[![BMAD](https://bmad-badge.vercel.app/nick/my-project.svg)]

<!-- Flat-square style -->
[![BMAD](https://bmad-badge.vercel.app/nick/my-project.svg?style=flat-square)]

<!-- Custom color -->
[![BMAD](https://bmad-badge.vercel.app/nick/my-project.svg?color=ff69b4)]

<!-- Custom label -->
[![BMAD](https://bmad-badge.vercel.app/nick/my-project.svg?label=BMAD%20Method)]
```

## Color Rules

| Version Type | Color |
|--------------|-------|
| Stable (e.g., 1.0.0) | Green `#97ca00` |
| Beta (e.g., 1.0.0-Beta.1) | Blue `#007ec6` |
| Alpha (e.g., 1.0.0-Alpha.1) | Orange `#fe7d37` |
| Not installed | Gray `#9f9f9f` |

## How It Works

1. The badge service queries the GitHub API for your repository
2. It looks for BMAD manifest files (supports both v4 and v6):
   - **v6**: `_bmad/_config/manifest.yaml` → `installation.version`
   - **v4**: `.bmad-core/install-manifest.yaml` → `version`
3. Generates an SVG badge with appropriate color

## Supported BMAD Versions

| Version | Manifest Path | Version Field |
|---------|---------------|---------------|
| v6.x | `_bmad/_config/manifest.yaml` | `installation.version` |
| v4.x | `.bmad-core/install-manifest.yaml` | `version` |

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Vercel
npm run deploy
```

## Project Structure

```
bmad-badge/
├── api/
│   └── [owner]/
│       └── [repo].js      # Serverless endpoint
├── lib/
│   ├── github.js          # GitHub API
│   └── badge.js           # SVG generator
├── public/
│   └── index.html         # Homepage
├── package.json
└── vercel.json
```

## License

MIT
