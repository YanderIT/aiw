"use client";

import { ScrollReveal, ParallaxScroll, FadeInWhenVisible, StaggerChildren, staggerItem } from "@/components/ui/scroll-reveal";
import { FluidGradientBg } from "@/components/ui/animated-gradient-bg";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Branding from "@/components/blocks/branding";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import FeatureNotionStyle from "@/components/blocks/feature/feature-notion-style";
import Feature1Enhanced from "@/components/blocks/feature1/feature1-enhanced";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import FeaturesGrid from "@/components/blocks/features-grid";
import FlowDemo from "@/components/blocks/flow-demo";
import HeroSpline from "@/components/blocks/hero/hero-spline";
import HeroSplineCentered from "@/components/blocks/hero/hero-spline-centered";
import HeroSplineV2 from "@/components/blocks/hero/hero-spline-v2";
import HeroSplineV3 from "@/components/blocks/hero/hero-spline-v3";
import HeroSplineV4 from "@/components/blocks/hero/hero-spline-v4";
import HeroSplineV5 from "@/components/blocks/hero/hero-spline-v5";
import HeroSplineV6 from "@/components/blocks/hero/hero-spline-v6";
import HeroSplineV7 from "@/components/blocks/hero/hero-spline-v7";
import Pricing from "@/components/blocks/pricing";
import Showcase from "@/components/blocks/showcase";
import StatsPremium from "@/components/blocks/stats/stats-premium";
import Testimonial from "@/components/blocks/testimonial";
import { useHero } from "@/contexts/hero-context";
 
export default function LandingPageClient({ page }: { page: any }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mounted, setMounted] = useState(false);
  const { heroType } = useHero();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SmoothScrollProvider>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      {/* Clean background */}
      <div className="fixed inset-0 -z-10 bg-background" />
      
      {/* Very subtle noise texture */}
      <NoiseTexture opacity={0.01} />

      {/* Hero Section with special animation */}
      {page.hero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {heroType === "v2-new" ? (
            <HeroSplineV2 section={page.hero} />
          ) : heroType === "v3-third" ? (
            <HeroSplineV3 section={page.hero} />
          ) : heroType === "v4-fourth" ? (
            <HeroSplineV4 section={page.hero} />
          ) : heroType === "v5-particles" ? (
            <HeroSplineV5 section={page.hero} />
          ) : heroType === "v6-spline-new" ? (
            <HeroSplineV6 section={page.hero} />
          ) : heroType === "v7-static-bg" ? (
            <HeroSplineV7 section={page.hero} />
          ) : (
            <HeroSplineCentered section={page.hero} />
          )}
        </motion.div>
      )}

      {/* Other sections with scroll animations */}
      <StaggerChildren className="relative">
        {/* Features Grid Section */}
        <motion.div variants={staggerItem}>
          <ScrollReveal delay={0.1}>
            <FeaturesGrid section={page.features} />
          </ScrollReveal>
        </motion.div>

        {/* {page.introduce && (
          <motion.div variants={staggerItem}>
            <ScrollReveal>
              <Feature1Enhanced section={page.introduce} />
            </ScrollReveal>
          </motion.div>
        )} */}

        {/* {page.benefit && (
          <motion.div variants={staggerItem}>
            <ParallaxScroll speed={0.3}>
              <ScrollReveal delay={0.1}>
                <Feature2 section={page.benefit} />
              </ScrollReveal>
            </ParallaxScroll>
          </motion.div>
        )} */}

        {/* {page.usage && (
          <motion.div variants={staggerItem}>
            <FadeInWhenVisible>
              <Feature3 section={page.usage} />
            </FadeInWhenVisible>
          </motion.div>
        )} */}

        {/* {page.feature && (
          <motion.div variants={staggerItem}>
            <ScrollReveal delay={0.2} y={60}>
              <FeatureNotionStyle section={page.feature} />
            </ScrollReveal>
          </motion.div>
        )} */}

        {/* Flow Demo Section */}
        <motion.div variants={staggerItem}>
          <ScrollReveal delay={0.15}>
            <FlowDemo />
          </ScrollReveal>
        </motion.div>

        {/* {page.showcase && (
          <motion.div variants={staggerItem}>
            <ParallaxScroll speed={0.5}>
              <ScrollReveal>
                <Showcase section={page.showcase} />
              </ScrollReveal>
            </ParallaxScroll>
          </motion.div>
        )} */}

        {page.stats && (
          <motion.div variants={staggerItem}>
            <FadeInWhenVisible>
              <StatsPremium section={page.stats} />
            </FadeInWhenVisible>
          </motion.div>
        )}
 

        {page.testimonial && (
          <motion.div variants={staggerItem}>
            <ParallaxScroll speed={0.2}>
              <ScrollReveal>
                <Testimonial section={page.testimonial} />
              </ScrollReveal>
            </ParallaxScroll>
          </motion.div>
        )}

        {page.faq && (
          <motion.div variants={staggerItem}>
            <ScrollReveal delay={0.1}>
              <FAQ section={page.faq} />
            </ScrollReveal>
          </motion.div>
        )}

        {page.cta && (
          <motion.div variants={staggerItem}>
            <ScrollReveal delay={0.2} scale={0.9}>
              <CTA section={page.cta} />
            </ScrollReveal>
          </motion.div>
        )}
        
 
         
      </StaggerChildren>
    </SmoothScrollProvider>
  );
}