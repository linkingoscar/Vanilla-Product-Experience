# 🛠️ Vanilla Product Experience 二次开发手册

> 目标：不引入 Node.js、npm 或构建工具，把 VPE 的 Cursor Reference Demo 改造成你自己的 AI / SaaS / CLI / 开源产品官网。

## 系统结构

VPE v1.0 有五个主要系统，并保留一个很薄的跨系统 Integration Layer：

```text
1. Template Core
├── index.html / en/index.html
├── assets/css/style-base.css
└── assets/js/main-base.js

2. Liquid Glass
├── assets/css/liquid-glass*.css
└── assets/js/liquid-glass*.js

3. Ambient Particle Field
├── assets/css/ambient-particles.css
└── assets/js/ambient/

4. Site Motion System
├── assets/css/site-motion.css
└── assets/js/motion/

5. Product UI & Art Direction
├── assets/css/product-ui.css
├── assets/css/product-ui-media.css
└── assets/js/product-ui.js

Integration Layer
└── assets/css/experience-integration.css
```

`assets/css/style.css` 与 `assets/js/main.js` 是薄入口，通常不需要 Fork 用户修改。

## 5-Minute Quickstart

1. Fork / Use this template；
2. 全局搜索 `TEMPLATE:EDIT`；
3. 替换品牌、Hero、Feature、Pricing、链接和 SEO；
4. 搜索 `DEMO:CURSOR`，替换 Reference Demo 专属内容；
5. 在 `assets/css/style-base.css` 修改基础 Design Tokens；
6. 在 `assets/css/product-ui.css` 修改品牌人格/排版 tokens；
7. 替换 `assets/icons/` 与 `manifest.json`；
8. 根据 `docs/DEPLOY.md` 部署。

## 1. 元数据与 SEO

编辑 `index.html` 与 `en/index.html`：

```html
<title>你的产品名称 · 一句话定位</title>
<meta name="description" content="你的产品描述" />
<meta property="og:title" content="你的产品名称 · 标语" />
<meta property="og:description" content="你的产品描述" />
```

如果改了 GitHub 仓库名、Pages 子路径或自定义域名，同步检查 canonical / hreflang / Open Graph URL。

## 2. 基础品牌

编辑 `assets/css/style-base.css`：

```css
:root {
  --blue: #0071e3;
  --indigo: #6366f1;
  --bg-app: #fbfbfd;
  --bg-surface: #ffffff;
  --text-main: #1d1d1f;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

如果只需要普通静态 Landing Page，Template Core 本身已经可以独立工作。

## 3. Product UI / Art Direction

编辑 `assets/css/product-ui.css` 中的品牌与排版 tokens，例如：

```text
--brand-signature-a/b/c
--brand-display-tracking
--brand-title-tracking
--brand-media-radius
--type-display-xl
--type-title
--type-body
```

Proof、Editorial Visual、Conversion 等增强由 `assets/js/product-ui.js` 装配。Fork 时只填真实可验证的数据，不要为了视觉占位编造 vanity metrics。

## 4. Liquid Glass 品牌化

编辑 `assets/css/liquid-glass.css`，优先调整：

```css
--lg-ior
--lg-refraction
--lg-bezel
--lg-specular-alpha
--lg-primary-tint
```

先在 `liquid-glass-lab.html` 验收。标准是边缘存在真实像素位移、中心保持可读，不是 distortion 越大越好。

Glass 属于 Functional Layer：导航、按钮、segmented controls、Command Palette、range thumb 等；长文卡片通常保持 opaque content surface。

## 5. Ambient Field

`assets/js/ambient/` 使用一份粒子模拟状态驱动 WebGL2 / Canvas2D / Glass mirror。常用 API 通过 VPE facade 获取：

```js
VPE.ambient?.setMode('cloud');
VPE.ambient?.setDensity(0.7);
VPE.ambient?.pulse(element, 0.6, 220);
```

移动端/Reduced Motion 已有预算策略，Fork 不建议单独复制第二套粒子模拟。

## 6. Site Motion

`assets/js/motion/` 提供 spring、FLIP、number motion 和整站 choreography。

重要 invariant：**动画不得压缩真实可读内容。** Feature Matrix 从少卡片扩张到多卡片时立即采用自然高度；只有安全的多余空白收缩可以做 container-height animation。

不要引入 scroll hijacking；VPE 只读取原生滚动速度作为交互状态。

## 7. Feature Matrix

分类按钮：

```html
<button class="tab-btn" data-filter="frontend">Frontend</button>
```

卡片：

```html
<article class="feature-card" data-category="frontend">...</article>
```

Base filter 是可见状态的 source of truth；Shared Lens 和 FLIP 只增强视觉连续性。

## 8. Command Palette

业务搜索数据仍位于 `assets/js/main-base.js` 的 Search Index。Liquid Glass 只负责 Search → Palette geometry morph。

## 9. ROI / Range

保留原生 `<input type="range">`。它是真实 keyboard/touch/accessibility target；光学 Thumb 只是视觉层。

## 10. PWA 与版本

修改版本化 runtime 资源时必须同步：

```text
loader/import query
Service Worker precache key
module version（如适用）
CI expectation
```

详细规则见 `docs/VERSIONING.md`。不要只改文件内容却继续使用旧 query key。

## VPE Public API

新集成优先使用：

```js
VPE.version
VPE.glass
VPE.ambient
VPE.motion
VPE.ui
```

历史 `CursorLiquidGlass`、`CursorAmbientField`、`CursorProductUI` 等在 v1 继续作为 compatibility alias 保留。
