import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Document, DocumentType } from "@/models/document";
import { formatDocumentDate, getDocumentTypeDisplayName } from "@/services/document";
import { 
  RecommendationLetterIcon, 
  CoverLetterIcon, 
  PersonalStatementIcon, 
  ResumeIcon, 
  SOPIcon,
  DocumentIcon 
} from "./icons/DocumentIcons";

interface DocumentCardProps {
  document: Document;
  onDelete?: (uuid: string) => void;
  onDownload?: (document: Document) => void;
  onClick?: (document: Document) => void;
}

const getDocumentIcon = (type: DocumentType) => {
  const iconMap: Record<DocumentType, React.ComponentType<{ className?: string }>> = {
    [DocumentType.RecommendationLetter]: RecommendationLetterIcon,
    [DocumentType.Resume]: ResumeIcon,
    [DocumentType.CoverLetter]: CoverLetterIcon,
    [DocumentType.SOP]: SOPIcon,
    [DocumentType.PersonalStatement]: PersonalStatementIcon,
  };
  
  return iconMap[type] || DocumentIcon;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onDownload,
  onClick
}) => {
  const Icon = getDocumentIcon(document.document_type);
  const displayDate = formatDocumentDate(document.created_at || '');
  
  // 获取前两三行的内容预览
  const getContentPreview = (content: string | undefined, maxLength: number = 120) => {
    if (!content) return "";
    const cleanContent = content.replace(/[#*`\[\]()]/g, '').trim();
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + "..."
      : cleanContent;
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden h-auto flex flex-col"
      onClick={() => onClick?.(document)}
    >
      <div className="p-4 flex-1 flex flex-col">
        {/* 日期 */}
        <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">
          {displayDate}
        </div>
        
        {/* 标题 */}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-1">
          {document.title || "未命名文档"}
        </h3>
        
        {/* 内容预览 - 3行 */}
        <p className="text-sm text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed">
          {getContentPreview(document.content) || "暂无内容"}
        </p>
      </div>
      
      {/* 分割线和底部操作区 */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-3">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* 字数统计 */}
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {document.word_count || 0} 字
          </span>
          
          {/* 删除按钮 */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(document.uuid);
            }}
          >
            <Trash2 className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
};