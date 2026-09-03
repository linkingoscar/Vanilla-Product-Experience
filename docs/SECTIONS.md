# 🧩 页面模块与组件速查手册 (Sections & Architecture)

本文档详细列出了模板中每一个功能模块的 HTML ID、核心样式类名、JS 行为依赖，以及是否可安全删除。

---

## 模块清单总览

| 模块序号 | 模块名称 | HTML 容器 | 样式选择器 | JS 依赖 | 是否可直接删除 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Dynamic Island 灵动岛导航** | `header.island-header` | `.island`, `.island-nav` | 滚动进度监听、平滑滚动、中英切换 | ❌ 核心骨架（建议保留） |
| **02** | **Hero 首屏主视觉** | `section.hero` | `.hero-grid`, `.ide-window` | 无额外 JS，纯 CSS 动效 | ❌ 核心骨架（建议保留） |
| **03** | **Highlights 核心卖点便当盒** | `section#highlights` | `.bento-grid`, `.bento-card` | 无 | ✅ 可选 |
| **04** | **Feature Matrix 功能矩阵** | `section#new-features` | `.feature-grid`, `.feature-card` | 分类 Tab 点击即时过滤 | ✅ 可选 |
| **05** | **Deep Dive & Simulators** | `section#composer-25` | `.sim-grid`, `.calc-card` | 模拟器步进动效、ROI 计算器 | ✅ 可选 |
| **06** | **Media 影音与资料** | `section#media` | `.media-grid`, `.video-container`| iframe 懒加载 | ✅ 可选 |
| **07** | **Timeline 演进时间轴** | `section#timeline` | `.timeline`, `.timeline-item` | 滚动显现动画 | ✅ 可选 |
| **08** | **Pricing 定价卡片** | `section#pricing` | `.pricing-grid`, `.price-card` | 悬停发光动效 | ✅ 可选 |
| **09** | **Comparison 竞品横评表** | `section#compare` | `.table-responsive`, `.compare-table`| 滚动提示阴影 | ✅ 可选 |
| **10** | **Call-To-Action 转化引导** | `section#start` | `.start-card`, `.steps-list` | 无 | ✅ 可选 |
| **11** | **Footer 网站页脚** | `footer.site-footer` | `.footer-grid`, `.footer-links` | 主题切换器挂载 | ❌ 核心骨架（建议保留） |
| **12** | **Command Palette 搜索弹窗** | `div#cmdPalette` | `.cmd-backdrop`, `.cmd-modal` | 键盘监听、模糊匹配 | ✅ 可选 |

---

## 各模块深入说明

### 01. Dynamic Island 导航条
* **HTML 标记**：`<!-- TEMPLATE:CORE — Dynamic Island Header -->`
* **功能**：浮动胶囊导航条，随页面滚动自动增加毛玻璃背景并高亮当前所在的视口区块。自带 `⌘K` 搜索按钮与语言切换按钮。
* **删除影响**：不建议删除整条导航。如不需要多语言，可仅删除 `<a class="lang-badge">`；如不需要搜索，可仅删除 `<button class="island-search-btn">`。

### 02. Hero 首屏
* **HTML 标记**：`<!-- TEMPLATE:EDIT — Hero Section -->`
* **功能**：左侧为高冲击力标语、分类胶囊与操作按钮组；右侧为拟物化 macOS IDE 视窗，支持内嵌代码高亮与动态状态指示灯。
* **自定义**：右侧视窗不仅可放代码，也可替换为 `<img src="..." />` 产品截图或产品演示视频。

### 03. Bento Grid 卖点便当盒
* **HTML 标记**：`<!-- TEMPLATE:OPTIONAL START — Highlights Bento Grid -->`
* **功能**：采用现代 Apple / Vercel 风格的 Bento 错落网格布局，支持 1 列、2 列或全宽跨列展示核心卖点。
* **删除影响**：可安全删除。删除后只需在导航中去掉对应的 `<a href="#highlights">` 锚点即可。

### 04. Feature Matrix 功能矩阵
* **HTML 标记**：`<!-- TEMPLATE:OPTIONAL START — Feature Matrix -->`
* **功能**：支持 30+ 项特性的密集陈列，并支持 Tab 分类动态切换。
* **JS 交互**：当用户点击 `data-filter="xxx"` 的按钮时，JS 会自动为卡片切换 `.is-hidden` / `.is-visible` 样式，并伴有弹性过渡动效。

### 05. Interactive Simulators 交互式演练组件
* **HTML 标记**：`<!-- TEMPLATE:OPTIONAL START — Deep Dive & Simulators -->`
* **功能**：包含两个高转化组件：
  1. **多智能体协同模拟器**：支持点击“开始演示”，分步模拟流水线任务拆解；
  2. **ROI 成本测算器**：支持滑动条调整人数与代码量，实时计算成本节省金额。
* **删除影响**：如果不适用于你的产品，可整块删除。相关 JS 带有 `document.getElementById` 防空检测，删除后不会报错。

### 08. Pricing 定价表
* **HTML 标记**：`<!-- TEMPLATE:OPTIONAL START — Pricing -->`
* **功能**：支持 3~5 档分级订阅套餐卡片，中间卡片支持 `.is-featured` 高亮推荐与发光边框。

### 09. Comparison 竞品横评表
* **HTML 标记**：`<!-- TEMPLATE:OPTIONAL START — Comparison -->`
* **功能**：支持桌面端全功能对比、移动端横向滑动的响应式对比表格。支持 `✅`、`❌`、`部分支持` 等状态徽章。

### 12. Command Palette 全局快捷搜索面板 (⌘K)
* **HTML 标记**：`<!-- TEMPLATE:OPTIONAL START — Command Palette -->`
* **快捷键**：Mac 按 `⌘ + K`，Windows 按 `Ctrl + K` 随时唤出；按 `Esc` 或点击遮罩关闭。支持键盘上下键选择条目，按回车直接平滑滚动至对应锚点。
