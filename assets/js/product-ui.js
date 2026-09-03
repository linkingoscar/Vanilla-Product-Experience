/**
 * Product UI & Art Direction System v0.1
 * ---------------------------------------
 * Progressive enhancement layer for product-grade information architecture,
 * proof, media framing, conversion, interaction states and data visualizations.
 */
(function initProductUiSystem() {
  "use strict";

  const root = document.documentElement;
  const isEn = root.lang.startsWith("en");
  const mobileQuery = window.matchMedia("(max-width: 880px)");
  const cleanup = [];

  const copy = isEn ? {
    mobileMenu: "Menu",
    search: "Search",
    theme: "Theme",
    language: "中文",
    proofKicker: "Open-source foundation",
    proofTitle: "Built to fork, not rebuild.",
    proof: [["0", "build steps"], ["2", "languages"], ["PWA", "offline-ready"], ["MIT", "commercial-friendly"]],
    editorialKicker: "Product surface",
    editorialTitle: "One workspace. Multiple execution environments.",
    editorialBody: "Use the visual slot for a real product screenshot, product film, or architecture diagram. The Cursor demo expresses the same system through local, cloud, and private execution surfaces.",
    nodes: [["Local", "developer workstation"], ["Cloud", "parallel agents"], ["Private", "self-hosted pool"]],
    core: "Workspace",
    visualCaption: "TEMPLATE VISUAL SLOT · replace with screenshot / film / architecture diagram",
    conversionKicker: "Start with the workflow that fits your team",
    conversionProof: ["Free Hobby entry", "Local + cloud workspaces", "Official docs"],
    conversionFootnote: "Demo conversion copy. Forks can map this slot to signup, trial, download, GitHub, or sales.",
    footerBrand: "Cursor 3.x Showcase",
    footerBody: "A high-fidelity demo running on a reusable zero-build landing-page system.",
    footerCols: [["Explore", ["Highlights", "Features", "Timeline"]], ["Product", ["Pricing", "Compare", "Search"]], ["Template", ["MIT", "PWA", "Bilingual"]]],
    roiTitle: "Annual cost shape",
    optimized: "Composer annual",
    baseline: "Comparison annual",
    savings: "estimated savings",
    mediaLive: "LIVE PRODUCT SURFACE"
  } : {
    mobileMenu: "导航",
    search: "搜索",
    theme: "主题",
    language: "EN",
    proofKicker: "开源模板底座",
    proofTitle: "Fork 即用，不用重建。",
    proof: [["0", "构建步骤"], ["2", "语言版本"], ["PWA", "离线可用"], ["MIT", "商业友好"]],
    editorialKicker: "产品视觉层",
    editorialTitle: "一个工作区，多种执行环境。",
    editorialBody: "这里是模板级 Product Visual Slot：可以替换成真实产品截图、产品影片或架构图。当前 Cursor Demo 用本地、云端与私有池三个执行面展示同一套工作区语义。",
    nodes: [["Local", "开发者本机"], ["Cloud", "并行云 Agent"], ["Private", "自托管机器池"]],
    core: "Workspace",
    visualCaption: "TEMPLATE VISUAL SLOT · 可替换截图 / 产品影片 / 架构图",
    conversionKicker: "从适合团队的工作流开始",
    conversionProof: ["Hobby 免费开始", "本地 + 云端工作区", "官方文档直达"],
    conversionFootnote: "当前为 Demo 转化文案。Fork 后可替换为注册、试用、下载、GitHub 或联系销售。",
    footerBrand: "Cursor 3.x Showcase",
    footerBody: "高保真 Demo 内容，运行在可复用、零构建的 Landing Page 设计系统之上。",
    footerCols: [["浏览", ["亮点", "功能", "时间线"]], ["产品", ["定价", "对比", "搜索"]], ["模板", ["MIT", "PWA", "双语"]]],
    roiTitle: "年度成本结构",
    optimized: "Composer 年度成本",
    baseline: "对照模型年度成本",
    savings: "预计节省",
    mediaLive: "LIVE PRODUCT SURFACE"
  };

  const qs = (selector, scope) => (scope || document).querySelector(selector);
  const qsa = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  function make(tag, className, attrs) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === "text") el.textContent = value;
      else if (key === "html") el.innerHTML = value;
      else el.setAttribute(key, String(value));
    });
    return el;
  }

  function decorateGlass(el, variant, strength) {
    if (!el || !window.CursorLiquidGlass) return;
    el.dataset.liquidGlass = variant || "clear";
    el.dataset.lgCopyBackdrop = "true";
    window.CursorLiquidGlass.decorate(el, { variant: variant || "clear", strength: strength || 7, interactive: true });
    if (root.dataset.lgRenderer === "content-copy-svg" || root.dataset.lgRenderer === "svg-local") {
      window.CursorLiquidGlassV2?.installContentCopy?.(el);
    }
  }

  function installControlStates() {
    qsa("a.btn, button, .chip-btn, .tab-btn, .island-nav a, .product-mobile-tool").forEach((el) => {
      el.dataset.uiControl = "";
    });
  }

  function installMobileIa() {
    const islandInner = qs(".island-inner");
    const desktopNav = qs(".island-nav");
    const status = qs(".island-status");
    if (!islandInner || !desktopNav || !status || qs(".product-mobile-menu-btn")) return;

    const trigger = make("button", "product-mobile-menu-btn", {
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "productMobilePanel",
      "aria-label": isEn ? "Open site navigation" : "打开站点导航"
    });
    trigger.innerHTML = `<span class="product-mobile-current">${copy.mobileMenu}</span><span class="product-mobile-menu-icon" aria-hidden="true"></span>`;
    trigger.dataset.uiControl = "";
    islandInner.insertBefore(trigger, status);

    const scrim = make("div", "product-mobile-scrim", { "aria-hidden": "true" });
    const panel = make("div", "product-mobile-panel", { id: "productMobilePanel", "aria-hidden": "true" });
    const nav = make("nav", "product-mobile-panel-nav", { "aria-label": isEn ? "Mobile site navigation" : "移动端站点导航" });

    qsa("a[href^='#']", desktopNav).forEach((link) => {
      const clone = link.cloneNode(true);
      clone.classList.remove("lg-interactive");
      clone.dataset.uiControl = "";
      nav.appendChild(clone);
    });

    const tools = make("div", "product-mobile-panel-tools");
    const searchTool = make("button", "product-mobile-tool", { type: "button", text: copy.search });
    const themeTool = make("button", "product-mobile-tool", { type: "button", text: copy.theme });
    const langSource = qs(".lang-badge");
    const langTool = langSource ? make("a", "product-mobile-tool", { href: langSource.getAttribute("href") || "#", text: copy.language }) : make("span", "product-mobile-tool", { text: copy.language });
    [searchTool, themeTool, langTool].forEach((el) => { el.dataset.uiControl = ""; });
    tools.append(searchTool, themeTool, langTool);
    panel.append(nav, tools);
    document.body.append(scrim, panel);

    let returnFocus = null;
    function setOpen(open) {
      trigger.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));
      panel.classList.toggle("is-open", open);
      scrim.classList.toggle("is-open", open);
      root.dataset.productMobileNav = open ? "open" : "closed";
      if (open) {
        returnFocus = document.activeElement;
        requestAnimationFrame(() => qs("a, button", panel)?.focus({ preventScroll: true }));
        decorateGlass(panel, "regular", 7);
      } else if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) {
        returnFocus.focus({ preventScroll: true });
      }
    }

    trigger.addEventListener("click", () => setOpen(trigger.getAttribute("aria-expanded") !== "true"));
    scrim.addEventListener("click", () => setOpen(false));
    nav.addEventListener("click", () => setOpen(false));
    searchTool.addEventListener("click", () => { setOpen(false); qs(".island-search-btn.open-cmd-palette")?.click(); });
    themeTool.addEventListener("click", () => qs("#themeToggle")?.click());

    const onKeydown = (event) => {
      if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeydown);
    cleanup.push(() => window.removeEventListener("keydown", onKeydown));

    const onMedia = () => { if (!mobileQuery.matches) setOpen(false); };
    mobileQuery.addEventListener?.("change", onMedia);
    cleanup.push(() => mobileQuery.removeEventListener?.("change", onMedia));

    const current = qs(".product-mobile-current", trigger);
    const updateCurrent = () => {
      const active = qs(".island-nav a.is-active");
      current.textContent = active ? active.textContent.trim() : copy.mobileMenu;
      qsa("a", nav).forEach((item) => item.classList.toggle("is-active", active && item.getAttribute("href") === active.getAttribute("href")));
    };
    const navObserver = new MutationObserver(updateCurrent);
    qsa("a", desktopNav).forEach((link) => navObserver.observe(link, { attributes: true, attributeFilter: ["class"] }));
    updateCurrent();
    cleanup.push(() => navObserver.disconnect());
  }

  function installProofStrip() {
    const hero = qs(".hero");
    if (!hero || qs(".product-proof-strip")) return;
    const section = make("section", "product-proof-strip", { "aria-label": isEn ? "Template proof points" : "模板能力证明" });
    const container = make("div", "container product-proof-inner");
    const intro = make("div", "product-proof-intro");
    intro.innerHTML = `<span class="product-proof-label">${copy.proofKicker}</span><strong>${copy.proofTitle}</strong>`;
    container.appendChild(intro);
    copy.proof.forEach(([value, label]) => {
      const item = make("div", "product-proof-item");
      item.innerHTML = `<span class="product-proof-value">${value}</span><span class="product-proof-copy">${label}</span>`;
      container.appendChild(item);
    });
    section.appendChild(container);
    hero.after(section);
  }

  function enhanceHeroMedia() {
    const heroVisual = qs(".hero-visual");
    const ide = qs(".ide-window", heroVisual);
    if (!heroVisual || !ide || ide.parentElement?.classList.contains("product-media-frame")) return;
    const frame = make("div", "product-media-frame product-media-surface");
    const label = make("span", "product-media-label", { text: copy.mediaLive });
    ide.parentNode.insertBefore(frame, ide);
    frame.append(label, ide);
    heroVisual.classList.add("product-art-direction");
  }

  function installEditorialBreak() {
    const highlights = qs("#highlights");
    const features = qs("#new-features");
    if (!features || qs(".product-editorial-break")) return;
    const section = make("section", "product-editorial-break", { "aria-label": isEn ? "Product visual narrative" : "产品视觉叙事" });
    const container = make("div", "container product-editorial-grid");
    const text = make("div", "product-editorial-copy");
    text.innerHTML = `<div class="product-ui-kicker">${copy.editorialKicker}</div><h2 class="product-editorial-title">${copy.editorialTitle}</h2><p class="product-editorial-body">${copy.editorialBody}</p><div class="product-brand-rule" style="margin-top:28px;"></div>`;
    const visual = make("div", "product-editorial-visual");
    visual.append(make("div", "product-visual-orbit", { "aria-hidden": "true" }), make("div", "product-visual-core", { text: copy.core }));
    copy.nodes.forEach(([title, subtitle], index) => {
      const node = make("div", `product-visual-node n${index + 1}`);
      node.innerHTML = `<strong>${title}</strong><span>${subtitle}</span>`;
      visual.appendChild(node);
    });
    visual.appendChild(make("div", "product-visual-caption", { text: copy.visualCaption }));
    container.append(text, visual);
    section.appendChild(container);
    if (highlights && highlights.nextElementSibling === features) highlights.after(section); else features.before(section);
    window.CursorSiteMotion?.refresh?.();
  }

  function enhanceMediaSurfaces() {
    qsa(".video-container, .media-video, .media-embed").forEach((el) => el.classList.add("product-media-surface", "product-video-surface"));
    qsa(".doc-panel, .compare-wrap").forEach((el) => el.classList.add("product-media-surface"));
  }

  function enhanceConversion() {
    const section = qs("#start");
    const container = qs(":scope > .container", section);
    if (!section || !container || qs(".product-conversion-shell", section)) return;
    section.classList.add("product-conversion-section");
    const shell = make("div", "product-conversion-shell");
    while (container.firstChild) shell.appendChild(container.firstChild);
    container.appendChild(shell);
    const title = qs(".section-title", shell);
    if (title) title.before(make("div", "product-ui-kicker", { text: copy.conversionKicker }));
    const proof = make("div", "product-conversion-proof");
    copy.conversionProof.forEach((item) => proof.appendChild(make("span", "", { text: item })));
    shell.append(proof, make("p", "product-conversion-footnote", { text: copy.conversionFootnote }));
  }

  function enhanceFooter() {
    const footer = qs(".site-footer");
    const inner = qs(".footer-inner", footer);
    if (!footer || !inner || qs(".product-footer-grid", footer)) return;
    footer.classList.add("product-footer");
    const grid = make("div", "product-footer-grid");
    const brand = make("div", "product-footer-brand");
    brand.innerHTML = `<strong>${copy.footerBrand}</strong><p>${copy.footerBody}</p>`;
    grid.appendChild(brand);
    const targetsByIndex = [
      [["#highlights", copy.footerCols[0][1][0]], ["#new-features", copy.footerCols[0][1][1]], ["#timeline", copy.footerCols[0][1][2]]],
      [["#pricing", copy.footerCols[1][1][0]], ["#compare", copy.footerCols[1][1][1]], ["#", copy.footerCols[1][1][2]]],
      null
    ];
    copy.footerCols.forEach(([heading, items], colIndex) => {
      const col = make("div", "product-footer-col");
      col.appendChild(make("strong", "", { text: heading }));
      const targets = targetsByIndex[colIndex];
      if (targets) {
        targets.forEach(([href, label], index) => {
          const a = make("a", "", { href, text: label });
          a.dataset.uiControl = "";
          if (colIndex === 1 && index === 2) {
            a.addEventListener("click", (event) => { event.preventDefault(); qs(".island-search-btn.open-cmd-palette")?.click(); });
          }
          col.appendChild(a);
        });
      } else items.forEach((label) => col.appendChild(make("span", "", { text: label })));
      grid.appendChild(col);
    });
    inner.prepend(grid);
  }

  function parseMoneyValues(text) {
    const matches = String(text || "").match(/\$[\d,.]+/g) || [];
    return matches.map((token) => Number(token.replace(/[$,]/g, ""))).filter(Number.isFinite);
  }

  function installRoiViz() {
    const metrics = qs(".roi-metrics-grid");
    const savingsEl = qs("#annualSavingsText");
    const compareEl = qs("#costCompareText");
    if (!metrics || !savingsEl || !compareEl || qs(".product-roi-viz")) return;
    const viz = make("div", "product-roi-viz");
    viz.innerHTML = `<div class="product-proof-label">${copy.roiTitle}</div><div class="product-viz-row is-optimized"><span class="product-viz-label">${copy.optimized}</span><span class="product-viz-track"><span class="product-viz-fill"></span></span><span class="product-viz-value"></span></div><div class="product-viz-row is-baseline"><span class="product-viz-label">${copy.baseline}</span><span class="product-viz-track"><span class="product-viz-fill"></span></span><span class="product-viz-value"></span></div><div class="product-viz-summary"><span>${copy.savings}</span><strong></strong></div>`;
    metrics.after(viz);
    function update() {
      const [optimized = 0, baseline = 0] = parseMoneyValues(compareEl.textContent);
      const [savings = 0] = parseMoneyValues(savingsEl.textContent);
      const max = Math.max(1, optimized, baseline);
      const rows = qsa(".product-viz-row", viz);
      [optimized, baseline].forEach((value, index) => {
        rows[index].style.setProperty("--viz-width", `${Math.max(3, (value / max) * 100).toFixed(2)}%`);
        qs(".product-viz-value", rows[index]).textContent = `$${Math.round(value).toLocaleString()}`;
      });
      qs(".product-viz-summary strong", viz).textContent = `$${Math.round(savings).toLocaleString()}`;
    }
    const observer = new MutationObserver(update);
    observer.observe(compareEl, { childList: true, characterData: true, subtree: true });
    observer.observe(savingsEl, { childList: true, characterData: true, subtree: true });
    update();
    cleanup.push(() => observer.disconnect());
  }

  function decorateBenchmarkTables() {
    qsa(".compare-table td").forEach((cell) => {
      if (cell.dataset.productBar !== undefined) return;
      const percent = cell.textContent.trim().match(/(\d+(?:\.\d+)?)\s*%/);
      if (!percent) return;
      const value = Math.max(0, Math.min(100, Number(percent[1])));
      cell.dataset.productBar = "";
      cell.style.setProperty("--product-bar", `${value}%`);
    });
  }

  function markControls() {
    installControlStates();
    qsa(".btn-primary").forEach((el) => el.classList.add("product-primary-action"));
  }

  function setBusy(element, busy) {
    const el = typeof element === "string" ? qs(element) : element;
    if (!el) return;
    el.classList.toggle("is-busy", Boolean(busy));
    el.setAttribute("aria-busy", String(Boolean(busy)));
  }

  function setDisabled(element, disabled) {
    const el = typeof element === "string" ? qs(element) : element;
    if (!el) return;
    el.classList.toggle("is-disabled", Boolean(disabled));
    el.setAttribute("aria-disabled", String(Boolean(disabled)));
    if ("disabled" in el) el.disabled = Boolean(disabled);
  }

  function boot() {
    installMobileIa();
    installProofStrip();
    enhanceHeroMedia();
    installEditorialBreak();
    enhanceMediaSurfaces();
    enhanceConversion();
    enhanceFooter();
    installRoiViz();
    decorateBenchmarkTables();
    markControls();
    root.classList.add("product-ui-ready");
    window.dispatchEvent(new CustomEvent("cursor:product-ui-ready", { detail: { version: "0.1.0" } }));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(boot), { once: true }); else requestAnimationFrame(boot);

  window.CursorProductUI = Object.freeze({
    version: "0.1.0",
    refresh() { enhanceMediaSurfaces(); decorateBenchmarkTables(); markControls(); window.CursorSiteMotion?.refresh?.(); },
    setBusy,
    setDisabled,
    decorateMedia(element, type) {
      const el = typeof element === "string" ? qs(element) : element;
      if (!el) return;
      el.classList.add("product-media-surface");
      if (type === "video") el.classList.add("product-video-surface");
    }
  });
})();
