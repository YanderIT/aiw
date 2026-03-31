"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Script from 'next/script';

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

export default function HeroSpline({ section }: { section: SectionType }) {
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
      <section id={section.name} className="relative min-h-[65vh] lg:min-h-[75vh] overflow-hidden bg-gradient-to-b from-background to-background/95">
        {/* Spline 3D Background - Positioned absolutely */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0"
        >
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
          
          {/* Spline container - positioned to show more on the left */}
          <div className="absolute top-0 left-[-20%] w-full h-full">
            <spline-viewer 
              url="https://prod.spline.design/JdZgoBYW5zhBLimi/scene.splinecode"
              style={{ width: '50%', height: '70%' }}
            />
          </div>
        </motion.div>

        {/* Content Container */}
        <div className="relative z-20 h-full">
          <div className="container mx-auto px-4 h-full flex items-center py-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 max-w-2xl"
            >
              <div className="space-y-5">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                >
                  Effortless
                  <br />
                  AI integration
                  <br />
                  <span className="text-primary/70">for business</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-lg lg:text-xl text-muted-foreground max-w-lg"
                >
                  No extra setup, just smart automation when you need it.
                  Handle the heavy lifting while you stay in control.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="text-base px-8 py-5 rounded-xl font-medium"
                >
                  JOIN US NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-sm text-muted-foreground"
              >
                Press on the canvas to focus and interact
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </section>
    </>
  );
}