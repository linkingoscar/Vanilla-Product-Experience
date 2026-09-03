/**
 * Cursor Layout Motion v0.1
 * -------------------------
 * Small FLIP/layout continuity helper for a framework-free static page.
 */
(function registerCursorLayoutMotion() {
  "use strict";

  const Physics = () => window.CursorMotionPhysics;

  function rectSnapshot(elements) {
    const snapshot = new Map();
    Array.from(elements || []).forEach((el) => {
      if (!(el instanceof Element) || !el.isConnected) return;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) snapshot.set(el, rect);
    });
    return snapshot;
  }

  function sanitizeGhost(node) {
    node.setAttribute("aria-hidden", "true");
    node.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    node.querySelectorAll(".lg-optics, .lg-content-copy, .ambient-particle-glass-mirror").forEach((el) => el.remove());
    node.querySelectorAll("a, button, input, select, textarea").forEach((el) => {
      el.setAttribute("tabindex", "-1");
      el.style.pointerEvents = "none";
    });
    return node;
  }

  function createGhost(el, rect) {
    if (!rect || rect.width <= 0 || rect.height <= 0) return null;
    const ghost = sanitizeGhost(el.cloneNode(true));
    ghost.classList.add("site-motion-layout-ghost");
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      zIndex: "760",
      pointerEvents: "none",
      transformOrigin: "50% 50%"
    });
    document.body.appendChild(ghost);
    return ghost;
  }

  function animateGhostOut(ghost, options) {
    if (!ghost) return;
    const opts = options || {};
    const animation = ghost.animate([
      { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0px)" },
      { opacity: 0, transform: `translate3d(0,${opts.y ?? -8}px,0) scale(${opts.scale ?? 0.975})`, filter: "blur(2px)" }
    ], {
      duration: opts.duration || 220,
      easing: opts.easing || "cubic-bezier(.22,.72,.18,1)",
      fill: "forwards"
    });
    animation.finished.finally(() => ghost.remove());
  }

  function animateFlip(first, elements, options) {
    const opts = options || {};
    const PhysicsApi = Physics();
    if (!PhysicsApi) return { animations: [], moved: [], entered: [] };
    const animations = [];
    const moved = [];
    const entered = [];

    Array.from(elements || []).forEach((el, index) => {
      if (!(el instanceof Element) || !el.isConnected) return;
      const last = el.getBoundingClientRect();
      if (last.width <= 0 || last.height <= 0) return;
      const before = first.get(el);

      if (!before) {
        entered.push(el);
        const delay = Math.min(index * (opts.enterStagger || 18), opts.maxEnterDelay || 120);
        const animation = el.animate([
          { opacity: 0, transform: `translate3d(0,${opts.enterY ?? 13}px,0) scale(${opts.enterScale ?? 0.985})`, filter: "blur(2px)" },
          { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0px)" }
        ], {
          duration: opts.enterDuration || 360,
          delay,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both"
        });
        animations.push(animation);
        return;
      }

      const dx = before.left - last.left;
      const dy = before.top - last.top;
      const sx = before.width / Math.max(1, last.width);
      const sy = before.height / Math.max(1, last.height);
      if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25 && Math.abs(sx - 1) < 0.003 && Math.abs(sy - 1) < 0.003) return;

      moved.push(el);
      const spring = PhysicsApi.springFrames((progress) => ({
        transform: `translate3d(${(dx * (1 - progress)).toFixed(3)}px, ${(dy * (1 - progress)).toFixed(3)}px, 0) scale(${(1 + (sx - 1) * (1 - progress)).toFixed(5)}, ${(1 + (sy - 1) * (1 - progress)).toFixed(5)})`
      }), {
        stiffness: opts.stiffness || 360,
        damping: opts.damping || 36,
        mass: opts.mass || 1,
        maxDuration: opts.maxDuration || 0.9
      });

      const animation = el.animate(spring.keyframes, {
        duration: spring.duration,
        easing: "linear",
        fill: "both"
      });
      animations.push(animation);
    });

    return { animations, moved, entered };
  }

  function animateContainerHeight(container, fromHeight, toHeight, options) {
    if (!container || Math.abs(fromHeight - toHeight) < 1) return null;
    const opts = options || {};
    container.style.height = `${fromHeight}px`;
    container.style.overflow = "clip";
    const animation = container.animate([
      { height: `${fromHeight}px` },
      { height: `${toHeight}px` }
    ], {
      duration: opts.duration || 460,
      easing: opts.easing || "cubic-bezier(.2,.78,.18,1)",
      fill: "forwards"
    });
    animation.finished.finally(() => {
      container.style.removeProperty("height");
      container.style.removeProperty("overflow");
    });
    return animation;
  }

  window.CursorLayoutMotion = Object.freeze({
    version: "0.1.0",
    capture: rectSnapshot,
    createGhost,
    animateGhostOut,
    animateFlip,
    animateContainerHeight
  });
})();
