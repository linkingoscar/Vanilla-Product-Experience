/**
 * Cursor Liquid Glass Engine v0.2.1 — content-copy renderer & interaction layer
 * ---------------------------------------------------------------------------
 * Safari/WebKit and Firefox currently cannot rely on SVG displacement through
 * backdrop-filter. This enhancement mirrors the real document content beneath
 * selected glass controls, clips that copy to the glass geometry, and applies
 * the already-generated feDisplacementMap through CSS filter:url().
 *
 * Result: actual page pixels/text/lines are displaced instead of substituting
 * Gaussian blur. Chromium keeps the faster backdrop SVG renderer from v0.1.
 */
(function initCursorLiquidGlassV2() {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduceTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");
  const baseRenderer = root.dataset.lgRenderer || "";
  const copyRecords = new Set();
  const copyByElement = new WeakMap();
  const rangeRecords = new WeakMap();

  let ambientSyncTimer = 0;
  let lastPaletteSourceRect = null;
  let paletteAnimation = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, x) {
    if (edge0 === edge1) return x < edge0 ? 0 : 1;
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function pageRect(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY
    };
  }

  function stripMirrorRuntime(clone) {
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("script, iframe, video, audio, canvas, object, embed").forEach((node) => node.remove());
    clone.querySelectorAll(".lg-optics, .lg-shared-lens, .lg-content-copy, .lg-range-thumb").forEach((node) => node.remove());

    clone.querySelectorAll("[id]").forEach((node) => {
      node.dataset.lgMirrorId = node.id;
      node.removeAttribute("id");
    });

    clone.querySelectorAll(".lg-surface, .lg-interactive, .lg-pressed, .lg-has-shared-lens").forEach((node) => {
      node.classList.remove("lg-surface", "lg-interactive", "lg-pressed", "lg-has-shared-lens");
      delete node.dataset.lgRenderer;
      delete node.dataset.lgPointerReady;
    });

    clone.querySelectorAll(".animate-on-scroll, .bento-card, .feature-card, .pricing-card, .timeline-item").forEach((node) => {
      node.classList.add("is-visible");
    });

    clone.querySelectorAll("a, button, input, select, textarea").forEach((node) => {
      node.setAttribute("tabindex", "-1");
      node.setAttribute("aria-hidden", "true");
      node.style.pointerEvents = "none";
      if (node.tagName === "A") node.removeAttribute("href");
    });

    return clone;
  }

  function buildAmbientMirror(world) {
    const originalLayer = document.querySelector(".bg-blobs");
    if (!originalLayer) return null;

    const mirrorLayer = originalLayer.cloneNode(true);
    mirrorLayer.classList.add("lg-mirror-bg");
    mirrorLayer.setAttribute("aria-hidden", "true");
    mirrorLayer.querySelectorAll(".blob").forEach((blob) => {
      blob.style.animation = "none";
      blob.style.willChange = "auto";
    });
    world.appendChild(mirrorLayer);

    return {
      originalLayer,
      mirrorLayer,
      originalBlobs: Array.from(originalLayer.querySelectorAll(".blob")),
      mirrorBlobs: Array.from(mirrorLayer.querySelectorAll(".blob"))
    };
  }

  function syncAmbient(record) {
    if (!record.ambient) return;
    const { mirrorLayer, originalBlobs, mirrorBlobs } = record.ambient;
    mirrorLayer.style.left = `${window.scrollX}px`;
    mirrorLayer.style.top = `${window.scrollY}px`;
    mirrorLayer.style.width = `${window.innerWidth}px`;
    mirrorLayer.style.height = `${window.innerHeight}px`;

    originalBlobs.forEach((source, index) => {
      const mirror = mirrorBlobs[index];
      if (!mirror) return;
      const style = getComputedStyle(source);
      mirror.style.transform = style.transform;
      mirror.style.borderRadius = style.borderRadius;
      mirror.style.opacity = style.opacity;
    });
  }

  function createWorld(record, sourceEl) {
    const world = document.createElement("span");
    world.className = "lg-content-copy-world";
    world.setAttribute("aria-hidden", "true");

    record.ambient = buildAmbientMirror(world);

    if (sourceEl) {
      const clone = stripMirrorRuntime(sourceEl.cloneNode(true));
      clone.classList.add("lg-content-copy-local-source");
      world.appendChild(clone);
      record.sourceEl = sourceEl;
      record.sourceClone = clone;
    } else {
      const main = document.querySelector("main");
      const footer = document.querySelector(".site-footer");
      if (main) {
        const clone = stripMirrorRuntime(main.cloneNode(true));
        clone.classList.add("lg-content-copy-main");
        world.appendChild(clone);
      }
      if (footer) {
        const clone = stripMirrorRuntime(footer.cloneNode(true));
        clone.classList.add("lg-content-copy-footer");
        world.appendChild(clone);
      }
    }

    return world;
  }

  function updateCopyFilter(record) {
    if (!record.fallback || !record.copy) return;
    const base = record.fallback.style.filter || getComputedStyle(record.fallback).filter;
    if (!base || base === "none") return;
    record.copy.style.filter = `${base} saturate(1.18) brightness(1.025)`;
    record.el.classList.add("lg-content-copy-ready");
    record.el.dataset.lgRenderer = "content-copy-svg";
  }

  function syncLocalSource(record) {
    if (!record.sourceEl || !record.sourceClone) return;
    const source = pageRect(record.sourceEl);
    record.sourceClone.style.left = `${source.left}px`;
    record.sourceClone.style.top = `${source.top}px`;
    record.sourceClone.style.width = `${source.width}px`;
    record.sourceClone.style.height = `${source.height}px`;

    // Keep dynamic labels/values in the local mirror current without cloning
    // the whole ROI/demo subtree on every input event.
    record.sourceClone.querySelectorAll("[data-lg-mirror-id]").forEach((mirror) => {
      const original = document.getElementById(mirror.dataset.lgMirrorId);
      if (!original) return;

      if (mirror.matches("input, select, textarea")) {
        mirror.value = original.value;
      } else if (mirror.children.length === 0) {
        mirror.textContent = original.textContent;
      }

      if (original.matches("input.range-slider")) {
        const originalShell = original.closest(".lg-range-shell");
        const mirrorShell = mirror.closest(".lg-range-shell");
        if (originalShell && mirrorShell) {
          mirrorShell.style.setProperty("--lg-range-progress", originalShell.style.getPropertyValue("--lg-range-progress"));
          const originalFill = originalShell.querySelector(".lg-range-fill");
          const mirrorFill = mirrorShell.querySelector(".lg-range-fill");
          if (originalFill && mirrorFill) mirrorFill.style.width = originalFill.style.width;
        }
      }
    });
  }

  function syncContentCopy(record) {
    if (!record || !record.el.isConnected) return;
    const rect = record.el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const doc = document.documentElement;
    const worldWidth = Math.max(doc.scrollWidth, window.innerWidth);
    const worldHeight = Math.max(doc.scrollHeight, window.innerHeight);
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;

    record.world.style.width = `${worldWidth}px`;
    record.world.style.height = `${worldHeight}px`;
    record.world.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
    record.world.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;

    syncLocalSource(record);
    syncAmbient(record);
  }

  function installContentCopySurface(el, options) {
    if (!el || copyByElement.has(el) || reduceTransparency.matches) return copyByElement.get(el) || null;
    const opts = options || {};
    const refract = el.querySelector(":scope > .lg-refract");
    const fallback = refract && refract.querySelector(":scope > .lg-refract-fallback");
    if (!refract || !fallback) return null;

    let sourceEl = null;
    if (opts.source instanceof Element) sourceEl = opts.source;
    if (!sourceEl && opts.sourceSelector) sourceEl = document.querySelector(opts.sourceSelector);

    const copy = document.createElement("span");
    copy.className = "lg-content-copy";
    copy.setAttribute("aria-hidden", "true");

    const record = {
      el,
      refract,
      fallback,
      copy,
      world: null,
      ambient: null,
      sourceEl: null,
      sourceClone: null,
      filterObserver: null
    };

    record.world = createWorld(record, sourceEl);
    copy.appendChild(record.world);
    refract.insertBefore(copy, fallback);

    const filterObserver = new MutationObserver(() => updateCopyFilter(record));
    filterObserver.observe(fallback, { attributes: true, attributeFilter: ["style"] });
    record.filterObserver = filterObserver;

    copyByElement.set(el, record);
    copyRecords.add(record);
    updateCopyFilter(record);
    syncContentCopy(record);
    return record;
  }

  function removeContentCopies() {
    copyRecords.forEach((record) => {
      record.filterObserver?.disconnect();
      record.copy.remove();
      copyByElement.delete(record.el);
      record.el.classList.remove("lg-content-copy-ready");
      if (record.el.dataset.lgRenderer === "content-copy-svg") {
        record.el.dataset.lgRenderer = "svg-local";
      }
    });
    copyRecords.clear();
  }

  function syncAllCopies() {
    copyRecords.forEach(syncContentCopy);
  }

  // Full-document mirrors are comparatively cheap to rebuild after discrete UI
  // state changes (feature filter/theme/simulator). This prevents Safari/Firefox
  // from refracting stale content while avoiding MutationObserver churn per frame.
  function rebuildFullWorld(record) {
    if (!record || record.sourceEl || !record.copy.isConnected) return;
    const previous = record.world;
    record.ambient = null;
    record.world = createWorld(record, null);
    previous.replaceWith(record.world);
    syncContentCopy(record);
  }

  function refreshFullWorldCopies() {
    copyRecords.forEach((record) => rebuildFullWorld(record));
  }

  function syncAmbientThrottled() {
    window.clearTimeout(ambientSyncTimer);
    ambientSyncTimer = window.setTimeout(() => copyRecords.forEach(syncAmbient), 180);
  }

  function isCopyRendererNeeded() {
    return baseRenderer === "svg-local" || /Firefox/i.test(navigator.userAgent);
  }

  function installCrossBrowserRefraction() {
    if (!isCopyRendererNeeded() || reduceTransparency.matches) return;

    root.dataset.lgRenderer = "content-copy-svg";

    document.querySelectorAll(".island, .cmd-palette-modal, [data-lg-copy-backdrop='true']").forEach((el) => {
      installContentCopySurface(el);
    });
  }

  function springScalar(config) {
    const state = {
      value: config.from,
      velocity: config.velocity || 0,
      target: config.to,
      running: true,
      last: performance.now(),
      raf: 0
    };

    const stiffness = config.stiffness || 300;
    const damping = config.damping || 28;

    function frame(now) {
      if (!state.running) return;
      const dt = Math.min(0.032, Math.max(0.001, (now - state.last) / 1000));
      state.last = now;

      const acceleration = (state.target - state.value) * stiffness;
      state.velocity += acceleration * dt;
      state.velocity *= Math.exp(-damping * dt);
      state.value += state.velocity * dt;

      config.onUpdate?.(state.value, state.velocity);

      const settled = Math.abs(state.target - state.value) < 0.0015 && Math.abs(state.velocity) < 0.006;
      if (settled) {
        state.value = state.target;
        state.velocity = 0;
        state.running = false;
        config.onUpdate?.(state.value, 0);
        config.onComplete?.();
        return;
      }
      state.raf = requestAnimationFrame(frame);
    }

    state.raf = requestAnimationFrame(frame);
    return {
      cancel() {
        state.running = false;
        cancelAnimationFrame(state.raf);
      },
      get value() {
        return state.value;
      }
    };
  }

  function paletteNodes() {
    const backdrop = document.getElementById("cmdPalette");
    const modal = backdrop?.querySelector(".cmd-palette-modal") || null;
    const source = document.querySelector(".island-search-btn.open-cmd-palette")
      || document.querySelector(".open-cmd-palette");
    const contents = modal
      ? Array.from(modal.querySelectorAll(".cmd-input-wrap, .cmd-results, .cmd-footer"))
      : [];
    return { backdrop, modal, source, contents };
  }

  function clearPaletteInline(modal, contents) {
    if (!modal) return;
    modal.style.removeProperty("transform");
    modal.style.removeProperty("transform-origin");
    modal.style.removeProperty("border-radius");
    modal.style.removeProperty("opacity");
    modal.classList.remove("lg-morph-energy");
    contents.forEach((node) => {
      node.style.removeProperty("opacity");
      node.style.removeProperty("transform");
    });
  }

  function animatePalette(opening, sourceRectOverride) {
    const { backdrop, modal, source, contents } = paletteNodes();
    if (!backdrop || !modal || !source) return;

    paletteAnimation?.cancel?.();
    paletteAnimation = null;

    const sourceRect = sourceRectOverride || lastPaletteSourceRect || source.getBoundingClientRect();
    const targetRect = modal.getBoundingClientRect();
    if (!targetRect.width || !targetRect.height) return;

    const dx = sourceRect.left - targetRect.left;
    const dy = sourceRect.top - targetRect.top;
    const sx = clamp(sourceRect.width / targetRect.width, 0.045, 1);
    const sy = clamp(sourceRect.height / targetRect.height, 0.045, 1);
    const targetRadius = parseFloat(getComputedStyle(modal).borderTopLeftRadius) || 24;
    const sourceRadius = Math.max(12, sourceRect.height * 0.5);

    modal.style.transformOrigin = "top left";
    modal.classList.add("lg-morph-energy");
    backdrop.classList.toggle("lg-palette-opening", opening);
    backdrop.classList.toggle("lg-palette-closing", !opening);

    if (opening) source.classList.add("lg-morph-source-hidden");

    const from = opening ? 0 : 1;
    const to = opening ? 1 : 0;

    const finish = () => {
      paletteAnimation = null;
      backdrop.classList.remove("lg-palette-opening", "lg-palette-closing");
      source.classList.remove("lg-morph-source-hidden");

      if (!opening) {
        backdrop.classList.remove("is-open");
        backdrop.setAttribute("aria-hidden", "true");
      }

      clearPaletteInline(modal, contents);
      syncAllCopies();
    };

    if (reduceMotion.matches) {
      if (!opening) {
        backdrop.classList.remove("is-open");
        backdrop.setAttribute("aria-hidden", "true");
      }
      finish();
      return;
    }

    paletteAnimation = springScalar({
      from,
      to,
      stiffness: opening ? 315 : 360,
      damping: opening ? 29 : 32,
      onUpdate(raw) {
        const p = clamp(raw, -0.035, 1.035);
        const geometry = clamp(p, 0, 1);
        const tx = dx * (1 - geometry);
        const ty = dy * (1 - geometry);
        const scaleX = sx + (1 - sx) * geometry;
        const scaleY = sy + (1 - sy) * geometry;
        const radius = sourceRadius + (targetRadius - sourceRadius) * geometry;
        const contentP = smoothstep(0.42, 0.82, geometry);

        modal.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
        modal.style.borderRadius = `${radius.toFixed(2)}px`;
        modal.style.opacity = String(clamp(0.82 + geometry * 0.18, 0, 1));

        contents.forEach((node) => {
          node.style.opacity = String(contentP);
          node.style.transform = `translate3d(0, ${(1 - contentP) * -8}px, 0)`;
        });

        if (Math.random() > 0.5) syncContentCopy(copyByElement.get(modal));
      },
      onComplete: finish
    });
  }

  function installPaletteMorph() {
    const { backdrop, modal, source } = paletteNodes();
    if (!backdrop || !modal || !source) return;

    document.querySelectorAll(".open-cmd-palette").forEach((button) => {
      button.addEventListener("click", () => {
        lastPaletteSourceRect = button.getBoundingClientRect();
        requestAnimationFrame(() => {
          if (backdrop.classList.contains("is-open")) animatePalette(true, lastPaletteSourceRect);
        });
      });
    });

    backdrop.addEventListener("click", (event) => {
      if (event.target !== backdrop || !backdrop.classList.contains("is-open")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      animatePalette(false, source.getBoundingClientRect());
    }, true);

    window.addEventListener("keydown", (event) => {
      const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const escape = event.key === "Escape";
      const open = backdrop.classList.contains("is-open");

      if (open && (shortcut || escape)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        animatePalette(false, source.getBoundingClientRect());
        return;
      }

      if (!open && shortcut) {
        lastPaletteSourceRect = source.getBoundingClientRect();
        requestAnimationFrame(() => {
          if (backdrop.classList.contains("is-open")) animatePalette(true, lastPaletteSourceRect);
        });
      }
    }, true);

    const mutation = new MutationObserver(() => {
      if (!backdrop.classList.contains("is-open") && !backdrop.classList.contains("lg-palette-closing")) {
        paletteAnimation?.cancel?.();
        paletteAnimation = null;
        source.classList.remove("lg-morph-source-hidden");
        clearPaletteInline(modal, Array.from(modal.querySelectorAll(".cmd-input-wrap, .cmd-results, .cmd-footer")));
      }
    });
    mutation.observe(backdrop, { attributes: true, attributeFilter: ["class"] });
  }

  function rangePercent(input) {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || min);
    if (max === min) return 0;
    return clamp((value - min) / (max - min), 0, 1);
  }

  function syncRange(record) {
    const { input, shell, thumb, fill } = record;
    const shellRect = shell.getBoundingClientRect();
    const thumbSize = parseFloat(getComputedStyle(thumb).width) || 28;
    const travel = Math.max(0, shellRect.width - thumbSize);
    const x = rangePercent(input) * travel;
    const center = x + thumbSize * 0.5;

    thumb.style.transform = `translate3d(${x.toFixed(2)}px, -50%, 0)`;
    fill.style.width = `${center.toFixed(2)}px`;
    shell.style.setProperty("--lg-range-progress", `${(rangePercent(input) * 100).toFixed(2)}%`);
    input.setAttribute("aria-valuenow", input.value);

    const copyRecord = copyByElement.get(thumb);
    if (copyRecord) requestAnimationFrame(() => syncContentCopy(copyRecord));
  }

  function installRange(input) {
    if (!input || rangeRecords.has(input) || input.closest(".lg-range-shell")) return;

    const shell = document.createElement("span");
    shell.className = "lg-range-shell";
    const track = document.createElement("span");
    track.className = "lg-range-track";
    const fill = document.createElement("span");
    fill.className = "lg-range-fill";
    const thumb = document.createElement("span");
    thumb.className = "lg-range-thumb";
    thumb.dataset.liquidGlass = "clear";
    thumb.dataset.lgStrength = "9";
    thumb.dataset.lgCopyBackdrop = "true";
    thumb.setAttribute("aria-hidden", "true");

    input.parentNode.insertBefore(shell, input);
    shell.append(track, fill, thumb, input);
    input.classList.add("lg-range-input");

    const record = { input, shell, track, fill, thumb };
    rangeRecords.set(input, record);

    window.CursorLiquidGlass?.decorate(thumb, { variant: "clear", strength: 9, interactive: false });

    requestAnimationFrame(() => {
      // Place the native input/fill before cloning so the local mirror starts
      // from the correct value; stripMirrorRuntime removes the visual thumb.
      syncRange(record);
      if (isCopyRendererNeeded()) {
        installContentCopySurface(thumb, { source: input.closest(".roi-card") || input.parentElement });
      }
    });

    const activate = () => shell.classList.add("lg-range-active");
    const deactivate = () => shell.classList.remove("lg-range-active");

    input.addEventListener("input", () => syncRange(record));
    input.addEventListener("pointerdown", activate, { passive: true });
    input.addEventListener("pointerup", deactivate, { passive: true });
    input.addEventListener("pointercancel", deactivate, { passive: true });
    input.addEventListener("focus", () => shell.classList.add("lg-range-focus"));
    input.addEventListener("blur", () => {
      shell.classList.remove("lg-range-focus");
      deactivate();
    });
    input.addEventListener("keydown", activate);
    input.addEventListener("keyup", deactivate);
  }

  function installRanges() {
    document.querySelectorAll("input.range-slider[type='range']").forEach(installRange);
  }

  function installMirrorRefreshTriggers() {
    // Discrete state transitions change the source DOM layout/content. Rebuild
    // full-world mirrors shortly after the source code finishes its own update.
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".feature-tabs, .prompt-chips, .theme-toggle")) return;
      window.setTimeout(refreshFullWorldCopies, 90);
    }, { passive: true });
  }

  function installLayoutSync() {
    let ticking = false;
    const sync = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        syncAllCopies();
        ticking = false;
      });
    };

    window.addEventListener("scroll", () => {
      sync();
      syncAmbientThrottled();
    }, { passive: true });
    window.addEventListener("resize", () => {
      sync();
      document.querySelectorAll("input.range-slider[type='range']").forEach((input) => {
        const record = rangeRecords.get(input);
        if (record) syncRange(record);
      });
    }, { passive: true });
  }

  function handleTransparency() {
    if (reduceTransparency.matches) {
      removeContentCopies();
      root.dataset.lgRenderer = "accessible-solid";
      return;
    }
    if (window.CursorLiquidGlass) {
      root.dataset.lgRenderer = window.CursorLiquidGlass.renderer;
      installCrossBrowserRefraction();
    }
  }

  function boot() {
    if (!window.CursorLiquidGlass) return;

    installCrossBrowserRefraction();
    installPaletteMorph();
    installRanges();
    installMirrorRefreshTriggers();
    installLayoutSync();

    reduceTransparency.addEventListener?.("change", handleTransparency);

    root.dataset.lgVersion = "0.2.1";
    root.classList.add("lg-v2-ready");
    window.dispatchEvent(new CustomEvent("cursor:liquid-glass-v2-ready", {
      detail: {
        renderer: root.dataset.lgRenderer,
        quality: root.dataset.lgQuality,
        contentCopy: isCopyRendererNeeded()
      }
    }));
  }

  if (root.classList.contains("lg-ready") && window.CursorLiquidGlass) {
    boot();
  } else {
    window.addEventListener("cursor:liquid-glass-ready", boot, { once: true });
  }

  window.CursorLiquidGlassV2 = Object.freeze({
    version: "0.2.1",
    installContentCopy: installContentCopySurface,
    syncContentCopies: syncAllCopies,
    installRange,
    animatePalette,
    refreshMirrors: refreshFullWorldCopies
  });
})();
