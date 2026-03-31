import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { customAuth } from "@/lib/auth";
import { createDocumentRevision, findDocumentByUuid, getDocumentRevisionCount } from "@/models/document";
import { findUserByUuid } from "@/models/user";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const session = await customAuth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByUuid(session.user.uuid!);
    if (!user) {
      return NextResponse.json({
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const { uuid } = await params;
    const body = await request.json();
    const { content, revision_settings } = body;

    // Verify document belongs to user
    const document = await findDocumentByUuid(uuid);
    if (!document || document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    // Check if user has already used their free revision
    const revisionCount = await getDocumentRevisionCount(uuid);
    if (revisionCount >= 1) {
      return NextResponse.json({ 
        error: "Free revision already used" 
      }, { status: 403 });
    }

    // Create revision
    const revision = await createDocumentRevision(uuid, content, revision_settings);

    return NextResponse.json({ 
      success: true, 
      data: revision 
    });
  } catch (error) {
    console.error("Error creating revision:", error);
    return NextResponse.json(
      { error: "Failed to create revision" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const session = await customAuth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByUuid(session.user.uuid!);
    if (!user) {
      return NextResponse.json({
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const { uuid } = await params;

    // Verify document belongs to user
    const document = await findDocumentByUuid(uuid);
    if (!document || document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    const revisionCount = await getDocumentRevisionCount(uuid);

    return NextResponse.json({ 
      success: true, 
      data: {
        revision_count: revisionCount,
        has_used_free_revision: revisionCount >= 1
      }
    });
  } catch (error) {
    console.error("Error getting revision info:", error);
    return NextResponse.json(
      { error: "Failed to get revision info" },
      { status: 500 }
    );
  }
}