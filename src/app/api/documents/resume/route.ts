import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail } from "@/models/user";
import { createResumeDocument, updateResumeDocument, generateResumeTitle } from "@/services/resume-document";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { resumeData, template, themeColor, layoutConfiguration, moduleSelection, title } = body;

    // Generate title if not provided
    const documentTitle = title || generateResumeTitle(resumeData);

    // Create resume document
    const document = await createResumeDocument(
      user.uuid!,
      documentTitle,
      {
        resumeData,
        template,
        themeColor,
        layoutConfiguration,
        moduleSelection
      }
    );

    return NextResponse.json({ 
      success: true, 
      data: document 
    });
  } catch (error) {
    console.error("Error creating resume document:", error);
    return NextResponse.json(
      { error: "Failed to create resume document" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const { uuid, resumeData, template, themeColor, layoutConfiguration, moduleSelection, title } = body;

    if (!uuid) {
      return NextResponse.json({ error: "Document UUID is required" }, { status: 400 });
    }

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