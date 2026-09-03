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
    loadScript("liquid-glass.js?v=0.1.2", function loadLiquidGlassV2() {
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
