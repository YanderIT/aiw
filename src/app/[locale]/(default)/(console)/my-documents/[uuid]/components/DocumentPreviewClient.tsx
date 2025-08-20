"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  GitCompare,
  History,
  RotateCcw
} from "lucide-react";
import { Document, DocumentType, VersionType } from "@/models/document";
import { getDocumentTypeDisplayName, formatDocumentDate } from "@/services/document";
import { toast } from "sonner";
import Markdown from "@/components/markdown";
import VersionComparison from "@/app/[locale]/(default)/recommendation-letter/components/VersionComparison";
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
import { 
  RecommendationLetterIcon, 
  CoverLetterIcon, 
  PersonalStatementIcon, 
  ResumeIcon, 
  SOPIcon,
  DocumentIcon 
} from "@/components/console/icons/DocumentIcons";

interface DocumentPreviewClientProps {
  documentUuid: string;
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

export default function DocumentPreviewClient({ documentUuid }: DocumentPreviewClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 版本历史相关状态
  const [versions, setVersions] = useState<Document[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<Document | null>(null);
  const [restoringVersion, setRestoringVersion] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [documentUuid]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentUuid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      const data = await response.json();
      if (data.success) {
        setDocument(data.data);
        // 获取文档后，加载版本历史
        fetchVersions();
      } else {
        throw new Error(data.error || 'Failed to fetch document');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('无法加载文档');
      toast.error("获取文档详情失败");
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    setLoadingVersions(true);
    try {
      const response = await fetch(`/api/documents/${documentUuid}/versions`);
      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }
      const data = await response.json();
      if (data.success && data.data.versions) {
        setVersions(data.data.versions);
        // 设置当前版本为最新版本
        if (data.data.versions.length > 0) {
          const latestVersion = data.data.versions[data.data.versions.length - 1];
          setCurrentVersionId(latestVersion.uuid);
        }
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast.error("获取版本历史失败");
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleCopy = async () => {
    if (!document?.content) return;
    
    try {
      await navigator.clipboard.writeText(document.content);
      toast.success("已复制到剪贴板");
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error("复制失败");
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    const element = window.document.createElement("a");
    const file = new Blob([document.content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${document.title || '文档'}.md`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
    toast.success("下载成功");
  };

  const handleVersionChange = (versionId: string) => {
    setCurrentVersionId(versionId);
    const selectedVersion = versions.find(v => v.uuid === versionId);
    if (selectedVersion) {
      setDocument(selectedVersion);
    }
  };

  const handleRestoreClick = () => {
    const currentVersion = versions.find(v => v.uuid === currentVersionId);
    if (currentVersion) {
      setVersionToRestore(currentVersion);
      setShowRestoreDialog(true);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!versionToRestore || !document) return;
    
    setRestoringVersion(true);
    try {
      const response = await fetch(`/api/documents/${document.parent_document_uuid || documentUuid}/revisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: versionToRestore.content,
          revision_settings: {
            restored_from: versionToRestore.uuid,
            restored_version: versionToRestore.version,
            restore_timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to restore version');
      }

      const { data: newVersion } = await response.json();
      
      toast.success("版本恢复成功");
      setShowRestoreDialog(false);
      
      // 重新加载版本历史
      await fetchVersions();
      
      // 切换到新恢复的版本
      if (newVersion.uuid) {
        setCurrentVersionId(newVersion.uuid);
        setDocument(newVersion);
      }
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast.error(error.message || "版本恢复失败");
    } finally {
      setRestoringVersion(false);
    }
  };

  // 获取当前显示的内容
  const displayContent = document?.content || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{error || "文档不存在"}</h3>
          <Button 
            variant="outline" 
            onClick={() => router.push('/my-documents')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回文档列表
          </Button>
        </div>
      </div>
    );
  }

  const Icon = getDocumentIcon(document.document_type);

  // 简历类型暂不支持预览
  if (document.document_type === DocumentType.Resume) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/my-documents')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回文档列表
          </Button>

          <Card className="text-center py-12">
            <CardContent>
              <ResumeIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">简历预览功能开发中</h3>
              <p className="text-muted-foreground">
                简历文档的预览功能正在开发中，敬请期待
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/my-documents')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回文档列表
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              复制
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              下载
            </Button>
          </div>
        </div>

        {/* 文档信息卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Icon className="w-8 h-8 text-primary mt-1" />
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {document.title || "未命名文档"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {getDocumentTypeDisplayName(document.document_type)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDocumentDate(document.created_at || '')}
                    </span>
                    {document.word_count && (
                      <Badge variant="secondary">
                        {document.word_count} 字
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 版本控制 */}
        {versions.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <History className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">版本历史</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">当前版本：</Label>
                  <select
                    value={currentVersionId || ''}
                    onChange={(e) => handleVersionChange(e.target.value)}
                    className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                    disabled={loadingVersions}
                  >
                    {versions.map((version) => (
                      <option key={version.uuid} value={version.uuid}>
                        版本 {version.version} - {version.version_type === VersionType.Original ? '原始版本' : `修订版本`}
                        {version.revision_settings?.restored_from && ' (恢复自历史版本)'}
                      </option>
                    ))}
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVersionComparison(true)}
                    disabled={loadingVersions}
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    版本对比
                  </Button>

                  {currentVersionId !== versions[versions.length - 1]?.uuid && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestoreClick}
                      disabled={loadingVersions || restoringVersion}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      恢复此版本
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* 文档内容 */}
        <Card>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">
            <Markdown content={displayContent} />
          </CardContent>
        </Card>
      </div>

      {/* 版本对比弹窗 */}
      {showVersionComparison && versions.length > 1 && (
        <VersionComparison
          isOpen={showVersionComparison}
          onClose={() => setShowVersionComparison(false)}
          versions={versions}
          currentVersionId={currentVersionId}
        />
      )}

      {/* 版本恢复确认对话框 */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认恢复版本</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要恢复到版本 {versionToRestore?.version} 吗？
              <br />
              这将创建一个新版本，当前版本不会被覆盖。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoringVersion}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              disabled={restoringVersion}
            >
              {restoringVersion ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  恢复中...
                </>
              ) : (
                '确认恢复'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}