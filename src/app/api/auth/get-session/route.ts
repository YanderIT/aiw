import { NextRequest, NextResponse } from "next/server";
import { getCustomSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Debug: log cookies
    const cookieHeader = request.headers.get("cookie");
    console.log("[get-session] Cookie header:", cookieHeader);

    const session = await getCustomSession(request.headers);
    console.log("[get-session] Session result:", session ? "found" : "null");

    if (!session) {
      return NextResponse.json(null);
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json(null);
  }
}
