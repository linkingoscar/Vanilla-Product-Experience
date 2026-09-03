/**
 * Liquid Glass Product Components v0.3
 * ------------------------------------
 * Visible, reusable UI built on top of CursorLiquidGlass / CursorLiquidGlassV2.
 * No framework or build step required.
 */
(function initLiquidGlassComponents() {
  "use strict";

  const root = document.documentElement;
  const isEn = root.lang.startsWith("en");
  const LG = () => window.CursorLiquidGlass;
  const LG2 = () => window.CursorLiquidGlassV2;

  function setPressedGroup(container, active) {
    container.querySelectorAll("button").forEach((button) => {
      const selected = button === active;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function decorateComposite(container, options) {
    if (!container) return;
    const config = options || {};
    container.dataset.liquidGlass = config.variant || "clear";
    if (config.copyBackdrop !== false) container.dataset.lgCopyBackdrop = "true";

    LG()?.decorate(container, {
      variant: config.variant || "clear",
      strength: config.strength || 8,
      interactive: config.interactive !== false
    });

    if (root.dataset.lgRenderer === "content-copy-svg" || root.dataset.lgRenderer === "svg-local") {
      LG2()?.installContentCopy(container, config.source ? { source: config.source } : undefined);
    }
  }

  function installHeroController() {
    const heroVisual = document.querySelector(".hero-visual");
    const ideWindow = heroVisual?.querySelector(".ide-window");
    if (!heroVisual || !ideWindow || heroVisual.querySelector(".lg-hero-controller")) return;

    const title = ideWindow.querySelector(".ide-title");
    const swarmPill = ideWindow.querySelector(".ide-swarm-pill");

    const modes = isEn ? [
      { key: "local", label: "Local", title: "workspace/local — Cursor Agent", status: "3 Agents · Local" },
      { key: "cloud", label: "Cloud", title: "origin/main — Cursor Origin Cloud", status: "3 Agents · Cloud" },
      { key: "private", label: "Private Pool", title: "team-pool/secure — Self-hosted Machines", status: "3 Agents · Private" }
    ] : [
      { key: "local", label: "本地", title: "workspace/local — Cursor Agent", status: "3 Agents · 本地" },
      { key: "cloud", label: "云端", title: "origin/main — Cursor Origin Cloud", status: "3 Agents · 云端" },
      { key: "private", label: "私有池", title: "team-pool/secure — Self-hosted Machines", status: "3 Agents · 私有" }
    ];

    const controller = document.createElement("div");
    controller.className = "lg-hero-controller";
    controller.setAttribute("aria-label", isEn ? "Workspace execution mode" : "工作区执行模式");
    controller.innerHTML = `
      <span class="lg-hero-controller-label">${isEn ? "WORKSPACE" : "工作区"}</span>
      <div class="lg-hero-segmented" data-lg-segmented role="group" aria-label="${isEn ? "Execution mode" : "执行模式"}">
        ${modes.map((mode, index) => `
          <button type="button" class="${index === 1 ? "is-active" : ""}" data-lg-mode="${mode.key}" aria-pressed="${index === 1}">
            ${mode.label}
          </button>`).join("")}
      </div>
      <span class="lg-hero-live"><span class="lg-hero-live-dot" aria-hidden="true"></span><span class="lg-hero-live-text">${modes[1].status}</span></span>
    `;

    heroVisual.appendChild(controller);
    decorateComposite(controller, { variant: "clear", strength: 9 });

    const segmented = controller.querySelector(".lg-hero-segmented");
    LG()?.installSharedLens(segmented, "button");

    segmented.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const mode = modes.find((item) => item.key === button.dataset.lgMode);
        if (!mode) return;
        setPressedGroup(segmented, button);
        if (title) title.textContent = mode.title;
        if (swarmPill) {
          const dot = swarmPill.querySelector(".agent-status-dot");
          swarmPill.textContent = "";
          if (dot) swarmPill.appendChild(dot);
          else {
            const freshDot = document.createElement("span");
            freshDot.className = "agent-status-dot";
            swarmPill.appendChild(freshDot);
          }
          swarmPill.append(` ${mode.status}`);
        }
        controller.querySelector(".lg-hero-live-text").textContent = mode.status;
        controller.classList.remove("lg-mode-change");
        void controller.offsetWidth;
        controller.classList.add("lg-mode-change");
        LG2()?.syncContentCopies();
      });
    });
  }

  function installSimulatorLens() {
    const chips = document.querySelector(".prompt-chips");
    if (!chips || chips.classList.contains("lg-simulator-segmented")) return;

    chips.classList.add("lg-simulator-segmented");
    chips.dataset.lgSegmented = "";
    decorateComposite(chips, { variant: "clear", strength: 7 });

    const buttons = Array.from(chips.querySelectorAll(".chip-btn"));
    const initial = chips.querySelector(".chip-btn.active") || buttons[0];
    if (initial) {
      buttons.forEach((button) => {
        const selected = button === initial;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }

    LG()?.installSharedLens(chips, ".chip-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        requestAnimationFrame(() => {
          const active = chips.querySelector(".chip-btn.active") || button;
          buttons.forEach((item) => {
            const selected = item === active;
            item.classList.toggle("is-active", selected);
            item.setAttribute("aria-pressed", String(selected));
          });
          LG2()?.syncContentCopies();
        });
      });
    });

    const status = document.getElementById("simStatusPill");
    if (status && !status.classList.contains("lg-surface")) {
      status.dataset.liquidGlass = "clear";
      status.dataset.lgCopyBackdrop = "true";
      LG()?.decorate(status, { variant: "clear", strength: 6, interactive: false });
      if (root.dataset.lgRenderer === "content-copy-svg" || root.dataset.lgRenderer === "svg-local") {
        LG2()?.installContentCopy(status);
      }
    }
  }

  function annualizedHtml(price) {
    const html = price.dataset.lgMonthlyHtml || price.innerHTML;
    const text = price.textContent || "";
    const match = text.match(/\$(\d+(?:\.\d+)?)/);
    if (!match) return html;

    const monthly = Number(match[1]);
    if (!Number.isFinite(monthly)) return html;
    const annual = monthly * 12;
    const amount = Number.isInteger(annual) ? annual.toLocaleString("en-US") : annual.toFixed(2);

    const perUser = /用户|user/i.test(text);
    const suffix = isEn
      ? (perUser ? " / user / annualized" : " / annualized")
      : (perUser ? " / 用户 / 年化" : " / 年化");

    return `$${amount}<span>${suffix}</span>`;
  }

  function animatePrice(price, html) {
    if (!price || price.innerHTML === html) return;
    price.classList.remove("lg-price-changing");
    price.innerHTML = html;
    void price.offsetWidth;
    price.classList.add("lg-price-changing");
  }

  function installPricingSelector() {
    const pricing = document.getElementById("pricing");
    const grid = pricing?.querySelector(".pricing-grid");
    if (!pricing || !grid || pricing.querySelector(".lg-pricing-controls")) return;

    const prices = Array.from(grid.querySelectorAll(".pricing-price"));
    prices.forEach((price) => {
      price.dataset.lgMonthlyHtml = price.innerHTML;
      price.dataset.lgAnnualizedHtml = annualizedHtml(price);
    });

    const controls = document.createElement("div");
    controls.className = "lg-pricing-controls";
    controls.innerHTML = `
      <div class="lg-pricing-segmented" data-lg-segmented role="group" aria-label="${isEn ? "Pricing display" : "价格展示方式"}">
        <button type="button" class="is-active" data-lg-pricing-mode="monthly" aria-pressed="true">${isEn ? "Monthly" : "月价"}</button>
        <button type="button" data-lg-pricing-mode="annualized" aria-pressed="false">${isEn ? "Annualized ×12" : "年化 ×12"}</button>
      </div>
      <span class="lg-pricing-note">${isEn
        ? "Annualized view is monthly price × 12 for comparison; it does not imply an official annual discount."
        : "年化仅按当前月价 × 12 换算用于比较，不代表官方年付优惠。"}</span>
    `;
    grid.before(controls);

    const segmented = controls.querySelector(".lg-pricing-segmented");
    decorateComposite(segmented, { variant: "clear", strength: 7 });
    LG()?.installSharedLens(segmented, "button");

    segmented.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const annualized = button.dataset.lgPricingMode === "annualized";
        setPressedGroup(segmented, button);
        prices.forEach((price) => {
          animatePrice(price, annualized ? price.dataset.lgAnnualizedHtml : price.dataset.lgMonthlyHtml);
        });
        pricing.dataset.lgPricingMode = annualized ? "annualized" : "monthly";
        LG2()?.syncContentCopies();
      });
    });
  }

  function installDevicePolicy() {
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const apply = () => {
      const touch = coarse.matches;
      root.dataset.lgDevice = touch ? "touch" : "pointer";

      const narrow = window.matchMedia("(max-width: 760px)").matches;
      if ((touch || narrow) && root.dataset.lgQuality === "high") {
        root.dataset.lgQuality = "balanced";
      }
    };
    apply();
    coarse.addEventListener?.("change", apply);
    window.addEventListener("resize", apply, { passive: true });
  }

  function boot() {
    installDevicePolicy();
    installHeroController();
    installSimulatorLens();
    installPricingSelector();

    root.classList.add("lg-components-ready");
    window.dispatchEvent(new CustomEvent("cursor:liquid-glass-components-ready", {
      detail: {
        version: "0.3.0",
        renderer: root.dataset.lgRenderer || "unknown",
        quality: root.dataset.lgQuality || "unknown"
      }
    }));
  }

  if (window.CursorLiquidGlass && window.CursorLiquidGlassV2) {
    requestAnimationFrame(boot);
  } else {
    window.addEventListener("cursor:liquid-glass-v2-ready", () => requestAnimationFrame(boot), { once: true });
  }

  window.CursorGlassUI = Object.freeze({
    version: "0.3.0",
    refresh() {
      LG2()?.syncContentCopies();
    }
  });
})();
