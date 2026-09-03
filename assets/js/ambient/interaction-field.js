/**
 * Ambient Interaction Field v0.1
 * -------------------------------
 * Collects pointer velocity, scroll energy, palette focus state and moving
 * Liquid Glass lens energy. No visual rendering happens in this module.
 */
(function registerAmbientInteractionField() {
  "use strict";

  class AmbientInteractionField {
    constructor() {
      this.pointer = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.42,
        vx: 0,
        vy: 0,
        speed: 0,
        active: false,
        lastX: window.innerWidth * 0.5,
        lastY: window.innerHeight * 0.42,
        lastTime: performance.now()
      };
      this.scrollVelocity = 0;
      this.lastScrollY = window.scrollY;
      this.lastScrollTime = performance.now();
      this.pulses = [];
      this.paletteOpen = false;
      this.lensSamples = new WeakMap();
      this.cleanupFns = [];
      this.install();
    }

    install() {
      const onPointerMove = (event) => {
        const now = performance.now();
        const dt = Math.max(8, now - this.pointer.lastTime) / 1000;
        const rawVx = (event.clientX - this.pointer.lastX) / dt;
        const rawVy = (event.clientY - this.pointer.lastY) / dt;
        this.pointer.vx = this.pointer.vx * 0.58 + rawVx * 0.42;
        this.pointer.vy = this.pointer.vy * 0.58 + rawVy * 0.42;
        this.pointer.speed = Math.hypot(this.pointer.vx, this.pointer.vy);
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.pointer.lastX = event.clientX;
        this.pointer.lastY = event.clientY;
        this.pointer.lastTime = now;
        this.pointer.active = true;
      };
      const onPointerLeave = () => {
        this.pointer.active = false;
      };
      const onScroll = () => {
        const now = performance.now();
        const dt = Math.max(12, now - this.lastScrollTime) / 1000;
        const raw = (window.scrollY - this.lastScrollY) / dt;
        this.scrollVelocity = this.scrollVelocity * 0.62 + raw * 0.38;
        this.lastScrollY = window.scrollY;
        this.lastScrollTime = now;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
      window.addEventListener("blur", onPointerLeave, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      this.cleanupFns.push(
        () => window.removeEventListener("pointermove", onPointerMove),
        () => document.documentElement.removeEventListener("pointerleave", onPointerLeave),
        () => window.removeEventListener("blur", onPointerLeave),
        () => window.removeEventListener("scroll", onScroll)
      );

      const palette = document.getElementById("cmdPalette");
      if (palette) {
        const sync = () => {
          this.paletteOpen = palette.classList.contains("is-open");
        };
        const observer = new MutationObserver(sync);
        observer.observe(palette, { attributes: true, attributeFilter: ["class"] });
        sync();
        this.cleanupFns.push(() => observer.disconnect());
      }
    }

    addPulse(x, y, energy, radius) {
      this.pulses.push({
        x,
        y,
        energy: Math.max(0.04, Math.min(1.5, energy || 0.4)),
        radius: Math.max(60, radius || 220),
        life: 1
      });
      if (this.pulses.length > 12) this.pulses.splice(0, this.pulses.length - 12);
    }

    sampleLensMotion() {
      document.querySelectorAll(".lg-shared-lens").forEach((lens) => {
        const rect = lens.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        const previous = this.lensSamples.get(lens);
        if (previous) {
          const distance = Math.hypot(cx - previous.x, cy - previous.y);
          if (distance > 2.5) {
            this.addPulse(cx, cy, Math.min(0.8, distance / 70), 150 + Math.min(110, distance));
          }
        }
        this.lensSamples.set(lens, { x: cx, y: cy });
      });
    }

    tick(dt) {
      const decay = Math.exp(-5.2 * dt);
      this.pointer.vx *= decay;
      this.pointer.vy *= decay;
      this.pointer.speed = Math.hypot(this.pointer.vx, this.pointer.vy);
      this.scrollVelocity *= Math.exp(-4.5 * dt);
      this.sampleLensMotion();

      this.pulses.forEach((pulse) => {
        pulse.life -= dt * 1.45;
      });
      this.pulses = this.pulses.filter((pulse) => pulse.life > 0);
    }

    getState() {
      return {
        pointer: this.pointer,
        scrollVelocity: this.scrollVelocity,
        paletteOpen: this.paletteOpen,
        pulses: this.pulses
      };
    }

    destroy() {
      this.cleanupFns.forEach((fn) => fn());
      this.cleanupFns.length = 0;
      this.pulses.length = 0;
    }
  }

  window.CursorAmbientInteractionField = AmbientInteractionField;
})();
