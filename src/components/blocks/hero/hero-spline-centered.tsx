"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Script from 'next/script';
import { useEffect, useRef } from "react";

// Declare the custom element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
      }, HTMLElement>;
    }
  }
}

export default function HeroSplineCentered({ section }: { section: SectionType }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!titleRef.current) return;

      // Show the title after fonts are loaded
      titleRef.current.style.visibility = "visible";

      const { words } = splitText(titleRef.current);

      // Animate the words with initial delay
      words.forEach((word, index) => {
        animate(
          word,
          { opacity: [0, 1], y: [20, 0], filter: ["blur(10px)", "blur(0px)"] },
          {
            type: "spring",
            duration: 1.5,
            bounce: 0,
            delay: 0.2 + index * 0.05, // 0.2s initial delay + stagger
          }
        );
      });
    });
  }, []);

  if (section.disabled) {
    return null;
  }

  return (
    <>
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.10.35/build/spline-viewer.js"
        strategy="lazyOnload"
      />
      <section id={section.name} className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-gradient-to-b from-background to-background/95 flex items-center justify-center">
        {/* Spline 3D Background - Centered behind content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-background/30 z-10" />
          
          {/* Spline container - positioned behind title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-[175%] -translate-y-1/2 w-[80%] h-[80%] max-w-4xl">
            <spline-viewer 
              url="https://prod.spline.design/JdZgoBYW5zhBLimi/scene.splinecode"
              className="w-[250%] h-[180%] 2xl:h-full"
            />
          </div>
        </motion.div>

        {/* Content Container - Centered */}
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              <h1 
                ref={titleRef}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold leading-tight text-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                style={{ visibility: "hidden" }}
              >
                <span className="block">为留学申请打造的</span>
                <span className="block">AI 工作空间</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                整合写作工具、案例参考与智能辅助，让每份材料都更打动人心。
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-xl font-medium"
              >
                立即开始使用
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
 
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-sm text-muted-foreground"
            >
            </motion.p>
          </motion.div>
        </div>

        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      </section>
      <style jsx global>{`
        .split-word {
          will-change: transform, opacity, filter;
          display: inline-block;
        }
      `}</style>
    </>
  );
}