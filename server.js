import { createServer } from 'http';
import { parse } from 'url';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import geminiHandler from './api/gemini.ts';
import videoHandler from './api/video.ts';

// 加载 .env.local 文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env.local') });

const PORT = 3000;

const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (pathname === '/api/gemini') {
      // 将 Node.js 请求转换为 Web Request
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }

      const request = new Request(`http://localhost:${PORT}${pathname}`, {
        method: req.method,
        headers: Object.entries(req.headers).reduce((acc, [key, value]) => {
          if (value) acc[key] = Array.isArray(value) ? value[0] : value;
          return acc;
        }, {}),
        body: body || undefined,
      });

      const response = await geminiHandler(request);
      const responseBody = await response.text();

      res.writeHead(response.status, {
        'Content-Type': 'application/json',
      });
      res.end(responseBody);
    } else if (pathname === '/api/video') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }

      const request = new Request(`http://localhost:${PORT}${pathname}`, {
        method: req.method,
        headers: Object.entries(req.headers).reduce((acc, [key, value]) => {
          if (value) acc[key] = Array.isArray(value) ? value[0] : value;
          return acc;
        }, {}),
        body: body || undefined,
      });

      const response = await videoHandler(request);
      const responseBody = await response.text();

      res.writeHead(response.status, {
        'Content-Type': 'application/json',
      });
      res.end(responseBody);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }));
  }
});

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  - POST http://localhost:${PORT}/api/gemini`);
  console.log(`  - POST http://localhost:${PORT}/api/video`);
});
