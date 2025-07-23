"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function CircularProgress({ 
  value, 
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "primary"
}: { 
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const strokeDashoffset = useTransform(
    motionValue,
    [0, max],
    [circumference, 0]
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 2.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      });

      return controls.stop;
    }
  }, [isInView, value, motionValue]);

  return (
    <div ref={ref} className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/20"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`text-${color}`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
    </div>
  );
}

function AnimatedCounter({ 
  value, 
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2.5,
  className = ""
}: { 
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState("0");
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
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
          setDisplayValue(Math.round(currentValue).toString());
        }

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateValue);
        }
      };

      animationFrame = requestAnimationFrame(updateValue);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isInView, value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{displayValue}</span>
      {suffix}
    </span>
  );
}

export default function StatsCircular({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section id={section.name} className="py-24 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20"
              style={{
                width: `${300 + i * 100}px`,
                height: `${300 + i * 100}px`,
                left: `${20 + i * 10}%`,
                top: `${-50 + i * 20}px`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="container relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {section.label && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
              >
                {section.icon && (
                  <Icon name={section.icon} className="h-8 w-auto text-primary" />
                )}
              </motion.div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {section.label}
              </span>
            </div>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            {section.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {section.description}
          </p>
        </motion.div>

        <motion.div 
          ref={containerRef}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {section.items?.map((item, index) => {
            const match = item.label?.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*?)$/);
            const value = match ? parseFloat(match[2]) : 0;
            const prefix = match ? match[1] : "";
            const suffix = match ? match[3] : "";
            const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;
            const isPercentage = suffix.includes('%');
            
            return (
              <motion.div 
                key={index} 
                className="relative group"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-center p-6 rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Circular progress for percentage values */}
                  {isPercentage && (
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <CircularProgress value={value} max={100} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <AnimatedCounter 
                            value={value} 
                            suffix="%"
                            decimals={decimals}
                            className="text-2xl font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Large number display for non-percentage values */}
                  {!isPercentage && (
                    <div className="text-5xl lg:text-6xl font-bold text-primary mb-4">
                      <AnimatedCounter 
                        value={value} 
                        prefix={prefix}
                        suffix={suffix}
                        decimals={decimals}
                        duration={2 + index * 0.3}
                      />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}