import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 从环境变量获取API密钥
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { prompt, image, aspectRatio } = body;

    // 初始化GoogleGenAI客户端
    const ai = new GoogleGenAI({ apiKey });

    const request = {
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio
      },
      ...(image && {
        image: {
          imageBytes: image.base64,
          mimeType: image.mimeType
        }
      })
    };

    let operation = await ai.models.generateVideos(request);
    
    // 等待视频生成完成
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed during operation.");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation completed, but no download link was found.");
    }

    return new Response(
      JSON.stringify({ downloadLink }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error calling Video Generation API:", error);
    let errorMessage = "An unknown error occurred during video generation.";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      try {
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.error && parsedError.error.message) {
          errorMessage = parsedError.error.message;
        }
      } catch (e) {}
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
