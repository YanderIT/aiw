import { Document, DocumentType, findDocumentsByUser, findDocumentByUuid, getDocumentCount } from "@/models/document";

export interface DocumentListParams {
  page?: number;
  limit?: number;
  search?: string;
  document_type?: DocumentType;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

export async function getUserDocuments(
  userUuid: string,
  params: DocumentListParams = {}
): Promise<DocumentListResponse> {
  const { page = 1, limit = 10, document_type } = params;
  
  // Get total count from database
  const totalCount = await getDocumentCount(userUuid, document_type);
  
  // Get documents from model
  const documents = await findDocumentsByUser(userUuid, document_type, page, limit);
  
  // If search is provided, filter documents
  let filteredDocuments = documents;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredDocuments = documents.filter(doc => 
      doc.title?.toLowerCase().includes(searchLower) ||
      doc.description?.toLowerCase().includes(searchLower) ||
      doc.content?.toLowerCase().includes(searchLower)
    );
  }
  
  return {
    documents: filteredDocuments,
    total: params.search ? filteredDocuments.length : totalCount,
    page,
    limit
  };
}

export async function getDocumentDetail(uuid: string): Promise<Document | null> {
  const document = await findDocumentByUuid(uuid);
  return document || null;
}

export function getDocumentTypeDisplayName(type: DocumentType): string {
  const typeMap: Record<DocumentType, string> = {
    [DocumentType.RecommendationLetter]: "推荐信",
    [DocumentType.Resume]: "简历",
    [DocumentType.CoverLetter]: "求职信",
    [DocumentType.SOP]: "SOP",
    [DocumentType.PersonalStatement]: "个人陈述",
    [DocumentType.StudyAbroadConsultation]: "留学咨询"
  };
  
  return typeMap[type] || "文档";
}

export function formatDocumentDate(date: string): string {
  const docDate = new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - docDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "今天";
  } else if (diffDays === 1) {
    return "昨天";
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    const month = docDate.getMonth() + 1;
    const day = docDate.getDate();
    return `${month}月${day}日`;
  }
}