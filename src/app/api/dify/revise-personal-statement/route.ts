import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { customAuth } from "@/lib/auth";
import { DifyService } from "@/services/dify";

export async function POST(request: Request) {
  try {
    console.log("[Revise PS API] Starting request");

    const session = await customAuth.api.getSession({ headers: await headers() });
    console.log("[Revise PS API] Session user:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("[Revise PS API] Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[Revise PS API] Request body:", JSON.stringify(body, null, 2));
    
    const difyService = new DifyService();

    // 调用 Dify API 进行润色
    console.log("[Revise PS API] Calling Dify service with function: revise-personal-statement");
    const result = await difyService.runWorkflow({
      inputs: body,
      response_mode: 'blocking',
      user: `revise-ps-${session.user.email}`
    }, 'revise-personal-statement');

    console.log("[Revise PS API] Dify result:", JSON.stringify(result, null, 2));

    // 返回润色后的内容
    const revisedContent = result.data?.outputs?.text || "";
    console.log("[Revise PS API] Revised content length:", revisedContent.length);

    return NextResponse.json({ 
      success: true,
      content: revisedContent
    });
  } catch (error) {
    console.error("[Revise PS API] Error details:", error);
    console.error("[Revise PS API] Error stack:", error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: "Failed to revise PS content" },
      { status: 500 }
    );
  }
}