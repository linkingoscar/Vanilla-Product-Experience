# VPE Versioning & Cache Policy

Vanilla Product Experience starts project-level semantic versioning at **v1.0.0**.

## Four version concepts

### 1. Project version

The public release version, stored in `VERSION` and exposed as `VPE.version`.

Example: `1.0.0`.

### 2. Reference-demo content version

The bundled Cursor site has its own timeline (Cursor 3.x / September 2026). Those product-version labels are demo data, not the VPE project version.

### 3. Internal module versions

Liquid Glass, Ambient, Motion and Product UI retain small internal versions such as `0.1.1`. These help diagnose runtime/cache mismatches and do not imply separate package releases.

### 4. Service Worker cache revision

`CACHE_NAME` is an implementation revision. It changes whenever precached dependency keys change. It is not a semantic project version by itself.

## Public entrypoint policy

The HTML should load project-level entrypoints with the project version:

```text
assets/css/style.css?v=1.0.0
assets/js/main.js?v=1.0.0
```

Those entrypoints may load internal modules with their module versions.

## Critical cache rule

**If the contents of a versioned runtime asset change, the request key must change too.**

For every runtime version bump, update all relevant locations together:

1. loader/import query string;
2. Service Worker precache query string;
3. integrity CI expectation;
4. module-reported version when applicable.

Do not change `layout-motion.js` to v0.1.2 while leaving the loader and SW at `?v=0.1.1`. A stale query key can keep pre-fix code alive even after deployment.

## Service Worker policy

VPE uses network-first requests with exact-query cache keys and offline fallback. Critical bootstrap/runtime files may force network revalidation when a migration needs to evict historically stale HTTP-cache entries.

A deployment that changes the precache graph must bump `CACHE_NAME`.

## Changelog policy

`CHANGELOG.md` tracks VPE project releases starting at v1.0.0. The older Cursor showcase history is preserved separately in `docs/CURSOR_DEMO_HISTORY.md` so product-demo releases are not confused with framework/runtime releases.
