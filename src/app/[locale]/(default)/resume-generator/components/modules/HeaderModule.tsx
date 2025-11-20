"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { User, MapPin, Phone, Mail, Linkedin, Github, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { useResume } from '../ResumeContext';
import { toast } from 'sonner';
import Image from 'next/image';

export default function HeaderModule() {
  const { data, updateHeaderData } = useResume();
  const formData = data.header;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [showOptionalFields, setShowOptionalFields] = useState({
    linkedin: false,
    github: false
  });

  const toggleOptionalField = (field: 'linkedin' | 'github') => {
    setShowOptionalFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    
    // 客户端验证
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('请上传 JPG、PNG 或 WebP 格式的图片');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('图片大小不能超过 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '上传失败');
      }

      // 更新头像数据
      updateHeaderData({
        profilePicture: {
          url: result.data.url,
          key: result.data.key
        }
      });

      toast.success('头像上传成功');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : '上传失败，请重试');
      toast.error('头像上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!formData.profilePicture) return;

    try {
      // 调用删除 API
      const response = await fetch(`/api/upload/avatar?key=${encodeURIComponent(formData.profilePicture.key)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 清除头像数据
      updateHeaderData({ profilePicture: undefined });
      toast.success('头像已删除');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('删除失败，请重试');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xs">
          请填写您的基本信息和联系方式，确保雇主能够联系到您。
        </p>
      </div>

      {/* Photo Upload */}
      <div className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex flex-col xl:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group">
              {formData.profilePicture ? (
                <>
                  <Image
                    src={formData.profilePicture.url}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemovePhoto}
                      className="h-6 px-2 text-[10px]"
                    >
                      <X className="w-3 h-3 mr-0.5" />
                      删除
                    </Button>
                  </div>
                </>
              ) : (
                <User className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="flex-1 text-center xl:text-left">
            <h4 className="text-xs font-medium text-foreground mb-2">
              为您的简历添加照片（可选）
            </h4>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="h-8 px-3 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 mr-1.5" />
                    {formData.profilePicture ? '更换照片' : '添加照片'}
                  </>
                )}
              </Button>
              
              {uploadError && (
                <div className="flex items-center gap-1.5 text-[10px] text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  {uploadError}
                </div>
              )}
              
              <p className="text-[10px] text-muted-foreground">
                支持 JPG、PNG、WebP 格式，最大 5MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2 text-xs font-medium text-foreground">
              姓名（英文） <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="例如：Zhang San"
              value={formData.full_name}
              onChange={(e) => updateHeaderData({ full_name: e.target.value })}
              className="h-10 text-xs bg-white dark:bg-white"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2 text-xs font-medium text-foreground">
                <MapPin className="w-3 h-3" />
                所在城市 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="例如：Beijing"
                value={formData.city}
                onChange={(e) => updateHeaderData({ city: e.target.value })}
                className="h-10 text-xs bg-white dark:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-xs font-medium text-foreground">
                <MapPin className="w-3 h-3" />
                所在国家 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                placeholder="例如：China"
                value={formData.country}
                onChange={(e) => updateHeaderData({ country: e.target.value })}
                className="h-10 text-xs bg-white dark:bg-white"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Mail className="w-3 h-3" />
                邮箱地址 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="zhangsan@example.com"
                value={formData.email}
                onChange={(e) => updateHeaderData({ email: e.target.value })}
                className="h-10 text-xs bg-white dark:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Phone className="w-3 h-3" />
                手机号（国际格式） <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="例如：+86 138 1234 5678"
                value={formData.phone}
                onChange={(e) => updateHeaderData({ phone: e.target.value })}
                className="h-10 text-xs bg-white dark:bg-white"
              />
            </div>
          </div>

          {/* Optional Fields Toggles */}
          <div>
            <Label className="text-xs font-medium mb-3 block text-foreground">可选信息</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleOptionalField('linkedin')}
                className={`h-8 px-3 text-xs ${showOptionalFields.linkedin ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              >
                <Linkedin className="w-3 h-3 mr-1.5" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleOptionalField('github')}
                className={`h-8 px-3 text-xs ${showOptionalFields.github ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              >
                <Github className="w-3 h-3 mr-1.5" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Optional Fields Inputs */}
          {showOptionalFields.linkedin && (
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Linkedin className="w-3 h-3" />
                LinkedIn 链接
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <span className="text-muted-foreground text-[10px]">linkedin.com/in/</span>
                </div>
                <Input
                  id="linkedin"
                  placeholder="username"
                  value={formData.linkedin ? formData.linkedin.replace('https://linkedin.com/in/', '') : ''}
                  onChange={(e) => updateHeaderData({ linkedin: e.target.value ? `https://linkedin.com/in/${e.target.value}` : '' })}
                  className="h-10 text-xs pl-24 bg-white dark:bg-white"
                />
              </div>
            </div>
          )}

          {showOptionalFields.github && (
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Github className="w-3 h-3" />
                GitHub 链接
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <span className="text-muted-foreground text-[10px]">github.com/</span>
                </div>
                <Input
                  id="github"
                  placeholder="username"
                  value={formData.github ? formData.github.replace('https://github.com/', '') : ''}
                  onChange={(e) => updateHeaderData({ github: e.target.value ? `https://github.com/${e.target.value}` : '' })}
                  className="h-10 text-xs pl-20 bg-white dark:bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 