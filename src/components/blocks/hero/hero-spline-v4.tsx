"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

export default function HeroSplineV4({ section }: { section: SectionType }) {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  useEffect(() => {
    // Check if spline-viewer custom element is already defined
    const checkSplineLoaded = () => {
      if (customElements.get('spline-viewer')) {
        setIsSplineLoaded(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkSplineLoaded()) return;

    // Load script only if not already loaded
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.35/build/spline-viewer.js';
    script.onload = () => {
      setIsSplineLoaded(true);
    };
    
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      // Script exists, just wait for element to be defined
      const interval = setInterval(() => {
        if (checkSplineLoaded()) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="relative h-screen w-full overflow-hidden">
      {/* Loading indicator for Spline */}
      {!isSplineLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="text-muted-foreground animate-pulse">
            Loading 3D Scene...
          </div>
        </div>
      )}
      
      {/* Spline 3D - Full Screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSplineLoaded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        <spline-viewer 
          url="https://prod.spline.design/CW69XyYus95EWxCu/scene.splinecode"
          className="w-full h-full"
        />
      </motion.div>
    </section>
  );
}