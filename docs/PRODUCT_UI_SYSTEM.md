# Product UI & Art Direction System

This layer turns the visual stack from a technically impressive demo into a reusable product-landing-page system.

It sits above the existing stack:

```text
Template Core
  -> Liquid Glass
      -> Ambient Particle Field
          -> Site Motion System
              -> Product UI / Art Direction
```

The Product UI layer is deliberately responsible for information architecture, visual direction, brand personality, proof, conversion, media and data presentation. It does not replace the optical or motion engines.

## Files

```text
assets/css/product-ui.css
assets/js/product-ui.js
```

`assets/css/style.css` imports the stylesheet after Site Motion. `assets/js/main.js` loads the JavaScript after the motion controller.

## 1. Mobile information architecture

The desktop Island navigation is not simply hidden on narrow screens anymore.

The Product UI layer creates a mobile Island control that shows the current section and expands into a Liquid Glass navigation panel containing:

- cloned primary section links
- Search
- Theme
- Language
- active-section synchronization
- Escape and backdrop close behavior

The existing desktop navigation remains the semantic/source-of-truth navigation.

## 2. Art direction and Product Visual Slots

The Hero IDE mockup is reframed as a reusable Product Media Surface instead of a one-off code-window mock.

The system also inserts an editorial Product Visual Slot between dense content sections. The Cursor demo uses Local / Cloud / Private execution nodes around a central Workspace object.

Forks should replace the visual slot with one of:

- real product screenshot
- product film / walkthrough
- architecture diagram
- browser/product mockup
- launch visual

The purpose is to create a visual narrative break instead of continuously repeating title -> paragraph -> card grid.

## 3. Brand personality tokens

Product branding is separated from the generic theme tokens.

Important tokens include:

```css
--brand-signature-a
--brand-signature-b
--brand-signature-c
--brand-signal
--brand-display-tracking
--brand-title-tracking
--brand-body-tracking
--brand-editorial-radius
--brand-media-radius
```

The default Cursor demo uses the signature gradient for the mark, display emphasis and visual nodes. Forks can change brand personality without rewriting component CSS.

## 4. Typography system

The layer introduces role-based type tokens instead of relying only on isolated font sizes:

```css
--type-display-xl
--type-display
--type-title
--type-subtitle
--type-body
--type-caption
--type-meta
--type-code
```

Chinese and English receive separate optical tracking/line-height overrides.

The goal is editorial hierarchy, not merely larger headings.

## 5. Interaction state matrix

Reusable controls now share explicit states:

```text
default
hover
focus-visible
pressed
selected / aria-selected / aria-pressed
disabled / aria-disabled
busy / aria-busy
```

Public helpers:

```js
CursorProductUI.setBusy(element, true)
CursorProductUI.setBusy(element, false)
CursorProductUI.setDisabled(element, true)
CursorProductUI.setDisabled(element, false)
```

Focus-visible remains keyboard-first and uses a brand-aware focus ring.

## 6. Light Mode as art direction

Light Mode is treated as a separate visual direction rather than a simple color inversion.

Changes include:

- darker and less saturated particle treatment
- multiplication-style ambient blending
- softer shadows
- reduced Liquid Glass saturation
- reduced specular intensity
- brighter editorial/media surfaces
- lower-contrast grid lines

The functional hierarchy remains the same in both themes, but the material behavior differs.

## 7. Editorial pacing / content density

The page previously contained several dense sections in sequence.

The Product Visual Slot creates a deliberate low-density editorial break. It has:

- one large statement
- one explanatory paragraph
- one large visual
- no card grid
- no comparison table

This is a design-system rule: dense product information should be separated by visual breathing spaces.

## 8. Conversion architecture

The final `#start` section is upgraded from two centered buttons into a conversion surface with:

- conversion kicker
- core headline and supporting copy
- primary / secondary actions
- proof chips
- deployment/rebranding guidance microcopy
- a distinct conversion background field

For Cursor demo content the chips communicate free entry, local/cloud workflows and official docs.

Fork mappings can include:

- signup + demo
- download + docs
- GitHub + documentation
- trial + contact sales

## 9. Trust / Proof layer

A proof strip appears immediately after Hero.

The default open-source proof points are intentionally verifiable repository properties:

```text
0 build steps
2 language versions
PWA offline-ready
MIT license
```

Forks should replace these with their strongest trustworthy proof, such as customer logos, usage metrics, security certifications or deployment numbers.

Do not invent vanity metrics merely to fill the component.

## 10. Media Surface system

Product media is normalized through shared surface tokens and classes.

Targets include:

- Hero product window
- video frames
- documentation panels
- comparison/table containers when appropriate

Public helper:

```js
CursorProductUI.decorateMedia(element, 'video')
```

Media surfaces share radius, border, elevation and light/dark treatment so screenshots, videos and product mockups belong to the same visual family.

## 11. Data visualization language

The ROI calculator gets a small proportional cost visualization rather than relying only on changing numbers.

It visualizes:

- optimized annual cost
- comparison annual cost
- estimated savings

The values stay synchronized through a MutationObserver, so the visualization follows the existing calculator logic instead of duplicating its business calculations.

Tables with percentage values can receive subtle inline background bars without replacing text values.

The rule is "micro visualization, not dashboard".

## Product UI public API

```js
CursorProductUI.version
CursorProductUI.refresh()
CursorProductUI.setBusy(element, boolean)
CursorProductUI.setDisabled(element, boolean)
CursorProductUI.decorateMedia(element, type)
```

## Visual budget rule

The stack is intentionally powerful. It must not be used everywhere at once.

Recommended section budget:

| Section | Primary expressive system |
| --- | --- |
| Hero | Ambient + Liquid Glass |
| Proof strip | Typography + material restraint |
| Highlights | Content + restrained elevation |
| Editorial break | Art direction visual |
| Feature Matrix | Shared Lens + FLIP |
| Simulator | Pipeline motion |
| ROI | Liquid range + micro data viz |
| Media | Product Media Surfaces |
| Timeline | Scroll progress |
| Pricing | Segmented glass selector |
| Comparison | Reading-first / mostly static |
| Final CTA | Conversion hierarchy |

Avoid combining strong particle energy, strong glass, glow, large motion and 3D transforms in the same section.

## Fork customization

For a fast rebrand:

1. Replace product copy in `index.html` / `en/index.html`.
2. Change core template theme tokens in `style-base.css`.
3. Change brand personality tokens in `product-ui.css`.
4. Replace the editorial visual slot with a screenshot/video/diagram if desired.
5. Replace proof points with real product evidence.
6. Replace conversion CTA copy/actions.
7. Keep or remove `product-ui.js` as one complete enhancement layer.

## Design principle

The final hierarchy should read as:

```text
Brand tells users who this is.
Art direction tells users what world the product lives in.
Typography tells users what matters.
Proof tells users why to believe it.
Conversion tells users what to do next.
Motion connects states.
Ambient gives space life.
Liquid Glass gives controls material.
```
