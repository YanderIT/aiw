"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Award, Users, Clock, Globe } from "lucide-react";

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
        
        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
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
    icon: Award,
    title: "用户满意率",
    value: 98.7,
    suffix: "%",
    unit: "好评率",
    decimals: 1,
    color: "blue",
  },
  {
    icon: Users,
    title: "AI润色用户",
    value: 6500,
    suffix: "+",
    unit: "使用过AI润色",
    color: "purple",
  },
  {
    icon: Clock,
    title: "平均生成用时",
    value: 3,
    suffix: "",
    unit: "分钟",
    color: "orange",
    small: true,
  },

  {
    icon: TrendingUp,
    title: "累计生成文书数量",
    value: 21000,
    suffix: "+",
    unit: "份文书",
    color: "red",
    highlight: true,
  },

  {
    icon: Globe,
    title: "母语文书老师",
    value: 10,
    suffix: "+",
    unit: "常驻参与润色",
    color: "green",
    small: true,
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
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">平台数据</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            {section.title || "我们的用户遍布世界名校"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {section.description || "数据是我们实力最好的证明"}
          </p>
        </motion.div>

        {/* Stats Grid - Premium Layout */}
        <div ref={containerRef} className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 lg:gap-8">
            {/* First Row - 3 Main Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {statsConfig.slice(0, 3).map((stat, index) => (
                <StatsCard key={index} stat={stat} index={index} isInView={isInView} />
              ))}
            </div>

            {/* Second Row - 2 Secondary Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              {statsConfig.slice(3, 5).map((stat, index) => (
                <StatsCard key={index + 3} stat={stat} index={index + 3} isInView={isInView} compact />
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
  compact?: boolean;
}

function StatsCard({ stat, index, isInView, compact }: StatsCardProps) {
  const IconComponent = stat.icon;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <div className={`
        relative overflow-hidden rounded-xl border border-transparent
        transition-all duration-300 hover:shadow-lg
        ${compact ? 'p-6' : 'p-8'}
        ${stat.highlight ? 'md:scale-105' : ''}
        ${stat.color === 'red' ? 'bg-gradient-to-br from-red-50 to-red-100 hover:border-red-300' :
          stat.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-300' :
          stat.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-300' :
          stat.color === 'orange' ? 'bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-300' :
          'bg-gradient-to-br from-green-50 to-green-100 hover:border-green-300'}
        group
      `}>
        {/* Subtle Pattern on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300">
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>

        {/* Content */}
        <div className="relative">
          {/* Icon */}
          <motion.div
            className={`
              inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4
              ${stat.color === 'red' ? 'text-red-600' :
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'purple' ? 'text-purple-600' :
                stat.color === 'orange' ? 'text-orange-600' :
                'text-green-600'}
            `}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>

          {/* Title */}
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {stat.title}
          </h3>

          {/* Number */}
          <div className={`
            font-bold text-foreground mb-2
            ${stat.small ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl'}
          `}>
            <AnimatedCounter 
              value={stat.value} 
              suffix={stat.suffix}
              decimals={stat.decimals || 0}
              duration={isHovering ? 1.5 : 2 + index * 0.2}
              isHovering={isHovering}
            />
          </div>

          {/* Unit */}
          <p className="text-sm text-muted-foreground">
            {stat.unit}
          </p>
        </div>

        {/* Highlight Badge */}
        {stat.highlight && (
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-100">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-700">热门</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}