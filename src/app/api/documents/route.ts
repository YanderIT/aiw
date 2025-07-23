import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { insertDocument, updateDocument, findDocumentByUuid, DocumentType } from "@/models/document";
import { findUserByEmail } from "@/models/user";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { document_type, form_data, title, language } = body;

    // Create initial document with empty content
    const document = await insertDocument({
      user_uuid: user.uuid,
      document_type: document_type as DocumentType,
      title,
      form_data,
      content: "", // Will be updated after generation
      language: language || 'zh',
      version: 1,
      version_type: "original" as any,
      revision_count: 0,
      status: "active" as any
    });

    return NextResponse.json({ 
      success: true, 
      data: document 
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { uuid, content, ai_workflow_id, word_count } = body;

    // Verify document belongs to user
    const document = await findDocumentByUuid(uuid);
    if (!document || document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    // Update document with generated content
    const updated = await updateDocument(uuid, {
      content,
      ai_workflow_id,
      word_count: word_count || content.length
    });

    return NextResponse.json({ 
      success: true, 
      data: updated 
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}