# Cursor 3.x 介绍页 & Static Product Landing Page Template

> 🖥️ 一个以 **Cursor 3.x** 为高质量 Demo Content 的纯静态产品宣传页模板。  
> ⚡ **零框架、零打包构建**，Fork 后直接修改 HTML / CSS / JavaScript 即可部署自己的 AI / SaaS / 开源产品 Landing Page。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/Accessibility-ARIA-005A9C?logo=w3c&logoColor=white)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)

> 🌐 **[English Documentation](README.en.md)**

---

## 🧭 两种使用方式

### ① Cursor 3.x Showcase

- 了解 Cursor 1.x → 3.x / 2026 年 9 月前沿生态；
- 浏览 **31 项功能矩阵**、版本时间线、定价与竞品对比；
- 体验多 Agent 模拟器、Command Palette 与 ROI 计算器。

### ② Static Product Landing Page Template

- 无 React / Vue / Vite / Webpack；
- 无需 Node.js 即可运行；
- 中英文、暗色模式、PWA、SEO、无障碍能力开箱即用；
- `TEMPLATE:EDIT` / `TEMPLATE:OPTIONAL` / `DEMO:CURSOR` 注释帮助快速 Fork；
- 自带一套可独立拆除的 **Liquid Glass Optical Design System**。

---

## 🫧 Real Liquid Glass — 不是 blur 冒充玻璃

当前 `feat/liquid-glass-design-system` 分支引入真实位移折射实验实现，而不是只做：

```css
backdrop-filter: blur(20px);
```

光学链路包含：

```text
Rounded-Rect SDF
      ↓
RG Displacement Map
      ↓
SVG feDisplacementMap
      ↓
Edge Lensing / Refraction
      ↓
Material Tint
      ↓
Directional Specular Highlight
      ↓
Foreground Content
```

### Renderer

- **Chromium**：`backdrop-svg`，直接对玻璃背后的实际像素做 SVG displacement；
- **Safari / Firefox**：`content-copy-svg`，同步真实 DOM 的非交互副本，再通过 `filter:url(#feDisplacementMap)` 折射；
- **Reduce Transparency**：切换为高不透明度、可读性优先的 `accessible-solid` 材质；
- Video / Canvas 暂不强行 DOM Rasterize，后续需要时走独立 WebGL renderer。

### 已升级的 Functional Layer

Liquid Glass 主要用于操作层，而不是把所有内容卡片都做成毛玻璃：

- Floating Island Navigation
- Shared Active Lens
- Primary / Secondary CTA
- Command Palette
- Search → Palette shared-geometry morph
- Feature Segmented Tabs
- ROI Liquid Range Thumb
- Status / Badge / Floating Controls

专门的光学验收与参数页：

```text
/liquid-glass-lab.html
```

它提供普通 blur 与真实 displacement 的并排比较，以及 Refraction / Bezel / Radius / Specular / Tint 调节。

详细工程说明见：[`docs/LIQUID_GLASS_IMPLEMENTATION.md`](docs/LIQUID_GLASS_IMPLEMENTATION.md)。

> 当前分支已经通过仓库级静态 CI；Chrome / Safari / Firefox 的最终视觉参数仍应在合并前按 QA Checklist 做真人浏览器验收。

---

## ⚡ 5 分钟 Fork Quickstart

```text
Fork / Use this template
       ↓
搜索 TEMPLATE:EDIT
       ↓
替换品牌、文案、链接
       ↓
修改 Design Tokens
       ↓
替换 Icons / manifest
       ↓
部署
```

1. Fork 本仓库或使用 **Use this template**；
2. 全局搜索 `TEMPLATE:EDIT`，替换品牌、Hero、功能、定价与外链；
3. 修改 `assets/css/style-base.css` 顶部 Design Tokens；
4. 如需修改 Command Palette 搜索数据或 Demo 行为，编辑 `assets/js/main-base.js`；
5. 替换 `assets/icons/` 和 `manifest.json`；
6. 根据 [`docs/DEPLOY.md`](docs/DEPLOY.md) 发布。

---

## 🧩 文件职责与修改地图

Liquid Glass 分支将“模板内容层”和“光学增强层”明确拆开：

