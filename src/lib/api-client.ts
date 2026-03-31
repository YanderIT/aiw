import { authClient } from "@/lib/auth-client";

interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export async function apiRequest<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // 如果是 401 错误且错误代码是 SESSION_EXPIRED，自动退出登录
    if (response.status === 401 && data.code === "SESSION_EXPIRED") {
      console.log("Session expired, signing out...");
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/auth/signin";
          },
        },
      });
      throw new Error("Session expired");
    }

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message === "Session expired") {
      throw error;
    }
    console.error("API request failed:", error);
    throw error;
  }
}
