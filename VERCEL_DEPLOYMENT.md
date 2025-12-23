# Vercel 一键部署指南

## ✅ 项目已配置完成，可以一键部署！

本项目已完全配置好 Vercel 部署所需的所有文件，可以直接部署。

---

## 🚀 快速部署步骤

### 方式一：通过 Vercel 网站部署（推荐）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 如果仓库不在列表中，点击 "Import Git Repository"

3. **配置环境变量**
   - 在 "Environment Variables" 部分添加：
     ```
     Name: GEMINI_API_KEY
     Value: 你的 Gemini API Key
     ```
   - 可以为不同环境（Production, Preview, Development）设置不同的值

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟完成部署
   - 部署成功后会获得一个 `.vercel.app` 域名

5. **访问应用**
   - 点击生成的链接访问你的应用
   - 应用将在支持 Gemini API 的地区运行

---

### 方式二：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   # 首次部署
   vercel
   
   # 生产环境部署
   vercel --prod
   ```

4. **设置环境变量**
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   然后输入你的 API Key

---

### 方式三：一键部署按钮

在你的 GitHub README 中添加以下按钮：

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO&env=GEMINI_API_KEY&envDescription=Gemini%20API%20Key%20from%20Google%20AI%20Studio&envLink=https://aistudio.google.com/app/apikey)
```

替换 `YOUR_USERNAME` 和 `YOUR_REPO` 为你的实际仓库信息。

---

## 📋 部署配置说明

### 已配置的文件

1. **`vercel.json`** - Vercel 部署配置
   - 前端构建配置（Vite）
   - API 路由配置
   - Serverless 函数配置

2. **`.vercelignore`** - 忽略不需要部署的文件
   - 开发文件（`server.js`）
   - 环境变量文件
   - 测试文件

3. **`package.json`** - 构建脚本
   - `build`: Vite 构建命令
   - 已包含所有必要依赖

### 部署架构

```
用户浏览器
    ↓
Vercel CDN (全球分发)
    ↓
├─ 静态文件 (React 前端)
└─ Serverless Functions
    ├─ /api/gemini (图片编辑)
    └─ /api/video (视频生成)
        ↓
    Gemini API
```

---

## 🔧 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `GEMINI_API_KEY` | Gemini API 密钥 | https://aistudio.google.com/app/apikey |

### 在 Vercel 中设置环境变量

1. 进入项目设置：Project → Settings → Environment Variables
2. 添加变量：
   - Name: `GEMINI_API_KEY`
   - Value: 你的 API Key
   - Environments: 选择 Production, Preview, Development
3. 点击 "Save"
4. 重新部署项目以应用新的环境变量

---

## 🌍 自定义域名（可选）

1. 进入项目设置：Project → Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

---

## 🔄 自动部署

Vercel 会自动监听 GitHub 仓库的变化：

- **Push to main/master**: 自动部署到生产环境
- **Pull Request**: 自动创建预览部署
- **Push to other branches**: 自动创建预览部署

每次部署都会获得一个唯一的 URL，方便测试。

---

## 📊 部署后的优势

✅ **解决地理位置限制**
- Vercel 服务器位于支持 Gemini API 的地区
- 无需 VPN 即可使用

✅ **全球 CDN 加速**
- 静态资源全球分发
- 访问速度快

✅ **自动 HTTPS**
- 免费 SSL 证书
- 安全连接

✅ **零配置扩展**
- 自动负载均衡
- 按需扩展

✅ **免费额度充足**
- 个人项目完全免费
- 100GB 带宽/月
- 无限部署次数

---

## 🐛 常见问题

### 1. 部署失败

**检查项：**
- 确保 `package.json` 中有 `build` 脚本
- 确保所有依赖都在 `dependencies` 或 `devDependencies` 中
- 查看 Vercel 部署日志获取详细错误信息

### 2. API 调用失败

**检查项：**
- 确认环境变量 `GEMINI_API_KEY` 已正确设置
- 确认 API Key 有效且未过期
- 查看 Vercel Functions 日志

### 3. 页面显示 404

**检查项：**
- 确认 `vercel.json` 中的路由配置正确
- 确认 `dist` 目录已正确生成
- 尝试重新部署

### 4. 环境变量不生效

**解决方法：**
- 修改环境变量后需要重新部署
- 在 Vercel Dashboard 中触发 "Redeploy"

---

## 📝 部署检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] 有有效的 Gemini API Key
- [ ] 已登录 Vercel 账号
- [ ] 已配置环境变量
- [ ] 本地测试通过

部署后验证：

- [ ] 网站可以正常访问
- [ ] 可以上传图片
- [ ] API 调用正常
- [ ] 图片生成功能正常
- [ ] 无控制台错误

---

## 🎉 部署成功！

部署完成后，你将获得：
- 一个公开的 URL（如 `https://your-project.vercel.app`）
- 自动 HTTPS 加密
- 全球 CDN 加速
- 自动部署更新

现在你的应用已经可以在全球任何地方访问，不受地理位置限制！

---

## 📚 更多资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Gemini API 文档](https://ai.google.dev/docs)
- [项目 GitHub 仓库](https://github.com/YOUR_USERNAME/YOUR_REPO)
