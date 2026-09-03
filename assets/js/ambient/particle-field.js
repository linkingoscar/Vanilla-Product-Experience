/**
 * Ambient Particle Interaction Field v0.1
 * ---------------------------------------
 * One CPU particle simulation feeds:
 *   1) a WebGL2 point-sprite background renderer (Canvas2D fallback), and
 *   2) small Canvas2D glass mirrors for Safari/Firefox content-copy surfaces.
 *
 * The visual language is intentionally restrained: slow vector-field drift,
 * pointer pressure/wake, depth, elastic return, scroll energy and Liquid Glass
 * lens pulses. No framework or build step is required.
 */
(function initAmbientParticleField() {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, value) {
    if (edge0 === edge1) return value < edge0 ? 0 : 1;
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function seeded(seed) {
    let value = seed >>> 0;
    return function random() {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  class Canvas2DRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });
      if (!this.ctx) throw new Error("Canvas2D unavailable");
      this.width = 1;
      this.height = 1;
      this.dpr = 1;
    }

    resize(width, height, dpr) {
      this.width = Math.max(1, width);
      this.height = Math.max(1, height);
      this.dpr = Math.max(1, dpr || 1);
      const pixelWidth = Math.max(1, Math.round(this.width * this.dpr));
      const pixelHeight = Math.max(1, Math.round(this.height * this.dpr));
      if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;
      }
    }

    render(particles, count, options) {
      const ctx = this.ctx;
      const opts = options || {};
      const color = opts.cssColor || "174, 190, 255";
      const opacity = opts.opacity == null ? 1 : opts.opacity;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < count; i += 1) {
        const particle = particles[i];
        const radius = 0.55 + particle.depth * 1.18;
        const alpha = opacity * (0.10 + particle.depth * 0.34);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha.toFixed(4)})`;
        ctx.fill();
      }
    }

    destroy() {}
  }

  class AmbientParticleField {
    constructor() {
      this.canvas = document.createElement("canvas");
      this.canvas.className = "ambient-particle-layer";
      this.canvas.setAttribute("aria-hidden", "true");
      this.canvas.setAttribute("role", "presentation");
      const noise = document.querySelector(".noise");
      if (noise?.parentNode) noise.parentNode.insertBefore(this.canvas, noise);
      else document.body.prepend(this.canvas);

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.mode = "cloud";
      this.densityScale = 1;
      this.particles = [];
      this.count = 0;
      this.running = false;
      this.raf = 0;
      this.lastFrame = performance.now();
      this.time = 0;
      this.visible = document.visibilityState !== "hidden";
      this.mirrors = new Map();
      this.lastMirrorScan = 0;
      this.themeColor = [0.70, 0.77, 1.0];
      this.themeCssColor = "178, 196, 255";
      this.quality = this.resolveQuality();
      this.dpr = this.resolveDpr();
      this.interaction = new window.CursorAmbientInteractionField();
      this.renderer = this.createRenderer();
      this.cleanupFns = [];

      root.dataset.ambientQuality = this.quality;
      root.dataset.ambientMode = this.mode;

      this.installEvents();
      this.resize();
      this.reseed();
      this.syncTheme();
      this.renderOnce();
      this.start();
      root.classList.add("ambient-particles-ready");

      window.dispatchEvent(new CustomEvent("cursor:ambient-particles-ready", {
        detail: {
          renderer: this.renderer instanceof Canvas2DRenderer ? "canvas2d" : "webgl2",
          quality: this.quality,
          count: this.count
        }
      }));
    }

    resolveQuality() {
      const glassQuality = root.dataset.lgQuality;
      if (glassQuality === "low") return "low";
      if (glassQuality === "balanced") return "balanced";
      if (coarsePointer.matches || window.innerWidth <= 760) return "balanced";
      return "high";
    }

    resolveCount() {
      const base = this.quality === "high" ? 1100 : this.quality === "balanced" ? 560 : 220;
      const narrowCap = window.innerWidth <= 520 ? 280 : window.innerWidth <= 760 ? 380 : Infinity;
      const reducedCap = reduceMotion.matches ? 300 : Infinity;
      return Math.max(80, Math.round(Math.min(base * this.densityScale, narrowCap, reducedCap)));
    }

    resolveDpr() {
      const cap = this.quality === "high" ? 1.5 : this.quality === "balanced" ? 1.25 : 1;
      return Math.max(1, Math.min(window.devicePixelRatio || 1, cap));
    }

    createRenderer() {
      try {
        if (!window.CursorParticleWebGLRenderer) throw new Error("WebGL renderer module missing");
        root.dataset.ambientRenderer = "webgl2";
        return new window.CursorParticleWebGLRenderer(this.canvas);
      } catch (error) {
        root.dataset.ambientRenderer = "canvas2d";
        return new Canvas2DRenderer(this.canvas);
      }
    }

    reseed() {
      const count = this.resolveCount();
      const random = seeded(0xA57A2026 + count);
      const aspect = this.width / Math.max(1, this.height);
      const columns = Math.max(1, Math.round(Math.sqrt(count * aspect)));
      const rows = Math.max(1, Math.ceil(count / columns));
      const particles = [];

      for (let index = 0; index < count; index += 1) {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const ax = clamp((column + 0.18 + random() * 0.64) / columns, 0.01, 0.99);
        const ay = clamp((row + 0.18 + random() * 0.64) / rows, 0.01, 0.99);
        const depth = Math.pow(random(), 0.72);
        const seed = random() * Math.PI * 2;
        particles.push({
          ax,
          ay,
          x: ax * this.width,
          y: ay * this.height,
          vx: 0,
          vy: 0,
          depth,
          seed,
          cluster: index % 4
        });
      }

      this.particles = particles;
      this.count = particles.length;
      root.dataset.ambientParticles = String(this.count);
    }

    installEvents() {
      const onResize = () => {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
          const oldWidth = this.width;
          const oldHeight = this.height;
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          this.quality = this.resolveQuality();
          this.dpr = this.resolveDpr();
          root.dataset.ambientQuality = this.quality;

          this.particles.forEach((particle) => {
            particle.x = oldWidth > 0 ? particle.x * (this.width / oldWidth) : particle.ax * this.width;
            particle.y = oldHeight > 0 ? particle.y * (this.height / oldHeight) : particle.ay * this.height;
          });
          const desired = this.resolveCount();
          if (Math.abs(desired - this.count) > Math.max(40, this.count * 0.16)) this.reseed();
          this.resize();
          this.scanGlassMirrors(true);
          this.renderOnce();
        }, 120);
      };
      const onVisibility = () => {
        this.visible = document.visibilityState !== "hidden";
        if (this.visible) {
          this.lastFrame = performance.now();
          this.start();
        } else {
          this.stop();
        }
      };
      const onHeroMode = (event) => {
        const button = event.target.closest?.(".lg-hero-segmented button[data-lg-mode]");
        if (!button) return;
        this.setMode(button.dataset.lgMode || "cloud");
        const rect = button.getBoundingClientRect();
        this.pulse(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, 0.82, 260);
      };
      const onThemeMutation = () => this.syncTheme();

      window.addEventListener("resize", onResize, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      document.addEventListener("click", onHeroMode, true);

      const themeObserver = new MutationObserver(onThemeMutation);
      themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

      this.cleanupFns.push(
        () => window.removeEventListener("resize", onResize),
        () => document.removeEventListener("visibilitychange", onVisibility),
        () => document.removeEventListener("click", onHeroMode, true),
        () => themeObserver.disconnect()
      );
    }

    syncTheme() {
      if (root.getAttribute("data-theme") === "light") {
        this.themeColor = [0.22, 0.31, 0.50];
        this.themeCssColor = "54, 77, 126";
      } else {
        this.themeColor = [0.70, 0.77, 1.0];
        this.themeCssColor = "178, 196, 255";
      }
      this.renderOnce();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = this.resolveDpr();
      this.renderer.resize(this.width, this.height, this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
    }

    modeParameters() {
      if (this.mode === "local") return { flow: 0.64, spring: 1.28, cluster: 0.0, radius: 150 };
      if (this.mode === "private") return { flow: 0.84, spring: 0.92, cluster: 0.58, radius: 176 };
      return { flow: 1.12, spring: 0.62, cluster: 0.0, radius: 188 };
    }

    targetAnchor(particle, time, params) {
      let x = particle.ax * this.width;
      let y = particle.ay * this.height;

      if (this.mode === "cloud") {
        const amplitude = 8 + particle.depth * 12;
        x += Math.sin(time * 0.17 + particle.seed * 1.3) * amplitude;
        y += Math.cos(time * 0.14 + particle.seed * 0.9) * amplitude * 0.72;
      } else if (this.mode === "private") {
        const centers = [[0.27, 0.30], [0.70, 0.30], [0.32, 0.70], [0.72, 0.68]];
        const center = centers[particle.cluster] || centers[0];
        const clusterX = center[0] * this.width + Math.sin(particle.seed * 2.1) * 72;
        const clusterY = center[1] * this.height + Math.cos(particle.seed * 1.7) * 58;
        x += (clusterX - x) * params.cluster;
        y += (clusterY - y) * params.cluster;
      }

      return { x, y };
    }

    step(dt) {
      const state = this.interaction.getState();
      const pointer = state.pointer;
      const params = this.modeParameters();
      const focusScale = state.paletteOpen ? 0.32 : 1;
      const time = this.time;
      const maxVelocity = this.quality === "low" ? 105 : this.quality === "balanced" ? 145 : 185;

      root.dataset.ambientFocus = state.paletteOpen ? "palette" : "page";

      for (let i = 0; i < this.count; i += 1) {
        const particle = this.particles[i];
        const target = this.targetAnchor(particle, time, params);
        const nx = particle.x / Math.max(1, this.width);
        const ny = particle.y / Math.max(1, this.height);
        const field = Math.sin(ny * 5.3 + time * 0.21 + particle.seed * 0.31)
          + Math.cos(nx * 4.7 - time * 0.17 - particle.seed * 0.23);
        const angle = field * 1.65 + particle.seed * 0.55;
        let fx = Math.cos(angle) * 24 * params.flow * (0.3 + particle.depth * 0.7) * focusScale;
        let fy = Math.sin(angle) * 20 * params.flow * (0.3 + particle.depth * 0.7) * focusScale;

        fx += (target.x - particle.x) * params.spring;
        fy += (target.y - particle.y) * params.spring;
        fy -= state.scrollVelocity * 0.055 * particle.depth * focusScale;

        if (pointer.active && !state.paletteOpen) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          const radius = params.radius + Math.min(90, pointer.speed * 0.035);
          if (distance < radius) {
            const falloff = Math.pow(1 - distance / radius, 2);
            const pressure = 520 + Math.min(780, pointer.speed * 0.62);
            fx += (dx / distance) * pressure * falloff * particle.depth;
            fy += (dy / distance) * pressure * falloff * particle.depth;
            fx += pointer.vx * 0.78 * falloff * particle.depth;
            fy += pointer.vy * 0.78 * falloff * particle.depth;
          }
        }

        for (let j = 0; j < state.pulses.length; j += 1) {
          const pulse = state.pulses[j];
          const dx = particle.x - pulse.x;
          const dy = particle.y - pulse.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < pulse.radius) {
            const falloff = Math.pow(1 - distance / pulse.radius, 2) * pulse.life;
            const force = 1050 * pulse.energy * falloff * (0.36 + particle.depth * 0.64);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        }

        particle.vx += fx * dt;
        particle.vy += fy * dt;
        const damping = Math.exp(-(this.mode === "cloud" ? 1.5 : 1.9) * dt);
        particle.vx *= damping;
        particle.vy *= damping;

        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed > maxVelocity) {
          const ratio = maxVelocity / speed;
          particle.vx *= ratio;
          particle.vy *= ratio;
        }

        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        if (particle.x < -80 || particle.x > this.width + 80 || particle.y < -80 || particle.y > this.height + 80) {
          particle.x += (target.x - particle.x) * Math.min(1, dt * 4.5);
          particle.y += (target.y - particle.y) * Math.min(1, dt * 4.5);
        }
      }
    }

    currentOpacity() {
      const topStrength = 1 - smoothstep(this.height * 0.45, this.height * 1.45, window.scrollY);
      return 0.22 + topStrength * 0.78;
    }

    renderOnce() {
      if (!this.renderer || !this.particles.length) return;
      const state = this.interaction?.getState?.() || { paletteOpen: false };
      const opacity = this.currentOpacity() * (state.paletteOpen ? 0.52 : 1);
      this.renderer.render(this.particles, this.count, {
        opacity,
        color: this.themeColor,
        cssColor: this.themeCssColor
      });
      this.drawGlassMirrors(opacity);
    }

    frame = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.033, Math.max(0.001, (now - this.lastFrame) / 1000));
      this.lastFrame = now;
      this.time += dt;
      this.interaction.tick(dt);
      this.step(dt);
      this.scanGlassMirrors(false, now);
      this.renderOnce();
      this.raf = requestAnimationFrame(this.frame);
    };

    start() {
      if (!this.visible || this.running) return;
      if (reduceMotion.matches) {
        this.running = false;
        this.renderOnce();
        return;
      }
      this.running = true;
      this.lastFrame = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }

    stop() {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }

    setMode(mode) {
      if (!["local", "cloud", "private"].includes(mode)) return;
      this.mode = mode;
      root.dataset.ambientMode = mode;
      this.renderOnce();
    }

    setDensity(scale) {
      this.densityScale = clamp(Number(scale) || 1, 0.25, 1.5);
      this.reseed();
      this.renderOnce();
    }

    pulse(x, y, energy, radius) {
      if (x instanceof Element) {
        const rect = x.getBoundingClientRect();
        this.interaction.addPulse(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, y || 0.5, energy || 220);
      } else {
        this.interaction.addPulse(Number(x) || this.width * 0.5, Number(y) || this.height * 0.5, energy || 0.5, radius || 220);
      }
    }

    shouldMirrorIntoGlass() {
      return root.dataset.lgRenderer === "content-copy-svg" || root.dataset.lgRenderer === "svg-local";
    }

    scanGlassMirrors(force, now) {
      if (!this.shouldMirrorIntoGlass()) return;
      const timestamp = now || performance.now();
      if (!force && timestamp - this.lastMirrorScan < 900) return;
      this.lastMirrorScan = timestamp;

      const selector = [
        ".island.lg-surface",
        ".cmd-palette-modal.lg-surface",
        ".lg-hero-controller.lg-surface",
        ".lg-pricing-segmented.lg-surface",
        ".lg-range-thumb.lg-surface",
        ".lg-shared-lens.lg-surface"
      ].join(",");

      document.querySelectorAll(selector).forEach((surface) => {
        if (this.mirrors.has(surface)) return;
        const refract = surface.querySelector(":scope > .lg-refract");
        if (!refract) return;
        const canvas = document.createElement("canvas");
        canvas.className = "ambient-particle-glass-mirror";
        canvas.setAttribute("aria-hidden", "true");
        const contentCopy = refract.querySelector(":scope > .lg-content-copy");
        if (contentCopy) refract.insertBefore(canvas, contentCopy);
        else refract.prepend(canvas);
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          canvas.remove();
          return;
        }
        this.mirrors.set(surface, { canvas, ctx, lastFilter: "" });
      });

      this.mirrors.forEach((record, surface) => {
        if (!surface.isConnected) {
          record.canvas.remove();
          this.mirrors.delete(surface);
        }
      });
    }

    drawGlassMirrors(globalOpacity) {
      if (!this.shouldMirrorIntoGlass()) return;
      this.scanGlassMirrors(false);
      const mirrorDpr = this.quality === "high" ? Math.min(1.25, window.devicePixelRatio || 1) : 1;

      this.mirrors.forEach((record, surface) => {
        const rect = surface.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4 || rect.bottom < -20 || rect.top > this.height + 20) return;

        const pixelWidth = Math.max(1, Math.round(rect.width * mirrorDpr));
        const pixelHeight = Math.max(1, Math.round(rect.height * mirrorDpr));
        if (record.canvas.width !== pixelWidth || record.canvas.height !== pixelHeight) {
          record.canvas.width = pixelWidth;
          record.canvas.height = pixelHeight;
        }
        record.canvas.style.width = `${rect.width}px`;
        record.canvas.style.height = `${rect.height}px`;

        const fallback = surface.querySelector(":scope > .lg-refract > .lg-refract-fallback");
        const filter = fallback?.style.filter || "";
        if (filter && filter !== record.lastFilter) {
          record.canvas.style.filter = filter;
          record.lastFilter = filter;
        }

        const ctx = record.ctx;
        ctx.setTransform(mirrorDpr, 0, 0, mirrorDpr, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);

        for (let i = 0; i < this.count; i += 1) {
          const particle = this.particles[i];
          const localX = particle.x - rect.left;
          const localY = particle.y - rect.top;
          if (localX < -6 || localX > rect.width + 6 || localY < -6 || localY > rect.height + 6) continue;
          const radius = 0.55 + particle.depth * 1.18;
          const alpha = globalOpacity * (0.10 + particle.depth * 0.34);
          ctx.beginPath();
          ctx.arc(localX, localY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.themeCssColor}, ${alpha.toFixed(4)})`;
          ctx.fill();
        }
      });
    }

    destroy() {
      this.stop();
      this.cleanupFns.forEach((fn) => fn());
      this.cleanupFns.length = 0;
      this.interaction.destroy();
      this.renderer.destroy();
      this.mirrors.forEach((record) => record.canvas.remove());
      this.mirrors.clear();
      this.canvas.remove();
      root.classList.remove("ambient-particles-ready");
      delete root.dataset.ambientQuality;
      delete root.dataset.ambientMode;
      delete root.dataset.ambientFocus;
      delete root.dataset.ambientParticles;
    }
  }

  function boot() {
    if (window.CursorAmbientField) return;
    const field = new AmbientParticleField();
    window.CursorAmbientField = Object.freeze({
      version: "0.1.0",
      get quality() { return field.quality; },
      get mode() { return field.mode; },
      get count() { return field.count; },
      setMode: (mode) => field.setMode(mode),
      setDensity: (scale) => field.setDensity(scale),
      pulse: (...args) => field.pulse(...args),
      pause: () => field.stop(),
      resume: () => field.start(),
      destroy: () => field.destroy()
    });
  }

  if (window.CursorParticleWebGLRenderer && window.CursorAmbientInteractionField) {
    boot();
  } else {
    window.addEventListener("cursor:ambient-modules-ready", boot, { once: true });
  }
})();
