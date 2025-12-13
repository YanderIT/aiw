import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { insertDocument, updateDocument, findDocumentByUuid, DocumentType } from "@/models/document";
import { findUserByEmail, findUserByUuid } from "@/models/user";
import { getUserDocuments } from "@/services/document";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    
    if (!user) {
      // 如果找不到用户，返回 401 状态码，触发前端重新登录
      console.error("User not found for email:", session.user.email, "- forcing re-authentication");
      return NextResponse.json({ 
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const body = await request.json();
    const { document_type, form_data, title, language } = body;

    // Create initial document with empty content
    const document = await insertDocument({
      uuid: uuidv4(),
      user_uuid: user.uuid!,
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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      // 如果找不到用户，返回 401 状态码，触发前端重新登录
      console.error("User not found for email:", session.user.email, "- forcing re-authentication");
      return NextResponse.json({ 
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const body = await request.json();
    const { uuid, content, ai_workflow_id, word_count } = body;

    // Verify document belongs to user
    const document = await findDocumentByUuid(uuid);
    if (!document || document.user_uuid !== user.uuid) {
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    // Update document with generated content (preserve version_type and other metadata)
    const updated = await updateDocument(uuid, {
      content,
      ai_workflow_id,
      word_count: word_count || content.length
      // Explicitly NOT updating: version_type, version, revision_count
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      // 如果找不到用户，返回 401 状态码，触发前端重新登录
      console.error("User not found for email:", session.user.email, "- forcing re-authentication");
      return NextResponse.json({ 
        error: "Session expired, please sign in again",
        code: "SESSION_EXPIRED"
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const document_type = searchParams.get('document_type') as DocumentType | undefined;

    const result = await getUserDocuments(user.uuid!, {
      page,
      limit,
      search,
      document_type
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}