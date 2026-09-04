/**
 * Cursor 3.x JavaScript entrypoint.
 *
 * main-base.js contains the production Static Landing Page Template behavior.
 * Enhancement layers load afterwards and stay independently removable:
 *   v0.1.x Liquid Glass optical primitives + SDF + shared lenses
 *   v0.2.x cross-browser content-copy refraction + fluid controls
 *   v0.3.x visible Hero / Simulator / Pricing components
 *   Ambient v0.1.x WebGL2 particle field + interaction bridge + glass mirrors
 *   Site Motion v0.1.x page choreography + FLIP + spring interaction physics
 *   Product UI v0.1.x mobile IA + art direction + proof/media/conversion systems
 */
(function bootstrapCursorExperience() {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches) root.classList.add("site-motion-pending");

  const motionFallback = window.setTimeout(() => {
    root.classList.remove("site-motion-pending");
  }, 2400);
  window.addEventListener("cursor:site-motion-ready", () => window.clearTimeout(motionFallback), { once: true });

  const currentScript = document.currentScript;
  const baseUrl = currentScript && currentScript.src
    ? new URL("./", currentScript.src)
    : new URL("./assets/js/", document.baseURI);

  function loadScript(file, onload) {
    const script = document.createElement("script");
    script.src = new URL(file, baseUrl).href;
    script.async = false;
    if (onload) script.addEventListener("load", onload, { once: true });
    document.head.appendChild(script);
  }

  /**
   * Navigation resilience layer.
   *
   * The curated nav order is not identical to document section order
   * (`Composer Models` is shown before `3.x Feature Matrix`, while the feature
   * section appears earlier in the DOM). The legacy scroll-spy therefore could
   * let a later nav item overwrite the section that is actually deepest in the
   * document. This controller performs the final geometry-based resolution
   * after the base scroll handler without changing DOM/tab order.
   *
   * It also reconciles Mobile Island state at the wider 1120px capacity
   * breakpoint used by the responsive CSS so browser zoom/window resizing never
   * leaves an expanded mobile panel stranded in desktop mode.
   */
  function installNavigationResilience() {
    const island = document.querySelector(".island");
    const nav = document.querySelector(".island-nav");
    if (!island || !nav || nav.dataset.navResilienceReady === "true") return;

    const items = Array.from(nav.querySelectorAll("a[href^='#']"))
      .map((link) => {
        const id = link.getAttribute("href").slice(1);
        const section = document.getElementById(id);
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!items.length) return;
    nav.dataset.navResilienceReady = "true";

    let raf = 0;
    let correcting = false;

    function getHeaderOffset() {
      return island.offsetHeight + 24;
    }

    function resolveCurrent() {
      const scrollPos = window.scrollY + getHeaderOffset() + 20;
      let current = null;
      let currentTop = -Infinity;

      items.forEach((item) => {
        const top = item.section.offsetTop;
        if (top <= scrollPos && top > currentTop) {
          current = item;
          currentTop = top;
        }
      });

      return current;
    }

    function applyCurrent() {
      const current = resolveCurrent();
      correcting = true;
      items.forEach(({ link }) => {
        link.classList.toggle("is-active", Boolean(current && link === current.link));
      });
      correcting = false;
    }

    function schedule() {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applyCurrent();
      });
    }

    // Registered after main-base.js, so this RAF becomes the final active-state
    // decision for each scroll frame.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);

    // If another subsystem changes nav classes asynchronously, normalize the
    // state again before it can become persistent.
    const classObserver = new MutationObserver(() => {
      if (!correcting) schedule();
    });
    items.forEach(({ link }) => classObserver.observe(link, {
      attributes: true,
      attributeFilter: ["class"]
    }));

    const mobileNavQuery = window.matchMedia("(max-width: 1120px)");
    function reconcileMobileNav() {
      if (mobileNavQuery.matches) return;

      const trigger = document.querySelector(".product-mobile-menu-btn");
      const panel = document.getElementById("productMobilePanel");
      const scrim = document.querySelector(".product-mobile-scrim");

      trigger?.setAttribute("aria-expanded", "false");
      panel?.setAttribute("aria-hidden", "true");
      panel?.classList.remove("is-open");
      scrim?.classList.remove("is-open");
      document.body.classList.remove("product-mobile-nav-open");
      root.dataset.productMobileNav = "closed";
    }

    mobileNavQuery.addEventListener?.("change", () => {
      reconcileMobileNav();
      schedule();
    });
    window.addEventListener("cursor:product-ui-ready", () => {
      reconcileMobileNav();
      schedule();
    });

    applyCurrent();
  }

  function loadProductUi() {
    loadScript("product-ui.js?v=0.1.1");
  }

  function loadSiteMotion() {
    loadScript("motion/spring.js?v=0.1.0", function loadLayoutMotion() {
      loadScript("motion/layout-motion.js?v=0.1.0", function loadNumberMotion() {
        loadScript("motion/number-motion.js?v=0.1.0", function loadSiteMotionController() {
          loadScript("motion/site-motion.js?v=0.1.0", loadProductUi);
        });
      });
    });
  }

  function loadAmbientField() {
    loadScript("ambient/particle-renderer-webgl.js?v=0.1.0", function loadAmbientInteraction() {
      loadScript("ambient/interaction-field.js?v=0.1.0", function loadAmbientSimulation() {
        loadScript("ambient/particle-field.js?v=0.1.0", loadSiteMotion);
      });
    });
  }

  loadScript("main-base.js?v=3.10.0", function loadLiquidGlassCore() {
    installNavigationResilience();
    loadScript("liquid-glass.js?v=0.1.3", function loadLiquidGlassV2() {
      loadScript("liquid-glass-v2.js?v=0.2.1", function loadLiquidGlassComponents() {
        loadScript("liquid-glass-components.js?v=0.3.1", function waitForComponentBoot() {
          if (root.classList.contains("lg-components-ready")) {
            loadAmbientField();
          } else {
            window.addEventListener("cursor:liquid-glass-components-ready", loadAmbientField, { once: true });
          }
        });
      });
    });
  });
})();
