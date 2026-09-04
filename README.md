# Vanilla Product Experience

> **零构建的产品体验系统。** 使用原生 HTML、CSS 与 JavaScript，提供真实折射 Liquid Glass、WebGL Ambient Field、整站 Motion Choreography、响应式 Product UI、PWA 与 Accessibility。
>
> 仓库中的 **Cursor 3.x** 页面是 Reference Demo，不再是项目本身的身份。

[Live Demo](https://linkingoscar.github.io/Vanilla-Product-Experience/) · [v1.0.0 Release Notes](docs/releases/v1.0.0.md) · [English](README.en.md) · [Documentation](docs/README.md) · [Customize](docs/CUSTOMIZE.md)

[![Version](https://img.shields.io/badge/VPE-v1.0.0-6366f1)](VERSION)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Build](https://img.shields.io/badge/build-zero-10b981)](#quickstart)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8)](manifest.json)
[![Accessibility](https://img.shields.io/badge/accessibility-reduced%20motion%20%2F%20transparency-005A9C)](docs/BROWSER_SUPPORT.md)

## 这是什么

Vanilla Product Experience（**VPE**）不是另一个 CSS 组件库，也不是一个 React/Vite Starter。它是一套可以直接部署的静态 Product Experience Runtime：

```text
Static Content
    ↓
Template Core
    ↓
Optical Material System
    ↓
Ambient Interaction Field
    ↓
Site Motion System
    ↓
Product UI / Art Direction
    ↓
Experience Integration + PWA
```

它的目标是：在 **不引入框架、打包器或运行时依赖** 的前提下，仍然做出高级产品官网需要的材质、空间、动效、信息架构和响应式交互。

## What ships

| 系统 | 作用 |
| --- | --- |
| **Template Core** | 双语页面、Theme、Command Palette、Feature Matrix、Simulator、ROI、Pricing、Comparison、SEO 基础 |
| **Real Liquid Glass** | SDF displacement map、`feDisplacementMap`、shared lens、specular、cross-browser content-copy renderer |
| **Ambient Field** | WebGL2 粒子场、Canvas2D fallback、pointer wake、scroll energy、Glass mirror bridge |
| **Site Motion** | Spring physics、FLIP、数字连续动画、section choreography、Timeline progress |
| **Product UI** | Mobile Island、Typography、Proof、Media Surface、Conversion、Light Mode art direction |
| **Integration** | 响应式 hardening、浏览器 zoom/window resilience、PWA cache/version integrity |

核心原则不是“特效越多越好”，而是：**内容优先，动效保持连续，Glass 只服务功能控件，Ambient 只负责空间感。**

## Reference Demo: Cursor 3.x

根目录与 `/en/` 当前使用 Cursor 3.x 作为高保真 Reference Experience，用来展示 VPE 在真实产品信息密度下的表现：

- 31 项可筛选 Feature Matrix；
- Floating Island + Command Palette；
- Local / Cloud / Private Workspace 控制；
- Composer workflow simulator 与 ROI calculator；
- Timeline、Pricing、Comparison；
- 中英文、Dark / Light、PWA、响应式布局。

Fork 时可以完整替换这些 `DEMO:CURSOR` 内容，而保留 VPE runtime。

## Quickstart

无需安装 Node.js 或 npm：

```bash
git clone https://github.com/linkingoscar/Vanilla-Product-Experience.git
cd Vanilla-Product-Experience
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

用于二次开发时：

1. 全局搜索 `TEMPLATE:EDIT`；
2. 替换品牌、Hero、Feature、Pricing、链接与 SEO；
3. 修改 `assets/css/style-base.css` 的基础 Design Tokens；
4. 修改 `assets/css/product-ui.css` 的品牌/排版 tokens；
5. 替换 `assets/icons/` 与 `manifest.json`；
6. 按 [`docs/DEPLOY.md`](docs/DEPLOY.md) 部署。

## Runtime architecture

正式入口保持很薄：

```text
assets/css/style.css
├── style-base.css
├── liquid-glass*.css
├── ambient-particles.css
├── site-motion.css
├── product-ui*.css
└── experience-integration.css

assets/js/main.js
├── main-base.js
├── liquid-glass*.js
├── ambient/*
├── motion/*
└── product-ui.js
```

项目级版本从 **v1.0.0** 开始。内部模块仍保留自己的小版本用于诊断，但 public entrypoint、PWA cache 和 Release 以项目版本为准。详见 [`docs/VERSIONING.md`](docs/VERSIONING.md)。

## Public API

v1 提供中性的 `window.VPE` facade：

```js
VPE.version
VPE.glass
VPE.ambient
VPE.motion
VPE.ui
```

历史 `CursorLiquidGlass`、`CursorAmbientField`、`CursorProductUI` 等全局对象在 v1 继续作为兼容 alias 保留，不要求现有集成立即迁移。

## Browser & accessibility policy

- Chromium：真实 backdrop displacement 主路径；
- Safari / Firefox：content-copy SVG displacement 路径；
- 无 WebGL2：Ambient 自动回退 Canvas2D；
- `prefers-reduced-motion`：停止或显著降低持续运动；
- `prefers-reduced-transparency`：切换高可读性 solid material；
- Touch / coarse pointer：降低视觉预算并保留原生交互目标；
- Responsive：支持窗口连续 resize、zoom breakpoint、Mobile Island 与横向 segmented controls。

当前仓库拥有静态完整性 CI 和 Chromium 集成调校；Safari / Firefox 的最终视觉参数仍建议在目标版本原生浏览器上做人工验收。完整矩阵见 [`docs/BROWSER_SUPPORT.md`](docs/BROWSER_SUPPORT.md)。

## Documentation

从 [`docs/README.md`](docs/README.md) 开始：

- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) — 系统边界、加载顺序与依赖；
- [`CUSTOMIZE.md`](docs/CUSTOMIZE.md) — Fork / Rebrand / tokens；
- [`SECTIONS.md`](docs/SECTIONS.md) — 页面模块、依赖与安全删除；
- [`BROWSER_SUPPORT.md`](docs/BROWSER_SUPPORT.md) — renderer、responsive、accessibility；
- [`VERSIONING.md`](docs/VERSIONING.md) — 项目/模块/资源/PWA 版本规则；
- [`DEPLOY.md`](docs/DEPLOY.md) — GitHub Pages / Vercel / Cloudflare / Netlify；
- [`LIQUID_GLASS_IMPLEMENTATION.md`](docs/LIQUID_GLASS_IMPLEMENTATION.md) — 光学系统；
- [`AMBIENT_PARTICLE_FIELD.md`](docs/AMBIENT_PARTICLE_FIELD.md) — 环境粒子场；
- [`SITE_MOTION_SYSTEM.md`](docs/SITE_MOTION_SYSTEM.md) — 全站动效；
- [`PRODUCT_UI_SYSTEM.md`](docs/PRODUCT_UI_SYSTEM.md) — Product UI / Art Direction。

## Project rules

贡献代码前请阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md)。几个不可退让的约束：

- 不为普通功能引入 React / Vue / Vite / Webpack；
- 不劫持原生滚动；
- 不用 blur-only 冒充真实折射；
- 不允许 motion/layout 压缩或裁剪可读内容；
- 所有响应式交互必须覆盖 keyboard / touch / reduced-motion；
- 修改版本化资源时必须同步入口 query 与 Service Worker cache key。

## License & demo attribution

VPE 代码以 [MIT License](LICENSE) 发布。

Cursor 3.x 仅作为 Reference Demo 内容与外部产品示例；本仓库不是 Cursor 官方项目，也不代表 Cursor/Anysphere。Fork 项目应替换 `DEMO:CURSOR` 标记内容、品牌与产品声明。
