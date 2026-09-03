# Site Motion System

`feat/site-motion-system` adds a page-level motion language above the existing Liquid Glass and Ambient Particle layers.

The goal is not to maximize animation count. The goal is to make the page feel like one continuous spatial system:

```text
Ambient Field
  -> gives the page a living environment

Site Motion
  -> gives navigation, layout and storytelling temporal continuity

Liquid Glass
  -> gives the functional controls a physical material
```

The implementation stays zero-build and framework-free. It uses the Web Animations API, `requestAnimationFrame`, `IntersectionObserver`, DOM geometry measurement and small spring helpers.

---

## Reference mechanisms studied

The implementation is original to this template, but several mature open-source projects were studied for their interaction mechanics:

- **Motion** — https://github.com/motiondivision/motion
  - physics vocabulary based on stiffness / damping / mass
  - interruptible motion rather than queued decorative transitions
  - separating value generation from DOM rendering
- **Auto Animate** — https://github.com/formkit/auto-animate
  - continuity across layout changes by measuring geometry before and after DOM updates
  - useful precedent for framework-independent layout animation
- **Lenis** — https://github.com/darkroomengineering/lenis
  - scroll velocity as useful interaction state
  - explicit RAF-driven temporal state
  - this template deliberately does **not** adopt scroll hijacking; native browser scrolling remains authoritative
- **Number Flow** — https://github.com/barvian/number-flow
  - numeric changes should maintain visual continuity rather than snap between unrelated text states

The project does not ship any of these libraries. The useful mechanisms were reduced into small Vanilla modules appropriate for a static template.

---

## Files

```text
assets/css/site-motion.css

assets/js/motion/
├── spring.js
├── layout-motion.js
├── number-motion.js
└── site-motion.js
```

### Responsibility split

`spring.js`
: Interruptible scalar spring and sampled spring keyframes.

`layout-motion.js`
: FLIP-style layout measurement, moving-card animation, entering elements, disappearing ghosts and container-height continuity.

`number-motion.js`
: Interruptible numeric interpolation for values that change faster than an animation can finish.

`site-motion.js`
: The actual page choreography. It coordinates Hero, Island, sections, Feature Matrix, Simulator, ROI, Timeline, Comparison, primary CTAs and the Ambient field.

---

## Motion principles

### 1. Motion follows hierarchy

Large motion is reserved for structural transitions. Small controls receive small motion.

Good:

```text
Feature Grid layout change -> obvious spatial continuity
Primary CTA press          -> small material response
Comparison row hover       -> almost no movement
```

Bad:

```text
every card -> strong 3D tilt
all buttons -> particle explosion
all section titles -> identical dramatic entrance
```

### 2. Keep native scrolling

The site does not interpolate or replace browser scroll position.

Scroll velocity is measured and used as input for:

- Dynamic Island compression
- scroll direction state
- Ambient particle energy
- Timeline progress
- active section choreography

The user still gets native touch scrolling, browser navigation behavior and platform accessibility semantics.

### 3. Prefer interruptible physics

A user can click A -> B -> C before B finishes animating. Motion must redirect from the current visual state rather than queue stale animations.

`SpringValue` therefore maintains current value + velocity and simply accepts a new target.

### 4. Preserve spatial continuity

Filtering a 31-card grid should not look like one page disappearing and another page appearing.

Feature Matrix uses:

```text
First geometry
  -> base filter mutates DOM
  -> Last geometry
  -> Invert surviving cards
  -> spring to new positions
```

Cards leaving the filter get short-lived visual ghosts so disappearance also has continuity.

### 5. Motion is part of accessibility

`prefers-reduced-motion: reduce` is not implemented as a random collection of CSS overrides. The motion controller changes behavior:

- no Hero choreography
- no spring layout movement
- no pointer-card physics
- no Ambient energy pulses
- native content remains immediately readable
- Timeline and Simulator still communicate state without relying on motion

---

## Page choreography

### Hero — establish space

Entrance sequence:

```text
Eyebrow
  -> headline
  -> supporting copy
  -> CTA group
  -> IDE/workspace visual
  -> Liquid Glass workspace controller
```

The sequence overlaps. It is not a slow presentation-style one-item-at-a-time animation.

The visual enters with slightly greater depth than the copy so the Hero feels spatial without excessive parallax.

### Dynamic Island — react to scroll energy

The Island reads real scroll velocity.

At rest:

```text
scaleX 1
scaleY 1
```

During a fast scroll:

```text
slight horizontal stretch
slight vertical compression
```

A spring immediately returns it to rest when scroll energy stops.

It also moves a few pixels closer to the viewport edge after leaving the Hero area and increases material density slightly.

### Highlights / Bento — progressive expansion

Bento cards use a compact staggered entrance.

Fine-pointer hover uses very low-amplitude spring elevation:

- about 3px vertical lift
- sub-1-degree rotation
- shadow / luminance response

This is deliberately not a large 3D tilt effect.

### Feature Matrix — FLIP layout morph

This is one of the strongest structural motions on the page.

