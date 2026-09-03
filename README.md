# Cursor 3.x 介绍页 & Static Product Landing Page Template

> 🖥️ 一个以 **Cursor 3.x** 为高质量示例内容的纯静态高颜值产品宣传页模板。  
> ⚡ **零框架、零打包构建**，Fork 后修改标记代码即可在 15 分钟内上线自己的 AI / SaaS 产品 Landing Page。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Responsive](https://img.shields.io/badge/Responsive-Design-38BDF8?logo=tailwindcss&logoColor=white)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-ARIA-005A9C?logo=w3c&logoColor=white)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)](https://vercel.com)

> 🌐 **[English Documentation](README.en.md)**

---

## 🧭 你可以怎么使用它？

### ① 作为 Cursor 3.x 深度知识库与选型指南
* 查看在线页面，系统了解 Cursor 从 1.x、2.0 到 3.10 / 4.0 时代的 **31 项前沿功能矩阵**；
* 体验**交互式多智能体演练器**、**年度 Token ROI 成本计算器**与 **14+ 维度竞品深度横评**。

### ② 作为开源产品 Landing Page 模版 (Fork & Rebrand)
* **无需安装 Node.js 或 npm**，双击 HTML 即可在浏览器实时预览；
* 代码内预置清晰的 `TEMPLATE:EDIT` 标记，**15 分钟**即可换上你自己的品牌、文案与主题色并上线。

---

## ⚡ 5 分钟极速上手 (Quickstart)

```text
Fork / Use this template → 全局搜索 TEMPLATE:EDIT → 替换品牌与功能 → 调整主题色 → 部署上线
```

1. **Fork 本仓库** 或点击右上角 **Use this template**；
2. 在代码编辑器中全局搜索 `TEMPLATE:EDIT`，修改你的网站标题、Logo、Hero 文案与功能列表；
3. 打开 `assets/css/style.css`，在顶部 `:root` 调整 `--blue` 主品牌色与暗色模式背景；
4. 替换 `assets/icons/` 中的 Favicon 与 App 图标；
5. 查看 [部署指南](docs/DEPLOY.md)，一键免费发布至 GitHub Pages、Vercel 或 Cloudflare Pages！

---

## 🧩 Fork 改造地图

| 核心文件 | 修改内容说明 | 必须修改？ |
| :--- | :--- | :---: |
| `index.html` | 品牌名、导航、Hero、功能卡片、定价表、SEO 元数据 | ✅ 必须 |
| `en/index.html` | 英文版对应内容（如仅做中文单语言站可直接删除此文件夹） | 可选 |
| `assets/css/style.css` | 顶部 Design Tokens（品牌主色 `--blue`、背景、字体、圆角） | 🎨 推荐 |
| `assets/js/main.js` | 搜索索引 `searchIndex`、可选模拟器数据 | 💡 视情况 |
| `assets/icons/` | Favicon、Logo 与 PWA 启动图标 | ✅ 必须 |
| `manifest.json` | Web App 名称、主题色与图标路径 | PWA 必须 |
| `sw.js` | 递增 `CACHE_NAME` 强制客户端更新离线缓存 | 部署更新时 |

> 💡 **搜索技巧**：在编辑器中全局搜索：
> * `TEMPLATE:EDIT`：需要替换的品牌、文案与配置项；
> * `TEMPLATE:OPTIONAL`：可以安全整块删除的可选模块（不影响其余页面功能）；
> * `DEMO:CURSOR`：当前属于 Cursor 专属的示例内容。

---

## 🏛️ 页面模块与组件清单

所有模块均经过无障碍（WCAG 2.2 AA）与高性能优化，每个模块均可独立保留或裁剪：

| 模块名称 | 容器标识 | Cursor Demo 中的内容 | Fork 后可用于 |
| :--- | :--- | :--- | :--- |
| **灵动岛导航** | `header.island-header` | 滚动进度监听、⌘K 搜索按钮、中英切换 | 产品导航、版本号与快速搜索 |
| **首屏主视觉** | `section.hero` | 产品核心标语、动态 macOS 视窗 | 核心卖点展示 + CTA 转化按钮 |
| **卖点便当盒** | `section#highlights` | Agents Window / Design Mode | 核心价值主张 Bento Grid 网格 |
| **功能矩阵** | `section#new-features` | 31 项前沿特性与分类 Tab 筛选 | 产品全功能矩阵与动态分类过滤 |
| **交互演示器** | `section#composer-25` | 多 Agent 协作模拟器、ROI 成本计算器 | 交互式 Demo / 价格换算器 |
| **影音与学习** | `section#media` | B 站 / YouTube 实操视频嵌入 | 视频演示 / 团队播客 / 文档直达 |
| **演进时间线** | `section#timeline` | Cursor 各代际大版本升级节点 | 产品发布历史 / 未来 Roadmap |
| **定价卡片** | `section#pricing` | Hobby / Pro / Ultra / Teams 方案 | SaaS 分级订阅计划卡片 |
| **竞品对比表** | `section#compare` | Cursor vs Copilot vs Claude Code | 14+ 维度竞品横向评测表格 |
| **转化号召** | `section#start` | 快速上手步骤指引 | 注册登录 / 快速开始引导 |
| **全局快捷搜索** | `div#cmdPalette` | ⌘K / Ctrl+K 极速无依赖模糊搜索面板 | 网站全局页面/功能快捷跳转 |

---

## 📚 二次开发详细文档

* 📖 **[二次开发换肤手册 (docs/CUSTOMIZE.md)](docs/CUSTOMIZE.md)**：一步一步带你完成文案替换、主题调色与模块配置。
* 🧩 **[模块依赖与安全删除指南 (docs/SECTIONS.md)](docs/SECTIONS.md)**：各模块的 HTML/CSS/JS 依赖关系及如何安全裁减。
* 🌐 **[多平台静态部署指南 (docs/DEPLOY.md)](docs/DEPLOY.md)**：GitHub Pages、Vercel、Cloudflare Pages、Netlify 与子路径兼容说明。

---

## 📋 本站 Demo 收录的 Cursor 3.x 全景

如果你是为学习 Cursor 而来，本站收录了截至 **2026 年 9 月** 的官方最新知识沉淀：

* **自托管与云端基础设施**：Self-hosted Machines（自建内网私有算力与团队池）、Computer Use（Linux/Mac 计算机原生界面操作）；
* **Origin 原生代码托管**：Cursor 自研 Git 托管平台，与 GitHub 实时双向无缝镜像，代码库内置 Web Agent；
* **31 项功能矩阵**：涵盖 Swarm 蜂群协同、Grok 4.6 模型（4 档思考深度）、JetBrains ACP 跨 IDE 插件、Sidecar 侧边栏实时预览等；
* **成本与决策**：自研 Composer 模型成本解析与团队年度 Token 预算测算工具；
* **客观横评**：涵盖代码生成、上下文上限、Agent 自动化、企业安全等 14 项对比维度。

---

## ⚖️ 免责声明 (Disclaimer)

1. **示例内容声明**：本仓库中涉及 Cursor 的商标、产品名称、特性介绍与定价方案仅作为模板的 **高质量展示示例 (Demo Content)**。Fork 本仓库用于自身产品时，请替换为你自己的产品内容。
2. **非官方关系**：本项目是由开源社区独立维护的社区项目，与 **Cursor / Anysphere, Inc.** 无官方隶属、赞助或背书关系。Cursor 相关商标归其各自所有者所有。

---

## 📄 开源许可证

本项目基于 [MIT 许可证](LICENSE) 开源。无论用于个人学习还是商业产品官网搭建，均可自由免费使用！

⭐ 如果这个项目或者模板对你有启发，欢迎点个 **Star** 支持！
