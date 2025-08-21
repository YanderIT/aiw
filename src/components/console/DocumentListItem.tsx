import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Document, DocumentType } from "@/models/document";
import { formatDocumentDate, getDocumentTypeDisplayName } from "@/services/document";

interface DocumentListItemProps {
  document: Document;
  onDelete?: (uuid: string) => void;
  onDownload?: (document: Document) => void;
  onClick?: (document: Document) => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  onDownload,
  onClick
}) => {
  const displayDate = formatDocumentDate(document.created_at || '');
  
  // 获取前两三行的内容预览
  const getContentPreview = (content: string | undefined, maxLength: number = 200) => {
    // 特殊处理留学咨询文档
    if (document.document_type === DocumentType.StudyAbroadConsultation && document.form_data) {
      const formData = document.form_data;
      const parts = [];
      
      if (formData.basicInfo?.full_name) {
        parts.push(`姓名: ${formData.basicInfo.full_name}`);
      }
      if (formData.targetProgram?.target_country) {
        parts.push(`目标国家: ${formData.targetProgram.target_country}`);
      }
      if (formData.targetProgram?.target_degree) {
        parts.push(`申请学位: ${formData.targetProgram.target_degree}`);
      }
      if (formData.consultationNeeds?.main_concerns) {
        parts.push(`关注点: ${formData.consultationNeeds.main_concerns}`);
      }
      
      const preview = parts.join(' | ');
      return preview.length > maxLength 
        ? preview.substring(0, maxLength) + "..."
        : preview;
    }
    
    // 特殊处理简历文档
    if (document.document_type === DocumentType.Resume && document.form_data) {
      const formData = document.form_data;
      const parts = [];
      
      // 添加模板名称
      const template = formData.template || formData.resumeData?.selectedTemplate;
      if (template) {
        const templateName = template === 'kakuna' ? 'Kakuna模板' : 
                           template === 'ditto' ? 'Ditto模板' : 
                           `${template}模板`;
        parts.push(templateName);
      }
      
      // 添加姓名
      if (formData.resumeData?.header?.full_name) {
        parts.push(`姓名: ${formData.resumeData.header.full_name}`);
      }
      
      // 添加教育信息
      if (formData.resumeData?.education?.school_name) {
        let eduInfo = formData.resumeData.education.school_name;
        if (formData.resumeData.education.degree) {
          eduInfo = `${eduInfo} - ${formData.resumeData.education.degree.split(' ')[0]}`;
        }
        parts.push(eduInfo);
      }
      
      // 添加位置信息
      if (formData.resumeData?.header?.city || formData.resumeData?.header?.country) {
        const location = [];
        if (formData.resumeData.header.city) location.push(formData.resumeData.header.city);
        if (formData.resumeData.header.country) location.push(formData.resumeData.header.country);
        if (location.length > 0) parts.push(location.join(', '));
      }
      
      const preview = parts.join(' | ');
      return preview.length > maxLength 
        ? preview.substring(0, maxLength) + "..."
        : preview;
    }
    
    if (!content) return "";
    const cleanContent = content.replace(/[#*`\[\]()]/g, '').trim();
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + "..."
      : cleanContent;
  };
  
  return (
    <div 
      className="group bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(document)}
    >
      <div className="p-6 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {/* 日期 */}
              <div className="text-sm text-gray-400 dark:text-gray-500 mb-1">
                {displayDate}
              </div>
              
              {/* 标题 */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {document.title || "未命名文档"}
              </h3>
              
              {/* 内容预览 */}
              <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
                {getContentPreview(document.content) || "暂无内容"}
              </p>
            </div>
          </div>
        </div>
        
        {/* 右侧信息和操作 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* 字数统计 - 留学咨询和简历不显示 */}
          {document.document_type !== DocumentType.StudyAbroadConsultation && document.document_type !== DocumentType.Resume && (
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {document.word_count || 0} 字
            </span>
          )}
          
          {/* 删除按钮 */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(document.uuid);
            }}
          >
            <Trash2 className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};