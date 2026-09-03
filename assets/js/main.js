/**
 * Cursor 3.x JavaScript entrypoint.
 *
 * main-base.js contains the production Static Landing Page Template behavior.
 * Liquid Glass loads afterwards as removable enhancement layers:
 *   v0.1 optical primitives + shared lenses
 *   v0.2.x cross-browser content-copy refraction + fluid controls
 */
(function bootstrapCursorExperience() {
  "use strict";

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

  loadScript("main-base.js?v=3.10.0", function loadLiquidGlassCore() {
    loadScript("liquid-glass.js?v=0.1.0", function loadLiquidGlassV2() {
      loadScript("liquid-glass-v2.js?v=0.2.1");
    });
  });
})();
