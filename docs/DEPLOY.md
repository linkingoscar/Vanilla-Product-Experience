# 🌐 零构建静态部署指南 (Deployment Guide)

由于本项目是**纯原生、零构建依赖**（Vanilla HTML / CSS / JS）架构，你可以将其部署在全球任何静态托管平台，或者直接扔进任何 Nginx / Apache / S3 静态桶中。

---

## 平台一键部署推荐

### 1. GitHub Pages（最推荐）

1. 将代码推送到你的 GitHub 仓库；
2. 进入仓库 **Settings** → **Pages**；
3. 在 **Build and deployment** 下：
   * **Source** 选择 `Deploy from a branch`；
   * **Branch** 选择 `main` 分支，文件夹选择 `/ (root)`；
4. 点击 **Save**；
5. 等待 1~2 分钟，页面即可在 `https://<your-username>.github.io/<repo-name>/` 访问！

> 💡 **子路径兼容说明**：
> 本模板中的样式表、脚本、字体和中英文跨页面链接均采用了**相对路径**（例如 `assets/css/style.css` 与 `../assets/`），无论部署在根域名还是 GitHub Pages 的二级子目录下，均可完美自适应加载！

---

### 2. Vercel

1. 登录 [Vercel](https://vercel.com)；
2. 点击 **"Add New..."** → **"Project"**；
3. 导入你的 GitHub 仓库；
4. **Framework Preset** 选择 **"Other"**；
5. **Build and Output Settings** 全部保持默认为空；
6. 点击 **Deploy**，几秒内即可生成生产环境 HTTPS 域名。

---

### 3. Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)；
2. 进入 **Compute (Workers) & Pages** → **Create application** → **Pages**；
3. 连接你的 GitHub 仓库；
4. **Build settings**：
   * Framework preset: `None`
   * Build command: 留空
   * Build output directory: `.` (根目录)
5. 点击 **Save and Deploy**。

---

### 4. Netlify

1. 登录 [Netlify](https://netlify.com)；
2. 点击 **"Add new site"** → **"Import an existing project"**；
3. 选择 GitHub 仓库；
4. 构建命令留空，发布目录填写 `.`；
5. 点击 **Deploy site**。

---

## 部署后必须更新的生产 URL / SEO

Reference Demo 为了正确支持 GitHub Pages 项目子路径，`index.html`、`en/index.html` 与 `sitemap.xml` 使用了当前 VPE 的**绝对生产 URL**。Fork 后不要原样保留。

全局搜索：

```text
TEMPLATE:EDIT — Site Metadata & SEO
linkingoscar.github.io/Vanilla-Product-Experience
```

至少替换 canonical、hreflang、`og:url`、`og:image`、JSON-LD 与 `sitemap.xml`。详细规则见 [`SEO.md`](SEO.md)。

如果从 GitHub Pages 项目子路径迁移到自定义根域名，也要把这些 URL 从 `https://user.github.io/repo/` 改为最终域名。

---

## 本地开发与测试

无需安装任何 npm 包或前端依赖，以下任意命令均可启动本地实时预览服务器：

```bash
# Python 3 (推荐)
python -m http.server 8000

# Node.js npx
npx serve .

# PHP 内置服务器
php -S localhost:8000
```

启动后在浏览器打开 `http://localhost:8000` 即可实时预览修改。
