# 🧩 页面模块与组件速查手册

本文档列出模板主要模块的真实 DOM 容器、CSS / JavaScript 依赖，以及 Liquid Glass 增强关系。

> 原则：**Template Core 决定内容和基础交互，Liquid Glass 只增强 Functional Layer。** 删除可选模块时，不应为了视觉效果保留无意义 DOM。

---

## 模块总览

| # | 模块 | 实际 HTML 容器 | 主要样式 | Template JS | Liquid Glass | 可删除？ |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 01 | Floating Island | `header.island` | `.island`, `.island-nav` | Scroll Spy / Smooth Scroll / Search | Island refraction + Shared Nav Lens | 建议保留 |
| 02 | Hero | `section.hero` | `.hero-grid`, `.ide-window` | Scroll Reveal | CTA / status controls | 建议保留 |
| 03 | Highlights | `section#highlights` | `.bento`, `.bento-card` | Scroll Reveal | 内容卡不默认 Glass | ✅ |
| 04 | Feature Matrix | `section#new-features` | `.feature-tabs`, `.feature-grid`, `.feature-card` | 分类筛选 | Shared Tab Lens | ✅ |
| 05 | Composer / ROI | `section#composer-25` | `.sim-*`, `.roi-*`, `.range-slider` | Simulator / Calculator | Liquid Range Thumb | ✅ |
| 06 | Media | `section#media` | `.media-*`, `.video-frame` | iframe loading | 不默认 Glass | ✅ |
| 07 | Timeline | `section#timeline` | `.timeline`, `.timeline-item` | Scroll Reveal | 不默认 Glass | ✅ |
| 08 | Pricing | `section#pricing` | `.pricing-grid`, `.pricing-card` | Scroll Reveal | CTA / badge 可 Glass | ✅ |
| 09 | Comparison | `section#compare` | `.compare-wrap`, `.compare-table` | 基础页面行为 | 不默认 Glass | ✅ |
| 10 | Final CTA | `section#start` | `.btn`, section styles | 无独立逻辑 | CTA 自动增强 | ✅ |
| 11 | Footer | `footer.site-footer` | `.site-footer`, `.footer-inner` | 无独立逻辑 | 不默认 Glass | 建议保留 |
| 12 | Command Palette | `div#cmdPalette` | `.cmd-palette-*` | Search / Keyboard Nav | Search → Palette Morph | ✅ |
| 13 | Theme Toggle | `button#themeToggle` | `.theme-toggle` | Theme persistence | Small Glass Control | ✅ |
| 14 | Back to Top | `button#backToTop` | `.back-to-top` | Scroll visibility | Small Glass Control | ✅ |

---

## 01. Floating Island

```html
<header class="island">
  <div class="island-inner">
    ...
    <nav class="island-nav">...</nav>
    ...
  </div>
</header>
```

### Template Core

`assets/js/main-base.js`：

- 根据滚动位置设置导航 `.is-active`；
- 锚点平滑滚动；
- Search 按钮打开 Command Palette。

### Liquid Glass

`assets/js/liquid-glass.js`：

- 将 `.island` 装饰成真实光学材质；
- `.island-nav` 只创建 **一个** `.lg-shared-lens`；
- Active 项变化时移动/拉伸同一个 Lens。

Safari / Firefox 由 `liquid-glass-v2.js` 给 Island 建立 `content-copy-svg` 折射副本。

### 删除注意

不建议删整个 Island。如果只想精简：

- 删除 `.lang-badge`：取消多语言按钮；
- 删除 `.island-search-btn`：取消 Command Palette 入口；
- 删除某个导航链接：同时确认对应 section 是否仍存在。

---

## 02. Hero

实际容器：

```html
<section class="hero">
```

主体是 Content Layer，不应把整个 Hero 透明化。

推荐 Glass 只放在：

- `.btn-primary`
- `.btn-secondary`
- `.ide-swarm-pill`
- 后续新增的 floating toolbar / status control

右侧 `.ide-window` 可以替换成产品截图、终端、Dashboard 或 HTML Demo。

---

## 03. Highlights Bento

```html
<section id="highlights">
  <div class="bento">
    <article class="bento-card">...</article>
  </div>
</section>
```

`.bento-card` 属于 Content Surface，默认不做真实 refraction。

原因：如果几十张内容卡同时进入 displacement 合成，会同时损害层级、可读性和 GPU 预算。

可以安全删除整个 section；记得同步删除 Island 中 `#highlights` 链接。

---

## 04. Feature Matrix

```html
<div class="feature-tabs" role="tablist">
  <button class="tab-btn is-active" data-filter="all">...</button>
</div>

<div class="feature-grid">
  <article class="feature-card" data-category="model">...</article>
</div>
```

