/**
 * Cursor Site Motion System v0.1
 * --------------------------------
 * Page-level interaction choreography for the static landing-page template.
 * Uses native scrolling, WAAPI, IntersectionObserver, FLIP and small physics
 * primitives. It deliberately does not scroll-jack or add a runtime framework.
 */
(function initCursorSiteMotion() {
  "use strict";

  const root = document.documentElement;
  const Physics = window.CursorMotionPhysics;
  const Layout = window.CursorLayoutMotion;
  const NumberMotion = window.CursorNumberMotion;
  if (!Physics || !Layout || !NumberMotion) {
    root.classList.remove("site-motion-pending");
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const cleanupFns = [];
  const revealAnimations = new WeakMap();
  let currentSection = "hero";

  const SECTION_PRESENCE = {
    hero: 1,
    highlights: 0.82,
    "composer-25": 0.72,
    "new-features": 0.62,
    media: 0.50,
    timeline: 0.46,
    pricing: 0.34,
    compare: 0.28,
    start: 0.48
  };

  function pulse(target, energy, radius) {
    if (reduceMotion.matches || !window.CursorAmbientField?.pulse) return;
    if (target instanceof Element) {
      window.CursorAmbientField.pulse(target, energy || 0.09, radius || 160);
    } else if (Array.isArray(target)) {
      window.CursorAmbientField.pulse(target[0], target[1], energy || 0.09, radius || 220);
    }
  }

  function finishAnimation(animation) {
    if (!animation) return animation;
    animation.finished.then(() => animation.cancel()).catch(() => {});
    return animation;
  }

  function reveal(el, options) {
    if (!(el instanceof Element)) return null;
    const opts = options || {};
    revealAnimations.get(el)?.cancel?.();

    if (reduceMotion.matches) {
      el.style.removeProperty("opacity");
      el.style.removeProperty("transform");
      el.style.removeProperty("filter");
      return null;
    }

    const x = Number(opts.x) || 0;
    const y = Number.isFinite(opts.y) ? Number(opts.y) : 18;
    const scale = Number.isFinite(opts.scale) ? Number(opts.scale) : 0.988;
    const blur = Number.isFinite(opts.blur) ? Number(opts.blur) : 2.2;
    const spring = Physics.springFrames((progress) => {
      const visible = Physics.clamp(progress, 0, 1);
      const inverse = 1 - progress;
      return {
        opacity: visible,
        transform: `translate3d(${(x * inverse).toFixed(3)}px, ${(y * inverse).toFixed(3)}px, 0) scale(${(1 + (scale - 1) * inverse).toFixed(5)})`,
        filter: `blur(${Math.max(0, blur * (1 - visible)).toFixed(3)}px)`
      };
    }, {
      stiffness: opts.stiffness || 300,
      damping: opts.damping || 32,
      mass: opts.mass || 1,
      maxDuration: opts.maxDuration || 0.88
    });

    const animation = el.animate(spring.keyframes, {
      duration: spring.duration,
      delay: Number(opts.delay) || 0,
      easing: "linear",
      fill: "both"
    });
    revealAnimations.set(el, animation);
    animation.finished.finally(() => {
      if (revealAnimations.get(el) === animation) revealAnimations.delete(el);
      animation.cancel();
    });
    return animation;
  }

  function normalizeBaseReveal() {
    document.querySelectorAll(
      ".animate-on-scroll, .bento-card, .feature-card, .pricing-card, .timeline-item"
    ).forEach((el) => el.classList.add("is-visible"));
  }

  function installPageEntrance() {
    const hero = document.querySelector(".hero");
    if (!hero) {
      root.classList.remove("site-motion-pending");
      return;
    }

    const copy = hero.querySelector(".hero-copy");
    const visual = hero.querySelector(".hero-visual");
    copy?.classList.add("is-visible");
    visual?.classList.add("is-visible");

    if (reduceMotion.matches) {
      root.classList.remove("site-motion-pending");
      return;
    }

    const sequence = [
      [copy?.querySelector(".eyebrow"), { y: 10, scale: 0.995, blur: 1.4, delay: 10, stiffness: 320, damping: 34 }],
      [copy?.querySelector("h1"), { y: 25, scale: 0.982, blur: 3.2, delay: 72, stiffness: 285, damping: 30 }],
      [copy?.querySelector(".lead"), { y: 18, scale: 0.992, blur: 2.2, delay: 150, stiffness: 300, damping: 32 }],
      [copy?.querySelector(".hero-actions"), { y: 15, scale: 0.985, blur: 1.4, delay: 218, stiffness: 340, damping: 34 }],
      [copy?.querySelector(".font-note"), { y: 8, scale: 0.998, blur: 0.8, delay: 286, stiffness: 340, damping: 38 }],
      [visual, { y: 30, scale: 0.974, blur: 3.0, delay: 125, stiffness: 260, damping: 29, maxDuration: 1.0 }],
      [visual?.querySelector(".lg-hero-controller"), { y: 12, scale: 0.96, blur: 1.6, delay: 390, stiffness: 360, damping: 34 }]
    ];

    sequence.forEach(([el, opts]) => el && reveal(el, opts));
    root.classList.remove("site-motion-pending");
    window.setTimeout(() => pulse([window.innerWidth * 0.68, window.innerHeight * 0.44], 0.10, 280), 390);
  }

  function installIslandMotion() {
    const island = document.querySelector(".island");
    if (!island) return;
    island.classList.add("site-motion-island");

    const topSpring = new Physics.SpringValue(window.scrollY > 42 ? 10 : 14, {
      stiffness: 360,
      damping: 38,
      precision: 0.02,
      velocityPrecision: 0.02,
      onUpdate: (value) => root.style.setProperty("--sm-island-top", `${value.toFixed(2)}px`)
    });
    const scaleX = new Physics.SpringValue(1, {
      stiffness: 420,
      damping: 37,
      precision: 0.0002,
      velocityPrecision: 0.0004,
      onUpdate: (value) => root.style.setProperty("--sm-island-scale-x", value.toFixed(5))
    });
    const scaleY = new Physics.SpringValue(1, {
      stiffness: 420,
      damping: 37,
      precision: 0.0002,
      velocityPrecision: 0.0004,
      onUpdate: (value) => root.style.setProperty("--sm-island-scale-y", value.toFixed(5))
    });

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let settleTimer = 0;

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(8, now - lastTime) / 1000;
      const velocity = (y - lastY) / dt;
      const magnitude = Math.abs(velocity);

      root.dataset.siteMotionScrolled = y > 42 ? "true" : "false";
      root.dataset.siteScrollDirection = velocity > 18 ? "down" : velocity < -18 ? "up" : "idle";

      if (reduceMotion.matches) {
        root.style.setProperty("--sm-island-top", `${y > 42 ? 10 : 14}px`);
        root.style.setProperty("--sm-island-scale-x", "1");
        root.style.setProperty("--sm-island-scale-y", "1");
      } else {
        const squash = Physics.clamp(1 - magnitude * 0.000026, 0.966, 1);
        const stretch = Physics.clamp(1 + magnitude * 0.0000045, 1, 1.006);
        topSpring.set(y > 42 ? 10 : 14, velocity * -0.001);
        scaleX.set(stretch);
        scaleY.set(squash);
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          scaleX.set(1);
          scaleY.set(1);
          root.dataset.siteScrollDirection = "idle";
        }, 76);
      }

      lastY = y;
      lastTime = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanupFns.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer);
      topSpring.stop();
      scaleX.stop();
      scaleY.stop();
    });
  }

  function installSectionState() {
    const sections = [
      { key: "hero", el: document.querySelector(".hero") },
      ...["highlights", "composer-25", "new-features", "media", "timeline", "pricing", "compare", "start"]
        .map((key) => ({ key, el: document.getElementById(key) }))
    ].filter((entry) => entry.el);

    let raf = 0;
    let initialized = false;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.46;
      let next = sections[0];
      let best = Infinity;

      sections.forEach((entry) => {
        const rect = entry.el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom >= line) {
          next = entry;
          best = -1;
          return;
        }
        if (best < 0) return;
        const distance = Math.min(Math.abs(rect.top - line), Math.abs(rect.bottom - line));
        if (distance < best) {
          best = distance;
          next = entry;
        }
      });

      if (!next || next.key === currentSection && initialized) return;
      const previous = currentSection;
      currentSection = next.key;
      root.dataset.siteMotionSection = currentSection;
      root.style.setProperty("--sm-ambient-presence", String(SECTION_PRESENCE[currentSection] ?? 0.5));

      if (initialized && previous !== currentSection) {
        pulse([window.innerWidth * 0.52, window.innerHeight * 0.58], 0.045, 310);
      }
      initialized = true;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    cleanupFns.push(() => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    });
  }

  function installSectionReveals() {
    const headers = Array.from(document.querySelectorAll("section.section, section[id]"));
    const seenHeaders = new WeakSet();

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      headers.forEach((section) => {
        section.querySelectorAll(":scope > .container > .section-label, :scope > .container > .section-title, :scope > .container > .section-desc")
          .forEach((el) => el.style.opacity = "1");
      });
      return;
    }

    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seenHeaders.has(entry.target)) return;
        seenHeaders.add(entry.target);
        const children = [
          entry.target.querySelector(":scope > .container > .section-label"),
          entry.target.querySelector(":scope > .container > .section-title"),
          entry.target.querySelector(":scope > .container > .section-desc")
        ].filter(Boolean);
        children.forEach((el, index) => reveal(el, {
          y: index === 1 ? 19 : 11,
          scale: index === 1 ? 0.992 : 0.997,
          blur: index === 1 ? 2.1 : 1.1,
          delay: index * 52,
          stiffness: index === 1 ? 285 : 330,
          damping: index === 1 ? 31 : 35
        }));
        headerObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -12% 0px" });

    headers.forEach((section) => headerObserver.observe(section));
    cleanupFns.push(() => headerObserver.disconnect());

    const itemSpecs = [
      [".bento-card", { y: 24, scale: 0.982, blur: 2.2, stagger: 44 }],
      ["#composer-simulator, #roi-calculator", { y: 22, scale: 0.987, blur: 2.0, stagger: 64 }],
      [".feature-card", { y: 18, scale: 0.986, blur: 1.8, stagger: 22 }],
      [".timeline-item", { x: 12, y: 8, scale: 0.994, blur: 1.2, stagger: 0 }],
      [".pricing-card", { y: 22, scale: 0.986, blur: 1.8, stagger: 48 }],
      [".compare-wrap", { y: 14, scale: 0.993, blur: 1.0, stagger: 0 }]
    ];

    itemSpecs.forEach(([selector, spec]) => {
      const items = Array.from(document.querySelectorAll(selector));
      if (!items.length) return;
      const parentIndexes = new Map();
      items.forEach((el) => {
        const parent = el.parentElement;
        const idx = parentIndexes.get(parent) || 0;
        el.dataset.siteMotionIndex = String(idx);
        parentIndexes.set(parent, idx + 1);
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.siteMotionRevealed === "true") return;
          entry.target.dataset.siteMotionRevealed = "true";
          const index = Number(entry.target.dataset.siteMotionIndex) || 0;
          reveal(entry.target, {
            ...spec,
            delay: Math.min(index * (spec.stagger || 0), selector === ".feature-card" ? 90 : 180)
          });
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
      items.forEach((el) => observer.observe(el));
      cleanupFns.push(() => observer.disconnect());
    });
  }

  function installPointerCards() {
    if (!finePointer.matches || reduceMotion.matches) return;
    const cards = document.querySelectorAll(".bento-card, .pricing-card");

    cards.forEach((card) => {
      card.classList.add("site-motion-pointer-card");
      const x = new Physics.SpringValue(0, { stiffness: 420, damping: 38, onUpdate: (v) => card.style.setProperty("--sm-card-x", `${v.toFixed(3)}px`) });
      const y = new Physics.SpringValue(0, { stiffness: 420, damping: 38, onUpdate: (v) => card.style.setProperty("--sm-card-y", `${v.toFixed(3)}px`) });
      const rx = new Physics.SpringValue(0, { stiffness: 380, damping: 36, onUpdate: (v) => card.style.setProperty("--sm-card-rx", `${v.toFixed(4)}deg`) });
      const ry = new Physics.SpringValue(0, { stiffness: 380, damping: 36, onUpdate: (v) => card.style.setProperty("--sm-card-ry", `${v.toFixed(4)}deg`) });

      const onEnter = () => {
        card.classList.add("site-motion-card-hover");
        y.set(-3);
      };
      const onMove = (event) => {
        const rect = card.getBoundingClientRect();
        const nx = Physics.clamp(((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2, -1, 1);
        const ny = Physics.clamp(((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2, -1, 1);
        x.set(nx * 1.35);
        y.set(-3 + ny * 0.35);
        rx.set(-ny * 0.62);
        ry.set(nx * 0.78);
      };
      const onLeave = () => {
        card.classList.remove("site-motion-card-hover");
        x.set(0); y.set(0); rx.set(0); ry.set(0);
      };

      card.addEventListener("pointerenter", onEnter, { passive: true });
      card.addEventListener("pointermove", onMove, { passive: true });
      card.addEventListener("pointerleave", onLeave, { passive: true });
      cleanupFns.push(() => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
        x.stop(); y.stop(); rx.stop(); ry.stop();
      });
    });
  }

  function installFeatureLayoutMotion() {
    const tabs = document.querySelector(".feature-tabs");
    const grid = document.querySelector(".feature-grid");
    if (!tabs || !grid) return;
    grid.classList.add("site-motion-layout");

    const onCapture = (event) => {
      const button = event.target.closest(".tab-btn[data-filter]");
      if (!button || !tabs.contains(button)) return;
      if (reduceMotion.matches) return;

      const category = button.dataset.filter || "all";
      const cards = Array.from(grid.querySelectorAll(".feature-card"));
      const visible = cards.filter((card) => !card.classList.contains("is-hidden"));
      const first = Layout.capture(visible);
      const oldHeight = grid.getBoundingClientRect().height;

      const leaving = visible.filter((card) => category !== "all" && card.dataset.category !== category);
      const ghosts = leaving.map((card) => Layout.createGhost(card, first.get(card))).filter(Boolean);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const nextVisible = cards.filter((card) => !card.classList.contains("is-hidden"));
          nextVisible.forEach((card) => card.classList.add("is-visible"));
          const newHeight = grid.getBoundingClientRect().height;
          const result = Layout.animateFlip(first, nextVisible, {
            stiffness: 365,
            damping: 36,
            enterY: 14,
            enterScale: 0.982,
            enterStagger: 16,
            maxEnterDelay: 82
          });
          result.moved?.forEach((card) => card.classList.add("site-motion-layout-moving"));
          result.animations?.forEach((animation) => animation.finished.finally(() => {
            nextVisible.forEach((card) => card.classList.remove("site-motion-layout-moving"));
          }));
          Layout.animateContainerHeight(grid, oldHeight, newHeight, { duration: 460 });
          ghosts.forEach((ghost, index) => Layout.animateGhostOut(ghost, { duration: 205 + index * 4 }));
          window.setTimeout(() => window.CursorLiquidGlassV2?.syncContentCopies?.(), 500);
          pulse(button, 0.065, 150);
        });
      });
    };

    tabs.addEventListener("click", onCapture, true);
    cleanupFns.push(() => tabs.removeEventListener("click", onCapture, true));
  }

  function installSimulatorMotion() {
    const stepsWrap = document.querySelector(".sim-steps");
    if (!stepsWrap || stepsWrap.classList.contains("site-motion-sim-steps")) return;
    stepsWrap.classList.add("site-motion-sim-steps");

    const track = document.createElement("span");
    const progress = document.createElement("span");
    track.className = "site-motion-sim-track";
    progress.className = "site-motion-sim-progress";
    track.setAttribute("aria-hidden", "true");
    progress.setAttribute("aria-hidden", "true");
    stepsWrap.prepend(progress);
    stepsWrap.prepend(track);

    const steps = Array.from(stepsWrap.querySelectorAll(".sim-step"));
    const progressSpring = new Physics.SpringValue(0, {
      stiffness: 310,
      damping: 32,
      precision: 0.001,
      onUpdate: (value) => stepsWrap.style.setProperty("--sm-sim-progress", String(Physics.clamp(value, 0, 1)))
    });
    let lastActive = null;

    const sync = () => {
      const doneCount = steps.filter((step) => step.classList.contains("done")).length;
      const active = steps.find((step) => step.classList.contains("active")) || null;
      const activeIndex = active ? steps.indexOf(active) : -1;
      const units = Math.max(1, steps.length - 1);
      const target = activeIndex >= 0
        ? Physics.clamp(activeIndex / units, 0, 1)
        : Physics.clamp(doneCount >= steps.length ? 1 : Math.max(0, (doneCount - 1) / units), 0, 1);
      reduceMotion.matches ? progressSpring.jump(target) : progressSpring.set(target);

      if (active && active !== lastActive) {
        reveal(active, { x: -7, y: 0, scale: 0.99, blur: 0.7, stiffness: 390, damping: 34 });
        pulse(active, 0.07, 120);
      }
      lastActive = active;
    };

    const observer = new MutationObserver(sync);
    steps.forEach((step) => observer.observe(step, { attributes: true, attributeFilter: ["class"] }));
    sync();

    const codeText = document.getElementById("simCodeText");
    const codeWrap = codeText?.closest(".sim-code-preview") || codeText?.parentElement;
    let codeObserver = null;
    if (codeText && codeWrap) {
      codeObserver = new MutationObserver(() => {
        if (reduceMotion.matches) return;
        codeWrap.classList.add("site-motion-code-active");
        finishAnimation(codeWrap.animate([
          { opacity: 0.56, transform: "translate3d(0,4px,0)", filter: "blur(1.2px)" },
          { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0px)" }
        ], { duration: 245, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));
      });
      codeObserver.observe(codeText, { childList: true, characterData: true, subtree: true });
    }

    const status = document.getElementById("simStatusPill");
    let statusObserver = null;
    if (status) {
      statusObserver = new MutationObserver(() => {
        if (reduceMotion.matches) return;
        reveal(status, { y: 0, scale: 0.955, blur: 0.3, stiffness: 430, damping: 32 });
      });
      statusObserver.observe(status, { attributes: true, childList: true, characterData: true, subtree: true });
    }

    cleanupFns.push(() => {
      observer.disconnect();
      codeObserver?.disconnect();
      statusObserver?.disconnect();
      progressSpring.stop();
      track.remove();
      progress.remove();
    });
  }

  function installRoiMotion() {
    const savings = document.getElementById("annualSavingsText");
    const compare = document.getElementById("costCompareText");
    const inputs = [document.getElementById("devSlider"), document.getElementById("taskSlider")].filter(Boolean);
    if (!savings || !inputs.length) return;

    savings.classList.add("site-motion-number");
    compare?.classList.add("site-motion-number");
    const beforeValues = new WeakMap();
    let lastPulse = 0;

    inputs.forEach((input) => {
      const onCapture = () => {
        beforeValues.set(input, NumberMotion.parse(savings.textContent));
      };
      const onInput = () => {
        const target = NumberMotion.parse(savings.textContent);
        const from = beforeValues.get(input);
        if (!reduceMotion.matches && Number.isFinite(target)) {
          NumberMotion.animate(savings, target, {
            from: Number.isFinite(from) ? from : undefined,
            duration: 310,
            format: (value) => `$${Math.round(value).toLocaleString()}`
          });
          if (compare) {
            finishAnimation(compare.animate([
              { opacity: .62, transform: "translate3d(0,2px,0)" },
              { opacity: 1, transform: "translate3d(0,0,0)" }
            ], { duration: 190, easing: "ease-out" }));
          }
        }

        const shell = input.closest(".lg-range-shell");
        if (shell) {
          shell.classList.add("site-motion-range-active");
          window.clearTimeout(shell.__siteMotionRangeTimer);
          shell.__siteMotionRangeTimer = window.setTimeout(() => shell.classList.remove("site-motion-range-active"), 120);
          const now = performance.now();
          if (now - lastPulse > 110) {
            const thumb = shell.querySelector(".lg-range-thumb") || shell;
            pulse(thumb, 0.035, 90);
            lastPulse = now;
          }
        }
      };
      input.addEventListener("input", onCapture, true);
      input.addEventListener("input", onInput);
      cleanupFns.push(() => {
        input.removeEventListener("input", onCapture, true);
        input.removeEventListener("input", onInput);
      });
    });
  }

  function installTimelineMotion() {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;
    timeline.classList.add("site-motion-timeline");
    const line = document.createElement("span");
    line.className = "site-motion-timeline-progress";
    line.setAttribute("aria-hidden", "true");
    timeline.prepend(line);

    const items = Array.from(timeline.querySelectorAll(".timeline-item"));
    let lastCurrent = -1;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = timeline.getBoundingClientRect();
      const viewportLine = window.innerHeight * 0.56;
      const progress = Physics.clamp((viewportLine - rect.top - 8) / Math.max(1, rect.height - 16), 0, 1);
      timeline.style.setProperty("--sm-timeline-progress", progress.toFixed(4));

      let currentIndex = -1;
      let bestDistance = Infinity;
      items.forEach((item, index) => {
        const marker = item.querySelector(".timeline-marker") || item;
        const mRect = marker.getBoundingClientRect();
        const center = mRect.top + mRect.height * 0.5;
        const distance = Math.abs(center - viewportLine);
        if (distance < bestDistance) {
          bestDistance = distance;
          currentIndex = index;
        }
      });

      items.forEach((item, index) => {
        const state = index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming";
        item.dataset.motionState = state;
      });

      if (currentIndex !== lastCurrent && currentIndex >= 0 && lastCurrent >= 0) {
        pulse(items[currentIndex].querySelector(".timeline-marker") || items[currentIndex], 0.045, 110);
      }
      lastCurrent = currentIndex;
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    cleanupFns.push(() => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      line.remove();
    });
  }

  function installComparisonMotion() {
    document.querySelectorAll(".compare-wrap").forEach((wrap) => {
      if (wrap.parentElement?.classList.contains("site-motion-compare-shell")) return;
      const shell = document.createElement("div");
      shell.className = "site-motion-compare-shell";
      const parent = wrap.parentNode;
      parent.insertBefore(shell, wrap);
      shell.appendChild(wrap);

      const left = document.createElement("span");
      const right = document.createElement("span");
      left.className = "site-motion-scroll-cue is-left";
      right.className = "site-motion-scroll-cue is-right";
      left.setAttribute("aria-hidden", "true");
      right.setAttribute("aria-hidden", "true");
      shell.append(left, right);

      const sync = () => {
        shell.dataset.canScrollLeft = wrap.scrollLeft > 6 ? "true" : "false";
        shell.dataset.canScrollRight = wrap.scrollLeft + wrap.clientWidth < wrap.scrollWidth - 6 ? "true" : "false";
      };
      wrap.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync, { passive: true });
      sync();
      cleanupFns.push(() => {
        wrap.removeEventListener("scroll", sync);
        window.removeEventListener("resize", sync);
      });
    });
  }

  function installPrimaryActionEnergy() {
    const actions = document.querySelectorAll(".btn-primary, .pricing-card .btn-primary, #start .btn-primary");
    actions.forEach((action) => {
      action.classList.add("site-motion-primary-action");
      const onPointerDown = () => pulse(action, 0.055, 120);
      action.addEventListener("pointerdown", onPointerDown, { passive: true });
      cleanupFns.push(() => action.removeEventListener("pointerdown", onPointerDown));
    });
  }

  function refresh() {
    normalizeBaseReveal();
    window.CursorLiquidGlassV2?.syncContentCopies?.();
  }

  function boot() {
    normalizeBaseReveal();
    installPageEntrance();
    installIslandMotion();
    installSectionState();
    installSectionReveals();
    installPointerCards();
    installFeatureLayoutMotion();
    installSimulatorMotion();
    installRoiMotion();
    installTimelineMotion();
    installComparisonMotion();
    installPrimaryActionEnergy();

    root.classList.add("site-motion-ready");
    root.classList.remove("site-motion-pending");
    window.dispatchEvent(new CustomEvent("cursor:site-motion-ready", {
      detail: { version: "0.1.0", section: currentSection }
    }));
  }

  requestAnimationFrame(boot);

  window.CursorSiteMotion = Object.freeze({
    version: "0.1.0",
    get section() { return currentSection; },
    reveal,
    refresh,
    pulse,
    destroy() {
      cleanupFns.splice(0).forEach((fn) => fn());
      root.classList.remove("site-motion-ready", "site-motion-pending");
      delete root.dataset.siteMotionSection;
      delete root.dataset.siteMotionScrolled;
      delete root.dataset.siteScrollDirection;
    }
  });
})();
