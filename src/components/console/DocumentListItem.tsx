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
          {/* 字数统计 */}
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {document.word_count || 0} 字
          </span>
          
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