"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Calendar } from "lucide-react";
import { DocumentCard } from "@/components/console/DocumentCard";
import { DocumentListItem } from "@/components/console/DocumentListItem";
import { Document, DocumentType } from "@/models/document";
import { formatDocumentDate } from "@/services/document";
import { toast } from "sonner";
import { DocumentIcon } from "@/components/console/icons/DocumentIcons";
import { GridLayoutIcon, ListLayoutIcon } from "@/components/console/icons/LayoutIcons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyDocumentsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [layoutType, setLayoutType] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 获取文档列表
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data.documents);
        setFilteredDocuments(data.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error("获取文档列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // 搜索文档
  useEffect(() => {
    if (searchQuery) {
      const filtered = documents.filter(doc => 
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchQuery, documents]);

  // 根据日期分组文档
  const todayDocuments = filteredDocuments.filter(doc => {
    const displayDate = formatDocumentDate(doc.created_at || '');
    return displayDate === '今天';
  });
  const olderDocuments = filteredDocuments.filter(doc => {
    const displayDate = formatDocumentDate(doc.created_at || '');
    return displayDate !== '今天';
  });

  // 处理文档点击
  const handleDocumentClick = (document: Document) => {
    // 如果是简历文档，跳转到简历编辑页面
    if (document.document_type === DocumentType.Resume) {
      router.push(`/resume-generator/edit/${document.uuid}`);
    } else if (document.document_type === DocumentType.StudyAbroadConsultation) {
      // 留学咨询文档跳转到结果页面
      router.push(`/study-abroad-consultation/result/${document.uuid}`);
    } else {
      router.push(`/my-documents/${document.uuid}`);
    }
  };

  // 处理文档下载
  const handleDocumentDownload = async (document: Document) => {
    // 这里可以实现文档下载逻辑
    toast.info("文档下载功能即将上线");
  };

  // 处理文档删除
  const handleDocumentDelete = async (uuid: string) => {
    setDocumentToDelete(uuid);
    setDeleteDialogOpen(true);
  };

  // 确认删除文档
  const confirmDelete = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/documents/${documentToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      const data = await response.json();
      if (data.success) {
        // 从列表中移除已删除的文档
        setDocuments(documents.filter(doc => doc.uuid !== documentToDelete));
        setFilteredDocuments(filteredDocuments.filter(doc => doc.uuid !== documentToDelete));
        toast.success("文档已删除");
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("删除文档失败");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("my_documents.title")}
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2">管理您的所有文档</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <Button 
                variant={layoutType === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                className="p-2"
                onClick={() => setLayoutType("grid")}
              >
                <GridLayoutIcon className="w-4 h-4" />
              </Button>
              <Button 
                variant={layoutType === "list" ? "secondary" : "ghost"} 
                size="sm" 
                className="p-2"
                onClick={() => setLayoutType("list")}
              >
                <ListLayoutIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Search and New Button Container */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="搜索文档..."
                  className="pl-10 pr-4 py-2 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

 
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        )}

        {/* Today Section */}
        {!loading && todayDocuments.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              今天
            </h2>
            {layoutType === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.uuid}
                    document={doc}
                    onClick={handleDocumentClick}
                    onDownload={handleDocumentDownload}
                    onDelete={handleDocumentDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {todayDocuments.map((doc) => (
                  <DocumentListItem
                    key={doc.uuid}
                    document={doc}
                    onClick={handleDocumentClick}
                    onDownload={handleDocumentDownload}
                    onDelete={handleDocumentDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Older Documents Section */}
        {!loading && olderDocuments.length > 0 && (
          <div>
            {layoutType === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {olderDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.uuid}
                    document={doc}
                    onClick={handleDocumentClick}
                    onDownload={handleDocumentDownload}
                    onDelete={handleDocumentDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {olderDocuments.map((doc) => (
                  <DocumentListItem
                    key={doc.uuid}
                    document={doc}
                    onClick={handleDocumentClick}
                    onDownload={handleDocumentDownload}
                    onDelete={handleDocumentDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDocuments.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <DocumentIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              {searchQuery ? "没有找到匹配的文档" : "还没有文档"}
            </h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 px-4">
              {searchQuery ? "尝试其他搜索词" : "创建您的第一个文档开始使用"}
            </p>
            {/* {!searchQuery && (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                新建文档
              </Button>
            )} */}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个文档吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 