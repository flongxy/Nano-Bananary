/**
 * API路由功能测试
 * 这个测试文件用于验证API路由是否正常工作
 */

// 模拟API调用测试
async function testGeminiAPI() {
  console.log("Testing Gemini API endpoint...");
  
  try {
    // 这里只是示例，实际测试需要在Vercel环境中运行
    const mockImageData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64ImageData: mockImageData,
        mimeType: 'image/png',
        prompt: 'Test prompt',
        maskBase64: null,
        secondaryImage: null
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("Gemini API test passed:", result);
    } else {
      console.error("Gemini API test failed:", await response.text());
    }
  } catch (error) {
    console.error("Error testing Gemini API:", error);
  }
}

async function testVideoAPI() {
  console.log("Testing Video API endpoint...");
  
  try {
    const response = await fetch('/api/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Test video prompt',
        image: null,
        aspectRatio: '16:9'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("Video API test passed:", result);
    } else {
      console.error("Video API test failed:", await response.text());
    }
  } catch (error) {
    console.error("Error testing Video API:", error);
  }
}

// 运行测试
async function runTests() {
  console.log("Starting API tests...");
  await testGeminiAPI();
  await testVideoAPI();
  console.log("API tests completed.");
}

// 导出测试函数
export { testGeminiAPI, testVideoAPI, runTests };
