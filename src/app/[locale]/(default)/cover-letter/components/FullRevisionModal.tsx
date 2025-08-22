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
  { value: 'professional', label: '更专业', labelEn: 'Professional' },
  { value: 'enthusiastic', label: '更热情', labelEn: 'Enthusiastic' },
  { value: 'confident', label: '更自信', labelEn: 'Confident' },
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
    if (isNaN(count) || count < 200 || count > 6000) {
      setErrors({ ...errors, wordCount: '请输入200-6000之间的数字' });
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">求职信修改设置</DialogTitle>
              <DialogDescription className="mt-1">
                选择您想要的修改风格和调整方式
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 风格选择 */}
          <div>
            <Label className="text-base mb-3 block">选择风格（最多3个）</Label>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleStyleToggle(style.value)}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    selectedStyles.includes(style.value)
                      ? 'border-2 border-primary bg-primary/10 text-primary font-medium'
                      : 'border border-muted-foreground/30 hover:border-muted-foreground/50'
                  } ${selectedStyles.length >= 3 && !selectedStyles.includes(style.value) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedStyles.length >= 3 && !selectedStyles.includes(style.value)}
                >
                  <div>{style.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{style.labelEn}</div>
                </button>
              ))}
            </div>
            {selectedStyles.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">已选择：</span>
                <div className="flex gap-2">
                  {selectedStyles.map((style) => {
                    const option = STYLE_OPTIONS.find(s => s.value === style);
                    return (
                      <Badge key={style} variant="secondary">
                        {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 字数控制 */}
          <div>
            <Label className="text-base mb-3 block">
              字数控制
              <span className="text-sm text-muted-foreground ml-2">当前字数：{currentWordCount}</span>
            </Label>
            <RadioGroup value={wordControl} onValueChange={(value: any) => setWordControl(value)}>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="keep" />
                  <span>保持原本长度</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="expand" />
                  <span>扩写（增加内容细节）</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="reduce" />
                  <span>缩写（精简内容）</span>
                </label>
              </div>
            </RadioGroup>

            {wordControl !== 'keep' && (
              <div className="mt-4">
                <Label htmlFor="targetWordCount" className="text-sm">
                  目标字数（200-6000）
                </Label>
                <Input
                  id="targetWordCount"
                  type="number"
                  value={targetWordCount}
                  onChange={(e) => {
                    setTargetWordCount(e.target.value);
                    if (e.target.value) {
                      validateWordCount(e.target.value);
                    }
                  }}
                  placeholder="请输入目标字数"
                  className={`mt-2 ${errors.wordCount ? 'border-red-500' : ''}`}
                  min="200"
                  max="6000"
                />
                {errors.wordCount && (
                  <p className="text-sm text-red-500 mt-1">{errors.wordCount}</p>
                )}
              </div>
            )}
          </div>

          {/* 补充方向 */}
          <div>
            <Label htmlFor="direction" className="text-base mb-2 block">
              补充修改方向（选填，30字内）
            </Label>
            <Textarea
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value.slice(0, 30))}
              placeholder="例如：强调技术能力，突出团队合作经验"
              className="min-h-[80px]"
              maxLength={30}
            />
            <span className="text-xs text-muted-foreground float-right mt-1">
              {direction.length}/30
            </span>
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>提示：</strong>选择的风格将影响求职信的语言表达和整体基调。建议根据目标公司文化和职位要求选择合适的风格。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStyles.length === 0}
            className="gap-2"
          >
            <Wand2 className="w-4 h-4" />
            开始修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}