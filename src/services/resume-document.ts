import { Document, DocumentType, DocumentStatus, insertDocument, updateDocument, findDocumentByUuid } from "@/models/document";
import { v4 as uuidv4 } from 'uuid';

export interface ResumeFormData {
  resumeData: any; // Full resume data from ResumeContext
  template: string;
  themeColor: string;
  layoutConfiguration: {
    mainSections: string[];
    sidebarSections: string[];
  };
  moduleSelection: {
    header: boolean;
    education: boolean;
    workExperience: boolean;
    research: boolean;
    activities: boolean;
    awards: boolean;
    skillsLanguage: boolean;
  };
}

export async function createResumeDocument(
  userUuid: string,
  title: string,
  formData: ResumeFormData
): Promise<Document> {
  const document = await insertDocument({
    uuid: uuidv4(),
    user_uuid: userUuid,
    document_type: DocumentType.Resume,
    title: title || "未命名简历",
    description: `简历 - ${formData.template} 模板`,
    form_data: formData,
    content: "", // Will be populated when exported
    version: 1,
    version_type: "original" as any,
    revision_count: 0,
    status: DocumentStatus.Active,
    language: 'zh',
    ai_model: "resume-builder",
    generation_params: {
      template: formData.template,
      themeColor: formData.themeColor
    }
  });

  return document;
}

export async function updateResumeDocument(
  uuid: string,
  formData: Partial<ResumeFormData>,
  title?: string
): Promise<Document> {
  const updateData: Partial<Document> = {
    form_data: formData,
    updated_at: new Date().toISOString()
  };

  if (title) {
    updateData.title = title;
  }

  const updated = await updateDocument(uuid, updateData);
  return updated;
}

export async function getResumeDocument(uuid: string): Promise<Document | null> {
  const document = await findDocumentByUuid(uuid);
  
  if (!document || document.document_type !== DocumentType.Resume) {
    return null;
  }

  return document;
}

export async function saveResumeData(
  uuid: string,
  resumeData: any,
  template: string,
  themeColor: string,
  layoutConfiguration: any,
  moduleSelection: any
): Promise<Document> {
  const formData: ResumeFormData = {
    resumeData,
    template,
    themeColor,
    layoutConfiguration,
    moduleSelection
  };

  return await updateResumeDocument(uuid, formData);
}

// Generate a title based on resume data
export function generateResumeTitle(resumeData: any): string {
  const name = resumeData?.header?.full_name || "";
  const template = resumeData?.selectedTemplate || "简历";
  
  if (name) {
    return `${name}的简历`;
  }
  
  return `未命名简历 - ${new Date().toLocaleDateString('zh-CN')}`;
}