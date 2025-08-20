"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StaggerChildren, staggerItem } from "@/components/ui/scroll-reveal";

export default function FeatureEnhanced({ section }: { section: SectionType }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  if (section.disabled) {
    return null;
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
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
    <section ref={ref} id={section.name} className="py-24 relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0" />

      <div className="container relative">
        {/* Header */}
        <motion.div 
          className="mx-auto flex max-w-3xl flex-col items-center text-center gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <span className="text-sm font-semibold text-primary">核心功能</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold">
            {section.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {section.description}
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="relative mb-16 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div 
            style={{ y, opacity }}
            className="relative"
          >
            {/* Placeholder for hero image - replace with actual image */}
            <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-muted/20 rounded-3xl overflow-hidden">
              {/* Animated grid pattern */}
              <svg
                className="absolute inset-0 h-full w-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="feature-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-foreground/20"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#feature-grid)" />
              </svg>
 
               
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" delay={0.1}>
          {section.items?.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card hover effect */}
              <div className="absolute -inset-0.5 bg-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card content */}
              <div className="relative flex flex-col p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 group-hover:border-primary/50 transition-all duration-300 h-full">
                {/* Icon with animation */}
                {item.icon && (
                  <motion.div 
                    className="mb-6 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
                    <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30">
                      <Icon name={item.icon} className="size-8 text-primary" />
                    </div>
                  </motion.div>
                )}
                
                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground mb-4 flex-grow">
                  {item.description}
                </p>
                
                {/* Action indicator */}
                <motion.div 
                  className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <span>了解更多</span>
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
                </motion.div>
              </div>
            </motion.div>
          ))}
        </StaggerChildren>

        {/* Bottom decoration */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            所有功能均支持多次修改，直至满意为止
          </p>
        </motion.div>
      </div>
    </section>
  );
}