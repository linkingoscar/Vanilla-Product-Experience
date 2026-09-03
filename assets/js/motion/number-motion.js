/**
 * Cursor Number Motion v0.1
 * -------------------------
 * Interruptible numeric interpolation that keeps fast slider updates visually
 * continuous without adding a component runtime.
 */
(function registerCursorNumberMotion() {
  "use strict";

  const active = new WeakMap();

  function parseNumber(text) {
    const match = String(text || "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : NaN;
  }

  function animate(el, target, options) {
    if (!(el instanceof Element) || !Number.isFinite(Number(target))) return null;
    const opts = options || {};
    const previous = active.get(el);
    previous?.cancel?.();

    const from = Number.isFinite(opts.from) ? Number(opts.from) : parseNumber(el.textContent);
    const to = Number(target);
    const start = performance.now();
    const duration = Math.max(90, Number(opts.duration) || 300);
    let raf = 0;
    let cancelled = false;
    let current = Number.isFinite(from) ? from : to;

    const format = typeof opts.format === "function"
      ? opts.format
      : (value) => Math.round(value).toLocaleString();

    const ease = (t) => 1 - Math.pow(1 - t, 4);

    function frame(now) {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / duration);
      const p = ease(t);
      current = (Number.isFinite(from) ? from : to) + (to - (Number.isFinite(from) ? from : to)) * p;
      el.textContent = format(current);
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        el.textContent = format(to);
        active.delete(el);
        opts.onComplete?.(to);
      }
    }

    raf = requestAnimationFrame(frame);
    const controller = {
      cancel() {
        cancelled = true;
        cancelAnimationFrame(raf);
      },
      get value() { return current; }
    };
    active.set(el, controller);
    return controller;
  }

  window.CursorNumberMotion = Object.freeze({
    version: "0.1.0",
    parse: parseNumber,
    animate
  });
})();
