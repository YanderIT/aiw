"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { FileText, Wand2 } from "lucide-react";

interface FullRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: RevisionSettings) => void;
  currentWordCount: number;
}

export interface RevisionSettings {
  styles: string[];
  wordControl: 'keep' | 'expand' | 'reduce';
  targetWordCount?: number;
  direction: string;
}

const STYLE_OPTIONS = [
  { value: 'concise', label: '更精炼', labelEn: 'Concise' },
  { value: 'formal', label: '更正式', labelEn: 'Formal' },
  { value: 'logical', label: '更有逻辑', labelEn: 'Logical' },
  { value: 'emotional', label: '更感性', labelEn: 'Emotional' },
  { value: 'persuasive', label: '更有说服力', labelEn: 'Persuasive' },
  { value: 'academic', label: '更学术', labelEn: 'Academic' },
  { value: 'approachable', label: '更亲切', labelEn: 'Approachable' },
  { value: 'humanized', label: '更人性化', labelEn: 'Humanized' },
  { value: 'clarity', label: '更清晰', labelEn: 'Clarity' },
];

export default function FullRevisionModal({
  isOpen,
  onClose,
  onConfirm,
  currentWordCount
}: FullRevisionModalProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [wordControl, setWordControl] = useState<'keep' | 'expand' | 'reduce'>('keep');
  const [targetWordCount, setTargetWordCount] = useState<string>('');
  const [direction, setDirection] = useState('');
  const [errors, setErrors] = useState<{ wordCount?: string }>({});

  useEffect(() => {
    // 重置表单
    if (!isOpen) {
      setSelectedStyles([]);
      setWordControl('keep');
      setTargetWordCount('');
      setDirection('');
      setErrors({});
    }
  }, [isOpen]);

  const handleStyleToggle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      if (selectedStyles.length < 3) {
        setSelectedStyles([...selectedStyles, style]);
      }
    }
  };

  const validateWordCount = (value: string) => {
    const count = parseInt(value);
    if (isNaN(count) || count < 200 || count > 2000) {
      setErrors({ ...errors, wordCount: '请输入200-2000之间的数字' });
      return false;
    }
    setErrors({ ...errors, wordCount: undefined });
    return true;
  };

  const handleConfirm = () => {
    if (selectedStyles.length === 0) {
      return;
    }

    if (wordControl !== 'keep' && !validateWordCount(targetWordCount)) {
      return;
    }

    const settings: RevisionSettings = {
      styles: selectedStyles,
      wordControl,
      targetWordCount: wordControl !== 'keep' ? parseInt(targetWordCount) : undefined,
      direction
    };

    onConfirm(settings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">整篇重写设置</DialogTitle>
          </div>
          <DialogDescription>
            请选择您希望的修改方向，系统将根据您的选择优化整篇个人陈述
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 风格选择 */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              1. 选择风格（可选1-3项）
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleStyleToggle(style.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    selectedStyles.includes(style.value)
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-muted hover:border-muted-foreground/30'
                  } ${selectedStyles.length >= 3 && !selectedStyles.includes(style.value) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedStyles.length >= 3 && !selectedStyles.includes(style.value)}
                >
                  <div>{style.label}</div>
                  <div className="text-xs text-muted-foreground">{style.labelEn}</div>
                </button>
              ))}
            </div>
            {selectedStyles.length === 0 && (
              <p className="text-sm text-red-500 mt-2">请至少选择一种风格</p>
            )}
          </div>

          {/* 字数控制 */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              2. 控制字数
            </Label>
            <RadioGroup value={wordControl} onValueChange={(value: any) => setWordControl(value)}>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <RadioGroupItem value="keep" />
                  <span className="text-sm">保持原长度（当前约{currentWordCount}字）</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <RadioGroupItem value="expand" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">扩写至</span>
                    <Input
                      type="number"
                      min="200"
                      max="2000"
                      value={targetWordCount}
                      onChange={(e) => {
                        setTargetWordCount(e.target.value);
                        if (e.target.value) validateWordCount(e.target.value);
                      }}
                      onClick={() => setWordControl('expand')}
                      className="w-24 h-8"
                      placeholder="字数"
                    />
                    <span className="text-sm">字</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <RadioGroupItem value="reduce" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">缩写至</span>
                    <Input
                      type="number"
                      min="200"
                      max="2000"
                      value={targetWordCount}
                      onChange={(e) => {
                        setTargetWordCount(e.target.value);
                        if (e.target.value) validateWordCount(e.target.value);
                      }}
                      onClick={() => setWordControl('reduce')}
                      className="w-24 h-8"
                      placeholder="字数"
                    />
                    <span className="text-sm">字</span>
                  </div>
                </label>
              </div>
            </RadioGroup>
            {errors.wordCount && (
              <p className="text-sm text-red-500 mt-2">{errors.wordCount}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              限制输入范围 200-2000 字
            </p>
          </div>

          {/* 补充修改方向 */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              3. 补充修改方向（限30字）
            </Label>
            <Textarea
              value={direction}
              onChange={(e) => setDirection(e.target.value.slice(0, 30))}
              placeholder="例如：把项目过程写清楚一点、结尾更有总结感、想多写一点课程收获"
              className="min-h-[80px]"
              maxLength={30}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                只允许表达方式调整，不能修改具体经历或内容
              </p>
              <span className="text-xs text-muted-foreground">
                {direction.length}/30
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStyles.length === 0}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            开始生成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}