import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail } from "@/models/user";
import { getDocumentDetail } from "@/services/document";
import { updateDocument, DocumentStatus } from "@/models/document";

interface RouteParams {
  params: Promise<{
    uuid: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      console.error("User not found for email:", session.user.email, "- forcing re-authentication");
      return NextResponse.json({ 
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const { uuid } = await params;
    const document = await getDocumentDetail(uuid);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify document belongs to user
    if (document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      console.error("User not found for email:", session.user.email, "- forcing re-authentication");
      return NextResponse.json({ 
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const { uuid } = await params;
    const document = await getDocumentDetail(uuid);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify document belongs to user
    if (document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Soft delete - update status to deleted
    await updateDocument(uuid, { status: DocumentStatus.Deleted });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}