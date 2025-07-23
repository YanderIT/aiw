"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { User, MapPin, Phone, Mail, Linkedin, Github } from 'lucide-react';
import { useResume } from '../ResumeContext';

export default function HeaderModule() {
  const { data, updateHeaderData } = useResume();
  const formData = data.header;

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

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的基本信息和联系方式，确保雇主能够联系到您。
        </p>
      </div>

      {/* Photo Upload */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center space-x-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-medium text-foreground mb-3">
              为您的简历添加照片（可选）
            </h4>
            <Button variant="outline" className="mb-2 h-12 px-6 text-base">
              添加照片
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="space-y-8">
          {/* Full Name */}
          <div className="space-y-3">
            <Label htmlFor="full_name" className="flex items-center gap-2 text-base font-medium text-foreground">
              姓名（英文） <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="例如：Zhang San"
              value={formData.full_name}
              onChange={(e) => updateHeaderData({ full_name: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="city" className="flex items-center gap-2 text-base font-medium text-foreground">
                <MapPin className="w-5 h-5" />
                所在城市 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="例如：Beijing"
                value={formData.city}
                onChange={(e) => updateHeaderData({ city: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="country" className="flex items-center gap-2 text-base font-medium text-foreground">
                <MapPin className="w-5 h-5" />
                所在国家 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                placeholder="例如：China"
                value={formData.country}
                onChange={(e) => updateHeaderData({ country: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Mail className="w-5 h-5" />
                邮箱地址 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="zhangsan@example.com"
                value={formData.email}
                onChange={(e) => updateHeaderData({ email: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Phone className="w-5 h-5" />
                手机号（国际格式） <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="例如：+86 138 1234 5678"
                value={formData.phone}
                onChange={(e) => updateHeaderData({ phone: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>

          {/* Optional Fields Toggles */}
          <div>
            <Label className="text-lg font-medium mb-4 block text-foreground">可选信息</Label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => toggleOptionalField('linkedin')}
                className={`h-12 px-6 text-base ${showOptionalFields.linkedin ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => toggleOptionalField('github')}
                className={`h-12 px-6 text-base ${showOptionalFields.github ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Optional Fields Inputs */}
          {showOptionalFields.linkedin && (
            <div className="space-y-3">
              <Label htmlFor="linkedin" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Linkedin className="w-5 h-5" />
                LinkedIn 链接
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-muted-foreground text-lg">https://linkedin.com/in/</span>
                </div>
                <Input
                  id="linkedin"
                  placeholder="username"
                  value={formData.linkedin ? formData.linkedin.replace('https://linkedin.com/in/', '') : ''}
                  onChange={(e) => updateHeaderData({ linkedin: e.target.value ? `https://linkedin.com/in/${e.target.value}` : '' })}
                  className="h-14 text-lg pl-54"
                />
              </div>
            </div>
          )}

          {showOptionalFields.github && (
            <div className="space-y-3">
              <Label htmlFor="github" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Github className="w-5 h-5" />
                GitHub 链接
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-muted-foreground text-lg">https://github.com/</span>
                </div>
                <Input
                  id="github"
                  placeholder="username"
                  value={formData.github ? formData.github.replace('https://github.com/', '') : ''}
                  onChange={(e) => updateHeaderData({ github: e.target.value ? `https://github.com/${e.target.value}` : '' })}
                  className="h-14 text-lg pl-46"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 