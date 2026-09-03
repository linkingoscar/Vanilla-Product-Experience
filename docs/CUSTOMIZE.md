# 🛠️ Landing Page 模板二次开发手册 (Customization Guide)

> 本指南将帮助你在 **15 分钟内** 将本模板改造为你自己的 AI 工具、SaaS 软件、CLI 项目或开源产品官方首页。
> 整个项目采用纯原生 HTML/CSS/JavaScript，**无需任何 Node.js、npm 或打包构建步骤**，修改后即可直接部署。

---

## ⚡ 极速起步 (5-Minute Quickstart)

1. **Fork 本仓库** 或点击 GitHub 的 **Use this template**；
2. 在代码编辑器中全局搜索：
   ```text
   TEMPLATE:EDIT
   ```
3. 按照标记依次替换你的：品牌名称、标语、Hero 文案、功能卡片、定价与外链；
4. 打开 `assets/css/style.css`，修改顶部 `:root` 中的主题主色（`--blue` 等）；
5. 替换 `assets/icons/` 下的 Favicon 和 Logo 图标；
6. 检查 `docs/DEPLOY.md`，一键部署到 GitHub Pages、Vercel 或 Cloudflare Pages！

---

## 📋 详细修改步骤

### 1. 修改网站元数据与 SEO (`index.html` & `en/index.html`)

在 `<head>` 中搜索 `TEMPLATE:EDIT — Site Metadata`：
```html
<title>你的产品名称 · 一句话定位标语</title>
<meta name="description" content="你的产品核心优势与解决的痛点描述（建议 150 字以内）" />

<!-- Open Graph 社交分享卡片 -->
<meta property="og:title" content="你的产品名称 · 标语" />
<meta property="og:description" content="你的产品描述" />
<meta property="og:image" content="assets/icons/og-image.png" />
```

### 2. 品牌与主题色换肤 (`assets/css/style.css`)

打开 `assets/css/style.css`，顶部就是经过精心调优的 **Design Tokens** 系统：

```css
/* TEMPLATE:EDIT — BRAND & THEME TOKENS */
:root {
  /* 品牌主色系：只需修改这三个变量即可完成全站主色换肤 */
  --blue: #0071e3;               /* 主品牌色 (按钮、激活态、重点链接) */
  --blue-hover: #0077ed;         /* 悬停微调色 */
  --blue-glow: rgba(0, 113, 227, 0.3); /* 发光投影色 */

  /* 辅助状态色（可选调整） */
  --emerald: #10b981;            /* 成功 / 推荐标签 */
  --amber: #f59e0b;              /* 警示 / Beta 标签 */
  --violet: #8b5cf6;             /* 次要点缀色 */

  /* 浅色模式背景与文字 */
  --bg-app: #fbfbfd;
  --bg-surface: #ffffff;
  --text-main: #1d1d1f;

  /* 字体规范 */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

/* 深色模式表面色 (根据品牌自由微调) */
[data-theme="dark"] {
  --bg-app: #08090e;
  --bg-surface: #11131b;
  --text-main: #f5f5f7;
}
```

### 3. 修改顶部导航栏 (`header.island-header`)

搜索 `TEMPLATE:EDIT — Dynamic Island Header`：
* 修改品牌 Logo 与版本号：
  ```html
  <span class="logo-mark">⚡</span>
  <span>MyProduct <span class="logo-ver">1.0</span></span>
  ```
* 导航链接锚点：根据你保留的模块修改 `<nav class="island-nav">` 中的链接（如 `#features`, `#pricing`, `#faq`）。
* 如果是单语言站点，可以直接删除 `.lang-badge`（中英切换胶囊）。

### 4. 首屏主视觉区 (`section.hero`)

