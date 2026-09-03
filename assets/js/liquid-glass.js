/**
 * Cursor Liquid Glass Engine v0.1.1
 * ----------------------------------
 * Vanilla JS optical enhancement layer.
 *
 * The engine generates geometry-derived SVG displacement maps from a rounded
 * rectangle SDF. Chromium uses the map as a true backdrop displacement filter;
 * WebKit/Firefox keep an SVG filter-on-material path instead of pretending that
 * Gaussian blur alone is refraction. The API is intentionally framework-free.
 */
(function initCursorLiquidGlass() {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");
  const isAppleWebKit = /AppleWebKit/i.test(navigator.userAgent) && !/(Chrome|Chromium|CriOS|Edg|OPR)/i.test(navigator.userAgent);
  const isFirefox = /Firefox/i.test(navigator.userAgent);
  const renderer = (isAppleWebKit || isFirefox) ? "svg-local" : "backdrop-svg";

  const QUALITY = (() => {
    const memory = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    const narrow = window.matchMedia("(max-width: 760px)").matches;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (memory <= 4 || cores <= 4) return "low";
    if (narrow || coarse || memory <= 6 || cores <= 6) return "balanced";
    return "high";
  })();

  root.dataset.lgQuality = QUALITY;
  root.dataset.lgRenderer = renderer;

  let uid = 0;
  const records = new WeakMap();
  const sharedLenses = new WeakMap();

  function svgEl(name, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  }

  const defsHost = (() => {
    const svg = svgEl("svg", {
      width: 0,
      height: 0,
      "aria-hidden": "true",
      focusable: "false"
    });
    Object.assign(svg.style, {
      position: "fixed",
      width: "0",
      height: "0",
      overflow: "hidden",
      pointerEvents: "none"
    });
    const defs = svgEl("defs");
    svg.appendChild(defs);
    document.body.prepend(svg);
    return defs;
  })();

  function roundedRectSdf(px, py, width, height, radius) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const hx = Math.max(0, width * 0.5 - radius);
    const hy = Math.max(0, height * 0.5 - radius);
    const qx = Math.abs(px - cx) - hx;
    const qy = Math.abs(py - cy) - hy;
    const ox = Math.max(qx, 0);
    const oy = Math.max(qy, 0);
    return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius;
  }

  function smoothstep(edge0, edge1, x) {
    if (edge0 === edge1) return x < edge0 ? 0 : 1;
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  /**
   * Build an RG displacement map.
   * 128/128 is neutral. Near the inner rim, the SDF normal pushes samples
   * toward/away from the edge to create a lens band instead of random ripples.
   */
  function createDisplacementMap(width, height, radius, bezel) {
    const aspect = Math.max(0.25, Math.min(4, width / Math.max(1, height)));
    const mapH = QUALITY === "low" ? 48 : (QUALITY === "balanced" ? 60 : 72);
    const mapW = Math.max(48, Math.round(mapH * aspect));
    const canvas = document.createElement("canvas");
    canvas.width = mapW;
    canvas.height = mapH;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    const image = ctx.createImageData(mapW, mapH);

    const sx = width / mapW;
    const sy = height / mapH;
    const epsilon = Math.max(0.75, Math.min(sx, sy));

    for (let y = 0; y < mapH; y += 1) {
      for (let x = 0; x < mapW; x += 1) {
        const px = (x + 0.5) * sx;
        const py = (y + 0.5) * sy;
        const sdf = roundedRectSdf(px, py, width, height, radius);
        const insideDistance = -sdf;
        const index = (y * mapW + x) * 4;

        if (sdf > 0 || insideDistance > bezel * 1.35) {
          image.data[index] = 128;
          image.data[index + 1] = 128;
          image.data[index + 2] = 128;
          image.data[index + 3] = 255;
          continue;
        }

        const dx = roundedRectSdf(px + epsilon, py, width, height, radius)
          - roundedRectSdf(px - epsilon, py, width, height, radius);
        const dy = roundedRectSdf(px, py + epsilon, width, height, radius)
          - roundedRectSdf(px, py - epsilon, width, height, radius);
        const length = Math.hypot(dx, dy) || 1;
        const nx = dx / length;
        const ny = dy / length;
        const lens = 1 - smoothstep(0, bezel, insideDistance);
        const shaped = Math.pow(lens, 1.35);
        const xChannel = Math.round(128 + nx * shaped * 118);
        const yChannel = Math.round(128 + ny * shaped * 118);

        image.data[index] = Math.max(0, Math.min(255, xChannel));
        image.data[index + 1] = Math.max(0, Math.min(255, yChannel));
        image.data[index + 2] = Math.round(128 + shaped * 80);
        image.data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
  }

  function getRadius(el, width, height) {
    const computed = getComputedStyle(el);
    const parsed = parseFloat(computed.borderTopLeftRadius) || 0;
    return Math.min(Math.max(parsed, 8), Math.min(width, height) * 0.5);
  }

  function createFilter(el, strength) {
    const rect = el.getBoundingClientRect();
    const width = Math.max(24, Math.round(rect.width));
    const height = Math.max(24, Math.round(rect.height));
    const radius = getRadius(el, width, height);
    const bezel = Math.max(8, Math.min(parseFloat(getComputedStyle(root).getPropertyValue("--lg-bezel")) || 15, height * 0.42));
    const id = `lg-refraction-${++uid}`;
    const mapUrl = createDisplacementMap(width, height, radius, bezel);

    const filter = svgEl("filter", {
      id,
      x: -width * 0.18,
      y: -height * 0.28,
      width: width * 1.36,
      height: height * 1.56,
      filterUnits: "userSpaceOnUse",
      primitiveUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB"
    });

    const image = svgEl("feImage", {
      href: mapUrl,
      x: 0,
      y: 0,
      width,
      height,
      preserveAspectRatio: "none",
      result: "lg-map"
    });

    const displacement = svgEl("feDisplacementMap", {
      in: "SourceGraphic",
      in2: "lg-map",
      scale: Math.max(2, strength * 2),
      xChannelSelector: "R",
      yChannelSelector: "G",
      result: "lg-displaced"
    });

    filter.append(image, displacement);
    defsHost.appendChild(filter);
    return { id, filter, width, height, strength };
  }

  function makeLayer(className) {
    const layer = document.createElement("span");
    layer.className = `lg-optics ${className}`;
    layer.setAttribute("aria-hidden", "true");
    return layer;
  }

  function applyFilter(record) {
    const { el, filter, refract, fallback, variant } = record;
    if (!filter) return;
    const blur = variant === "clear" ? "0.4px" : "1px";
    const chain = `url("#${filter.id}") saturate(1.18) brightness(1.025) blur(${blur})`;

    if (renderer === "backdrop-svg") {
      refract.style.backdropFilter = chain;
      refract.style.webkitBackdropFilter = chain;
    } else {
      refract.style.backdropFilter = "none";
      refract.style.webkitBackdropFilter = "none";
    }

    fallback.style.filter = `url("#${filter.id}")`;
    el.dataset.lgRenderer = renderer;
  }

  function refreshSurface(el) {
    const record = records.get(el);
    if (!record || prefersReducedTransparency.matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return;

    if (record.filter && record.filter.filter.parentNode) {
      record.filter.filter.remove();
    }

    const strength = Number(el.dataset.lgStrength || record.strength || 9);
    record.filter = createFilter(el, strength);
    applyFilter(record);
  }

  function addPointerLighting(el) {
    if (el.dataset.lgPointerReady === "true") return;
    el.dataset.lgPointerReady = "true";

    const reset = () => {
      el.style.setProperty("--lg-local-light-x", "30%");
      el.style.setProperty("--lg-local-light-y", "8%");
    };

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
      el.style.setProperty("--lg-local-light-x", `${Math.max(0, Math.min(100, x)).toFixed(1)}%`);
      el.style.setProperty("--lg-local-light-y", `${Math.max(0, Math.min(100, y)).toFixed(1)}%`);
    }, { passive: true });
    el.addEventListener("pointerleave", reset, { passive: true });
    el.addEventListener("pointerdown", () => el.classList.add("lg-pressed"), { passive: true });
    ["pointerup", "pointercancel", "blur"].forEach((name) => {
      el.addEventListener(name, () => el.classList.remove("lg-pressed"), { passive: true });
    });
  }

  function decorateSurface(el, options) {
    if (!el || records.has(el)) return records.get(el);
    const opts = options || {};
    const variant = opts.variant || el.dataset.liquidGlass || "regular";
    const strength = Number(opts.strength || el.dataset.lgStrength || (variant === "clear" ? 11 : 8));

    el.classList.add("lg-surface");
    if (opts.interactive !== false) el.classList.add("lg-interactive");

    const refract = makeLayer("lg-refract");
    const fallback = document.createElement("span");
    fallback.className = "lg-refract-fallback";
    fallback.setAttribute("aria-hidden", "true");
    refract.appendChild(fallback);

    const material = makeLayer("lg-material");
    const specular = makeLayer("lg-specular");
    el.prepend(specular);
    el.prepend(material);
    el.prepend(refract);

    const record = { el, refract, fallback, material, specular, variant, strength, filter: null, resizeObserver: null };
    records.set(el, record);
    addPointerLighting(el);

    if (!prefersReducedTransparency.matches) {
      requestAnimationFrame(() => refreshSurface(el));
    }

    if ("ResizeObserver" in window) {
      let resizeTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => refreshSurface(el), 90);
      });
      ro.observe(el);
      record.resizeObserver = ro;
    }

    return record;
  }

  function springLens(lens, target, state) {
    if (prefersReducedMotion.matches) {
      state.x = target.x;
      state.w = target.w;
      state.vx = 0;
      state.vw = 0;
      lens.style.transform = `translate3d(${target.x}px, 0, 0)`;
      lens.style.width = `${target.w}px`;
      return;
    }

    state.targetX = target.x;
    state.targetW = target.w;
    if (state.running) return;
    state.running = true;
    state.last = performance.now();

    const stiffness = 265;
    const damping = 27;

    function frame(now) {
      const dt = Math.min(0.032, Math.max(0.001, (now - state.last) / 1000));
      state.last = now;

      const ax = (state.targetX - state.x) * stiffness;
      const aw = (state.targetW - state.w) * stiffness;
      state.vx += ax * dt;
      state.vw += aw * dt;
      const decay = Math.exp(-damping * dt);
      state.vx *= decay;
      state.vw *= decay;
      state.x += state.vx * dt;
      state.w += state.vw * dt;

      lens.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`;
      lens.style.width = `${Math.max(1, state.w).toFixed(2)}px`;

      const settled =
        Math.abs(state.targetX - state.x) < 0.12 &&
        Math.abs(state.targetW - state.w) < 0.12 &&
        Math.abs(state.vx) < 0.14 &&
        Math.abs(state.vw) < 0.14;

      if (settled) {
        state.x = state.targetX;
        state.w = state.targetW;
        state.vx = 0;
        state.vw = 0;
        state.running = false;
        lens.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`;
        lens.style.width = `${state.w.toFixed(2)}px`;
        refreshSurface(lens);
        return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function getActiveItem(container, itemSelector) {
    return container.querySelector(`${itemSelector}.is-active`)
      || container.querySelector(`${itemSelector}[aria-selected="true"]`)
      || container.querySelector(`${itemSelector}[aria-pressed="true"]`)
      || container.querySelector(itemSelector);
  }

  function installSharedLens(container, itemSelector) {
    if (!container || sharedLenses.has(container)) return;
    const first = getActiveItem(container, itemSelector);
    if (!first) return;

    container.classList.add("lg-has-shared-lens");
    const lens = document.createElement("span");
    lens.className = "lg-shared-lens";
    lens.setAttribute("aria-hidden", "true");
    container.prepend(lens);
    decorateSurface(lens, { variant: "clear", strength: 10, interactive: false });

    const cRect = container.getBoundingClientRect();
    const fRect = first.getBoundingClientRect();
    const state = {
      x: fRect.left - cRect.left,
      w: fRect.width,
      vx: 0,
      vw: 0,
      targetX: fRect.left - cRect.left,
      targetW: fRect.width,
      running: false,
      last: performance.now()
    };
    lens.style.transform = `translate3d(${state.x}px, 0, 0)`;
    lens.style.width = `${state.w}px`;

    function sync() {
      const active = getActiveItem(container, itemSelector);
      if (!active) return;
      const parentRect = container.getBoundingClientRect();
      const itemRect = active.getBoundingClientRect();
      springLens(lens, {
        x: itemRect.left - parentRect.left,
        w: itemRect.width
      }, state);
    }

    const mutation = new MutationObserver(sync);
    mutation.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "aria-selected", "aria-pressed"]
    });

    container.addEventListener("click", () => requestAnimationFrame(sync));
    window.addEventListener("resize", sync, { passive: true });
    sharedLenses.set(container, { lens, state, mutation, sync });
    requestAnimationFrame(() => {
      sync();
      refreshSurface(lens);
    });
  }

  function decorateExistingUi() {
    document.querySelectorAll([
      ".island",
      ".hero-actions .btn",
      ".pricing-card .btn",
      "#start .btn",
      ".island-search-btn",
      ".lang-badge",
      ".theme-toggle",
      ".back-to-top",
      ".ide-swarm-pill",
      ".pricing-badge",
      ".cmd-palette-modal",
      "[data-liquid-glass]"
    ].join(",")).forEach((el) => {
      let variant = "regular";
      let strength = 8;
      if (el.matches(".btn-primary, .btn-p")) {
        variant = "clear";
        strength = 11;
      } else if (el.matches(".island, .cmd-palette-modal")) {
        variant = "regular";
        strength = 9;
      } else if (el.matches(".ide-swarm-pill, .pricing-badge, .lang-badge")) {
        variant = "clear";
        strength = 7;
      }
      decorateSurface(el, { variant, strength, interactive: !el.matches(".island, .cmd-palette-modal") });
    });

    installSharedLens(document.querySelector(".island-nav"), "a");
    installSharedLens(document.querySelector(".feature-tabs"), ".tab-btn");
    document.querySelectorAll("[data-lg-segmented]").forEach((container) => {
      installSharedLens(container, "button, [role='tab']");
    });
  }

  function refreshAll() {
    document.querySelectorAll(".lg-surface").forEach((el) => refreshSurface(el));
  }

  function handleAccessibilityChange() {
    if (prefersReducedTransparency.matches) {
      root.dataset.lgTransparency = "reduced";
    } else {
      delete root.dataset.lgTransparency;
      requestAnimationFrame(refreshAll);
    }
  }

  prefersReducedTransparency.addEventListener?.("change", handleAccessibilityChange);
  handleAccessibilityChange();

  requestAnimationFrame(() => {
    decorateExistingUi();
    root.classList.add("lg-ready");
    window.dispatchEvent(new CustomEvent("cursor:liquid-glass-ready", {
      detail: { renderer, quality: QUALITY }
    }));
  });

  window.CursorLiquidGlass = Object.freeze({
    version: "0.1.1",
    renderer,
    quality: QUALITY,
    decorate: decorateSurface,
    refresh: refreshSurface,
    installSharedLens
  });
})();
