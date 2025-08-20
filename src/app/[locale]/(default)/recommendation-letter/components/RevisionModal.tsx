"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit3, ArrowLeft } from "lucide-react";

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueRevision: () => void;
  onBackToEdit: () => void;
}

export default function RevisionModal({ 
  isOpen, 
  onClose, 
  onContinueRevision, 
  onBackToEdit 
}: RevisionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-xl">修改前的重要提示</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-lg font-medium mb-2">您现在有一次免费的润色或重写机会。</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-1.5 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">如果您发现是输入信息时出现了问题</p>
                <p className="text-sm text-muted-foreground mt-1">
                  比如漏填了重要项目、经历填错、数据不准确等，建议返回输入页面重新生成（这会消耗一次生成次数）。
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-1.5 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-600 dark:text-green-400">如果只是希望让表达方式更好一些</p>
                <p className="text-sm text-muted-foreground mt-1">
                  比如写得更正式、更精炼、更有总结感，或者想扩写/缩写某段内容或整篇文章，您可以使用这次免费修改机会（不会扣除生成次数）。
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-medium">💡 提示：</span>
              本次修改不会覆盖原文书，系统将自动保存原始版本，方便您随时切换或对比查看两个版本的差异。
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={onBackToEdit}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回修改输入（消耗一次生成）
          </Button>
          <Button
            onClick={onContinueRevision}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            继续润色当前文档（免费修改一次）
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}