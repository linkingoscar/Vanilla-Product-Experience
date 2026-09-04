/**
 * Cursor Layout Motion v0.1.1
 * -------------------------
 * Small FLIP/layout continuity helper for a framework-free static page.
 */
(function registerCursorLayoutMotion() {
  "use strict";

  const Physics = () => window.CursorMotionPhysics;
  const containerHeightAnimations = new WeakMap();

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

  function clearContainerHeightState(container, expectedAnimation) {
    if (!container) return;
    if (expectedAnimation && containerHeightAnimations.get(container) !== expectedAnimation) return;
    if (!expectedAnimation || containerHeightAnimations.get(container) === expectedAnimation) {
      containerHeightAnimations.delete(container);
    }
    container.style.removeProperty("height");
    container.style.removeProperty("overflow");
    container.style.removeProperty("align-content");
  }

  function cancelContainerHeight(container) {
    if (!container) return;
    const running = containerHeightAnimations.get(container);
    if (running) {
      containerHeightAnimations.delete(container);
      try { running.cancel(); } catch (_) {}
    }
    clearContainerHeightState(container);
  }

  /**
   * Animate only safe contractions.
   *
   * Expanding a live CSS Grid from a short explicit height to a taller one can
   * force auto rows below their content size while the transition is running.
   * Feature cards intentionally clip their visual surface, so that temporary
   * row compression used to cut off titles/body copy. Expansion now adopts the
   * natural height immediately and leaves spatial continuity to FLIP/enter
   * animations. Contraction may animate the extra empty height because all
   * remaining rows already fit at their natural size.
   */
  function animateContainerHeight(container, fromHeight, toHeight, options) {
    if (!container) return null;
    const opts = options || {};

    // A fast second filter click can arrive before the previous height animation
    // settles. Remove that constraint first, then measure the current DOM state
    // instead of trusting a stale toHeight captured from an animated container.
    const running = containerHeightAnimations.get(container);
    if (running) {
      containerHeightAnimations.delete(container);
      try { running.cancel(); } catch (_) {}
    }
    clearContainerHeightState(container);

    const naturalTarget = container.getBoundingClientRect().height;
    const startHeight = Number.isFinite(fromHeight) ? fromHeight : naturalTarget;
    if (Math.abs(startHeight - naturalTarget) < 1) return null;

    // Content expansion must never constrain the real grid. Cards become fully
    // readable immediately; FLIP and enter animations still provide continuity.
    if (naturalTarget >= startHeight) return null;

    container.style.height = `${startHeight}px`;
    container.style.overflow = "clip";
    // Prevent CSS Grid's default stretch behavior from making rows absorb the
    // temporary extra container height while it contracts.
    container.style.alignContent = "start";

    const animation = container.animate([
      { height: `${startHeight}px` },
      { height: `${naturalTarget}px` }
    ], {
      duration: opts.duration || 460,
      easing: opts.easing || "cubic-bezier(.2,.78,.18,1)",
      fill: "forwards"
    });

    containerHeightAnimations.set(container, animation);
    animation.finished
      .catch(() => {})
      .finally(() => clearContainerHeightState(container, animation));
    return animation;
  }

  window.CursorLayoutMotion = Object.freeze({
    version: "0.1.1",
    capture: rectSnapshot,
    createGhost,
    animateGhostOut,
    animateFlip,
    animateContainerHeight,
    cancelContainerHeight
  });
})();
