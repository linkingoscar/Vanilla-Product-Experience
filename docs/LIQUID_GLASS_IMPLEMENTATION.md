# Liquid Glass Implementation Notes

This branch introduces the first working slice of the Liquid Glass design system without rewriting the existing HTML.

## File layering

- `assets/css/style-base.css` — exact pre-Liquid-Glass stylesheet blob.
- `assets/css/style.css` — tiny entrypoint importing the base styles and the new optical layer.
- `assets/css/liquid-glass.css` — material tokens, optical layers, shared-lens styling, accessibility gates.
- `assets/js/main-base.js` — exact pre-Liquid-Glass behavior blob.
- `assets/js/main.js` — tiny loader that runs the original behavior first and the material engine second.
- `assets/js/liquid-glass.js` — SDF displacement-map generator, SVG filter registry, surface decorator and spring shared lens.
- `liquid-glass-lab.html` — an explicit grid-background optical test page.

## What qualifies as refraction here

The engine generates a rounded-rectangle signed-distance field and converts the bezel normal into an RG displacement map. `R=128/G=128` is neutral. Pixels near the rim diverge from 128 and drive `feDisplacementMap`; the deep center returns to neutral so text remains readable.

This is intentionally different from `backdrop-filter: blur(...)` glassmorphism.

## Renderer paths

### Chromium

`backdrop-filter: url(#generated-displacement-filter)` is used for the actual pixels behind the glass, plus a very small optical blur and saturation adjustment.

### Safari / Firefox

Because SVG filters inside `backdrop-filter` are not consistently available, the engine uses the same geometry-derived SVG displacement filter on its local optical material layer. It does **not** claim Gaussian blur is equivalent refraction. A later phase can replace this local-material path with a synchronized content-copy renderer for full backdrop parity.

## Components upgraded automatically

The runtime decorates functional controls only:

- floating island navigation
- primary / secondary CTA buttons
- command palette modal
- feature category tabs through one shared moving lens
- nav active state through one shared moving lens
- small floating status controls / badges
- theme and back-to-top controls

Content cards remain content surfaces. This follows the functional-layer model instead of applying translucent blur to every card.

## Declarative template API

```html
<button data-liquid-glass="clear" data-lg-strength="10">Action</button>
```

Shared lens:

```html
<div data-lg-segmented>
  <button class="is-active" aria-pressed="true">A</button>
  <button aria-pressed="false">B</button>
</div>
```

## Accessibility

- `prefers-reduced-motion`: shared lens snaps instead of springing and press scaling is disabled.
- `prefers-reduced-transparency`: optical layers are removed and replaced by an opaque readable material.
- low-memory / low-core devices get a lower-resolution displacement map.

## Next implementation slice

1. True synchronized content-copy renderer for Safari/Firefox backdrop parity.
2. Search-button → command-palette shared-geometry morph.
3. ROI calculator slider thumb that materializes into glass while dragging.
4. Glass Playground controls for IOR / bezel / refraction / specular / spring.
