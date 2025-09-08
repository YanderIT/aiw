"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  FileText, 
  User, 
  Mail, 
  RefreshCw, 
  Sparkles, 
  Users,
  Zap
} from "lucide-react";

const features = [
  {
    id: "ps",
    icon: FileText,
    title: "个人陈述（PS）生成",
    description: "快速生成个性化的留学个人陈述",
    screenshot: "/imgs/bento_1.avif",
    color: "red",
  },
  {
    id: "cv",
    icon: User,
    title: "简历（CV）生成",
    description: "面向海外院校标准格式的英文简历生成",
    screenshot: "/imgs/30222.avif",
    color: "blue",
  },
  {
    id: "cl",
    icon: Mail,
    title: "求职信 / 动机信（CL/SOP）生成",
    description: "支持研究/工作方向的定制化文书输出",
    screenshot: "/imgs/bento_4.avif",
    color: "purple",
  },
  {
    id: "revision",
    icon: RefreshCw,
    title: "每份文书可免费修改一次",
    description: "用户提交后可选择整篇或部分重写/润色一次",
    screenshot: "/imgs/bento_5.avif",
    color: "orange",
  },
  {
    id: "ai-human",
    icon: Sparkles,
    title: "AI + 人工双重润色",
    description: "支持基础智能优化，也可由文书老师人工润色",
    screenshot: "/imgs/30222.avif",
    color: "yellow",
  },
  {
    id: "native",
    icon: Users,
    title: "常驻英语母语文书老师参与修改",
    description: "提升语感、逻辑与表达精准度",
    screenshot: "/imgs/bento_32.avif",
    color: "green",
  },
];

export default function FeatureNotionStyle({ section }: { section: SectionType }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  if (section.disabled) {
    return null;
  }

  return (
    <section ref={containerRef} id={section.name} className="py-16 lg:py-20 relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-lg font-semibold text-primary">核心功能</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            {section.title || "打造完美申请文书的智能工具"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {section.description || "从构思到成稿，AI 全程陪伴，让每一份文书都成为你的加分项"}
          </p>
        </motion.div>

        {/* Feature Cards - Notion Style Grid */}
        <div className="grid gap-8 md:gap-6">
          {/* First Row - 2 Large Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.slice(0, 2).map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} large />
            ))}
          </div>

          {/* Second Row - 3 Medium Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.slice(2, 5).map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index + 2} />
            ))}
          </div>

          {/* Third Row - 1 Wide Card */}
          <div className="grid gap-6">
            {features.slice(5, 6).map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index + 5} wide />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  large?: boolean;
  wide?: boolean;
}

function FeatureCard({ feature, index, large, wide }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const IconComponent = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      <div className={`
        relative overflow-hidden rounded-xl border border-transparent
        transition-all duration-300 hover:shadow-lg
        ${large ? 'h-[400px]' : wide ? 'h-[300px]' : 'h-[350px]'}
        ${feature.color === 'red' ? 'bg-gradient-to-br from-red-50 to-red-100 hover:border-red-300' :
          feature.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-300' :
          feature.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-300' :
          feature.color === 'orange' ? 'bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-300' :
          feature.color === 'yellow' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 hover:border-yellow-300' :
          'bg-gradient-to-br from-green-50 to-green-100 hover:border-green-300'}
      `}>
        {/* Subtle Pattern on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300">
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>

        {/* Content Layer */}
        <div className="relative h-full p-8 flex flex-col">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-lg
                ${feature.color === 'red' ? 'text-red-600  ' :
                  feature.color === 'blue' ? 'text-blue-600  ' :
                  feature.color === 'purple' ? 'text-purple-600  ' :
                  feature.color === 'orange' ? 'text-orange-600  ' :
                  feature.color === 'yellow' ? 'text-yellow-600  ' :
                  'text-green-600  '}
              `}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <IconComponent className="w-5 h-5" />
            </motion.div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>

          {/* Screenshot */}
          <div className="flex-1 relative mt-4 rounded-lg overflow-hidden bg-background/50 border border-border/20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            />
            
            {/* Product screenshot */}
            <img 
              src={feature.screenshot} 
              alt={feature.title}
              className="w-full h-full object-cover"
            />

            {/* Hover Effect - View Details */}
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ x: 20 }}
              whileHover={{ x: 0 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50">
                <span className="text-sm font-medium">查看详情</span>
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  whileHover={{ x: 3 }}
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </div>
            </motion.div>
          </div>

 
        </div>

        {/* 3D Effect Border */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/10 transition-all duration-300" />
        </div>
      </div>
    </motion.div>
  );
}

