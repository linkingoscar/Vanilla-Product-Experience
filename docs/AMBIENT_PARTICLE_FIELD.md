# Ambient Particle Interaction Field

> Branch: `feat/ambient-particle-field`  
> Base: `feat/liquid-glass-design-system`

This layer turns the page background into an interactive digital medium beneath the Liquid Glass functional layer. It is inspired by modern particle-field landing pages, but it is implemented as a reusable part of this static template rather than a copy of any specific site.

## Layer model

```text
Background Base
  ↓
Low-frequency Gradient Blobs
  ↓
Ambient Particle Interaction Field
  ↓
Content Layer
  ↓
Liquid Glass Functional Layer
```

The particle field is intentionally strongest around the Hero and fades toward a low-intensity ambient state as the user scrolls into dense content.

## Files

```text
assets/css/ambient-particles.css
assets/js/ambient/
├── particle-renderer-webgl.js
├── interaction-field.js
└── particle-field.js
```

### `particle-renderer-webgl.js`

Small WebGL2 point-sprite renderer. It only renders positions/depth/opacity; physics stay on the CPU so the same state can be reused elsewhere.

### `interaction-field.js`

Collects:

- pointer position
- pointer velocity
- pointer wake energy
- scroll velocity
- Command Palette focus state
- Shared Liquid Lens movement pulses

### `particle-field.js`

Owns one particle simulation and feeds multiple renderers.

```text
Particle State
   ├── WebGL2 background renderer
   └── Safari/Firefox glass mirror canvases
```

If WebGL2 is unavailable, the main renderer falls back to Canvas2D with the same state/API.

## Particle behavior

The field is not a random particle rain.

Each particle has:

- stable normalized anchor
- current position
- velocity
- depth
- deterministic seed
- cluster assignment

Forces include:

1. low-frequency vector-field drift
2. spring return toward a stable anchor
3. pointer pressure / radial displacement
4. pointer-velocity wake
5. scroll energy
6. Shared Lens energy pulses
7. Workspace-mode-specific forces

## Workspace modes

The existing Hero Workspace Controller drives the particle field.

### Local

- tighter return spring
- lower flow strength
- smaller pointer influence radius
- visually stable/localized

### Cloud

- looser spring
- higher flow strength
- slow anchor drift
- broader spatial feeling

### Private Pool

- particles pull toward four soft cluster centers
- moderate flow
- represents pooled/self-hosted machines without changing the page into a different theme

The current mode is exposed on:

```html
<html data-ambient-mode="local|cloud|private">
```

## Liquid Glass bridge

### Chromium

The main WebGL canvas sits below the content layer, so the existing `backdrop-svg` Liquid Glass renderer sees and refracts the actual particle pixels.

### Safari / Firefox

The content-copy renderer cannot clone a WebGL canvas as live pixels. The ambient field therefore creates small Canvas2D mirror renderers inside selected Liquid Glass refraction surfaces.

All mirrors reuse the same CPU particle state. They do **not** run another physics simulation.

Each mirror copies the glass surface's current SVG displacement filter:

```text
shared particle state
    ↓
local mirror canvas
    ↓
existing feDisplacementMap filter
    ↓
refracted particles inside glass
```

Mirror targets currently include:

- Floating Island
- Command Palette
- Hero workspace glass
- Pricing segmented glass
- Liquid Range thumbs
- Shared lenses

## Command Palette behavior

When Command Palette opens:

- particle simulation force is reduced
- visual opacity drops
- pointer wake is suppressed

This keeps the background alive without competing with the search surface.

## Quality policy

The ambient field consumes the existing Liquid Glass quality tier when available.

```text
high      ~1100 particles, DPR cap 1.5
balanced  ~560 particles,  DPR cap 1.25
low       ~220 particles,  DPR cap 1.0
```

Narrow/mobile screens apply additional particle-count caps.

`prefers-reduced-motion` keeps a static particle field instead of continuously animating it.

When the tab becomes hidden, `requestAnimationFrame` is stopped.

## Public API

```js
CursorAmbientField.version
CursorAmbientField.quality
CursorAmbientField.mode
CursorAmbientField.count
```

### Change mode

```js
CursorAmbientField.setMode('local');
CursorAmbientField.setMode('cloud');
CursorAmbientField.setMode('private');
```

### Change density

```js
CursorAmbientField.setDensity(0.7);
```

Accepted range is clamped to `0.25`–`1.5`.

### Add an energy pulse

By coordinates:

```js
CursorAmbientField.pulse(600, 320, 0.7, 240);
```

By element:

```js
CursorAmbientField.pulse(document.querySelector('.btn-primary'), 0.7, 240);
```

### Pause / resume

```js
CursorAmbientField.pause();
CursorAmbientField.resume();
```

### Remove the module at runtime

```js
CursorAmbientField.destroy();
```

## Runtime diagnostics

The root element exposes:

```text
data-ambient-renderer="webgl2|canvas2d"
data-ambient-quality="high|balanced|low"
data-ambient-mode="local|cloud|private"
data-ambient-focus="page|palette"
data-ambient-particles="<count>"
```

## Design constraints

- no Three.js
- no npm dependency
- no bundler
- no random connection-line network aesthetic
- no full-page high-opacity particle storm
- particle behavior supports Liquid Glass instead of competing with it
- existing Gradient Blobs are reduced to a lighting role
- Noise remains a subtle texture layer
