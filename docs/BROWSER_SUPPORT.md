# Browser, Responsive & Accessibility Support

This document describes architecture and intended support. It distinguishes implemented fallback paths from native-browser visual QA.

## Renderer matrix

| Capability | Chromium | Safari / WebKit | Firefox |
| --- | --- | --- | --- |
| Base template | Native | Native | Native |
| Liquid Glass refraction | `backdrop-svg` on real backdrop pixels | `content-copy-svg` | `content-copy-svg` |
| Shared lenses / controls | Yes | Yes | Yes |
| Ambient primary renderer | WebGL2 when available | WebGL2 when available | WebGL2 when available |
| Ambient fallback | Canvas2D | Canvas2D | Canvas2D |
| Particle pixels inside Glass | direct backdrop path | shared-state local mirror canvas | shared-state local mirror canvas |

The repository has been integration-tuned in Chromium. Safari/Firefox renderer paths are implemented, but final visual calibration should still be performed in the exact native versions targeted by a release.

## Responsive policy

VPE uses fluid layout plus breakpoints rather than device-name targeting. Important transitions include:

- desktop Island capacity and compact state;
- Mobile Island before English labels can overflow;
- Hero two-column → vertical composition;
- Feature Matrix 3 / 2 / 1 columns;
- Feature tabs → single-row horizontal touch scrolling;
- media/table overflow affordances;
- reduced Ambient density and optical budget on narrow/coarse-pointer devices.

Browser zoom changes the CSS viewport, so zoom is treated as responsive input. The UI should remain usable while continuously dragging the browser window across breakpoints.

## Resize behavior

- Glass surfaces use geometry observers and regenerate displacement maps when surface size changes.
- Shared lenses remeasure active targets on resize.
- Ambient resizes canvas/DPR and remaps particle state.
- Mobile navigation reconciles open/closed state when crossing its breakpoint.
- Layout motion uses current DOM geometry rather than fixed device dimensions.

## Accessibility preferences

### Reduced Motion

`prefers-reduced-motion: reduce` disables or greatly reduces:

- Hero choreography;
- continuous particle simulation;
- FLIP/spring layout movement;
- pointer-card physics;
- decorative energy pulses.

State changes remain visible without motion.

### Reduced Transparency

`prefers-reduced-transparency` switches Liquid Glass to a high-opacity readable material instead of attempting refraction.

### Keyboard and native controls

The original DOM remains the accessibility tree. Content-copy mirrors are non-interactive and `aria-hidden`; native range inputs remain the keyboard/touch targets; focus-visible states are preserved.

## Content-readability invariant

Motion is never allowed to compress live content below its natural layout size. Feature Matrix expansion adopts natural height immediately; only safe extra-space contraction may animate. This rule exists because layout choreography must not trade readability for visual continuity.
