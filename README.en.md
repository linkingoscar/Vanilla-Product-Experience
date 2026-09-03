# Cursor 3.x Showcase & Static Product Landing Page Template

> 🖥️ A polished product showcase featuring **Cursor 3.x** as high-fidelity demo content.  
> ⚡ **Zero-framework, zero-build dependency**. Fork it, replace marked content in 15 minutes, and deploy your own AI / SaaS product landing page.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Responsive](https://img.shields.io/badge/Responsive-Design-38BDF8?logo=tailwindcss&logoColor=white)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-ARIA-005A9C?logo=w3c&logoColor=white)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)](https://vercel.com)

> 🌐 **[中文说明 (Chinese)](README.md)**

---

## 🧭 How Can You Use This Repository?

### ① As a Comprehensive Cursor 3.x Showcase & Benchmark
* Explore the **31-item frontier feature matrix** covering Cursor's evolution from 1.x to 3.10 / 4.0;
* Test interactive tools: **Multi-Agent Swarm Simulator**, **ROI Token Budget Calculator**, and **14+ Dimension Competitor Matrix**.

### ② As a Static Product Landing Page Template (Fork & Rebrand)
* **Zero build steps**: pure HTML/CSS/JavaScript with no Node.js or bundlers required;
* Standardized `TEMPLATE:EDIT` markers throughout the code for a **15-minute rebrand** and instant deployment.

---

## ⚡ 5-Minute Quickstart

```text
Fork / Use this template → Search for TEMPLATE:EDIT → Rebrand copy & links → Adjust theme tokens → Deploy
```

1. **Fork this repository** or click **Use this template**;
2. In your code editor, search for `TEMPLATE:EDIT` to update your title, logo, hero copy, features, and pricing;
3. Open `assets/css/style.css` to tweak primary brand colors (`--blue`) and dark mode surfaces in `:root`;
4. Replace icons inside `assets/icons/`;
5. Check [Deployment Guide](docs/DEPLOY.md) to launch on GitHub Pages, Vercel, or Cloudflare Pages for free!

---

## 🧩 Customization Map

| Core File | Customization Scope | Required? |
| :--- | :--- | :---: |
| `index.html` | Brand, Nav, Hero, Features, Pricing, SEO metadata | ✅ Yes |
| `en/index.html` | English counterpart (can be safely deleted for single-language sites) | Optional |
| `assets/css/style.css` | Design tokens (`--blue` accent, dark/light surfaces, typography) | 🎨 Recommended |
| `assets/js/main.js` | Search index `searchIndex` & interactive simulator copy | 💡 As needed |
| `assets/icons/` | Favicon, logos, and PWA icons | ✅ Yes |
| `manifest.json` | Web App title, theme color, and icon paths | For PWA |
| `sw.js` | Increment `CACHE_NAME` to invalidate offline client cache | When updating |

> 💡 **Search Keywords**:
> * `TEMPLATE:EDIT`: Configurable brand, copy, and link entries;
> * `TEMPLATE:OPTIONAL`: Sections that can be safely removed without breaking scripts;
> * `DEMO:CURSOR`: Cursor-specific demo content.

---

## 🏛️ Template Component Inventory

| Component | HTML Element | Demo Usage | Reusable For |
| :--- | :--- | :--- | :--- |
| **Dynamic Island** | `header.island-header` | Sticky navbar, scroll spy, ⌘K search, i18n | Floating nav with brand & quick search |
| **Hero Section** | `section.hero` | Gradient typography, skeuomorphic IDE window | Headline value prop + CTA buttons |
| **Highlights** | `section#highlights` | Agents Window / Design Mode Bento cards | Core product pillars in Bento layout |
| **Feature Matrix** | `section#new-features` | 31 capabilities with real-time category filtering | Comprehensive feature grid with tabs |
| **Interactive Demo** | `section#composer-25` | Agent concurrency simulator & ROI calculator | Interactive visual demo or calculators |
| **Media Section** | `section#media` | YouTube / Bilibili video embed | Product tour video or demos |
| **Timeline** | `section#timeline` | Cursor version milestones | Release history or future roadmap |
| **Pricing Table** | `section#pricing` | Multi-tier plan cards with highlight | SaaS tiered pricing & feature breakdowns |
| **Comparison** | `section#compare` | Cursor vs Copilot vs Claude Code | 14+ dimension competitor matrix |
| **CTA Banner** | `section#start` | Getting started quick guide | Sign up / download conversion banner |
| **Command Palette** | `div#cmdPalette` | ⌘K / Ctrl+K fuzzy search modal | Keyboard-first search across all sections |

---

## 📚 Detailed Documentation

* 📖 **[Customization Guide (docs/CUSTOMIZE.md)](docs/CUSTOMIZE.md)**: Comprehensive manual for rebranding, theming, and configuring features.
* 🧩 **[Sections & Architecture (docs/SECTIONS.md)](docs/SECTIONS.md)**: Module dependencies, class names, and safe removal guides.
* 🌐 **[Deployment Guide (docs/DEPLOY.md)](docs/DEPLOY.md)**: Step-by-step hosting on GitHub Pages (with subpath support), Vercel, and Cloudflare Pages.

---

## ⚖️ Disclaimer

1. **Demo Content**: Mentions of Cursor trademarks, features, and pricing are included solely as **high-fidelity demo content**. Replace them when deploying this repository for your own product.
2. **Non-Affiliation**: This is an independent open-source community project and is not affiliated with, endorsed by, or sponsored by **Cursor / Anysphere, Inc.** All trademarks belong to their respective owners.

---

## 📄 License

Open-sourced under the [MIT License](LICENSE). Free for personal and commercial projects!
