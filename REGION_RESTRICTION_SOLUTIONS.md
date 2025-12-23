# Gemini API 地理位置限制解决方案

## 问题说明

错误信息：`User location is not supported for the API use`

这表示 Gemini API 检测到请求来自不支持的地理位置。Gemini API 目前仅在特定地区可用。

## 支持的地区

根据 Google 官方文档，Gemini API 目前支持以下地区：
- 美国
- 欧盟国家
- 英国
- 加拿大
- 澳大利亚
- 新西兰
- 日本
- 韩国
- 新加坡
- 等其他地区

**不支持的地区：** 中国大陆、俄罗斯等

详细信息：https://ai.google.dev/gemini-api/docs/available-regions

## 解决方案

### 方案 1：使用 VPN（开发测试）

**适用场景：** 本地开发和测试

**步骤：**
1. 连接到支持地区的 VPN（推荐美国、欧洲节点）
2. 确保 VPN 连接稳定
3. 重启开发服务器：
   ```bash
   npm run dev:all
   ```

**优点：** 简单快速，适合开发测试
**缺点：** 不适合生产环境，可能影响网络速度

---

### 方案 2：部署到云服务（推荐用于生产）

**适用场景：** 生产环境部署

#### 2.1 部署到 Vercel（推荐）

**步骤：**
1. 在 Vercel 上创建新项目
2. 连接 GitHub 仓库
3. 配置环境变量：
   - `GEMINI_API_KEY`: 你的 Gemini API Key
4. 部署

**优点：**
- 自动部署在支持地区的服务器
- 免费额度充足
- 自动 HTTPS
- 全球 CDN 加速

**Vercel 配置：**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

#### 2.2 部署到 Cloudflare Workers

**步骤：**
1. 安装 Wrangler CLI
2. 配置 `wrangler.toml`
3. 设置环境变量
4. 部署：`wrangler deploy`

**优点：**
- 边缘计算，速度快
- 免费额度大
- 全球分布

---

### 方案 3：使用代理服务器

**适用场景：** 需要自定义控制的场景

#### 3.1 设置 HTTP 代理

在 `server.js` 中配置代理：

```javascript
import { HttpsProxyAgent } from 'https-proxy-agent';

// 配置代理
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

// 在 fetch 请求中使用
const response = await fetch(url, {
  agent,
  // ... 其他配置
});
```

**环境变量配置（.env.local）：**
```
HTTP_PROXY=http://your-proxy-server:port
HTTPS_PROXY=http://your-proxy-server:port
```

#### 3.2 使用反向代理

通过 Nginx 或 Cloudflare 设置反向代理，将请求转发到支持地区的服务器。

---

### 方案 4：使用 Cloudflare Tunnel（高级）

**适用场景：** 需要保持本地开发环境但绕过地理限制

**步骤：**
1. 安装 Cloudflare Tunnel (cloudflared)
2. 创建 Tunnel
3. 配置路由规则
4. 启动 Tunnel

**优点：**
- 本地开发，全球访问
- 自动 HTTPS
- 无需修改代码

---

## 当前项目的优化

已在代码中添加了友好的错误提示：

```typescript
// api/gemini.ts
if (errorMessage.includes('User location is not supported')) {
  errorMessage = "⚠️ Gemini API is not available in your region. Please try one of the following solutions:\n\n" +
                "1. Use a VPN to connect from a supported region (US, EU, etc.)\n" +
                "2. Deploy this application to a cloud service in a supported region (Vercel, Cloudflare, etc.)\n" +
                "3. Use a proxy server in a supported location\n\n" +
                "Supported regions: https://ai.google.dev/gemini-api/docs/available-regions";
  statusCode = 451; // 451 Unavailable For Legal Reasons
}
```

当遇到地理位置限制时，前端会显示清晰的解决方案提示。

---

## 推荐方案总结

| 场景 | 推荐方案 | 难度 | 成本 |
|------|---------|------|------|
| 本地开发测试 | VPN | ⭐ | 免费/付费 |
| 生产环境 | Vercel 部署 | ⭐⭐ | 免费 |
| 企业级应用 | 云服务器 + 代理 | ⭐⭐⭐ | 付费 |
| 快速原型 | Cloudflare Workers | ⭐⭐ | 免费 |

---

## 注意事项

1. **API Key 安全：** 无论使用哪种方案，都要确保 API Key 不会暴露在前端代码中
2. **合规性：** 确保你的使用方式符合 Google 的服务条款
3. **性能：** 使用代理可能会增加延迟，建议选择地理位置较近的代理服务器
4. **稳定性：** 生产环境建议使用可靠的云服务提供商

---

## 快速开始（Vercel 部署）

1. Fork 或 Clone 项目到 GitHub
2. 访问 https://vercel.com
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 添加环境变量 `GEMINI_API_KEY`
6. 点击 "Deploy"
7. 等待部署完成，访问生成的 URL

部署完成后，应用将在支持 Gemini API 的地区运行，不再受地理位置限制。
