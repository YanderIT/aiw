"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { animate } from "motion";
import { splitText } from "motion-plus";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeroBg from "./bg";

export default function HeroSplineV7({ section }: { section: SectionType }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = '/imgs/cover.png';
  }, []);

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
    <section id={section.name} className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-gradient-to-b from-background to-background/95 flex items-center justify-center">
        {/* Background grid - shows immediately */}
        <div className="absolute inset-0 z-0">
          <HeroBg />
        </div>
        
        {/* Loading indicator for image */}
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
            <div className="text-muted-foreground animate-pulse">
              Loading background...
            </div>
          </div>
        )}

        {/* Static Image Background */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: imageLoaded ? "url('/imgs/cover.png')" : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
        </motion.div>

        {/* Content Container - Centered */}
        <div className="relative z-30 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              <h1 
                ref={titleRef}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold leading-tight text-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                style={{ visibility: "hidden" }}
              >
                <span className="block">为留学申请打造的 </span>
                <span className="block"> AI 工作空间</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
              >
                整合写作工具、案例参考与智能辅助，让每份材料都更打动人心。
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/creation-center">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  立即开始使用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-sm text-gray-300"
            >
            </motion.p>
          </motion.div>
        </div>

        {/* Subtle animated elements for visual interest */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black/15 rounded-full animate-pulse" 
               style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-black/20 rounded-full animate-pulse" 
               style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-black/10 rounded-full animate-pulse" 
               style={{ animationDelay: '2s', animationDuration: '5s' }} />
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-black/15 rounded-full animate-pulse" 
               style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        </div>
    </section>
  );
}