"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ 
  value, 
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2.5
}: { 
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    return decimals > 0 ? latest.toFixed(decimals) : Math.round(latest);
  });
  const [displayValue, setDisplayValue] = useState("0");
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom easing for smooth counting
        onUpdate: (latest) => {
          if (decimals > 0) {
            setDisplayValue(latest.toFixed(decimals));
          } else {
            setDisplayValue(Math.round(latest).toString());
          }
        }
      });

      return controls.stop;
    }
  }, [isInView, value, motionValue, decimals, duration]);

  return (
    <span ref={ref}>
      {prefix}
      <span className="tabular-nums">{displayValue}</span>
      {suffix}
    </span>
  );
}

function parseStatValue(label: string) {
  // Extract number, prefix, and suffix from labels like "21000+", "98.7%", "3 分钟"
  const match = label.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*?)$/);
  
  if (!match) {
    return { value: 0, prefix: "", suffix: label };
  }

  const [, prefix, numberStr, suffix] = match;
  const value = parseFloat(numberStr);
  const decimals = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;

  return {
    value,
    prefix: prefix || "",
    suffix: suffix || "",
    decimals
  };
}

export default function StatsEnhanced({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section id={section.name} className="py-16 relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0" />
      
      <div className="container relative">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {section.label && (
            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
              {section.icon && (
                <Icon name={section.icon} className="h-6 w-auto border-primary" />
              )}
              {section.label}
            </div>
          )}
          <h2 className="text-center text-3xl font-semibold lg:text-4xl">
            {section.title}
          </h2>
          <p className="text-center text-muted-foreground lg:text-lg max-w-2xl">
            {section.description}
          </p>
        </motion.div>

        <motion.div 
          ref={containerRef}
          className="w-full grid gap-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {section.items?.map((item, index) => {
            const { value, prefix, suffix, decimals } = parseStatValue(item.label || "0");
            
            return (
              <motion.div 
                key={index} 
                className="text-center group cursor-pointer"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="relative inline-block">
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 group-hover:border-primary/50 transition-colors duration-300">
                    <p className="text-lg font-semibold text-muted-foreground mb-4">
                      {item.title}
                    </p>
                    <p className="text-5xl lg:text-6xl font-bold text-primary mb-3">
                      <AnimatedCounter 
                        value={value} 
                        prefix={prefix}
                        suffix={suffix}
                        decimals={decimals}
                        duration={2.5 + index * 0.2} // Stagger the count animation
                      />
                    </p>
                    <p className="text-sm lg:text-base font-normal text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}