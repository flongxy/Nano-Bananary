import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedContent } from '../types';

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
    const { base64ImageData, mimeType, prompt, maskBase64, secondaryImage } = body;

    // 初始化GoogleGenAI客户端
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [
      {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      },
    ];

    let fullPrompt = prompt;
    if (maskBase64) {
      parts.push({
        inlineData: {
          data: maskBase64,
          mimeType: 'image/png',
        },
      });
      fullPrompt = `Apply the following instruction only to the masked area of the image: "${prompt}". Preserve the unmasked area.`;
    }
    
    if (secondaryImage) {
      parts.push({
        inlineData: {
          data: secondaryImage.base64,
          mimeType: secondaryImage.mimeType,
        },
      });
    }

    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const result: GeneratedContent = { imageUrl: null, text: null };
    const responseParts = response.candidates?.[0]?.content?.parts;

    if (responseParts) {
      for (const part of responseParts) {
        if (part.text) {
          result.text = (result.text ? result.text + "\n" : "") + part.text;
        } else if (part.inlineData) {
          result.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (!result.imageUrl) {
      let errorMessage;
      if (result.text) {
        errorMessage = `The model responded: "${result.text}"`;
      } else {
        const finishReason = response.candidates?.[0]?.finishReason;
        const safetyRatings = response.candidates?.[0]?.safetyRatings;
        errorMessage = "The model did not return an image. It might have refused the request. Please try a different image or prompt.";
        
        if (finishReason === 'SAFETY') {
          const blockedCategories = safetyRatings?.filter(r => r.blocked).map(r => r.category).join(', ');
          errorMessage = `The request was blocked for safety reasons. Categories: ${blockedCategories || 'Unknown'}. Please modify your prompt or image.`;
        }
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "An unknown error occurred while communicating with the API.";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // 检查是否是地理位置限制错误
      if (errorMessage.includes('User location is not supported') ||
          errorMessage.includes('location is not supported')) {
        errorMessage = "⚠️ Gemini API is not available in your region. Please try one of the following solutions:\n\n" +
                      "1. Use a VPN to connect from a supported region (US, EU, etc.)\n" +
                      "2. Deploy this application to a cloud service in a supported region (Vercel, Cloudflare, etc.)\n" +
                      "3. Use a proxy server in a supported location\n\n" +
                      "Supported regions: https://ai.google.dev/gemini-api/docs/available-regions";
        statusCode = 451; // 451 Unavailable For Legal Reasons
      } else {
        try {
          const parsedError = JSON.parse(errorMessage);
          if (parsedError.error && parsedError.error.message) {
            if (parsedError.error.status === 'RESOURCE_EXHAUSTED') {
              errorMessage = "You've likely exceeded the request limit. Please wait a moment before trying again.";
              statusCode = 429;
            } else if (parsedError.error.code === 500 || parsedError.error.status === 'UNKNOWN') {
              errorMessage = "An unexpected server error occurred. This might be a temporary issue. Please try again in a few moments.";
            } else {
              errorMessage = parsedError.error.message;
            }
          }
        } catch (e) {
          // 如果不是 JSON 格式，保持原始错误消息
        }
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
