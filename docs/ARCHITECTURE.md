# VPE Architecture

Vanilla Product Experience is a zero-build static product-experience system. The architecture separates content ownership from enhancement runtimes so a fork can remove an expressive layer without rewriting the whole page.

## Layer model

```text
HTML content / semantics
        ↓
Template Core
style-base.css + main-base.js
        ↓
Optical Material
liquid-glass*.css/js
        ↓
Ambient Interaction Field
ambient-particles.css + ambient/*
        ↓
Site Motion
site-motion.css + motion/*
        ↓
Product UI / Art Direction
product-ui*.css + product-ui.js
        ↓
Experience Integration
experience-integration.css + PWA/cache policy
```

### Template Core

Owns content, semantic HTML, base layout and source-of-truth interaction state: navigation targets, feature filtering, Command Palette data, simulator data, ROI calculations, themes and standard page behavior.

### Optical Material

Owns real displacement/refraction, shared lenses, specular lighting, content-copy fallback and Liquid Glass functional components. It must not become the source of truth for business state.

### Ambient Field

Owns one particle simulation and its WebGL2/Canvas2D renderers. It consumes interaction state but does not own navigation, filtering or product data.

### Site Motion

Owns temporal continuity: springs, FLIP, number interpolation, section choreography and scroll-derived state. It may animate geometry but must never reduce the readable content box below its natural size.

### Product UI

Owns product-level information architecture, typography roles, mobile navigation, proof/conversion, media surfaces and light-mode art direction.

### Experience Integration

Contains cross-layer responsive/hardening rules that are genuinely integration concerns. It is intentionally small; component-specific rules should live with their owning layer.

## Runtime order

`assets/js/main.js` loads dependencies sequentially because later systems intentionally consume APIs and DOM state from earlier systems:

```text
main-base
→ Liquid Glass core
→ cross-browser Glass
→ Glass components
→ Ambient
→ Motion primitives/controller
→ Product UI
→ VPE facade ready
```

No bundler is required. Browser script loading is the dependency graph.

## Public facade

VPE v1 exposes `window.VPE`:

```js
VPE.version
VPE.glass
VPE.ambient
VPE.motion
VPE.ui
```

The facade references the existing runtime objects rather than duplicating them. Historical `Cursor*` globals remain compatibility aliases for v1.

## Content surfaces vs functional surfaces

A core design constraint:

```text
Functional control → may use real Liquid Glass
Long-form content → normally remains an opaque/readable content surface
```

This prevents dense sections from becoming walls of distortion and keeps GPU/CPU work concentrated where the material communicates interaction.

## State ownership

Prefer one source of truth:

- native input owns range interaction;
- base filter owns Feature Matrix visibility;
- base simulator owns workflow state;
- Product UI/Motion/Glass observe and enhance those states;
- Ambient consumes energy/state signals without duplicating product logic.

## Removal strategy

A fork can stop at any level. `style-base.css + main-base.js` are designed to remain useful without the enhancement stack. When removing a system, also remove its entrypoint import/loader and corresponding Service Worker cache entry.
