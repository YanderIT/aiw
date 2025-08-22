import { getSupabaseClient } from "./db";
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id?: number;
  uuid: string;
  user_uuid: string;
  document_type: DocumentType;
  title?: string;
  description?: string;
  form_data: any; // JSONB
  content: string;
  version: number;
  version_type: VersionType;
  parent_document_uuid?: string;
  revision_count: number;
  revision_settings?: any; // JSONB
  word_count?: number;
  language: string;
  status: DocumentStatus;
  ai_model?: string;
  ai_workflow_id?: string;
  generation_params?: any; // JSONB
  created_at?: string;
  updated_at?: string;
}

export enum DocumentType {
  RecommendationLetter = "recommendation_letter",
  Resume = "resume",
  CoverLetter = "cover_letter",
  SOP = "sop",
  PersonalStatement = "personal_statement",
  StudyAbroadConsultation = "study_abroad_consultation"
}

export enum VersionType {
  Original = "original",
  Revised = "revised"
}

export enum DocumentStatus {
  Active = "active",
  Deleted = "deleted",
  Draft = "draft"
}

export async function insertDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = getSupabaseClient();
  const documentWithDefaults = {
    ...document,
    uuid: document.uuid || uuidv4(),
    version: document.version || 1,
    version_type: document.version_type || VersionType.Original,
    revision_count: document.revision_count || 0,
    status: document.status || DocumentStatus.Active,
    language: document.language || 'zh',
    form_data: document.form_data || {},
    content: document.content || ''
  };

  const { data, error } = await supabase
    .from("documents")
    .insert(documentWithDefaults)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateDocument(uuid: string, updates: Partial<Document>) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("uuid", uuid)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function findDocumentByUuid(uuid: string): Promise<Document | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function findDocumentsByUser(
  user_uuid: string,
  document_type?: DocumentType,
  page: number = 1,
  limit: number = 10
): Promise<Document[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("documents")
    .select("*")
    .eq("user_uuid", user_uuid)
    .eq("status", DocumentStatus.Active)
    .order("created_at", { ascending: false });

  if (document_type) {
    query = query.eq("document_type", document_type);
  }

  const { data, error } = await query
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return [];
  }

  return data || [];
}

export async function getDocumentCount(user_uuid: string, document_type?: DocumentType): Promise<number> {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from("documents")
    .select("*", { count: 'exact', head: true })
    .eq("user_uuid", user_uuid)
    .eq("version", 1)
    .eq("status", DocumentStatus.Active);

  if (document_type) {
    query = query.eq("document_type", document_type);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error getting document count:", error);
    return 0;
  }

  return count || 0;
}

export async function findDocumentVersions(parent_document_uuid: string): Promise<Document[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .or(`uuid.eq.${parent_document_uuid},parent_document_uuid.eq.${parent_document_uuid}`)
    .order("version", { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

export async function createDocumentRevision(
  originalUuid: string,
  content: string,
  revision_settings?: any
): Promise<Document> {
  // First get the original document
  const original = await findDocumentByUuid(originalUuid);
  if (!original) {
    throw new Error("Original document not found");
  }

  // Get all versions to determine the next version number
  const versions = await findDocumentVersions(originalUuid);
  const maxVersion = Math.max(...versions.map(v => v.version));
  const revisionCount = versions.filter(v => v.version_type === VersionType.Revised).length;

  const revision: Omit<Document, 'id' | 'created_at' | 'updated_at'> = {
    uuid: uuidv4(),
    user_uuid: original.user_uuid,
    document_type: original.document_type,
    title: original.title ? `${original.title} (修订版)` : undefined,
    description: original.description,
    form_data: original.form_data,
    content: content,
    version: maxVersion + 1,
    version_type: VersionType.Revised,
    parent_document_uuid: original.parent_document_uuid || original.uuid,
    revision_count: revisionCount + 1,
    revision_settings: revision_settings,
    word_count: content.length,
    language: original.language,
    status: DocumentStatus.Active,
    ai_model: original.ai_model,
    generation_params: original.generation_params
  };

  return await insertDocument(revision);
}

export async function getDocumentRevisionCount(documentUuid: string): Promise<number> {
  const versions = await findDocumentVersions(documentUuid);
  return versions.filter(v => v.version_type === VersionType.Revised).length;
}

export async function hasUsedFreeRevision(user_uuid: string, document_type: DocumentType): Promise<boolean> {
  const documents = await findDocumentsByUser(user_uuid, document_type);
  
  // Check if any document has revisions
  for (const doc of documents) {
    const revisionCount = await getDocumentRevisionCount(doc.uuid);
    if (revisionCount > 0) {
      return true;
    }
  }
  
  return false;
}