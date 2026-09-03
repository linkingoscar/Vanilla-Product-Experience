# Liquid Glass Implementation Notes

This repository now ships a reusable, zero-build Liquid Glass design system on top of the static landing-page template.

The implementation deliberately uses **refraction** as the acceptance criterion. `backdrop-filter: blur(...)` alone is not considered Liquid Glass.

## Architecture

```text
Template Core
├── assets/css/style-base.css
└── assets/js/main-base.js

Public Entrypoints
├── assets/css/style.css
└── assets/js/main.js

Liquid Glass Optical Core
├── assets/css/liquid-glass.css
├── assets/js/liquid-glass.js
├── assets/css/liquid-glass-v2.css
└── assets/js/liquid-glass-v2.js

Liquid Glass Product Components
├── assets/css/liquid-glass-components.css
└── assets/js/liquid-glass-components.js

Developer Playground
└── liquid-glass-lab.html
```

The split is intentional:

- `*-base` owns reusable landing-page content/layout/behavior.
- v0.1 owns SDF/displacement/specular/shared-lens primitives.
- v0.2 owns cross-browser content-copy refraction, palette morphing and range controls.
- v0.3 owns visible product components assembled from those primitives.

A Fork can remove the Liquid Glass imports/loaders and keep the underlying landing-page template intact.

## Optical model

The core builds a rounded-rectangle signed-distance field and converts its bezel normal into an RG displacement map:

```text
R channel -> X displacement
G channel -> Y displacement
128 / 128 -> neutral sample
```

Pixels near the inner rim diverge from neutral and drive SVG `feDisplacementMap`. The center returns toward neutral to keep foreground content readable.

```text
Background pixels
      ↓
Rounded-rect SDF
      ↓
RG displacement map
      ↓
feDisplacementMap
      ↓
edge lensing
      ↓
material tint
      ↓
directional specular
      ↓
foreground content
```

## Renderer paths

### Chromium — `backdrop-svg`

Chromium applies the generated SVG displacement map to the actual backdrop pixels.

### Safari / Firefox — `content-copy-svg`

Where SVG displacement through `backdrop-filter` cannot be relied on, the v0.2 renderer creates a sanitized non-interactive copy of the real page/content and uses that as `SourceGraphic` for `filter:url(...)`.

The mirror:

- strips scripts and embedded media;
- removes duplicate IDs;
- cannot receive pointer/focus interaction;
- strips Liquid Glass runtime layers to avoid recursive glass;
- synchronizes dynamic ROI labels/range state and discrete page state changes.

The original DOM remains the accessibility and interaction tree.

### Reduced Transparency — `accessible-solid`

`prefers-reduced-transparency` removes optical copies/refraction and switches the material to a readable high-opacity surface.

## Visible component layer (v0.3)

### Floating Island Navigation

The existing Island uses the optical material as a functional navigation layer. The selected nav item is represented by **one moving lens**, not separate glass backgrounds for every item.

### Hero Workspace Controller

The Hero now includes a floating Liquid Glass execution-mode controller:

```text
Workspace  [ Local | Cloud | Private Pool ]  ● 3 Agents · Cloud
```

Switching modes updates the IDE-window title/status and moves one shared spring lens between the modes.

The Safari/Firefox content copy is sourced from the IDE window instead of cloning the controller itself.

### CTA controls

Primary and secondary CTA buttons use the same optical primitive with restrained tinting and press energy.

### Feature Tabs

Feature categories use one shared moving lens and remain compatible with the original filter behavior.

### Simulator segmented control

The existing prompt chips are upgraded at runtime into a horizontally scrollable shared-lens segmented control.

The original simulation logic remains the source of truth; the component layer only adds optical presentation and ARIA pressed state.

### Search → Command Palette

The Search pill and Command Palette behave like one continuous glass object:

```text
search pill
    ↓
geometry capture
    ↓
spring expansion
    ↓
command palette
```

The close path reverses the geometry instead of simply fading the modal away.

### ROI Liquid Range

Native `<input type="range">` elements remain the actual keyboard/touch/accessibility controls.

