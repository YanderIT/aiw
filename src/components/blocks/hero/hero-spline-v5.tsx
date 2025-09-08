"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { animate } from "motion";
import { splitText } from "motion-plus";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import HeroBg from "./bg";
import BouncingParticles from "./BouncingParticles";

export default function HeroSplineV5({ section }: { section: SectionType }) {
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
            delay: 0.2 + index * 0.05,
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
      {/* Background grid - base layer */}
      <div className="absolute inset-0 z-0">
        <HeroBg />
      </div>
      
      {/* Bouncing Particles Background */}
      <div className="absolute inset-0 z-10">
        <BouncingParticles particleCount={30} />
      </div>

      {/* Subtle gradient overlay for better text readability */}
      <div className="absolute inset-0 z-20 bg-background/20" />

      {/* Content Container - Centered */}
      <div className="relative z-30 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="space-y-6">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold leading-tight text-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
              style={{ visibility: "hidden" }}
            >
              <span className="block">为留学申请打造的 </span>
              <span className="block"> AI 工作空间</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
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
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-muted-foreground"
          >
          </motion.p>
        </motion.div>
      </div>

      {/* Background gradient effects - subtle blobs */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
      </div>
    </section>
  );
}