"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedDividerProps {
  className?: string;
  duration?: number;
  height?: string;
}

export function AnimatedDivider({ 
  className, 
  duration = 5,
  height = "1px" 
}: AnimatedDividerProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ height }}>
      {/* Base gradient line - very subtle */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 10%, rgba(34, 197, 94, 0.1) 50%, transparent 90%)",
        }}
      />
      
      {/* Center expansion animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0.3, 0],
          scaleX: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.6) 25%, rgba(16, 185, 129, 0.5) 50%, rgba(34, 197, 94, 0.6) 75%, transparent 100%)",
          transformOrigin: "center",
        }}
      />
      
      {/* Breathing glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
        }}
      />
      
      {/* Subtle shimmer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0.15, 0],
          scaleX: [0.5, 1.2, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          background: "linear-gradient(90deg, transparent 20%, rgba(16, 185, 129, 0.4) 50%, transparent 80%)",
          filter: "blur(2px)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}