搜索 `TEMPLATE:EDIT — Hero Section`：
* **Eyebrow（顶部胶囊提示）**：放最新发版动态、融资消息或重要公告；
* **主标题 `<h1>`**：建议采用短小精悍的强动词句式（例如 `新一代代码分析引擎`，配合 `<span class="hero-title-gradient">秒级定位故障</span>` 实现渐变质感）；
* **Lead 副文本**：用 2~3 句话说明产品适合谁、怎么工作；
* **CTA 按钮组**：修改主操作按钮（`立即开始`、`免费试用` 或 `GitHub Star`）；
* **右侧拟物视窗 (`.ide-window`)**：展示产品核心代码、终端命令截图或产品交互动图。

### 5. 功能矩阵卡片 (`section#new-features`)

搜索 `TEMPLATE:EDIT — Feature Matrix`：
* 筛选分类 Tab：可根据你的产品维度自由修改 `data-filter`（例如 `frontend`, `backend`, `cloud` 等）；
* 功能卡片 `<article class="feature-card">`：
  * `data-category`：对应上面的分类 key；
  * `span.feature-version`：标识 `v1.2`、`Beta` 或 `Pro`；
  * `h3` 与 `p`：功能名称与要点；
  * `svg`：根据语义替换为对应的 SVG 图标。

### 6. 删除不适用的模块 (Safe Removal)

本模板所有独立模块均带安全边界标记：
* `TEMPLATE:OPTIONAL START — [模块名]`
* `TEMPLATE:OPTIONAL END — [模块名]`

例如：
* **没有定价策略？** 直接删除 `<!-- TEMPLATE:OPTIONAL START — Pricing -->` 到 `<!-- TEMPLATE:OPTIONAL END — Pricing -->`；
* **不需要竞品横评？** 直接删除 `<!-- TEMPLATE:OPTIONAL START — Comparison -->` 到 `<!-- TEMPLATE:OPTIONAL END — Comparison -->`；
* **不需要交互模拟器？** 直接删除对应的 Playground 区块。

> 💡 **放心删除**：底层 JavaScript 脚本对所有可选模块均做了 `if (el)` 防空保护，删掉 HTML 绝不会引发控制台报错。

### 7. 定制全局搜索 (Command Palette, ⌘K / Ctrl+K)

打开 `assets/js/main.js`，搜索 `TEMPLATE:EDIT — Search index`：
修改 `searchIndex` 数组，将标题、分类与跳转锚点替换为你产品的内容：

```javascript
const searchIndex = [
  { title: "安装与快速上手", cat: "入门", target: "#quickstart" },
  { title: "云端协作方案", cat: "核心特性", target: "#features" },
  { title: "团队版订阅与价格", cat: "定价", target: "#pricing" }
];
```

### 8. PWA 与离线配置 (`manifest.json` & `sw.js`)

* **`manifest.json`**：
  * 将 `"name"` 和 `"short_name"` 修改为你的产品名称；
  * 替换 `"icons"` 为你自己的图标尺寸。
* **`sw.js`**：
  * 搜索 `TEMPLATE:EDIT — Cache Name`：每当线上更新静态资源时，递增 `const CACHE_NAME = 'myproduct-v1';` 即可强制客户端更新缓存。

---

## ✅ 部署前自检清单 (Pre-Flight Checklist)

- [ ] 网页 `<title>` 和 `<meta description>` 是否已替换？
- [ ] 社交分享 `og:image` 是否更换为自己产品的缩略图？
- [ ] 顶部导航条与底部页脚的链接是否已指向自己的官网 / GitHub / 文档？
- [ ] 主题色 `--blue` 是否已匹配产品品牌 VI？
- [ ] `manifest.json` 中的产品名称与图标是否已更换？
- [ ] 尝试按下 `⌘K`（Mac）或 `Ctrl+K`（Windows），搜索弹窗中的关键词是否匹配你的新功能？
- [ ] 切换暗色模式与亮色模式，确认颜色对比度是否舒服？
- [ ] 在手机浏览器中测试响应式折叠排版是否正常？
