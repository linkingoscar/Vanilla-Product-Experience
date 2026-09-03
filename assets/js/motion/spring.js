/**
 * Cursor Site Motion Physics v0.1
 * --------------------------------
 * Framework-free interruptible spring values + sampled spring keyframes.
 * Inspired by the physics vocabulary used by mature motion systems, but kept
 * intentionally tiny for a zero-build static template.
 */
(function registerCursorMotionPhysics() {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (from, to, progress) => from + (to - from) * progress;

  class SpringValue {
    constructor(initial, options) {
      const opts = options || {};
      this.value = Number(initial) || 0;
      this.target = this.value;
      this.velocity = Number(opts.velocity) || 0;
      this.stiffness = Number(opts.stiffness) || 300;
      this.damping = Number(opts.damping) || 30;
      this.mass = Number(opts.mass) || 1;
      this.precision = Number(opts.precision) || 0.001;
      this.velocityPrecision = Number(opts.velocityPrecision) || 0.005;
      this.onUpdate = typeof opts.onUpdate === "function" ? opts.onUpdate : null;
      this.onComplete = typeof opts.onComplete === "function" ? opts.onComplete : null;
      this.running = false;
      this.raf = 0;
      this.last = 0;
    }

    set(target, velocity) {
      const next = Number(target);
      if (!Number.isFinite(next)) return this;
      this.target = next;
      if (Number.isFinite(velocity)) this.velocity = Number(velocity);
      if (!this.running) this.start();
      return this;
    }

    jump(value) {
      const next = Number(value);
      if (!Number.isFinite(next)) return this;
      this.stop();
      this.value = next;
      this.target = next;
      this.velocity = 0;
      this.onUpdate?.(this.value, this.velocity);
      return this;
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame((now) => this.frame(now));
    }

    frame(now) {
      if (!this.running) return;
      const dt = Math.min(0.032, Math.max(0.001, (now - this.last) / 1000));
      this.last = now;

      const displacement = this.value - this.target;
      const springForce = -this.stiffness * displacement;
      const dampingForce = -this.damping * this.velocity;
      const acceleration = (springForce + dampingForce) / this.mass;

      this.velocity += acceleration * dt;
      this.value += this.velocity * dt;
      this.onUpdate?.(this.value, this.velocity);

      const settled = Math.abs(this.value - this.target) <= this.precision
        && Math.abs(this.velocity) <= this.velocityPrecision;

      if (settled) {
        this.value = this.target;
        this.velocity = 0;
        this.running = false;
        this.onUpdate?.(this.value, 0);
        this.onComplete?.(this.value);
        return;
      }

      this.raf = requestAnimationFrame((time) => this.frame(time));
    }

    stop() {
      this.running = false;
      cancelAnimationFrame(this.raf);
      return this;
    }
  }

  function sampleSpring(options) {
    const opts = options || {};
    const stiffness = Number(opts.stiffness) || 340;
    const damping = Number(opts.damping) || 34;
    const mass = Number(opts.mass) || 1;
    const from = Number.isFinite(opts.from) ? Number(opts.from) : 0;
    const to = Number.isFinite(opts.to) ? Number(opts.to) : 1;
    const initialVelocity = Number(opts.velocity) || 0;
    const precision = Number(opts.precision) || 0.0008;
    const maxDuration = clamp(Number(opts.maxDuration) || 1.2, 0.25, 3);
    const step = 1 / 60;

    let value = from;
    let velocity = initialVelocity;
    let time = 0;
    const samples = [{ value, time: 0 }];

    while (time < maxDuration) {
      const displacement = value - to;
      const acceleration = (-stiffness * displacement - damping * velocity) / mass;
      velocity += acceleration * step;
      value += velocity * step;
      time += step;
      samples.push({ value, time });

      if (Math.abs(value - to) < precision && Math.abs(velocity) < precision * 8 && time > 0.12) {
        value = to;
        samples.push({ value: to, time });
        break;
      }
    }

    const duration = Math.max(0.001, samples[samples.length - 1].time);
    return {
      duration: duration * 1000,
      samples: samples.map((sample) => ({
        offset: clamp(sample.time / duration, 0, 1),
        value: sample.value
      }))
    };
  }

  function springFrames(mapper, options) {
    const sampled = sampleSpring(options);
    return {
      duration: sampled.duration,
      keyframes: sampled.samples.map((sample) => ({
        ...mapper(sample.value),
        offset: sample.offset
      }))
    };
  }

  window.CursorMotionPhysics = Object.freeze({
    version: "0.1.0",
    SpringValue,
    clamp,
    lerp,
    sampleSpring,
    springFrames
  });
})();
