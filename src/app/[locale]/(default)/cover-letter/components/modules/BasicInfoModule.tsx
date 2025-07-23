"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, MapPin, Phone, Mail, Calendar, Building, Briefcase } from 'lucide-react';
import { useCoverLetter } from '../CoverLetterContext';

export default function BasicInfoModule() {
  const { data, updateBasicInfoData } = useCoverLetter();
  const formData = data.basicInfo;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的基本信息，确保招聘方能够联系到您。
        </p>
      </div>

      {/* Personal Information Form */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="space-y-8">
          {/* Full Name */}
          <div className="space-y-3">
            <Label htmlFor="full_name" className="flex items-center gap-2 text-base font-medium text-foreground">
              <User className="w-5 h-5" />
              申请人英文姓名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="例如：John Smith"
              value={formData.full_name}
              onChange={(e) => updateBasicInfoData({ full_name: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* Address */}
          <div className="space-y-3">
            <Label htmlFor="address" className="flex items-center gap-2 text-base font-medium text-foreground">
              <MapPin className="w-5 h-5" />
              通讯地址（可选）
            </Label>
            <Textarea
              id="address"
              placeholder="例如：123 Main Street, Apt 4B, New York, NY 10001"
              value={formData.address}
              onChange={(e) => updateBasicInfoData({ address: e.target.value })}
              className="min-h-20 text-lg"
              rows={3}
            />
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
                placeholder="john.smith@example.com"
                value={formData.email}
                onChange={(e) => updateBasicInfoData({ email: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Phone className="w-5 h-5" />
                电话号码（国际格式） <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="例如：+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateBasicInfoData({ phone: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-3">
            <Label htmlFor="date" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Calendar className="w-5 h-5" />
              写信日期 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateBasicInfoData({ date: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* Recruiter Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-foreground border-b border-border pb-2">
              招聘方信息（可选）
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="recruiter_name" className="flex items-center gap-2 text-base font-medium text-foreground">
                  <User className="w-5 h-5" />
                  招聘官姓名
                </Label>
                <Input
                  id="recruiter_name"
                  placeholder="例如：Sarah Johnson"
                  value={formData.recruiter_name}
                  onChange={(e) => updateBasicInfoData({ recruiter_name: e.target.value })}
                  className="h-14 text-lg"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="recruiter_title" className="flex items-center gap-2 text-base font-medium text-foreground">
                  <Briefcase className="w-5 h-5" />
                  招聘官职位
                </Label>
                <Input
                  id="recruiter_title"
                  placeholder="例如：HR Manager"
                  value={formData.recruiter_title}
                  onChange={(e) => updateBasicInfoData({ recruiter_title: e.target.value })}
                  className="h-14 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-foreground border-b border-border pb-2">
              公司信息
            </h4>
            
            <div className="space-y-3">
              <Label htmlFor="company_name" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Building className="w-5 h-5" />
                公司或机构名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company_name"
                placeholder="例如：Goldman Sachs"
                value={formData.company_name}
                onChange={(e) => updateBasicInfoData({ company_name: e.target.value })}
                className="h-14 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="company_address" className="flex items-center gap-2 text-base font-medium text-foreground">
                <MapPin className="w-5 h-5" />
                公司地址（可选）
              </Label>
              <Textarea
                id="company_address"
                placeholder="例如：200 West Street, New York, NY 10282"
                value={formData.company_address}
                onChange={(e) => updateBasicInfoData({ company_address: e.target.value })}
                className="min-h-20 text-lg"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 