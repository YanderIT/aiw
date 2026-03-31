import { NextResponse } from "next/server";
import { getServerFetchProxyUrl, initServerFetchProxy } from "@/lib/server-fetch-proxy";

type NetworkTestResult = {
  success: boolean;
  status?: number;
  responseTime?: number;
  error?: string;
  code?: string;
};

async function testUrl(url: string): Promise<NetworkTestResult> {
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    const endTime = Date.now();

    return {
      success: response.ok || response.status < 400,
      status: response.status,
      responseTime: endTime - startTime,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "unknown error",
      code: error?.code,
    };
  }
}

export async function GET() {
  initServerFetchProxy();

  const diagnostics = {
    timestamp: new Date().toISOString(),
    network_tests: {} as Record<string, NetworkTestResult>,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL || "",
      AUTH_URL: process.env.AUTH_URL || "",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "",
      HTTP_PROXY: process.env.HTTP_PROXY ? "set" : "unset",
      HTTPS_PROXY: process.env.HTTPS_PROXY ? "set" : "unset",
      ALL_PROXY: process.env.ALL_PROXY ? "set" : "unset",
      NO_PROXY: process.env.NO_PROXY || "",
      EFFECTIVE_FETCH_PROXY: getServerFetchProxyUrl() || "direct",
    },
  };

  const testUrls = [
    "https://accounts.google.com",
    "https://oauth2.googleapis.com/token",
    "https://openidconnect.googleapis.com/v1/userinfo",
    "https://www.google.com",
  ];

  for (const url of testUrls) {
    diagnostics.network_tests[url] = await testUrl(url);
  }

  return NextResponse.json(diagnostics);
}
