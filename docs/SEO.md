# SEO & Social Metadata

Vanilla Product Experience ships a real bilingual Reference Demo, so SEO metadata is part of the template contract rather than an afterthought.

## Current Reference Demo URLs

```text
Chinese / x-default
https://linkingoscar.github.io/Vanilla-Product-Experience/

English
https://linkingoscar.github.io/Vanilla-Product-Experience/en/
```

The two HTML pages contain:

- `rel="canonical"`;
- reciprocal `hreflang` links (`zh-CN`, `en`, `x-default`);
- Open Graph title / description / URL / image;
- Twitter card metadata;
- JSON-LD `WebPage` → `WebSite` relationship;
- a sitemap link.

The project sitemap lives at [`../sitemap.xml`](../sitemap.xml).

## Fork checklist

Search for `TEMPLATE:EDIT — Site Metadata & SEO` in both `index.html` and `en/index.html` and replace **all** VPE deployment URLs with your own production origin/path.

At minimum update:

```text
canonical
hreflang zh-CN / en / x-default
og:url
og:image
JSON-LD url / isPartOf.url
sitemap.xml <loc> + alternate href values
```

If you remove the English page, remove the `en` alternate from the Chinese page and sitemap. If English becomes your default language, move `x-default` to the English URL.

## GitHub Pages project paths

A project Pages site normally lives below a repository path:

```text
https://<user>.github.io/<repo>/
```

Do **not** publish root-only metadata such as `href="/en/"` unless your site truly owns the origin root. Absolute canonical and alternate URLs should include the project path.

## Social image

The Reference Demo currently uses the 512px VPE/Cursor demo icon as its social image. Forks should replace it with a dedicated 1200×630 product preview and then update `og:image` / `twitter:image` in both language pages.

## Structured data

The bundled JSON-LD intentionally identifies the page as a `WebPage` that is part of the `Vanilla Product Experience` `WebSite`. It does **not** claim that VPE is Cursor or that this repository is an official Cursor property.

When rebranding a fork, keep that ownership boundary accurate.

## Sitemap and robots.txt

`sitemap.xml` is included because it can be submitted directly to search engines.

VPE does not ship a project-level `robots.txt` for GitHub Pages because crawlers only honor `robots.txt` at the **origin root** (for example `https://example.com/robots.txt`). A file at `/Vanilla-Product-Experience/robots.txt` cannot define crawl policy for the `linkingoscar.github.io` origin.

On a custom domain you control, add a root `robots.txt` and reference the production sitemap there.
