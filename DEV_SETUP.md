# 开发环境设置指南

## 问题修复说明

已修复以下问题：
1. ✅ **404 错误** - API 路由未找到
2. ✅ **JSON 解析错误** - 响应体为空
3. ✅ **React Key 警告** - 重复的 `category_effects` key

## 本地开发步骤

### 1. 安装依赖
```bash
npm install
```

**注意：** 如果之前已经安装过依赖，请重新安装以获取新添加的 `dotenv` 包：
```bash
npm install
```

### 2. 配置环境变量
确保 `.env.local` 文件中配置了 Gemini API Key：
```
GEMINI_API_KEY=your_api_key_here
```

### 3. 启动开发服务器

**方式一：同时启动前端和 API 服务器（推荐）**
```bash
npm run dev:all
```

**方式二：分别启动**

终端 1 - 启动 API 服务器：
```bash
npm run dev:api
```

终端 2 - 启动前端开发服务器：
```bash
npm run dev
```

### 4. 访问应用
打开浏览器访问：http://localhost:5173

## 技术说明

### 修复内容

1. **Vite 代理配置** (`vite.config.ts`)
   - 添加了 `/api` 路由代理到 `http://localhost:3000`
   - 配置了友好的错误处理

2. **本地 API 服务器** (`server.js`)
   - 创建了 Node.js HTTP 服务器
   - 处理 `/api/gemini` 和 `/api/video` 请求
   - 支持 CORS 跨域请求

3. **React Key 修复** (`constants.ts`)
   - 将重复的 `category_effects` 改为 `category_artistic_effects`

4. **NPM 脚本** (`package.json`)
   - `dev:api` - 启动 API 服务器
   - `dev:all` - 同时启动前端和 API（使用 concurrently）

## 端口说明
- 前端：http://localhost:5173 (Vite)
- API：http://localhost:3000 (Node.js)

## 故障排查

### 如果仍然出现 404 错误
1. 确保 API 服务器正在运行（端口 3000）
2. 检查 `.env.local` 中的 API Key 是否正确配置
3. 查看终端输出的错误信息

### 如果出现 CORS 错误
- API 服务器已配置 CORS 头，应该不会出现此问题
- 如果仍有问题，检查浏览器控制台的具体错误信息
