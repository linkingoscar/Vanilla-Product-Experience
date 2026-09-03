/**
 * Cursor 3.x JavaScript entrypoint.
 *
 * main-base.js contains the original application behavior. The Liquid Glass
 * enhancement is loaded afterwards so existing interactions remain the source
 * of truth and the new material system stays removable/reusable.
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

  loadScript("main-base.js?v=3.9.5", function loadLiquidGlass() {
    loadScript("liquid-glass.js?v=0.1.0");
  });
})();
