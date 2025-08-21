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
                  建议您返回修改输入的信息，重新生成求职信，这样不会消耗修改机会。
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-1.5 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-600 dark:text-green-400">如果您对生成的求职信整体满意，只需要润色调整</p>
                <p className="text-sm text-muted-foreground mt-1">
                  可以继续使用修改功能，对求职信进行风格调整、扩写或缩写。
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>温馨提示：</strong>修改机会仅有一次，请谨慎选择。
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBackToEdit}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回修改输入
          </Button>
          <Button
            onClick={onContinueRevision}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            继续修改求职信
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}