A Liquid Glass visual thumb is positioned from the native value:

```text
native range input
   ├── track/fill
   └── optical glass thumb
```

The thumb reuses a fixed geometry map while moving.

### Pricing display selector

Pricing now gets a reusable shared-lens selector:

```text
[ Monthly | Annualized ×12 ]
```

The annualized view is deliberately calculated as `current monthly price × 12` and explicitly states that it **does not imply an official annual discount**.

This makes the component useful for the template without inventing product pricing claims.

### Mobile/touch policy

On coarse-pointer or narrow devices:

- `data-lg-device="touch"` is enabled;
- high quality is reduced to `balanced`;
- specular intensity is reduced;
- the Hero controller moves into normal document flow;
- simulator chips become horizontal touch scrolling;
- native range inputs remain the touch target.

## Declarative optical API

Basic surface:

```html
<button data-liquid-glass="clear" data-lg-strength="10">
  Action
</button>
```

Request full Safari/Firefox content-copy refraction:

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

JavaScript API:

```js
CursorLiquidGlass.decorate(element, {
  variant: "clear",
  strength: 10
});

CursorLiquidGlass.installSharedLens(container, "button");

CursorLiquidGlassV2.installContentCopy(element, {
  source: document.querySelector(".underlying-content")
});

CursorLiquidGlassV2.installRange(rangeInput);
CursorLiquidGlassV2.syncContentCopies();
```

Component layer status:

```js
CursorGlassUI.version; // 0.3.x
CursorGlassUI.refresh();
```

## Design tokens

Common optical controls live in CSS variables:

```css
:root {
  --lg-ior: 1.48;
  --lg-refraction: 9px;
  --lg-refraction-strong: 13px;
  --lg-bezel: 15px;
  --lg-specular-alpha: 0.52;
  --lg-primary-tint: rgba(46, 115, 255, 0.28);
}
```

The template should tune these variables rather than scattering one-off glass values across components.

## Functional-layer rule

Liquid Glass is intentionally concentrated on interaction/navigation:

- Island navigation
- active lenses
- buttons
- Hero controls
- simulator controls
- pricing selector
- Command Palette
- sliders
- badges / small floating controls

Long-form Bento, Pricing, Timeline and Comparison cards remain content surfaces.

This avoids turning the site into a wall of translucent panels.

## Playground

Open:

```text
/liquid-glass-lab.html
```

The page contains:

- grid-based refraction acceptance background;
- blur-only vs displacement comparison;
- active renderer indicator;
- Refraction control;
- Bezel control;
- Radius control;
- Specular control;
- Tint control;
- Copy CSS Tokens helper.

Use the grid as the ground truth: a line that only blurs is not refraction.

## Accessibility

- `prefers-reduced-motion`: spring/morph animation is reduced or skipped.
- `prefers-reduced-transparency`: optical layers are replaced by solid readable materials.
- native controls remain in the focus/interaction tree.
- mirrors are `aria-hidden` and non-interactive.

## PWA/offline

The Service Worker caches the full dependency graph:

```text
style.css
  ├── style-base.css
  ├── liquid-glass.css
  ├── liquid-glass-v2.css
  └── liquid-glass-components.css

main.js
  ├── main-base.js
  ├── liquid-glass.js
  ├── liquid-glass-v2.js
  └── liquid-glass-components.js
```

Versioned query strings are preserved as exact cache keys.

## Performance rules

1. Real refraction stays on the functional layer.
2. Displacement maps regenerate on geometry changes, not normal movement.
3. Range thumbs reuse one fixed-size map while moving.
4. Mobile/coarse-pointer devices use the balanced optical budget.
5. Safari/Firefox mirrors remove media and recursive glass runtime layers.
6. Video/canvas is intentionally not DOM-rasterized by default.

## Optional future extension

If the template later needs Liquid Glass directly over continuously changing `<video>` or `<canvas>`, add a dedicated WebGL renderer for that media surface. It should remain an optional renderer rather than making the entire static page a WebGL application.
