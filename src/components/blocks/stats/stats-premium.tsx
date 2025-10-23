"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, Star, FileText, UserCheck, Zap, Target } from "lucide-react";

function AnimatedCounter({ 
  value, 
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2.5,
  isHovering = false
}: { 
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  isHovering?: boolean;
}) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState("0");
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Animate on first view or when hovering after initial animation
    if ((isInView && !hasAnimated) || (isHovering && hasAnimated)) {
      let startTime: number | null = null;
      let animationFrame: number;

      const updateValue = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // 增强的缓动函数 - 更流畅的滚动效果
        const easedProgress = 1 - Math.pow(1 - progress, 2.5);
        const currentValue = easedProgress * value;
        
        if (decimals > 0) {
          setDisplayValue(currentValue.toFixed(decimals));
        } else {
          // Format large numbers with comma separator
          const rounded = Math.round(currentValue);
          setDisplayValue(rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateValue);
        } else {
          setHasAnimated(true);
        }
      };

      animationFrame = requestAnimationFrame(updateValue);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isInView, value, decimals, duration, isHovering, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

const statsConfig = [
  {
    icon: Star,
    title: "95% 好评率",
    value: 95,
    suffix: "%",
    unit: "用户满意率",
    decimals: 0,
    color: "blue",
  },
  {
    icon: Users,
    title: "1500+ 注册用户",
    value: 1500,
    suffix: "+",
    unit: "累计注册用户数",
    color: "purple",
  },
  {
    icon: FileText,
    title: "3,289+ 份文书",
    value: 3289,
    suffix: "+",
    unit: "累计生成文书数量",
    color: "green",
    highlight: true,
  },
  {
    icon: UserCheck,
    title: "10+ 常驻参与润色的文书老师",
    value: 10,
    suffix: "+",
    unit: "人工润色",
    color: "orange",
  },
  {
    icon: Zap,
    title: "3 分钟快速生成",
    value: 3,
    suffix: "",
    unit: "平均生成用时",
    color: "red",
  },
  {
    icon: Target,
    title: "92% 用户获得录取",
    value: 92,
    suffix: "%",
    unit: "录取率",
    color: "emerald",
  },
];

export default function StatsPremium({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section id={section.name} className="py-24 relative overflow-hidden">
      {/* Linear-style Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stats-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0h40" fill="none" stroke="currentColor" strokeWidth="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-grid)" />
          </svg>
        </div>
        
        {/* Linear-style Gradient Background */}
        <div className="absolute inset-0 stats-bg-gradient" />
        
        {/* Subtle Light Beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#86f096]/10 to-transparent dark:via-[#86f096]/5" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#3dcd77]/10 to-transparent dark:via-[#3dcd77]/5" />
        
        {/* Soft Radial Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full 
                        bg-gradient-to-r from-[#86f096]/10 to-[#3dcd77]/10 
                        blur-[100px] opacity-40 dark:from-[#86f096]/5 dark:to-[#3dcd77]/5" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md 
                       bg-gradient-to-r from-[#86f096]/10 to-[#3dcd77]/10 
                       backdrop-blur-sm border border-[#3dcd77]/20 dark:border-[#3dcd77]/10 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-[#3dcd77] dark:text-[#86f096]" />
            <span className="text-lg font-semibold text-[#3dcd77] dark:text-[#86f096]">平台数据</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            {section.title || "我们的用户遍布世界名校"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {section.description || "数据是我们实力最好的证明"}
          </p>
        </motion.div>

        {/* Stats Grid - 2行×3列布局 */}
        <div ref={containerRef} className="relative">
          <div className="grid gap-4 lg:gap-6">
            {/* First Row - 前3个指标 */}
            <div className="grid md:grid-cols-3 gap-4">
              {statsConfig.slice(0, 3).map((stat, index) => (
                <StatsCard key={index} stat={stat} index={index} isInView={isInView} />
              ))}
            </div>

            {/* Second Row - 后3个指标 */}
            <div className="grid md:grid-cols-3 gap-4">
              {statsConfig.slice(3, 6).map((stat, index) => (
                <StatsCard key={index + 3} stat={stat} index={index + 3} isInView={isInView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatsCardProps {
  stat: typeof statsConfig[0];
  index: number;
  isInView: boolean;
}

function StatsCard({ stat, index, isInView }: StatsCardProps) {
  const IconComponent = stat.icon;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ 
        y: -1,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <div className={`
        relative overflow-hidden rounded-xl
        transition-all duration-300
        p-7
        ${stat.highlight ? 'ring-1 ring-gray-200 dark:ring-[#3dcd77]/20' : ''}
        bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm
        border border-gray-200 dark:border-gray-700/50
        shadow-sm
        hover:shadow-md dark:hover:shadow-[#3dcd77]/5
        hover:border-gray-300 dark:hover:border-[#3dcd77]/30
        group
      `}>
        {/* Linear-style Background Pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#86f096]/5 via-transparent to-[#3dcd77]/5 dark:from-[#86f096]/10 dark:to-[#3dcd77]/10" />
        </div>

        {/* Subtle Hover Gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#86f096]/5 via-transparent to-[#3dcd77]/5 dark:from-[#86f096]/8 dark:via-transparent dark:to-[#3dcd77]/8" />
        </div>

        {/* Content */}
        <div className="relative">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-4
                         bg-gradient-to-br from-[#86f096]/10 to-[#3dcd77]/10 dark:from-[#86f096]/15 dark:to-[#3dcd77]/15
                         border border-[#3dcd77]/20 dark:border-[#3dcd77]/30
                         group-hover:from-[#86f096]/20 group-hover:to-[#3dcd77]/20 dark:group-hover:from-[#86f096]/25 dark:group-hover:to-[#3dcd77]/25
                         transition-all duration-200">
            <IconComponent className="w-4 h-4 text-[#027c50] dark:text-[#86f096]" />
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {stat.title}
          </h3>

          {/* Number */}
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-3xl lg:text-4xl">
            <AnimatedCounter 
              value={stat.value} 
              suffix={stat.suffix}
              decimals={stat.decimals || 0}
              duration={isHovering ? 1.2 : 2.2 + index * 0.15}
              isHovering={isHovering}
            />
          </div>

          {/* Unit */}
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {stat.unit}
          </p>
        </div>

        {/* Linear-style Highlight Indicator */}
        {stat.highlight && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-0.5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-[#3dcd77] to-transparent dark:via-[#86f096]" />
          </motion.div>
        )}

        {/* Subtle Corner Accent */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#86f096]/10 to-transparent dark:from-[#86f096]/20 dark:to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}