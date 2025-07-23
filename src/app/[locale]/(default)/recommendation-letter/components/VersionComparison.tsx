"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface VersionComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent: string;
  revisedContent: string;
}

export default function VersionComparison({
  isOpen,
  onClose,
  originalContent,
  revisedContent
}: VersionComparisonProps) {
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
  
  const differences = highlightDifferences(originalContent, revisedContent);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">版本对比</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4 overflow-hidden">
          {/* 原始版本 */}
          <div className="border rounded-lg">
            <div className="bg-muted px-4 py-2 border-b">
              <Badge variant="outline">原始版本</Badge>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {differences.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      diff.changed ? 'bg-red-50 dark:bg-red-900/20' : ''
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {diff.original || <span className="text-muted-foreground">[空行]</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 修改版本 */}
          <div className="border rounded-lg">
            <div className="bg-muted px-4 py-2 border-b">
              <Badge variant="secondary">修改版本</Badge>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {differences.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      diff.changed ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {diff.revised || <span className="text-muted-foreground">[空行]</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• 红色背景表示原始版本中被修改的内容</p>
          <p>• 绿色背景表示修改版本中的新内容</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}