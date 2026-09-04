# Contributing to Vanilla Product Experience

Thanks for improving VPE. The project is intentionally opinionated: it aims for premium product-site behavior without introducing a framework or build pipeline.

## Development

Run any static server, for example:

```bash
python -m http.server 8000
```

No npm install is required.

## Project constraints

Please preserve these invariants:

1. **No framework dependency for ordinary features.** Do not introduce React, Vue, Vite, Webpack or a required Node runtime to solve a problem that can remain native.
2. **Native scrolling stays authoritative.** Measuring velocity is fine; scroll hijacking is not.
3. **Refraction must be real.** Blur-only glassmorphism is not accepted as Liquid Glass.
4. **Content readability wins.** Motion/layout code must never clip or compress readable content.
5. **One source of truth.** Enhancement systems observe base state instead of duplicating business logic.
6. **Accessibility paths are required.** Keyboard, touch, reduced motion and reduced transparency must remain functional.
7. **Responsive means continuous.** Test window resize and common browser zoom states, not only a desktop screenshot and one phone width.
8. **Version the dependency graph.** Runtime asset changes must update loader query strings, SW precache keys and CI expectations together.
9. **Visual budget matters.** Do not combine strong glass, particles, glow, motion and 3D in every section.

## Pull requests

Keep changes focused. Explain:

- the user-facing problem;
- the root cause;
- which layer owns the fix;
- browser/accessibility implications;
- whether cache keys changed.

For visual/runtime changes, include the viewport/browser state used to verify the change. Do not claim native Safari/Firefox visual QA unless it was actually performed there.
