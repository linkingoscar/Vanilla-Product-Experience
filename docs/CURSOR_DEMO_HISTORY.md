# Cursor Reference Demo — Historical Changelog

> Historical Cursor showcase/content releases from before Vanilla Product Experience adopted project-level semantic versioning. These entries describe the reference demo, not VPE releases.

# 修改日志

## [3.2.0] - 2026-09-04

### 新增

- **Cursor 9 月前沿生态板块 (September 2026)**
  - **Self-hosted Machines & Team Pools**：支持在企业自建网络/私有基础设施（AWS Lambda、Coder、Daytona 等）运行 Cloud Agent，源码与密钥不出内网；支持弹性机器池与自动休眠调度。
  - **Computer Use on Linux & Mac**：赋予 Agent 原生桌面 GUI 操控力（自主点击、输入、截屏与浏览器驱动），支持实时观看与人工远程接管。
  - **Cursor Origin Code Hosting**：全新原生 Git 代码托管系统，自带 Repos/PRs/Web 浏览，与 GitHub 实时双向同步，代码库内置 Web Agent。
  - **Start from scratch & Live Preview**：免 Git 仓库冷启动，随时一句话开启项目；浏览器实时端口转发直连预览，一键 Vercel 部署。
  - **Harness Subscriptions & /goal**：事件订阅机制（监听 PR/Slack 动态自动唤醒）、`/goal` 长线自主目标、子智能体独立 VM 沙箱。
- **开源落地页模板化改造（策略 C 转型）**
  - **模板模块化解耦**：在 `index.html` 与 `en/index.html` 中注入标准化的 `[TEMPLATE COMPONENT]` 区块标记。
  - **Design Tokens 二次开发指引**：在 `style.css` 头部增设 5 分钟换肤说明（主色、暗色/亮色表面、字体、阴影规范）。
  - **Command Palette 索引扩容**：⌘K / Ctrl+K 搜索面板收录最新 9 月前沿特性。

### 优化

- 功能矩阵从 26 项扩充至 31 项，同步精准校准各分类筛选 Tab 的计数。
- 版本演进时间线追加 **2026 年 9 月里程碑**（自托管算力、Origin 原生托管与 Harness 自治纪元）。
- 同步更新中英文 `README.md`，新增「开源产品 Landing Page 模版二次开发指南」。

---

## [3.1.0] - 2026-08-10

### 新增

- **3.9 功能板块 (August 05)**
  - Multi-agent Swarm 多智能体并行协作系统
  - Sandboxed Browser Action 内置沙盒浏览器联动与 UI 校验
- **3.8 功能板块 (July 08)**
  - Workspace Sidecar 侧边栏 Web 组件实时渲染与预览
  - Terminal Command Auto-Correction 终端命令智能纠错与补全
- **3.7 功能板块 (June 18)**
  - Deep Research Mode 深度研究模式（自动检索与架构分析）
  - Autonomous Debugger 自动排错调试与修复循环

### 优化

- 更新 Hero 区域与 SEO 元数据至 3.9 版本
- 更新版本演进时间线（新增 3.7 - 3.9 节点）
- 更新 14+ 维度竞品对比表格（加入 Multi-agent 协作、Deep Research、Sidecar 预览等最新指标）
- 升级 PWA Service Worker 缓存至 `cursor3-intro-v2`
- 修正 README 项目结构与功能板块说明

---

## [3.0.1] - 2026-06-07

### 变更

- **英文页新增 YouTube 视频板块**
  - 视频 1：Cursor 101（Cursor 官方频道）
  - 视频 2：Cursor Crash Course（Traversy Media）
  - 附官方文档链接面板
- **中文页文案重写**
  - 标题：~~大陆可用的视频与官方原文~~ → 「视频教程与官方资料」
  - 描述：从开发者注释风格改为面向普通用户的友好语气
  - 文档区标题/引导语同步优化
  - 页脚措辞软化，感谢社区创作者

### 修复

- 英文页视频嵌入 YouTube Error 153：替换为允许嵌入的视频源

---

## [3.0.0] - 2026-05-31

### 新增

- **3.6 功能板块 (May 29)**
  - Auto-review 智能审查模式
  - Composer 2.5 新模型

- **3.5 功能板块 (May 20)**
  - 共享画布 Shared Canvases
  - /loop 循环任务
  - Automations 自动化增强（多仓库/无仓库）
  - Cursor 集成 Jira
  - Cursor 集成 Microsoft Teams

- **3.4 功能板块 (May 13)**
  - 多仓库云环境
  - Dockerfile 构建密钥
  - 70% 更快重建（层缓存）
  - Agent 引导的凭据验证
  - 全屏标签页
  - 紧凑聊天响应

- **3.3 功能板块 (May 7)**
  - 统一 PR 审查体验
  - 并行构建 Build in Parallel
  - 拆分 PR Split into PRs
  - Quick-action pills
  - Bugbot 可配置审查深度

### 优化

- 更新 Hero 区域为 3.6 版本信息
- 更新版本演进时间线（新增 3.3-3.6 节点）
- 更新竞品对比表格（新增 Auto-review、第三方集成维度）
- 更新亮点速览（新增 Auto-review、/loop）
- 更新编辑器命令列表（新增 /loop、/multitask）
- 更新定价说明（Bugbot 改为按用量计费）
- 更新官方链接列表

---

## [2.0.0] - 2026-05-02

### 新增

- **新功能板块 (3.1-3.2)**
  - Canvases 可视化画布
  - /multitask 异步并行
  - 改进的 Worktrees
  - Multi-root 工作区
  - Cursor SDK (TypeScript)
  - Security Review 安全审查
  - Team Marketplace 团队插件市场
  - Bugbot 增强

- **定价方案板块**
  - Hobby (免费) / Pro ($20) / Pro+ ($60) / Ultra ($200)
  - Teams ($40/用户) / Enterprise (定制)
  - Bugbot Pro/Teams ($40/用户)

- **竞品对比扩展**
  - 从 6 维度扩展到 14 维度
  - 新增：Cloud Agent、SDK、安全审查、插件市场、Canvases、代码审查、定价、离线模型

- **亮点速览增强**
  - 每个卡片增加详细描述
  - Agents Window 增加特性列表
  - MCP 卡片增加插件类型说明

### 优化

- 修复对比表格边框缺角问题
- 优化 bento 卡片布局
- 更新 Hero 区域为 3.2 版本信息
- 更新导航栏（新增新功能、定价链接）

---

## [1.1.0] - 2026-05-02

### 新增

- 暗色模式支持（自动跟随系统 + 手动切换）
- 中英文双语支持
- Apple 风格滚动动画
- 返回顶部按钮
- PWA 离线支持
- 打印优化样式

---

## [1.0.0] - 初始版本

- Cursor 3.0 功能介绍页面
- 响应式布局
- SVG 对比图表
- B 站视频嵌入
- 版本演进时间线
- 竞品对比表格
