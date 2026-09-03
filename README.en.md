# Cursor 3.x Showcase & Static Product Landing Page Template

> 🖥️ A polished zero-build landing-page template using **Cursor 3.x** as high-fidelity demo content.  
> ⚡ Pure HTML/CSS/JavaScript: fork it, replace the marked content, and deploy your own AI / SaaS / open-source product site.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/Accessibility-ARIA-005A9C?logo=w3c&logoColor=white)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)

> 🌐 **[中文说明](README.md)**

---

## Two ways to use the repository

### Cursor showcase

- Browse the 31-item feature matrix, timeline, pricing and comparison content;
- Try the Agent simulator, ROI calculator and keyboard-first Command Palette;
- Use the Cursor copy as demo content or replace it entirely.

### Static Landing Page Template

- no React / Vue / Vite / Webpack;
- no Node.js required to run the site;
- bilingual pages, dark mode, PWA, SEO and accessibility built in;
- `TEMPLATE:EDIT`, `TEMPLATE:OPTIONAL`, `TEMPLATE:CORE` and `DEMO:CURSOR` markers;
- an independently removable **Liquid Glass Optical Design System**.

---

## Real Liquid Glass — not blur-only glassmorphism

The `feat/liquid-glass-design-system` branch uses geometry-derived displacement rather than presenting `backdrop-filter: blur()` as refraction.

```text
Rounded-Rect SDF
      ↓
RG Displacement Map
      ↓
SVG feDisplacementMap
      ↓
Edge Lensing / Refraction
      ↓
Material Tint
      ↓
Directional Specular Highlight
```

### Renderer paths

- **Chromium** — `backdrop-svg`: SVG displacement is applied to the real backdrop pixels.
- **Safari / Firefox** — `content-copy-svg`: a sanitized, non-interactive mirror of the real page content becomes the displaced `SourceGraphic`.
- **Reduced Transparency** — `accessible-solid`: refraction is removed in favor of a high-opacity readable surface.
- Video/canvas surfaces are intentionally excluded from DOM mirroring; an optional WebGL renderer can be added later.

Liquid Glass is used mainly on the functional layer:

- Floating Island navigation
- one shared moving active lens
- primary / secondary CTA buttons
- Search → Command Palette shared-geometry morph
- segmented feature tabs
- ROI liquid range thumbs
- small floating controls and status badges

Content cards remain content surfaces instead of turning the entire site into translucent blur panels.

Open `liquid-glass-lab.html` for the optical test grid and the Refraction / Bezel / Radius / Specular / Tint playground.

Engineering details and browser QA checklist: [`docs/LIQUID_GLASS_IMPLEMENTATION.md`](docs/LIQUID_GLASS_IMPLEMENTATION.md).

> Static CI is enabled on the branch. Final Chrome/Safari/Firefox visual tuning still requires real-browser verification before merge.

---

## 5-minute Fork quickstart

1. Fork the repository or use **Use this template**.
2. Search globally for `TEMPLATE:EDIT` and replace brand/copy/links.
3. Edit `assets/css/style-base.css` for the base Design Tokens.
4. Edit `assets/js/main-base.js` when you need to change `searchIndex`, simulator data or template behavior.
5. Replace `assets/icons/` and update `manifest.json`.
6. Deploy with [`docs/DEPLOY.md`](docs/DEPLOY.md).

---

## File responsibilities

