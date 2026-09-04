# Vanilla Product Experience — Documentation

VPE is organized as a stable static core plus removable enhancement systems. Use this page as the documentation index.

## Start here

| Document | Use it for |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | system boundaries, runtime order, public API and dependency rules |
| [CUSTOMIZE.md](CUSTOMIZE.md) | fork, rebrand, design tokens, content replacement |
| [SECTIONS.md](SECTIONS.md) | real DOM containers, section dependencies and safe removal |
| [BROWSER_SUPPORT.md](BROWSER_SUPPORT.md) | renderer paths, responsive policy, accessibility and known QA boundaries |
| [VERSIONING.md](VERSIONING.md) | project versions, internal modules, asset query strings and Service Worker rules |
| [DEPLOY.md](DEPLOY.md) | static hosting and GitHub Pages project-path deployment |
| [SEO.md](SEO.md) | canonical, hreflang, social metadata, structured data and sitemap |
| [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) | project release gates, browser pass and tagging checklist |

## Releases

- [v1.0.0 release notes](releases/v1.0.0.md)

## Experience systems

| System | Document |
| --- | --- |
| Optical material / real refraction | [LIQUID_GLASS_IMPLEMENTATION.md](LIQUID_GLASS_IMPLEMENTATION.md) |
| Ambient WebGL interaction field | [AMBIENT_PARTICLE_FIELD.md](AMBIENT_PARTICLE_FIELD.md) |
| Site-wide motion choreography | [SITE_MOTION_SYSTEM.md](SITE_MOTION_SYSTEM.md) |
| Product UI / art direction | [PRODUCT_UI_SYSTEM.md](PRODUCT_UI_SYSTEM.md) |

## Reference demo history

The project originally started as a Cursor 3.x showcase. That content history is preserved in [CURSOR_DEMO_HISTORY.md](CURSOR_DEMO_HISTORY.md). It is separate from the project-level [CHANGELOG](../CHANGELOG.md), which starts semantic versioning at VPE v1.0.0.

## Runtime layers

```text
Template Core
  → Liquid Glass
    → Ambient Field
      → Site Motion
        → Product UI
          → Experience Integration / PWA
```

The layers are intentionally removable. The stable template can run without optical/ambient/motion enhancements, while the reference demo enables the complete stack.
