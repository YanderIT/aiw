"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, Phone, Mail, MessageCircle, User, GraduationCap, Target, Trophy, HelpCircle, ArrowLeft, FileText } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api-client';

interface StudyAbroadResultClientProps {
  documentUuid: string;
}

export default function StudyAbroadResultClient({ documentUuid }: StudyAbroadResultClientProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'zh';
  const [documentData, setDocumentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { data } = await apiRequest(`/api/documents/${documentUuid}`);
        if (data) {
          setDocumentData(data);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('加载咨询信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentUuid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">正在加载咨询信息...</p>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">未找到咨询信息</p>
          <Button 
            onClick={() => router.push(`/${locale}/study-abroad-consultation`)}
            className="mt-4"
          >
            返回重新填写
          </Button>
        </div>
      </div>
    );
  }

  const formData = documentData.form_data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">咨询申请已提交成功！</h1>
          <p className="text-muted-foreground text-lg">
            我们的留学顾问将在24小时内与您联系
          </p>
        </div>

        <Card className="p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">后续流程</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">1</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">顾问审核</h3>
                <p className="text-sm text-muted-foreground">专业顾问将审核您的信息，匹配最适合的服务方案</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">初步沟通</h3>
                <p className="text-sm text-muted-foreground">顾问将通过电话或微信与您进行初步沟通，了解详细需求</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">定制方案</h3>
                <p className="text-sm text-muted-foreground">根据您的背景和目标，制定个性化的留学申请方案</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">您提交的信息</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                基本信息
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">姓名：</span>
                  <span>{formData.basicInfo?.full_name || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">电话：</span>
                  <span>{formData.basicInfo?.phone || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">邮箱：</span>
                  <span>{formData.basicInfo?.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">微信：</span>
                  <span>{formData.basicInfo?.wechat || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                文档润色
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">上传文档：</span>
                  <span>{formData.polishingDetails?.uploaded_document_name || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">润色要求：</span>
                  <p className="mt-1 text-foreground bg-muted/30 p-3 rounded-lg">
                    {formData.polishingDetails?.polishing_requirements || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">返还方式：</span>
                  <div className="mt-2">
                    {formData.polishingDetails?.return_method === 'email' && (
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>邮件返还</span>
                        <span className="ml-2 text-blue-600">{formData.polishingDetails?.return_email}</span>
                      </div>
                    )}
                    {formData.polishingDetails?.return_method === 'wechat' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          <span>微信返还</span>
                          <span className="ml-2 text-green-600">{formData.polishingDetails?.return_wechat}</span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-3">
                            请添加客服微信，润色完成后我们将通过微信发送给您
                          </p>
                          <div className="flex justify-center">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <Image
                                src="/imgs/wechat-qr-placeholder.svg"
                                alt="WeChat QR Code"
                                width={150}
                                height={150}
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
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                学术背景
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">当前学历：</span>
                  <span className="ml-2">{formData.academicBackground?.current_degree || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">学校：</span>
                  <span className="ml-2">{formData.academicBackground?.current_school || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">专业：</span>
                  <span className="ml-2">{formData.academicBackground?.major || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">GPA：</span>
                  <span className="ml-2">{formData.academicBackground?.gpa || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                申请目标
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">目标学位：</span>
                  <span className="ml-2">{formData.targetProgram?.target_degree || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">目标国家/地区：</span>
                  <span className="ml-2">{formData.targetProgram?.target_country || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">目标专业：</span>
                  <span className="ml-2">{formData.targetProgram?.target_major || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">目标院校：</span>
                  <span className="ml-2">{formData.targetProgram?.target_schools || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">申请时间：</span>
                  <span className="ml-2">{formData.targetProgram?.application_year || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                咨询需求
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">主要关注：</span>
                  <p className="mt-1 text-foreground">{formData.consultationNeeds?.main_concerns || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">服务期望：</span>
                  <p className="mt-1 text-foreground">{formData.consultationNeeds?.service_expectations || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/creation-center`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回创作中心
          </Button>
          <Button
            onClick={() => router.push(`/${locale}/my-documents`)}
          >
            查看我的文档
          </Button>
        </div>
      </div>
    </div>
  );
}