When a category changes:

1. capture current visible card geometry
2. create visual ghosts for cards that will disappear
3. let the existing filter logic remain the source of truth
4. measure new geometry
5. spring surviving cards from old positions to new positions
6. animate newly visible cards in
7. animate grid height to its new value
8. remove ghosts
9. resynchronize Safari/Firefox Liquid Glass content copies

The existing Shared Liquid Lens and Ambient field pulse at the same transition point.

### Composer Simulator — energy transfer

The Architect -> Coder -> Tester sequence becomes one visual pipeline.

- a vertical progress path connects stages
- stage status mutations drive the path through a spring
- the active node receives a small material emphasis
- code changes crossfade instead of snapping
- status-pill changes have a compact spring response
- active stage changes emit a very small Ambient pulse

### ROI Calculator — continuous values

The native range inputs remain the actual controls.

During drag:

- the Liquid Glass thumb receives a small specular / scale response
- annual savings animates from the value currently visible on screen toward the newest target
- a new input interrupts the previous number animation
- cost comparison text uses a quieter micro-transition

This prevents rapid slider input from creating a queue of stale number animations.

### Timeline — scroll narrative

The Timeline contains a separate active progress line above the static baseline.

Viewport progress drives:

- progress-line scale
- completed milestones
- current milestone
- upcoming milestones

The current marker receives the strongest state; completed markers remain visibly completed instead of turning off again.

### Pricing — restrained motion

Pricing already has a Liquid Glass Monthly / Annualized selector.

Site Motion adds only:

- staggered card entrance
- low-amplitude pointer elevation on fine-pointer devices
- existing number swap remains the main pricing transition

Content cards remain content surfaces rather than becoming animated glass panels.

### Comparison — reading first

Comparison tables intentionally use the smallest motion budget.

- subtle row luminance on fine-pointer hover
- left/right overflow cues appear only when horizontal scrolling is possible
- section entrance is shallow and short

No large transforms are applied to dense comparison data.

---

## Ambient integration

Site Motion does not reseed the particle simulation when sections change.

Instead it changes one visual presence token:

```css
--sm-ambient-presence
```

Default choreography:

```text
Hero          1.00
Highlights    0.82
Composer      0.72
Feature Grid  0.62
Media         0.50
Timeline      0.46
Pricing       0.34
Comparison    0.28
CTA           0.48
```

The Ambient simulation therefore remains continuous while the page changes its visual energy.

Structural events can emit controlled pulses through:

```js
CursorSiteMotion.pulse(element, energy, radius)
```

Only meaningful actions use this bridge. Ordinary text links and table rows do not produce particle effects.

---

## Public APIs

### Physics

```js
const x = new CursorMotionPhysics.SpringValue(0, {
  stiffness: 360,
  damping: 36,
  onUpdate(value) {
    // render value
  }
});

x.set(1);
x.set(0.5); // redirects the same spring while it is moving
```

### Sample spring keyframes

```js
const motion = CursorMotionPhysics.springFrames(
  (progress) => ({
    transform: `translateY(${20 * (1 - progress)}px)`
  }),
  { stiffness: 320, damping: 34 }
);

element.animate(motion.keyframes, {
  duration: motion.duration,
  easing: 'linear'
});
```

### Layout continuity

```js
const before = CursorLayoutMotion.capture(cards);

// mutate DOM/layout here

CursorLayoutMotion.animateFlip(before, cards);
```

### Numbers

```js
CursorNumberMotion.animate(output, 128400, {
  format: (value) => `$${Math.round(value).toLocaleString()}`
});
```

### Site controller

```js
CursorSiteMotion.section
CursorSiteMotion.reveal(element, options)
CursorSiteMotion.pulse(element, 0.05, 140)
CursorSiteMotion.refresh()
```

---

## Runtime state

The controller exposes useful state through `<html>` attributes:

```text
data-site-motion-section
data-site-motion-scrolled
data-site-scroll-direction
```

These are intentionally CSS-friendly so a fork can change visual behavior without rewriting the motion engine.

---

## Performance rules

1. Native scrolling is never replaced.
2. Scroll handlers schedule visual work with `requestAnimationFrame` where continuous work is required.
3. Large layout transitions happen only on discrete actions such as feature filtering.
4. Pointer-card physics is disabled on coarse/touch pointers.
5. Card rotation stays below one degree.
6. Ambient particle count is controlled by the separate Ambient quality policy.
7. Reduced Motion bypasses non-essential springs and pulses.
8. Motion modules have no third-party runtime dependency.

---

## Layer order

```text
style-base.css / main-base.js
        ↓
Liquid Glass optical system
        ↓
Liquid Glass product components
        ↓
Ambient Particle Interaction Field
        ↓
Site Motion System
```

Site Motion loads last because it coordinates the states produced by the other layers. It does not replace their implementation.

---

## Design target

The intended result is not “a website with many animations.”

The target is:

> The user should be able to understand where an object came from, where it moved, what changed, and what currently deserves attention — while the page still feels calm enough to read.
