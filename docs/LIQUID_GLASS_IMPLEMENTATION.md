# Liquid Glass Implementation Notes

This branch introduces a reusable Liquid Glass design system without rewriting the existing page content or adding a framework/build dependency.

The implementation deliberately treats **refraction** as the acceptance criterion. `backdrop-filter: blur(...)` by itself is not considered Liquid Glass.

## File layering

- `assets/css/style-base.css` — exact pre-Liquid-Glass stylesheet.
- `assets/css/style.css` — thin entrypoint importing the existing design plus the optical layers.
- `assets/css/liquid-glass.css` — v0.1 optical material tokens, specular layers, shared-lens styling and accessibility gates.
- `assets/css/liquid-glass-v2.css` — v0.2 content-copy renderer styling, palette morph and liquid range control.
- `assets/js/main-base.js` — exact pre-Liquid-Glass application behavior.
- `assets/js/main.js` — loader that runs original behavior first, then v0.1 and v0.2 enhancements.
- `assets/js/liquid-glass.js` — rounded-rect SDF displacement-map generator, SVG filter registry, surface decorator and spring shared lens.
- `assets/js/liquid-glass-v2.js` — cross-browser content-copy refraction, Search → Command Palette geometry morph, ROI liquid range thumbs and synchronization logic.
- `liquid-glass-lab.html` — optical validation surface and parameter playground.

## What qualifies as refraction

The optical core builds a rounded-rectangle signed-distance field (SDF) and converts the bezel normal into an RG displacement map:

```text
R channel -> X displacement
G channel -> Y displacement
128 / 128 -> neutral sample
```

Pixels near the inner rim diverge from 128 and drive `feDisplacementMap`; the deep center returns to neutral so content remains readable.

The visual acceptance test is simple:

> Put a straight grid/line behind the glass. If the line only becomes blurry, it is glassmorphism. If the line actually bends/moves near the rim, refraction is active.

## Renderer paths

### Chromium: `backdrop-svg`

Chromium uses the generated SVG displacement filter through `backdrop-filter` for the actual pixels behind the glass.

Pipeline:

```text
real backdrop
  -> generated displacement map
  -> feDisplacementMap
  -> very small optical blur/saturation
  -> material tint
  -> directional specular layer
  -> foreground content
```

### Safari / Firefox: `content-copy-svg`

Safari/WebKit and Firefox cannot currently be treated as reliable targets for SVG displacement inside `backdrop-filter`.

v0.2 therefore uses a different path:

```text
real DOM content
  -> synchronized non-interactive mirror
  -> clip mirror to the glass surface
  -> CSS filter:url(#generated-feDisplacementMap)
  -> material/specular layers
  -> original interactive foreground
```

This is not a Gaussian-blur fallback. The mirrored page text, lines and content pixels are the `SourceGraphic` being displaced.

### Mirror safety rules

The renderer sanitizes mirrors before inserting them:

- scripts are removed
- iframe/video/audio/canvas/object/embed nodes are removed
- duplicate `id` attributes are removed
- mirror controls cannot receive pointer events or focus
- Liquid Glass runtime layers are not recursively cloned
- scroll-reveal content is forced into its visible rendering state

The original DOM remains the only interactive/accessibility tree.

### Reduced transparency: `accessible-solid`

When `prefers-reduced-transparency` is active, optical copies/refraction are removed and the controls switch to a high-opacity readable material.

## Functional-layer scope

Liquid Glass is applied primarily to controls rather than every content card:

- floating island navigation
- primary / secondary CTA buttons
- Search control
- Command Palette
- feature-category shared lens
- navigation shared lens
- ROI range thumbs
- small status/badge controls
- theme/back-to-top controls

Bento cards, pricing cards and other long-form content surfaces remain content materials. This avoids a page full of translucent blur panels and keeps hierarchy legible.

## Shared moving lens

Navigation and feature tabs use **one physical lens** that moves/resizes between selected items instead of giving every tab its own translucent background.

The lens uses an interruptible damped spring, so a fast sequence such as A → B → C redirects the same lens toward the newest target instead of queueing three CSS animations.

## Search → Command Palette morph

