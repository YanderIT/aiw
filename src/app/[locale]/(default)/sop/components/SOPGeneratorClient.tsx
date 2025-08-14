"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowRight, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Target, 
  Lightbulb,
  ChartBar,
  Loader2,
  Globe,
  Wand2
} from "lucide-react";
import { toast } from 'sonner';
import { SOPProvider, useSOP } from "./SOPContext";
import SOPIcon from "./icons/SOPIcon";
import { apiRequest } from '@/lib/api-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SOPForm() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'zh';
  
  const { 
    data, 
    updateField,
    updateData,
    generationState,
    setGenerationLoading,
    setGenerationError,
    setLanguagePreference,
    canGenerate,
    saveToCache,
    getFormData
  } = useSOP();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 开发模式下的示例数据
  const fillSampleData = () => {
    const sampleData = {
      target: "I am applying for the PhD program in Computer Science at Stanford University, focusing on artificial intelligence and machine learning research. My goal is to contribute to the advancement of AI technologies that can solve real-world problems.",
      education: "Bachelor of Science in Computer Science from Tsinghua University (2019-2023), GPA: 3.9/4.0. Relevant coursework includes: Advanced Algorithms, Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, and Statistical Methods. Dean's List for 6 consecutive semesters.",
      skill: "Programming Languages: Python, Java, C++, JavaScript, MATLAB. Machine Learning Frameworks: TensorFlow, PyTorch, Scikit-learn, Keras. Deep Learning: CNNs, RNNs, Transformers, GANs. Research Tools: LaTeX, Git, Docker, AWS. Publications: 3 papers in top-tier ML conferences (NeurIPS, ICML).",
      research: "Research Assistant at Tsinghua AI Lab (2021-2023): Developed novel attention mechanisms for vision transformers, improving accuracy by 15% on ImageNet. Summer Research Intern at Microsoft Research Asia (2022): Worked on large language model optimization, reducing inference time by 30%. Published paper 'Efficient Attention Mechanisms for Vision Transformers' at NeurIPS 2023.",
      workExperience: "Machine Learning Engineer Intern at ByteDance AI Lab (Summer 2022): Developed recommendation algorithms serving 100M+ users daily. Data Science Intern at Alibaba Cloud (Winter 2021): Built predictive models for cloud resource optimization, saving 20% in operational costs. Teaching Assistant for Machine Learning course (2022-2023): Mentored 50+ students in ML projects.",
      plan: "My long-term goal is to become a leading researcher in AI safety and interpretability. During my PhD, I plan to focus on developing more transparent and reliable AI systems. After graduation, I aim to continue research in academia or industry research labs, working on ensuring AI systems are beneficial, safe, and aligned with human values. I believe Stanford's world-class faculty and resources will provide the perfect environment for achieving these goals."
    };
    
    updateData(sampleData);
    toast.success("已填充示例数据");
  };

  const handleSubmit = async () => {
    if (!canGenerate()) {
      toast.error('请至少填写申请目标和教育背景');
      return;
    }

    setIsSubmitting(true);
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      // 保存到缓存
      saveToCache();
      
      // 创建文档记录
      const formData = getFormData();
      const { data: document } = await apiRequest('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: 'sop',
          title: `SOP - ${(formData.target || '申请目标').substring(0, 100)}${formData.target && formData.target.length > 100 ? '...' : ''}`,
          form_data: {
            ...formData,
            language: generationState.languagePreference
          },
          language: generationState.languagePreference === 'English' ? 'en' : 'zh'
        }),
      });

      if (!document) {
        throw new Error('Failed to create document');
      }
      
      // 跳转到结果页面，带上文档ID和自动生成标记
      router.push(`/${locale}/sop/result/${document.uuid}?autoGenerate=true`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('创建文档失败，请重试');
      setGenerationLoading(false);
      setGenerationError('创建文档失败');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <SOPIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          SOP 目的陈述撰写
        </h1>
        <p className="text-muted-foreground text-lg">
          专业的Statement of Purpose撰写服务，清晰表达您的学术目标和研究兴趣
        </p>
        
        {/* 开发模式下显示填充按钮 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fillSampleData}
              className="gap-2"
            >
              <Wand2 className="w-4 h-4" />
              填充示例数据（开发模式）
            </Button>
          </div>
        )}
      </div>

      {/* 申请目标 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            申请目标
          </CardTitle>
          <CardDescription>
            请描述您的申请目标，包括申请的学校、专业和学位
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.target}
            onChange={(e) => updateField('target', e.target.value)}
            placeholder="例如：申请哈佛大学计算机科学博士项目，专注于人工智能和机器学习研究..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* 教育背景 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            教育背景
          </CardTitle>
          <CardDescription>
            您的教育经历，包括学校、专业、GPA、相关课程等
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.education}
            onChange={(e) => updateField('education', e.target.value)}
            placeholder="例如：清华大学计算机科学与技术本科，GPA 3.8/4.0，主修课程包括算法设计、机器学习、深度学习..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* 相关技能 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            相关技能
          </CardTitle>
          <CardDescription>
            与申请目标相关的专业技能、编程语言、工具等
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.skill}
            onChange={(e) => updateField('skill', e.target.value)}
            placeholder="例如：熟练掌握Python、TensorFlow、PyTorch，具备深度学习模型开发经验，发表过3篇机器学习相关论文..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* 研究经历 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            研究经历
          </CardTitle>
          <CardDescription>
            科研项目、实验室经历、论文发表等
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.research}
            onChange={(e) => updateField('research', e.target.value)}
            placeholder="例如：在XX教授的指导下，参与自然语言处理研究项目，负责模型设计和实验，成果发表在ACL会议..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* 工作经历 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            工作经历
          </CardTitle>
          <CardDescription>
            实习或全职工作经历，特别是与申请领域相关的
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.workExperience}
            onChange={(e) => updateField('workExperience', e.target.value)}
            placeholder="例如：在Google AI研究院实习6个月，参与大语言模型优化项目，提升模型推理速度30%..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* 未来规划 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5 text-primary" />
            未来规划
          </CardTitle>
          <CardDescription>
            您的职业目标和长期规划
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.plan}
            onChange={(e) => updateField('plan', e.target.value)}
            placeholder="例如：希望在博士期间深入研究强化学习在机器人控制中的应用，毕业后在学术界继续从事前沿研究..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* 语言选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            生成语言 / Generation Language
          </CardTitle>
          <CardDescription>
            选择SOP的生成语言 / Choose the language for your SOP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={generationState.languagePreference}
            onValueChange={(value: 'English' | 'Chinese') => setLanguagePreference(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English (英文)</SelectItem>
              <SelectItem value="Chinese">Chinese (中文)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 生成按钮 */}
      <div className="flex justify-center pt-6 pb-12">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!canGenerate() || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              生成SOP
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function SOPGeneratorClient() {
  return (
    <SOPProvider>
      <SOPForm />
    </SOPProvider>
  );
}