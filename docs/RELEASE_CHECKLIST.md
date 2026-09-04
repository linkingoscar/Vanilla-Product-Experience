# Release Checklist

Use this checklist for VPE project releases. Module-internal versions are diagnostic and do not replace the project release process.

## Before merge

- [ ] `VERSION` contains the intended SemVer.
- [ ] `VPE.version` matches `VERSION`.
- [ ] `CHANGELOG.md` contains the release entry.
- [ ] `docs/releases/<version>.md` contains copy-ready release notes.
- [ ] Versioned loader/import query strings match the module versions they load.
- [ ] Service Worker precache keys match those same query strings.
- [ ] `CACHE_NAME` is bumped when the precache graph/revision changes.
- [ ] `manifest.json` parses and keeps a stable `id` / `scope` / `start_url` relationship.
- [ ] Canonical, hreflang, Open Graph, JSON-LD and sitemap URLs match production.

## Experience regression checks

- [ ] Feature Matrix: All ↔ Workflow ↔ Enterprise does not clip content.
- [ ] Desktop Island keeps Search and language switch available through resize/zoom breakpoints.
- [ ] Mobile Island opens/closes with focus management and no background scroll leak.
- [ ] Command Palette works with keyboard and after viewport resize.
- [ ] Liquid Glass optical layers stay inside their containing surfaces.
- [ ] Reduced Motion and Reduced Transparency paths remain readable.
- [ ] Dark and Light modes both retain sufficient contrast.

## Browser / device pass

Prioritize representative cases rather than every width/zoom permutation:

```text
Desktop: 1440×900, 1366×600, 1920×1080
Tablet:  1024×768, 820×1180
Mobile:  430×932, 390×844, 320×568
Zoom:    100%, 125%, 150%, 200%
```

Check Chromium plus native Safari and Firefox for any release that changes renderer/material behavior.

## Main / deployment gates

- [ ] Experience integrity succeeds on `main`.
- [ ] GitHub Pages build succeeds.
- [ ] GitHub Pages deploy succeeds.
- [ ] Production Chinese page loads.
- [ ] Production English page loads.
- [ ] Service Worker activates the intended cache revision.

## Tag / GitHub Release

- [ ] Create tag `v<version>` from the verified `main` commit.
- [ ] Create GitHub Release from that tag.
- [ ] Paste `docs/releases/<version>.md` into the release body (edit only if post-merge facts changed).
- [ ] Verify repository homepage and README Live Demo point to the production URL.
