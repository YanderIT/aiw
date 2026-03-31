import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { customAuth } from "@/lib/auth";
import { findDocumentByUuid, findDocumentVersions } from "@/models/document";
import { findUserByUuid } from "@/models/user";

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

    // Get all versions of the document
    const versions = await findDocumentVersions(uuid);
    
    // Sort versions by version number
    const sortedVersions = versions.sort((a, b) => a.version - b.version);
    
    // Transform versions data for frontend
    const transformedVersions = sortedVersions.map(v => ({
      uuid: v.uuid,
      content: v.content,
      version: v.version,
      version_type: v.version_type,
      revision_count: v.revision_count,
      created_at: v.created_at,
      updated_at: v.updated_at,
      word_count: v.word_count
    }));

    return NextResponse.json({ 
      success: true, 
      data: {
        versions: transformedVersions,
        total: transformedVersions.length
      }
    });
  } catch (error) {
    console.error("Error getting document versions:", error);
    return NextResponse.json(
      { error: "Failed to get document versions" },
      { status: 500 }
    );
  }
}