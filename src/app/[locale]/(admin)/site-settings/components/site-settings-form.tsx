"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

export default function SiteSettingsForm() {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings?key=wechat_qr_url");
      const result = await res.json();
      if (result.code === 0 && result.data?.value) {
        setQrUrl(result.data.value);
      }
    } catch (error: any) {
      console.error("加载设置失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("仅支持 PNG、JPG、WebP、GIF 格式");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("文件大小不能超过 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-qrcode", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.code === 0 && result.data?.url) {
        setQrUrl(result.data.url);
        toast.success("二维码上传成功");
      } else {
        toast.error(result.message || "上传失败");
      }
    } catch (error: any) {
      toast.error("上传失败");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>微信客服二维码</CardTitle>
              <CardDescription>
                上传微信客服二维码图片，用户在网站浮窗中可扫码联系
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="微信二维码"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">暂无二维码</p>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>上传新二维码</Label>
                <p className="text-xs text-muted-foreground">
                  支持 PNG、JPG、WebP、GIF 格式，最大 5MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleUpload}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploading ? "上传中..." : "选择图片"}
              </Button>

              {qrUrl && (
                <p className="text-xs text-muted-foreground break-all">
                  当前地址：{qrUrl}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
