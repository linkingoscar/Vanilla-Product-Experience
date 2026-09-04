# Vanilla Product Experience

> **A zero-build product experience system** built with plain HTML, CSS and JavaScript: real refraction, a WebGL ambient field, site-wide motion choreography, responsive product UI, PWA and accessibility.
>
> The bundled **Cursor 3.x** site is the reference demo, not the identity of the project.

[Live Demo](https://linkingoscar.github.io/Vanilla-Product-Experience/) · [中文](README.md) · [Documentation](docs/README.md) · [Customize](docs/CUSTOMIZE.md)

[![Version](https://img.shields.io/badge/VPE-v1.0.0-6366f1)](VERSION)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Build](https://img.shields.io/badge/build-zero-10b981)](#quickstart)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8)](manifest.json)

## What is this?

Vanilla Product Experience (**VPE**) is not a component library and not a React/Vite starter. It is a deployable static product-experience runtime:

```text
Static Content
    ↓
Template Core
    ↓
Optical Material System
    ↓
Ambient Interaction Field
    ↓
Site Motion System
    ↓
Product UI / Art Direction
    ↓
Experience Integration + PWA
```

The goal is to deliver the material, spatial, motion, information-architecture and responsive behavior expected from a premium product site **without a framework, bundler or runtime dependency**.

## What ships

| System | Responsibility |
| --- | --- |
| **Template Core** | bilingual pages, themes, Command Palette, Feature Matrix, simulator, ROI, pricing, comparison and SEO foundations |
| **Real Liquid Glass** | SDF displacement maps, `feDisplacementMap`, shared lenses, specular and cross-browser content-copy refraction |
| **Ambient Field** | WebGL2 particles, Canvas2D fallback, pointer wake, scroll energy and glass mirror bridge |
| **Site Motion** | spring physics, FLIP, continuous numbers, section choreography and Timeline progress |
| **Product UI** | Mobile Island, typography, proof, media surfaces, conversion and Light Mode art direction |
| **Integration** | responsive hardening, browser zoom/window resilience and PWA cache/version integrity |

The guiding rule is not “more effects.” Content stays primary, motion preserves continuity, glass belongs to functional controls, and ambient effects provide spatial context.

## Reference Demo: Cursor 3.x

The root page and `/en/` use Cursor 3.x as a high-fidelity reference experience. It exercises VPE against realistic product density with a 31-item Feature Matrix, Command Palette, workspace controls, workflow simulator, ROI calculator, Timeline, Pricing and Comparison.

Forks can replace all `DEMO:CURSOR` content while keeping the VPE runtime.

## Quickstart

No Node.js or npm installation is required:

```bash
git clone https://github.com/linkingoscar/Vanilla-Product-Experience.git
cd Vanilla-Product-Experience
python -m http.server 8000
```

For a rebrand:

1. search globally for `TEMPLATE:EDIT`;
2. replace brand, Hero, Features, Pricing, links and SEO;
3. edit base tokens in `assets/css/style-base.css`;
4. edit brand/type tokens in `assets/css/product-ui.css`;
5. replace `assets/icons/` and `manifest.json`;
6. deploy with [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Runtime architecture

```text
assets/css/style.css
├── style-base.css
├── liquid-glass*.css
├── ambient-particles.css
├── site-motion.css
├── product-ui*.css
└── experience-integration.css

assets/js/main.js
├── main-base.js
├── liquid-glass*.js
├── ambient/*
├── motion/*
└── product-ui.js
```

Project-level semantic versioning starts at **v1.0.0**. Internal modules retain their own diagnostic versions, while public entrypoints, releases and PWA cache policy follow the project version. See [`docs/VERSIONING.md`](docs/VERSIONING.md).

## Public API

v1 exposes a neutral facade:

```js
VPE.version
VPE.glass
VPE.ambient
VPE.motion
VPE.ui
```

Historical globals such as `CursorLiquidGlass`, `CursorAmbientField` and `CursorProductUI` remain compatibility aliases throughout v1.

## Browser and accessibility policy

- Chromium uses real backdrop displacement as the primary path.
- Safari / Firefox use content-copy SVG displacement.
- Ambient falls back to Canvas2D without WebGL2.
- `prefers-reduced-motion` stops or significantly reduces continuous motion.
- `prefers-reduced-transparency` switches to readable solid materials.
- Touch/coarse-pointer devices retain native targets and a lower visual budget.
- Responsive behavior covers continuous resize, zoom breakpoints, Mobile Island and horizontal segmented controls.

The repository has static integrity checks and Chromium integration tuning. Final Safari/Firefox visual calibration should still be performed in the target native browser versions. See [`docs/BROWSER_SUPPORT.md`](docs/BROWSER_SUPPORT.md).

## Documentation

Start with [`docs/README.md`](docs/README.md): Architecture, customization, sections, browser support, versioning, deployment, Liquid Glass, Ambient Field, Site Motion and Product UI are documented independently.

## Project rules

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before contributing. Core constraints include: no framework dependency for ordinary features, no scroll hijacking, no blur-only “refraction,” no motion that clips readable content, full keyboard/touch/reduced-motion paths, and synchronized asset-query/PWA cache versions.

## License and reference-demo attribution

VPE is released under the [MIT License](LICENSE).

Cursor 3.x is reference/demo content only. This repository is not an official Cursor/Anysphere project. Forks should replace `DEMO:CURSOR` brand and product claims.