| File | Purpose | Usually edit when forking? |
| :--- | :--- | :---: |
| `index.html` | Chinese brand, Hero, Features, Pricing, SEO | Yes |
| `en/index.html` | English content; removable for a single-language site | Optional |
| `assets/css/style-base.css` | **Base Design Tokens and component styles** | Recommended |
| `assets/css/style.css` | Thin CSS entrypoint loading base + all enhancements | Usually no |
| `assets/css/liquid-glass.css` | Optical material, specular, shared lens | Advanced |
| `assets/css/liquid-glass-v2.css` | Content-copy, palette morph, liquid range | Advanced |
| `assets/css/liquid-glass-components.css` | Product UI layer (Hero, Pricing, Simulator) | Advanced |
| `assets/css/ambient-particles.css` | Ambient particle field styling | Advanced |
| `assets/css/site-motion.css` | Site-wide motion choreography and timing | Advanced |
| `assets/js/main-base.js` | **Template behavior, search index, simulator, ROI** | As needed |
| `assets/js/main.js` | Thin JS loader chaining enhancement layers | Usually no |
| `assets/js/liquid-glass.js` | SDF, displacement maps, SVG filters, shared spring | Advanced |
| `assets/js/liquid-glass-v2.js` | Cross-browser content-copy and fluid interactions | Advanced |
| `assets/js/liquid-glass-components.js` | Hero controller, Pricing and Simulator lenses | Advanced |
| `assets/js/ambient/` | WebGL2 particle simulation and interaction field | Advanced |
| `assets/js/motion/` | Spring physics, FLIP layout, number flow & choreography | Advanced |
| `liquid-glass-lab.html` | Optical validation / token playground | Optional |
| `ambient-particle-lab.html` | Particle field tuning playground | Optional |
| `manifest.json` | PWA metadata | For PWA |
| `sw.js` | Offline cache graph and cache invalidation | On deploy changes |

### Why `*-base` files?

The stable template and the optical experiment have separate lifecycles:

```text
Template Core
style-base.css + main-base.js
        │
        ▼
Liquid Glass Enhancement
liquid-glass*.css + liquid-glass*.js
```

You can update, roll back or remove Liquid Glass without rewriting the content/template engine.

### Disable Liquid Glass

In `assets/css/style.css`, remove the two `liquid-glass*.css` imports and keep only `style-base.css`.

In `assets/js/main.js`, load only:

```js
loadScript("main-base.js?v=3.10.0");
```

The bilingual site, themes, tabs, Command Palette, simulator, ROI calculator and PWA remain available.

---

## Base Design Tokens

Edit `assets/css/style-base.css`:

```css
:root {
  --blue: #0071e3;
  --indigo: #6366f1;
  --bg-app: #fbfbfd;
  --bg-surface: #ffffff;
  --text-main: #1d1d1f;
  --font-sans: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --bg-app: #08090e;
  --bg-surface: #141724;
  --text-main: #f5f5f7;
}
```

Advanced Glass tokens live in `assets/css/liquid-glass.css`:

```css
:root {
  --lg-ior: 1.48;
  --lg-refraction: 9px;
  --lg-bezel: 15px;
  --lg-specular-alpha: 0.52;
}
```

Tune those values against the grid in `liquid-glass-lab.html` rather than maximizing distortion.

---

## Component inventory

| Component | HTML container | Reusable for |
| :--- | :--- | :--- |
| Floating Island | `header.island` | product nav, search, language switch |
| Hero | `section.hero` | positioning + CTA |
| Highlights | `section#highlights` | Bento value propositions |
| Feature Matrix | `section#new-features` | filterable capability matrix |
| Interactive Demo | `section#composer-25` | simulator / calculator |
| Media | `section#media` | product videos |
| Timeline | `section#timeline` | changelog / roadmap |
| Pricing | `section#pricing` | SaaS plans |
| Comparison | `section#compare` | competitor matrix |
| CTA | `section#start` | final conversion section |
| Command Palette | `div#cmdPalette` | ⌘K / Ctrl+K navigation |

---

## Documentation

- [`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md) — rebrand, Design Tokens and Glass customization
- [`docs/SECTIONS.md`](docs/SECTIONS.md) — section dependencies and safe removal
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — GitHub Pages / Vercel / Cloudflare / Netlify
- [`docs/LIQUID_GLASS_IMPLEMENTATION.md`](docs/LIQUID_GLASS_IMPLEMENTATION.md) — renderer architecture, accessibility, performance and QA

---

## Static CI

`.github/workflows/liquid-glass-checks.yml` validates without npm dependencies:

- JavaScript and Service Worker syntax;
- duplicate HTML IDs;
- CSS/JS entrypoint dependency graph;
- displacement/content-copy renderer invariants;
- reduced-motion and reduced-transparency paths.

---

## Disclaimer

Cursor names, features, pricing and trademarks are included only as high-fidelity demo content. This is an independent open-source community project and is not affiliated with, sponsored by, or endorsed by Cursor / Anysphere, Inc.

## License

MIT License. Free for personal, open-source and commercial landing pages.