| 文件 | 职责 | Fork 时通常需要修改？ |
| :--- | :--- | :---: |
| `index.html` | 中文品牌、Hero、Feature、Pricing、SEO | ✅ |
| `en/index.html` | 英文内容；单语言项目可删除 | 可选 |
| `assets/css/style-base.css` | **模板 Design Tokens 与主体组件样式** | 🎨 推荐 |
| `assets/css/style.css` | CSS 薄入口，加载 Base + Liquid Glass | 通常不用 |
| `assets/css/liquid-glass.css` | v0.1 光学材质、Shared Lens、Specular | 高级定制 |
| `assets/css/liquid-glass-v2.css` | content-copy、Palette Morph、Liquid Slider | 高级定制 |
| `assets/css/liquid-glass-components.css` | v0.3 业务组件液态化视觉覆盖 (Hero/定价/模拟器) | 高级定制 |
| `assets/js/main-base.js` | **模板原始行为、searchIndex、模拟器、ROI** | 💡 视情况 |
| `assets/js/main.js` | JS 薄入口，按顺序加载 Base + Glass Engine | 通常不用 |
| `assets/js/liquid-glass.js` | SDF / Displacement Map / Filter / Shared Spring | 高级定制 |
| `assets/js/liquid-glass-v2.js` | Safari/Firefox content-copy、Palette、Range | 高级定制 |
| `assets/js/liquid-glass-components.js` | v0.3 Hero 控制器、定价/模拟器透镜业务装配 | 高级定制 |
| `liquid-glass-lab.html` | Glass 参数实验与光学验收 | 可选 |
| `assets/icons/` | Favicon 与 PWA icons | ✅ |
| `manifest.json` | PWA 名称、主题、图标 | PWA 项目 |
| `sw.js` | 离线缓存与版本失效 | 部署更新时 |

### 为什么保留 `*-base`？

因为模板主体与 Liquid Glass 是两个不同生命周期：

```text
Template Core
style-base.css + main-base.js
        │
        ├── 可独立工作
        │
        ▼
Liquid Glass Enhancement
liquid-glass*.css + liquid-glass*.js
```

这样光学实验可以快速升级、回滚或移除，不需要重写稳定的 Landing Page 内容层。

### 不想使用 Liquid Glass？

删除 `assets/css/style.css` 中两个 `liquid-glass*.css` import，并删除 `assets/js/main.js` 中两个 Liquid Glass loader 即可；`style-base.css + main-base.js` 仍保持原站完整功能。

---

## 🎨 最常用的 Design Tokens

在 `assets/css/style-base.css` 中修改品牌基础视觉：

```css
:root {
  --blue: #0071e3;
  --indigo: #6366f1;
  --bg-app: #fbfbfd;
  --bg-surface: #ffffff;
  --text-main: #1d1d1f;
  --font-sans: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --bg-app: #08090e;
  --bg-surface: #141724;
  --text-main: #f5f5f7;
}
```

Liquid Glass 的高级参数位于 `assets/css/liquid-glass.css`：

```css
:root {
  --lg-ior: 1.48;
  --lg-refraction: 9px;
  --lg-bezel: 15px;
  --lg-specular-alpha: 0.52;
}
```

建议先在 `liquid-glass-lab.html` 调整，再复制参数。

---

## 🔎 模板搜索标记

全局搜索：

- `TEMPLATE:EDIT`：品牌、文案与配置；
- `TEMPLATE:OPTIONAL`：可安全删除的独立模块；
- `TEMPLATE:CORE`：模板运行基础能力；
- `DEMO:CURSOR`：Cursor 专属 Demo 内容。

---

## 🏛️ 页面模块

| 模块 | 容器 | 可复用场景 |
| :--- | :--- | :--- |
| Floating Island | `header.island` | 浮动导航、搜索、语言切换 |
| Hero | `section.hero` | 产品定位 + CTA |
| Highlights | `section#highlights` | Bento 核心卖点 |
| Feature Matrix | `section#new-features` | 可筛选功能矩阵 |
| Interactive Demo | `section#composer-25` | 模拟器 / Calculator |
| Media | `section#media` | 视频 / 产品演示 |
| Timeline | `section#timeline` | Changelog / Roadmap |
| Pricing | `section#pricing` | SaaS 价格方案 |
| Comparison | `section#compare` | 竞品矩阵 |
| CTA | `section#start` | 最终转化区 |
| Command Palette | `div#cmdPalette` | ⌘K / Ctrl+K 快捷搜索 |

---

## 📚 文档

- [`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md) — Fork / Rebrand / Design Tokens
- [`docs/SECTIONS.md`](docs/SECTIONS.md) — 模块依赖与安全删除
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — GitHub Pages / Vercel / Cloudflare / Netlify
- [`docs/LIQUID_GLASS_IMPLEMENTATION.md`](docs/LIQUID_GLASS_IMPLEMENTATION.md) — Liquid Glass 光学架构、浏览器策略与 QA

---

## 🧪 静态 CI

Liquid Glass 分支提供 `.github/workflows/liquid-glass-checks.yml`，无需安装 npm 依赖，检查：

- JavaScript / Service Worker 语法；
- HTML 重复 ID；
- CSS/JS 入口依赖图；
- `feDisplacementMap` / content-copy renderer 是否仍存在；
- reduced-motion / reduced-transparency 可访问性路径。

---

## ⚖️ Disclaimer

1. 仓库中的 Cursor 名称、特性、定价与商标只作为高质量 Demo Content；Fork 用于自己的项目时请替换。
2. 本项目与 **Cursor / Anysphere, Inc.** 无官方隶属、赞助或背书关系；相关商标归各自权利人所有。

---

## 📄 License

MIT License。可用于个人学习、开源项目和商业 Landing Page。

⭐ 如果这个模板或 Liquid Glass 实现对你有帮助，欢迎 Star / Fork / PR。
