# Cursor 3.x Feature Showcase (Static Site)

> A polished static website showcasing Cursor 3.x features, with bilingual support (Chinese/English), dark mode, and PWA offline access.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **[中文文档](README.md)**

## Features

- Dark mode (auto-detect system preference + manual toggle)
- Bilingual support (Chinese / English)
- Apple-style scroll animations
- Responsive design (desktop / tablet / mobile)
- PWA offline support
- Print-optimized styles
- Accessibility (ARIA labels)
- SEO optimization (Open Graph, structured data)

## File Structure

```
cursor3-static/
├── index.html              # Chinese homepage (40KB)
├── en/
│   └── index.html          # English homepage
├── assets/
│   ├── css/style.css       # Styles
│   └── js/main.js          # Scripts
├── manifest.json           # PWA config
├── sw.js                   # Service Worker
├── README.md               # Chinese docs
├── README.en.md            # English docs
├── CHANGELOG.md            # Changelog
└── LICENSE                 # MIT License
```

## Content Sections

| Section | Description |
|---------|-------------|
| Hero | Product positioning, official links |
| Highlights | Agents Window, Design Mode, MCP, etc. |
| New Features (3.1–3.9) | Canvases, Multi-agent Swarm, Deep Research, Sidecar Preview, SDK |
| Videos | Chinese: Bilibili tutorials; English: YouTube official/community tutorials; official docs links |
| Version Timeline | 1.x → 2.0 → 3.0 → 3.6 → 3.9 evolution |
| Pricing | Hobby / Pro / Pro+ / Ultra / Teams |
| Comparison | Cursor vs Copilot vs Claude Code (14 dimensions) |
| Getting Started | Quick start guide |

## Quick Start

### Local Preview (Simplest)

Just double-click `index.html` to open in your browser.

### Local Server

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then visit http://localhost:8000

## Deployment

### GitHub Pages (Recommended)

1. Go to repo **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Wait 1–2 minutes, visit `https://linkingoscar.github.io/cursor3-static/`

### Netlify

1. Log in to [Netlify](https://netlify.com)
2. Click **"New site from Git"**
3. Select GitHub repo `cursor3-static`
4. Leave Build command empty
5. Publish directory: `.`
6. Click **Deploy site**

### Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click **"New Project"**
3. Import GitHub repo `cursor3-static`
4. Framework Preset: **"Other"**
5. Click **Deploy**

### Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Connect GitHub repo
4. Leave build settings empty (static site)
5. Click **Save and Deploy**

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## Performance

- First paint < 1s
- Total assets < 100KB
- Lighthouse score 95+

## Contributing

Issues and Pull Requests are welcome!

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Data Sources

- [Cursor Changelog](https://cursor.com/changelog) — Official changelog
- [Cursor Blog](https://cursor.com/blog) — Official blog
- [Cursor Pricing](https://cursor.com/pricing) — Official pricing
- [Cursor Docs](https://cursor.com/docs) — Official docs
- Bilibili videos are third-party creator content, not officially produced
- YouTube videos come from Cursor's official channel and community creators like Traversy Media

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

If you find this useful, give it a Star!
