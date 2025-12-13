import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DifyService } from "@/services/dify";

export async function POST(request: Request) {
  try {
    console.log("[Revise SOP API] Starting request");
    
    const session = await auth.api.getSession({ headers: await headers() });
    console.log("[Revise SOP API] Session user:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("[Revise SOP API] Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[Revise SOP API] Request body:", JSON.stringify(body, null, 2));
    
    const difyService = new DifyService();

    // 调用 Dify API 进行润色
    console.log("[Revise SOP API] Calling Dify service with function: revise-sop");
    const result = await difyService.runWorkflow({
      inputs: body,
      response_mode: 'blocking',
      user: `revise-sop-${session.user.email}`
    }, 'revise-sop');

    console.log("[Revise SOP API] Dify result:", JSON.stringify(result, null, 2));

    // 返回润色后的内容
    const revisedContent = result.data?.outputs?.text || "";
    console.log("[Revise SOP API] Revised content length:", revisedContent.length);

    return NextResponse.json({ 
      success: true,
      content: revisedContent
    });
  } catch (error) {
    console.error("[Revise SOP API] Error details:", error);
    console.error("[Revise SOP API] Error stack:", error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: "Failed to revise SOP content" },
      { status: 500 }
    );
  }
}