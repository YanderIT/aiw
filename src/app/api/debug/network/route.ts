import { NextRequest, NextResponse } from "next/server";

// 网络诊断API
export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    network_tests: {},
    environment: {},
    firebase_config: {}
  };

  // 测试网络连接
  const testUrls = [
    'https://www.google.com',
    'https://firebase.googleapis.com',
    'https://securetoken.googleapis.com',
    'https://identitytoolkit.googleapis.com'
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
    NODE_ENV: process.env.NODE_ENV,
    hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasFirebaseClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    hasFirebaseApiKey: !!process.env.FIREBASE_API_KEY,
    hasFirebaseAuthDomain: !!process.env.FIREBASE_AUTH_DOMAIN
  };

  // Firebase配置检查
  try {
    const { firebaseAdmin } = await import("@/lib/firebase-admin");
    diagnostics.firebase_config = {
      adminInitialized: !!firebaseAdmin,
      appName: firebaseAdmin.app().name,
      projectId: firebaseAdmin.app().options.projectId
    };
  } catch (error: any) {
    (diagnostics.firebase_config as any).error = error.message;
  }

  return NextResponse.json(diagnostics);
} 