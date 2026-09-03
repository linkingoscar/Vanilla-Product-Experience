# 🛠️ Landing Page 模板二次开发手册

> 目标：在不引入 Node.js、npm 或构建工具的前提下，把这个 Cursor Demo 改造成你自己的 AI / SaaS / CLI / 开源产品官网。

当前 Liquid Glass 分支把代码分为两个层次：

```text
Template Core
├── index.html / en/index.html
├── assets/css/style-base.css
└── assets/js/main-base.js

Liquid Glass Enhancement
├── assets/css/liquid-glass.css
├── assets/css/liquid-glass-v2.css
├── assets/css/liquid-glass-components.css
├── assets/js/liquid-glass.js
├── assets/js/liquid-glass-v2.js
└── assets/js/liquid-glass-components.js
```

`assets/css/style.css` 与 `assets/js/main.js` 是薄入口文件，负责按顺序加载上面的代码，通常无需修改。

---

## ⚡ 5-Minute Quickstart

1. Fork 本仓库或点击 **Use this template**；
2. 全局搜索 `TEMPLATE:EDIT`；
3. 替换品牌、Hero、Feature、Pricing、链接和 SEO；
4. 在 `assets/css/style-base.css` 调整基础 Design Tokens；
5. 替换 `assets/icons/` 与 `manifest.json`；
6. 需要 Liquid Glass 品牌化时，再调整 `assets/css/liquid-glass.css`；
7. 根据 `docs/DEPLOY.md` 部署。

---

## 1. 网站元数据与 SEO

编辑 `index.html` 和 `en/index.html`，搜索：

```text
TEMPLATE:EDIT — Site Metadata
```

至少替换：

```html
<title>你的产品名称 · 一句话定位</title>
<meta name="description" content="你的产品描述" />
<meta property="og:title" content="你的产品名称 · 标语" />
<meta property="og:description" content="你的产品描述" />
<meta property="og:image" content="assets/icons/og-image.png" />
```

---

## 2. 基础品牌与主题色

### 编辑文件

```text
assets/css/style-base.css
```

这里是模板主体的 Design Tokens：

```css
:root {
  --blue: #0071e3;
  --blue-hover: #0077ed;
  --blue-glow: rgba(0, 113, 227, 0.3);

  --indigo: #6366f1;
  --emerald: #10b981;
  --amber: #f59e0b;
  --violet: #8b5cf6;

  --bg-app: #fbfbfd;
  --bg-surface: #ffffff;
  --text-main: #1d1d1f;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

[data-theme="dark"] {
  --bg-app: #08090e;
  --bg-surface: #141724;
  --text-main: #f5f5f7;
}
```

如果只想做普通静态 Landing Page，到这里已经足够。

---

## 3. Liquid Glass 品牌化

### 编辑文件

```text
assets/css/liquid-glass.css
```

推荐先调整：

```css
:root {
  --lg-ior: 1.48;
  --lg-refraction: 9px;
  --lg-refraction-strong: 13px;
  --lg-bezel: 15px;
  --lg-specular-alpha: 0.52;
  --lg-primary-tint: rgba(46, 115, 255, 0.28);
}
```

不要把 `refraction` 无限制调大。验收标准不是“越扭越液态”，而是：

- 边缘网格/文字有真实像素位移；
- 中心仍然清楚可读；
- Specular 只作为光线提示，不是一圈白色描边；
- Tint 只用于重点操作，不把所有卡片染成彩色玻璃。

### Playground

打开：

```text
liquid-glass-lab.html
```

可以实时调整：

- Refraction
- Bezel
- Radius
- Specular
- Primary Tint

并使用 **Copy CSS Tokens** 复制参数。

---

## 4. 顶部 Floating Island

实际容器是：

```html
<header class="island">
```

修改：

- `.island-logo`：品牌名；
- `.island-mark`：Logo / 字母 Mark；
- `.island-nav`：导航锚点；
- `.island-search-btn`：Command Palette 入口；
- `.lang-badge`：中英文切换。

Liquid Glass runtime 会自动将 `.island` 装饰为光学材质，并给 `.island-nav` 添加一个共享移动 Lens。

---

## 5. Hero

搜索：

```text
TEMPLATE:EDIT — Hero Section
```

建议修改：

- Eyebrow：版本动态 / 公告；
- `<h1>`：一句核心定位；
- `.lead`：用户、场景、价值；
- `.hero-actions`：主要 CTA / 次要 CTA；
- `.ide-window`：产品 Demo、终端、代码或 Dashboard 示意。

