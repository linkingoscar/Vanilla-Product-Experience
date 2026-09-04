# Site Motion System

> Ships as part of Vanilla Product Experience v1.0.0.

Site Motion gives navigation, layout changes and product storytelling one temporal language. The goal is not to maximize animation count; it is to maintain hierarchy and spatial continuity while native scrolling remains authoritative.

## Stack relationship

```text
Ambient Field
  → gives the page a living environment

Site Motion
  → gives state/layout/storytelling temporal continuity

Liquid Glass
  → gives functional controls material behavior
```

The implementation stays zero-build and framework-free. It uses Web Animations API, `requestAnimationFrame`, `IntersectionObserver`, DOM geometry and small native spring helpers.

## Reference mechanisms studied

The implementation is original to VPE, but the following mature projects informed specific mechanics:

- Motion — stiffness / damping / mass vocabulary and interruptible motion;
- Auto Animate — geometry before/after DOM mutation;
- Lenis — velocity as interaction state, without adopting scroll hijacking;
- Number Flow — continuous numeric state rather than unrelated snapping text.

None of those libraries are shipped as runtime dependencies.

## Files

```text
assets/css/site-motion.css
assets/js/motion/
├── spring.js
├── layout-motion.js
├── number-motion.js
└── site-motion.js
```

### `spring.js`

Interruptible scalar spring values and sampled spring keyframes.

### `layout-motion.js`

FLIP geometry capture, entering elements, moving elements, leaving ghosts and safe container-height continuity.

### `number-motion.js`

Interruptible numeric interpolation for rapidly changing values such as ROI output.

### `site-motion.js`

Coordinates Hero, Island, sections, Feature Matrix, Simulator, ROI, Timeline, Comparison, primary actions and Ambient energy.

## Motion principles

### Motion follows hierarchy

Structural changes may have obvious spatial motion. Small controls get small feedback; reading surfaces get almost none.

### Native scrolling stays native

VPE measures scroll velocity and direction but does not interpolate or replace browser scroll position.

### Motion is interruptible

A→B→C input before B finishes should redirect from the current visual state instead of queuing stale transitions.

### Spatial continuity without content damage

Feature filtering uses FLIP:

```text
First geometry
→ base filter mutates DOM
→ Last geometry
→ Invert surviving cards
→ spring to new positions
```

Leaving cards receive short-lived visual ghosts.

**Readable natural height is a hard invariant.** When a category expands from fewer cards to more cards, the live grid adopts its natural target height immediately. VPE does not animate the real grid through a too-small explicit height, because CSS Grid rows can compress and `.feature-card { overflow: hidden }` would clip text. Only safe contraction of extra empty space may animate.

Rapid repeated category changes cancel stale height animation state before remeasurement.

### Accessibility is behavior, not a CSS afterthought

`prefers-reduced-motion: reduce` removes Hero choreography, spring layout movement, pointer-card physics and decorative Ambient pulses. State remains understandable without movement.

## Page choreography

### Hero

Eyebrow → headline → supporting copy → CTA → product visual → workspace control, with overlapping timing rather than slide-deck sequencing.

### Floating Island

Real scroll velocity drives very small squash/stretch and top-position changes. The spring returns immediately to rest when scrolling stops.

### Highlights

Compact staggered entrance plus very low-amplitude elevation on fine pointers. It intentionally avoids large 3D tilt.

### Feature Matrix

1. capture visible-card geometry;
2. create ghosts for leaving cards;
3. let the base filter remain source of truth;
4. measure new geometry;
5. FLIP surviving cards;
6. animate newly visible cards in;
7. keep natural readable grid height;
8. animate only safe extra-space contraction when appropriate;
9. resynchronize Glass content copies.

Shared Lens and a small Ambient pulse happen at the same state transition.

### Composer Simulator

Architect → Coder → Tester is represented as one pipeline with a progress path, active/completed nodes, compact status response and subtle Ambient transfer.

### ROI

Native range inputs remain real controls. Liquid thumb response and number interpolation are interruptible so rapid dragging never creates a stale animation queue.

### Timeline

Viewport progress drives a separate progress line and completed/current/upcoming marker states. Completed milestones remain completed rather than switching off again.

### Pricing / Comparison

Pricing uses restrained entry/elevation around its existing segmented selector. Comparison remains reading-first with only low-intensity row/scroll affordances.

## Public API

VPE aggregates motion modules under:

```js
VPE.motion.physics
VPE.motion.layout
VPE.motion.numbers
VPE.motion.site
```

Historical `CursorMotion*` / `CursorSiteMotion` globals remain v1 compatibility aliases where present.
