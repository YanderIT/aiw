import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { customAuth } from "@/lib/auth";
import { DifyService } from "@/services/dify";

export async function POST(request: Request) {
  try {
    console.log("[Revise Cover Letter API] Starting request");

    const session = await customAuth.api.getSession({ headers: await headers() });
    console.log("[Revise Cover Letter API] Session user:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("[Revise Cover Letter API] Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[Revise Cover Letter API] Request body:", JSON.stringify(body, null, 2));
    
    const difyService = new DifyService();

    // 调用 Dify API 进行润色
    console.log("[Revise Cover Letter API] Calling Dify service with function: revise-cover-letter");
    const result = await difyService.runWorkflow({
      inputs: body,
      response_mode: 'blocking',
      user: `revise-cover-letter-${session.user.email}`
    }, 'revise-cover-letter');

    console.log("[Revise Cover Letter API] Dify result:", JSON.stringify(result, null, 2));

    // 返回润色后的内容
    const revisedContent = result.data?.outputs?.text || "";
    console.log("[Revise Cover Letter API] Revised content length:", revisedContent.length);

    return NextResponse.json({ 
      success: true,
      content: revisedContent
    });
  } catch (error) {
    console.error("[Revise Cover Letter API] Error details:", error);
    console.error("[Revise Cover Letter API] Error stack:", error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: "Failed to revise cover letter content" },
      { status: 500 }
    );
  }
}