### Template Core

点击 `data-filter` 后：

- 当前按钮切换 `.is-active`；
- 功能卡切换 `.is-hidden` / `.is-visible`。

### Liquid Glass

`.feature-tabs` 使用一个 Shared Lens。

**不要**为了换肤给每一个 `.tab-btn` 单独加半透明背景；这会破坏“一个连续材质在不同选项间移动”的交互语言。

Safari / Firefox 在分类切换后会重新同步 full-world mirror，避免折射旧的卡片布局。

---

## 05. Composer Simulator / ROI Calculator

实际 section：

```html
<section id="composer-25">
```

### Simulator

主要由：

```text
.prompt-chips
.sim-steps
#simCodeText
#simStatusPill
```

组成。

`main-base.js` 负责 Demo 状态和内容变化；Liquid Glass 只增强浮动/状态控制。

### ROI Range

原始控件：

```html
<input class="range-slider" type="range" ... />
```

v0.2 会包装成：

```text
.lg-range-shell
├── .lg-range-track
├── .lg-range-fill
├── .lg-range-thumb     ← 光学视觉 Thumb
└── input.range-slider  ← 真正交互 / 键盘 / Accessibility Target
```

**不要删除原生 `<input>`。**

Safari / Firefox 的 Thumb 会局部复制 ROI Content，并在玻璃范围内做 SVG displacement。

---

## 06. Media

实际视频状态选择器以 `.video-frame` 为主。

Liquid Glass content-copy 明确排除：

```text
iframe
video
audio
canvas
object
embed
```

因此不要指望 DOM content-copy renderer 折射视频帧。需要这种能力时应新增 WebGL media renderer，而不是把媒体 Rasterize 成巨大 DOM Snapshot。

---

## 07. Timeline

```html
<section id="timeline">
  ... .timeline-item ...
</section>
```

纯 Content Layer + Scroll Reveal。可以安全删除。

---

## 08. Pricing

实际卡片：

```html
<div class="pricing-grid">
  <div class="pricing-card">...</div>
</div>
```

不要把所有 Pricing Card 都变成 Liquid Glass。

推荐只增强：

- `.pricing-badge`
- CTA `.btn`
- 如果未来加入 Monthly / Annual Toggle，则使用 Shared Lens。

---

## 09. Comparison

```html
<section id="compare">
  <div class="compare-wrap">
    <table class="compare-table">...</table>
  </div>
</section>
```

属于信息密度高的 Content Layer。默认不用 Glass。

---

## 10. Final CTA

```html
<section id="start">
```

CTA 按钮会自动被 Liquid Glass engine 装饰，因此无需在 HTML 中手动添加 `.lg-*` 内部节点。

---

## 11. Footer

```html
<footer class="site-footer">
```

Footer 不需要大量光学效果。保持稳定的正文和链接可读性即可。

---

## 12. Command Palette

```html
<div id="cmdPalette" class="cmd-palette-backdrop">
  <div class="cmd-palette-modal">...</div>
</div>
```

### Template Core

`main-base.js` 负责：

- ⌘K / Ctrl+K；
- Escape；
- 模糊搜索；
- Arrow Up / Down；
- Enter 跳转。

搜索数据同样在 `main-base.js` 的 `searchIndex`。

### Liquid Glass v0.2

`liquid-glass-v2.js` 将 Island Search Pill 与 Modal 当作连续几何：

```text
Search Pill
    ↓ spring expand / resize / radius morph
Command Palette
```

点击遮罩、Escape 或再次按 ⌘K / Ctrl+K 会执行反向 morph。

---

## 13 / 14. Theme & Back-to-Top

两个按钮都属于 small floating control，可使用轻量 Liquid Glass。

`prefers-reduced-motion` / `prefers-reduced-transparency` 下必须接受系统降级，不要通过自定义动画强行覆盖。

---

# 删除模块时的通用规则

### 1. 先删 Navigation Link

如果删除 section：

```html
<section id="pricing">...</section>
```

同时删除：

```html
<a href="#pricing">...</a>
```

### 2. 不要删除 Base 脚本里的防空判断

`main-base.js` 对可选模块做存在性检测。保留这些 guard，让不同 Fork 可以自由删 section。

### 3. Liquid Glass 不需要手动清理内部 DOM

`.lg-optics`、`.lg-shared-lens`、`.lg-range-thumb` 等均由 runtime 创建。删除原始组件后刷新页面即可，不要把运行时生成节点复制回 HTML。

### 4. 需要彻底关闭 Glass

参见 [`CUSTOMIZE.md`](CUSTOMIZE.md) 的“一键关闭 Liquid Glass”。
