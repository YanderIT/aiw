import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail } from "@/models/user";
import { getResumeDocument, updateResumeDocument } from "@/services/resume-document";
import { updateDocument, DocumentStatus } from "@/models/document";

interface RouteParams {
  params: Promise<{
    uuid: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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
    const document = await getResumeDocument(uuid);

    if (!document) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
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
    console.error("Error fetching resume document:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume document" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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
    const document = await getResumeDocument(uuid);

    if (!document) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Verify document belongs to user
    if (document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { resumeData, template, themeColor, layoutConfiguration, moduleSelection, title } = body;

    // Update resume document
    const updated = await updateResumeDocument(
      uuid,
      {
        resumeData,
        template,
        themeColor,
        layoutConfiguration,
        moduleSelection
      },
      title
    );

    return NextResponse.json({ 
      success: true, 
      data: updated 
    });
  } catch (error) {
    console.error("Error updating resume document:", error);
    return NextResponse.json(
      { error: "Failed to update resume document" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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
    const document = await getResumeDocument(uuid);

    if (!document) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Verify document belongs to user
    if (document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Soft delete - update status to deleted
    await updateDocument(uuid, { status: DocumentStatus.Deleted });

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting resume document:", error);
    return NextResponse.json(
      { error: "Failed to delete resume document" },
      { status: 500 }
    );
  }
}