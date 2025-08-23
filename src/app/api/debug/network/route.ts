import { NextRequest, NextResponse } from "next/server";

// 网络诊断API
export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    network_tests: {},
    environment: {}
  };

  // 测试网络连接
  const testUrls = [
    'https://www.google.com'
  ];

  for (const url of testUrls) {
    try {
      const startTime = Date.now();
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(10000)
      });
      const endTime = Date.now();
      
      (diagnostics.network_tests as any)[url] = {
        success: response.ok,
        status: response.status,
        responseTime: endTime - startTime
      };
    } catch (error: any) {
      (diagnostics.network_tests as any)[url] = {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // 检查环境变量
  diagnostics.environment = {
    NODE_ENV: process.env.NODE_ENV
  };


  return NextResponse.json(diagnostics);
} 