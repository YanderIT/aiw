"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, MessageCircle } from 'lucide-react';
import { useStudyAbroad } from '../StudyAbroadContext';

export default function BasicInfoModule() {
  const { data, updateBasicInfo } = useStudyAbroad();
  const formData = data.basicInfo;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的基本信息，方便我们与您联系
        </p>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          基本信息
        </h4>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="full_name" className="flex items-center gap-2 text-base font-medium text-foreground">
              <User className="w-5 h-5" />
              姓名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="请输入您的真实姓名"
              value={formData.full_name}
              onChange={(e) => updateBasicInfo({ full_name: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Phone className="w-5 h-5" />
              手机号码 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="请输入您的手机号码"
              value={formData.phone}
              onChange={(e) => updateBasicInfo({ phone: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Mail className="w-5 h-5" />
              邮箱 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入您的邮箱地址"
              value={formData.email}
              onChange={(e) => updateBasicInfo({ email: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="wechat" className="flex items-center gap-2 text-base font-medium text-foreground">
              <MessageCircle className="w-5 h-5" />
              微信号
            </Label>
            <Input
              id="wechat"
              placeholder="请输入您的微信号（选填）"
              value={formData.wechat}
              onChange={(e) => updateBasicInfo({ wechat: e.target.value })}
              className="h-14 text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}