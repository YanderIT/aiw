"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Document, VersionType } from "@/models/document";

interface VersionComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent?: string;
  revisedContent?: string;
  versions?: Document[];
  currentVersionId?: string | null;
}

export default function VersionComparison({
  isOpen,
  onClose,
  originalContent,
  revisedContent,
  versions = [],
  currentVersionId
}: VersionComparisonProps) {
  // 如果提供了版本列表，使用选择器模式
  const hasVersions = versions.length > 0;
  
  // 状态管理：选中的两个版本
  const [leftVersionId, setLeftVersionId] = useState<string>('');
  const [rightVersionId, setRightVersionId] = useState<string>('');
  
  // 初始化版本选择
  useEffect(() => {
    if (hasVersions && versions.length >= 2) {
      // 默认选择第一个版本（原始版本）和最后一个版本（最新版本）
      setLeftVersionId(versions[0].uuid);
      setRightVersionId(currentVersionId || versions[versions.length - 1].uuid);
    }
  }, [versions, currentVersionId, hasVersions]);
  
  // 获取选中版本的内容
  const getVersionContent = (versionId: string) => {
    const version = versions.find(v => v.uuid === versionId);
    return version?.content || '';
  };
  
  // 根据是否有版本列表，决定使用哪种内容
  const leftContent = hasVersions ? getVersionContent(leftVersionId) : (originalContent || '');
  const rightContent = hasVersions ? getVersionContent(rightVersionId) : (revisedContent || '');
  
  // 获取版本显示名称
  const getVersionDisplayName = (version: Document) => {
    let name = `版本 ${version.version}`;
    if (version.version_type === VersionType.Original) {
      name += ' (原始版本)';
    } else {
      name += ' (修订版本)';
    }
    if (version.revision_settings?.restored_from) {
      name += ' [恢复自历史]';
    }
    return name;
  };
  
  // 简单的文本差异高亮
  const highlightDifferences = (text1: string, text2: string) => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const result = [];
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        result.push({
          original: line1,
          revised: line2,
          changed: true
        });
      } else {
        result.push({
          original: line1,
          revised: line2,
          changed: false
        });
      }
    }
    
    return result;
  };
  
  const differences = highlightDifferences(leftContent, rightContent);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">版本对比</DialogTitle>
        </DialogHeader>
        
        {/* 版本选择器 - 仅在有版本列表时显示 */}
        {hasVersions && (
          <div className="flex items-center gap-4 mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 flex-1">
              <Label className="text-sm font-medium">对比版本：</Label>
              <Select
                value={leftVersionId}
                onValueChange={(value) => setLeftVersionId(value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="选择版本" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.uuid} value={version.uuid}>
                      {getVersionDisplayName(version)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <span className="text-muted-foreground">与</span>
            
            <div className="flex items-center gap-2 flex-1">
              <Select
                value={rightVersionId}
                onValueChange={(value) => setRightVersionId(value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="选择版本" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.uuid} value={version.uuid}>
                      {getVersionDisplayName(version)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-4 flex-1 overflow-hidden">
          {/* 左侧版本 */}
          <div className="border rounded-lg flex flex-col overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between flex-shrink-0">
              <Badge variant="outline">
                {hasVersions && leftVersionId
                  ? getVersionDisplayName(versions.find(v => v.uuid === leftVersionId)!)
                  : '原始版本'}
              </Badge>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div className="space-y-2">
                {differences.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      diff.changed ? 'bg-red-50 dark:bg-red-900/20' : ''
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {diff.original || <span className="text-muted-foreground">[空行]</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 右侧版本 */}
          <div className="border rounded-lg flex flex-col overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b flex-shrink-0">
              <Badge variant="secondary">
                {hasVersions && rightVersionId
                  ? getVersionDisplayName(versions.find(v => v.uuid === rightVersionId)!)
                  : '修改版本'}
              </Badge>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div className="space-y-2">
                {differences.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      diff.changed ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {diff.revised || <span className="text-muted-foreground">[空行]</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground flex-shrink-0">
          <p>• 红色背景表示左侧版本中被修改的内容</p>
          <p>• 绿色背景表示右侧版本中的新内容</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}