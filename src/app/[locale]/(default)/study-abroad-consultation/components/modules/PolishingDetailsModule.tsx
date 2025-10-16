"use client";

import { useStudyAbroad } from "../StudyAbroadContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Mail, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function PolishingDetailsModule() {
  const { data, updatePolishingDetails } = useStudyAbroad();
  const [uploading, setUploading] = useState(false);

  // Ensure polishingDetails exists with default values
  const polishingDetails = data.polishingDetails || {
    uploaded_document_name: '',
    uploaded_document_url: '',
    polishing_requirements: '',
    return_method: '',
    return_email: '',
    return_wechat: ''
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('仅支持 PDF、DOCX 或 TXT 格式文件');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过 10MB');
      return;
    }

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('文件上传失败');
      }

      const result = await response.json();

      // Update context with file info
      updatePolishingDetails({
        uploaded_document_name: file.name,
        uploaded_document_url: result.url || file.name,
      });

      toast.success('文件上传成功');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('文件上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleReturnMethodChange = (value: string) => {
    updatePolishingDetails({
      return_method: value as 'email' | 'wechat',
      // Clear the other method's field when switching
      ...(value === 'email' ? { return_wechat: '' } : { return_email: '' })
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">文档上传</h3>
        <p className="text-sm text-muted-foreground">
          请上传需要润色的文档（支持 PDF、DOCX、TXT 格式，最大 10MB）
        </p>
      </div>

      {/* File Upload */}
      <Card className="p-6">
        <Label htmlFor="document-upload" className="block mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4" />
            <span>上传文档 *</span>
          </div>
        </Label>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <input
            id="document-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="document-upload" className="cursor-pointer">
            {polishingDetails.uploaded_document_name ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-foreground">{polishingDetails.uploaded_document_name}</p>
                  <p className="text-sm text-muted-foreground">点击重新上传</p>
                </div>
              </div>
            ) : (
              <div>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {uploading ? '上传中...' : '点击选择文件或拖拽文件到此处'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  支持 PDF、DOCX、TXT 格式，最大 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </Card>

      {/* Polishing Requirements */}
      <Card className="p-6">
        <Label htmlFor="polishing-requirements" className="mb-4 block">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            <span>润色要求 *</span>
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            请详细说明您的润色需求，如：语法检查、表达优化、风格调整等
          </span>
        </Label>
        <Textarea
          id="polishing-requirements"
          placeholder="例如：希望老师重点关注语法错误和表达流畅度，特别是第二段关于研究经历的部分需要重点润色..."
          value={polishingDetails.polishing_requirements}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updatePolishingDetails({ polishing_requirements: e.target.value })
          }
          rows={5}
          className="resize-none"
        />
      </Card>

      {/* Return Method */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-4 block">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4" />
                <span>返还方式 *</span>
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                请选择您希望接收润色后文档的方式
              </span>
            </Label>
          </div>

          <RadioGroup
            value={polishingDetails.return_method}
            onValueChange={handleReturnMethodChange}
            className="space-y-4"
          >
            {/* Email Option */}
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="email" id="return-email" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="return-email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">通过邮件返还</span>
                </Label>
                {polishingDetails.return_method === 'email' && (
                  <div className="mt-3">
                    <Input
                      type="email"
                      placeholder="请输入您的邮箱地址"
                      value={polishingDetails.return_email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updatePolishingDetails({ return_email: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* WeChat Option */}
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="wechat" id="return-wechat" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="return-wechat" className="flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">通过微信返还</span>
                </Label>
                {polishingDetails.return_method === 'wechat' && (
                  <div className="mt-3 space-y-3">
                    <Input
                      type="text"
                      placeholder="请输入您的微信号"
                      value={polishingDetails.return_wechat}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updatePolishingDetails({ return_wechat: e.target.value })
                      }
                      className="w-full"
                    />

                    {/* WeChat QR Code */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        请扫描下方二维码添加客服微信，润色完成后我们将通过微信发送给您
                      </p>
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <Image
                            src="/imgs/wechat-qr-placeholder.svg"
                            alt="WeChat QR Code"
                            width={200}
                            height={200}
                            className="rounded"
                          />
                          <p className="text-center text-xs text-muted-foreground mt-2">
                            扫码添加客服微信
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Tips */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">温馨提示</p>
          <ul className="list-disc list-inside space-y-1">
            <li>人工润色服务通常需要 2-3 个工作日完成</li>
            <li>我们的老师均为英语母语专业人士</li>
            <li>润色完成后会通过您选择的方式第一时间通知您</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
