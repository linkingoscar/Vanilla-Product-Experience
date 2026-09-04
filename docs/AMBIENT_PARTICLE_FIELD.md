# Ambient Particle Interaction Field

> Ships as part of Vanilla Product Experience v1.0.0.

The Ambient Field turns the page background into a responsive digital medium beneath the functional Liquid Glass layer. It is a reusable runtime, not a copy of a specific product website.

## Layer model

```text
Background Base
  ↓
Low-frequency Gradient Lighting
  ↓
Ambient Particle Interaction Field
  ↓
Content Layer
  ↓
Liquid Glass Functional Layer
```

The field is strongest around the Hero and becomes quieter in dense reading sections.

## Files

```text
assets/css/ambient-particles.css
assets/js/ambient/
├── particle-renderer-webgl.js
├── interaction-field.js
└── particle-field.js
```

### Renderer

The preferred renderer is small custom WebGL2 point rendering. Physics remain on the CPU so **one particle state** can feed multiple outputs. If WebGL2 is unavailable, the main renderer falls back to Canvas2D.

```text
Particle State
   ├── WebGL2 / Canvas2D background
   └── Safari/Firefox local Glass mirrors
```

No second physics simulation is created for mirrors.

## Interaction field

Inputs include:

- pointer position and velocity;
- pointer wake / pressure;
- scroll velocity;
- Shared Liquid Lens movement;
- Command Palette focus state;
- Hero Workspace mode.

Each particle has a stable anchor, current position, velocity, depth, deterministic seed and optional cluster assignment. Forces combine low-frequency drift, spring return, pointer pressure/wake, scroll energy and local pulses.

## Workspace modes

### Local

Tighter spring and lower flow. The field feels stable and localized.

### Cloud

Looser spring and broader slow drift.

### Private Pool

Particles are attracted toward soft cluster centers to suggest pooled/self-hosted machines without changing the entire theme.

Current state is exposed as:

```html
<html data-ambient-mode="local|cloud|private">
```

## Liquid Glass bridge

### Chromium

The main WebGL canvas is behind content, so `backdrop-svg` sees and refracts actual particle pixels.

### Safari / Firefox

The content-copy renderer cannot clone live WebGL pixels. VPE therefore creates small local Canvas2D mirror renderers inside selected Glass surfaces. They consume the shared particle state and reuse the surface's existing SVG displacement filter.

Typical mirror targets include the Floating Island, Command Palette, Hero controls, pricing segmented controls, range thumbs and shared lenses.

## Focus behavior

When Command Palette opens, particle force/opacity are reduced and pointer wake is suppressed. Ambient remains alive but stops competing with the search surface.

## Quality policy

Typical budgets:

```text
high      ~1100 particles, DPR cap 1.5
balanced  ~560 particles,  DPR cap 1.25
low       ~220 particles,  DPR cap 1.0
```

Narrow/coarse-pointer screens apply additional caps. Hidden tabs stop continuous RAF work. `prefers-reduced-motion` keeps a static/very quiet field rather than requiring a blank background.

## Public API

New integrations can access the field through:

```js
VPE.ambient
```

The v1 compatibility alias remains:

```js
CursorAmbientField
```

Examples:

```js
VPE.ambient?.setMode('cloud');
VPE.ambient?.setDensity(0.7);
VPE.ambient?.pulse(document.querySelector('.btn-primary'), 0.7, 240);
VPE.ambient?.pause();
VPE.ambient?.resume();
```

Accepted density is clamped internally. `destroy()` removes runtime resources when the module is no longer needed.

## Design rule

Ambient is page atmosphere, not foreground content. Do not add strong particles, strong glow, strong Glass and strong 3D motion to the same section. Section energy is coordinated by Site Motion.
