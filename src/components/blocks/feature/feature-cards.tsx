"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { 
  FileText, 
  FileUser, 
  Mail, 
  RefreshCw, 
  Sparkles, 
  Users,
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";

// Map of feature types to icons
const featureIcons = {
  "ps": FileText,
  "cv": FileUser,
  "cl": Mail,
  "refresh": RefreshCw,
  "ai": Sparkles,
  "human": Users,
  "time": Clock,
  "quality": CheckCircle,
  "speed": Zap,
};

export default function FeatureCards({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  // Enhanced feature data with gradients
  const featureGradients = [
    "from-blue-500/20 to-cyan-500/20",
    "from-purple-500/20 to-pink-500/20",
    "from-green-500/20 to-emerald-500/20",
    "from-orange-500/20 to-red-500/20",
    "from-indigo-500/20 to-purple-500/20",
    "from-teal-500/20 to-cyan-500/20",
  ];

  return (
    <section id={section.name} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">功能入口</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            {section.title || "全方位智能文书解决方案"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {section.description || "从个人陈述到求职信，AI驱动的专业文书生成平台，助力您的留学申请之路"}
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {section.items?.map((item, i) => {
            const IconComponent = item.icon && featureIcons[item.icon as keyof typeof featureIcons] 
              ? featureIcons[item.icon as keyof typeof featureIcons] 
              : FileText;
            const gradient = featureGradients[i % featureGradients.length];
            
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative"
              >
                {/* 3D Card Effect */}
                <motion.div
                  className="relative h-full"
                  whileHover={{ 
                    rotateY: 5,
                    rotateX: -5,
                    z: 50,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  {/* Card shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10 transform translate-y-4" />
                  
                  {/* Card content */}
                  <div className="relative flex flex-col p-8 rounded-3xl bg-background/80 backdrop-blur-md border border-border/50 group-hover:border-primary/30 transition-all duration-300 h-full overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600" />
                      <svg
                        className="absolute inset-0 h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id={`card-pattern-${i}`}
                            width="30"
                            height="30"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle cx="15" cy="15" r="1" fill="currentColor" className="text-foreground/20" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#card-pattern-${i})`} />
                      </svg>
                    </div>

                    {/* Icon */}
                    <motion.div 
                      className="mb-6 relative z-10"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200,
                        damping: 10
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl`} />
                      <div className={`relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                        <IconComponent className="size-8 text-white" />
                      </div>
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="mb-3 text-xl font-bold z-10">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground mb-6 flex-grow z-10">
                      {item.description}
                    </p>
                    
                    {/* Feature tag */}
                    <div className="flex items-center gap-2 z-10">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground">支持多次修改</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">每份文书均可免费修改一次，确保满意为止</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}