主/次 CTA 会自动接入 Liquid Glass 功能层；Hero 内容本身保持 Content Layer，不建议整块透明化。

---

## 6. Feature Matrix

搜索：

```text
TEMPLATE:EDIT — Feature Matrix
```

分类按钮：

```html
<button class="tab-btn" data-filter="frontend">Frontend</button>
```

功能卡片：

```html
<article class="feature-card" data-category="frontend">
  ...
</article>
```

`.feature-tabs` 会由 Liquid Glass runtime 自动生成 **一个 Shared Lens**。不要给每个 Tab 单独加一块 glass background。

---

## 7. Command Palette

### 编辑数据

```text
assets/js/main-base.js
```

搜索：

```text
TEMPLATE:EDIT — Search Index
```

修改：

```javascript
const searchIndex = [
  { title: "安装与快速上手", cat: "入门", target: "#quickstart" },
  { title: "云端协作方案", cat: "核心特性", target: "#features" },
  { title: "团队版订阅与价格", cat: "定价", target: "#pricing" }
];
```

`assets/js/liquid-glass-v2.js` 只负责 Search Pill → Command Palette 的 shared-geometry morph，不负责你的业务搜索数据。

---

## 8. ROI / Range Control

原始 `<input type="range">` 仍然是键盘、鼠标、触摸和无障碍交互目标。

Liquid Glass runtime 自动在它下方生成：

```text
visual track
+ progress fill
+ real Liquid Glass DOM thumb
+ original native input hit target
```

因此 Fork 时不要删除原生 `<input>` 去换自绘 div slider。

---

## 9. 删除不需要的模块

搜索：

```text
TEMPLATE:OPTIONAL START
TEMPLATE:OPTIONAL END
```

模板主体 JS 对可选节点都做存在性检查，可以整块删除不需要的模块。

Liquid Glass runtime 同样使用查询后增强策略：没有对应 DOM 就不会初始化该组件。

---

## 10. 一键关闭 Liquid Glass

如果你只想要稳定的普通 Landing Page：

### `assets/css/style.css`

删除：

```css
@import url("./liquid-glass.css?v=0.1.0");
@import url("./liquid-glass-v2.css?v=0.2.0");
@import url("./liquid-glass-components.css?v=0.3.0");
```

保留：

```css
@import url("./style-base.css?v=3.10.0");
```

### `assets/js/main.js`

让入口只加载：

```javascript
loadScript("main-base.js?v=3.10.0");
```

这样中英文、暗色模式、Feature Tabs、Command Palette、模拟器、ROI、PWA 等模板基础能力仍然存在。

---

## 11. PWA 与离线缓存

### `manifest.json`

修改：

- `name`
- `short_name`
- `description`
- icons
- theme color

### `sw.js`

每次部署改变静态资源版本时递增：

```javascript
const CACHE_NAME = 'your-product-v2';
```

Liquid Glass 分支已经把完整入口依赖图加入预缓存，包括 `style-base`、`main-base` 和 `liquid-glass*` 文件。

---

## 12. Accessibility

不要删除以下能力：

```css
@media (prefers-reduced-motion: reduce)
@media (prefers-reduced-transparency: reduce)
```

Liquid Glass 对应策略：

- Reduce Motion：Shared Lens / Palette Morph 基本取消弹性动画；
- Reduce Transparency：移除折射副本，使用高不透明度材质；
- Native Range Input：继续负责键盘和辅助技术交互。

---

## 13. 部署前 Checklist

- [ ] `<title>` / description / OG 是否替换？
- [ ] Cursor Demo 内容是否替换或明确保留为 Demo？
- [ ] `style-base.css` 品牌 Tokens 是否完成？
- [ ] `main-base.js` 的 `searchIndex` 是否匹配你的页面？
- [ ] icons / manifest 是否换成自己的品牌？
- [ ] ⌘K / Ctrl+K 是否正常？
- [ ] Feature Tabs 是否正常筛选？
- [ ] Range 是否支持鼠标、触摸、键盘？
- [ ] 深色 / 浅色对比度是否合适？
- [ ] `prefers-reduced-motion` 是否可用？
- [ ] `prefers-reduced-transparency` 是否可用？
- [ ] Chrome 中 Glass 边缘是否真的折射背景？
- [ ] Safari / Firefox 是否显示 `content-copy-svg` renderer 并产生真实位移？
- [ ] 手机滚动是否流畅？
- [ ] PWA 离线刷新是否能加载完整 CSS/JS 依赖？

更多 Liquid Glass QA 见 [`LIQUID_GLASS_IMPLEMENTATION.md`](LIQUID_GLASS_IMPLEMENTATION.md)。