The v0.2 layer treats the Island search pill and Command Palette as one continuous glass object:

1. record the search pill geometry
2. open the existing dialog (original JS remains source of truth)
3. map the final modal rectangle back onto the source pill with FLIP-like geometry
4. run a spring from source geometry to modal geometry
5. fade the actual command content in only after the glass shell has expanded
6. reverse the geometry for Escape / Cmd/Ctrl+K / backdrop close

This avoids the old `opacity: 0 -> 1` disconnected modal feeling.

## ROI Liquid Range Thumb

The native range inputs stay in the DOM and remain keyboard/accessibility controls.

The visual thumb is a separate real DOM Liquid Glass surface layered underneath the transparent native thumb hit target:

```text
native <input type="range"> (interaction + accessibility)
        |
        +-- visual track / fill
        +-- real Liquid Glass thumb
```

The glass thumb moves without regenerating its displacement map; map regeneration is reserved for size/radius changes.

## Declarative template API

Basic surface:

```html
<button data-liquid-glass="clear" data-lg-strength="10">
  Action
</button>
```

Request synchronized content-copy refraction on WebKit/Firefox:

```html
<div
  data-liquid-glass="regular"
  data-lg-copy-backdrop="true"
  data-lg-strength="11"
>
  ...
</div>
```

Shared lens:

```html
<div data-lg-segmented>
  <button class="is-active" aria-pressed="true">A</button>
  <button aria-pressed="false">B</button>
</div>
```

## Playground

Open `liquid-glass-lab.html`.

It contains:

- grid background for optical validation
- ordinary blur-only glassmorphism vs Liquid Glass comparison
- current renderer badge
- Refraction strength control
- Bezel control
- Radius control
- Specular intensity control
- Primary tint control
- `Copy CSS Tokens` helper

The lab is intentionally a technical test surface, not a marketing screenshot.

## Accessibility

- `prefers-reduced-motion`: shared lenses snap, palette morphing is skipped and range/thumb motion is minimized.
- `prefers-reduced-transparency`: content-copy/refraction layers are removed and controls become opaque/readable.
- low-memory / low-core devices receive lower-resolution displacement maps.
- native controls remain the input/focus targets.

## Performance rules

1. Real refraction is reserved for the functional layer.
2. Displacement maps regenerate on geometry changes, not every pointer move.
3. Range thumbs reuse one fixed-size map while moving.
4. Safari/Firefox content-copy is clipped to the glass element instead of rendering a full-screen filtered canvas.
5. media elements are excluded from DOM mirrors; a later WebGL path should handle video/canvas if needed.

## QA status

### Completed in this branch

- JS syntax checks for v0.1/v0.2 and Playground inline code.
- non-framework static loading path.
- mirror duplicate-ID removal.
- script/iframe/media removal from mirrors.
- reduced-motion/reduced-transparency code paths.
- original `style-base.css` / `main-base.js` preserved for rollback.

### Browser verification still required

The current execution environment does not provide a browser runtime for this repository branch, so the following must be visually verified before merge:

- [ ] Chrome/Edge: grid lines visibly bend at Island / lab surfaces.
- [ ] Safari macOS/iOS: `data-lg-renderer="content-copy-svg"` and underlying lines/text visibly displace.
- [ ] Firefox: content-copy path visibly displaces pixels.
- [ ] Search pill expands into Command Palette without a geometry jump.
- [ ] Escape reverses palette morph and restores focus behavior.
- [ ] ROI native sliders remain mouse/touch/keyboard operable.
- [ ] visual Liquid Glass thumb aligns with the native range value at min/mid/max.
- [ ] dark/light themes keep sufficient contrast.
- [ ] Reduce Motion removes spring motion.
- [ ] Reduce Transparency produces an opaque readable material.
- [ ] mobile scroll remains smooth with the Island visible.

## Next engineering slice

1. Browser-matrix visual QA and parameter tuning.
2. Reuse/cache content mirrors across large surfaces to reduce Safari DOM-copy cost.
3. Synchronize more highly dynamic mirrored content only when it can enter a glass region.
4. Optional WebGL renderer for video/canvas surfaces.
5. Extract stable Glass tokens/components into the public template customization docs.
