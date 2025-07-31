"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MetallicIcon } from "@/components/icons/metallic";

interface CreationToolCardProps {
  icon: string;
  title: string;
  description: string;
  price?: number | null;
  url?: string;
  index?: number;
  className?: string;
}

export function CreationToolCard({
  icon,
  title,
  description,
  price,
  url,
  index = 0,
  className,
}: CreationToolCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 100,
    damping: 20,
  });
  
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 100,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setMousePosition({ x, y });
    mouseX.set((x - centerX) / centerX);
    mouseY.set((y - centerY) / centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-3xl",
        "shadow-lg hover:shadow-xl transition-all duration-500",
        "group cursor-pointer h-full min-h-[200px]",
        "transform-gpu perspective-1000",
        className
      )}
    >
      {/* Overflow container for content */}
      <div className="relative overflow-hidden rounded-3xl h-full">
        {/* Glass background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-md rounded-3xl" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: isHovered
            ? [
                "linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(16, 185, 129, 0.04) 50%, rgba(20, 184, 166, 0.06) 100%)",
                "linear-gradient(135deg, rgba(20, 184, 166, 0.06) 0%, rgba(34, 197, 94, 0.04) 50%, rgba(16, 185, 129, 0.06) 100%)",
                "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(20, 184, 166, 0.04) 50%, rgba(34, 197, 94, 0.06) 100%)",
              ]
            : "linear-gradient(135deg, rgba(34, 197, 94, 0.02) 0%, rgba(16, 185, 129, 0.02) 50%, rgba(20, 184, 166, 0.02) 100%)",
        }}
        transition={{
          duration: isHovered ? 4 : 0.5,
          repeat: isHovered ? Infinity : 0,
          ease: "linear",
        }}
      />

      {/* Moving gradient spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.08), transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: "100%",
              }}
              animate={{
                y: "-20%",
                x: [
                  Math.random() * 100 + "%",
                  Math.random() * 100 + "%",
                  Math.random() * 100 + "%",
                ],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-40 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.5) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: isHovered ? ["200% 0%", "-200% 0%"] : "200% 0%",
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: isHovered ? Infinity : 0,
        }}
      />

      <div className="relative p-8 z-10">
        <div className="flex items-start gap-5">
          {/* Icon with glow effect */}
          <motion.div
            className="relative flex-shrink-0"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{ 
              scale: { duration: 0.3, type: "spring", stiffness: 300 },
              rotate: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/40 via-emerald-400/40 to-teal-400/40 blur-2xl"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 2 : 1,
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className={`relative rounded-2xl p-4 backdrop-blur-sm ${
                icon === "personal-statement-write" ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20" :
                icon === "resume-generate" ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20" :
                icon === "sop-statement" || icon === "document-polish" ? "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20" :
                icon === "recommendation-letter-write" ? "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20" :
                icon === "one-on-one-consulting" ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20" :
                "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20"
              }`}
              animate={{
                boxShadow: isHovered 
                  ? "0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)" 
                  : "0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
              }}
            >
              <MetallicIcon 
                name={icon} 
                className="w-9 h-9 text-gray-600 dark:text-gray-400"
              />
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="text-xl font-semibold text-foreground mb-2 line-clamp-1"
              animate={{
                color: isHovered ? "#16a34a" : "currentColor",
              }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
            
            <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed">
              {description}
            </p>

            {/* Price badge with no "积分" text */}
            {price && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="mt-4"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-sm"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-lg">💰</span> 
                  <span className="font-bold text-green-700 dark:text-green-300 text-base">{price}</span>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Glow corners */}
        <motion.div
          className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.2 : 0,
            scale: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-green-400/40 to-transparent rounded-br-3xl blur-xl" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.2 : 0,
            scale: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-full h-full bg-gradient-to-tl from-teal-400/40 to-transparent rounded-tl-3xl blur-xl" />
        </motion.div>
      </div>

      {/* Bottom border gradient animation - outside overflow container */}
      <div className="absolute -bottom-[1px] left-6 right-6 h-[2px] overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute bottom-0 h-full"
            animate={{
              x: isHovered ? ["-100%", "200%"] : "-100%",
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            style={{
              width: "50%",
              background: "linear-gradient(90deg, transparent 0%, #22c55e 25%, #10b981 50%, #14b8a6 75%, transparent 100%)",
            }}
          />
        </motion.div>
      </div>
      </div>
    </motion.div>
  );

  if (url) {
    return <Link href={url} className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
}