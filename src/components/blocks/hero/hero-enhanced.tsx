"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "@/i18n/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroEnhanced({ hero }: { hero: HeroType }) {
  const { data: session } = useSession();
  const { setShowSignModal } = useAppContext();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  const handleButtonClick = (e: React.MouseEvent, url: string) => {
    const isStartCreatingButton = url === "/auth/signin" || url === "/creation-center";
    
    if (isStartCreatingButton && !session) {
      e.preventDefault();
      setShowSignModal(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <>
      {/* Clean minimal background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
      </div>

      <section ref={ref} className="relative py-24 overflow-hidden">
        <motion.div style={{ y, opacity }} className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {hero.show_badge && (
              <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
                <img
                  src="/imgs/badges/phdaily.svg"
                  alt="phdaily"
                  className="h-10 object-cover"
                />
              </motion.div>
            )}
            
            {hero.announcement && (
              <motion.div variants={itemVariants}>
                <Link
                  href={hero.announcement.url as any}
                  className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border border-border/50 backdrop-blur-sm bg-background/50 px-2 py-1 text-sm transition-all hover:border-primary/50 hover:bg-background/80"
                >
                  {hero.announcement.label && (
                    <Badge className="animate-pulse">{hero.announcement.label}</Badge>
                  )}
                  {hero.announcement.title}
                </Link>
              </motion.div>
            )}

            {texts && texts.length > 1 ? (
              <motion.h1 
                variants={itemVariants}
                className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl lg:mb-7 lg:text-7xl"
              >
                <span className="metallic-text">{texts[0]}</span>
                <span className="metallic-text-highlight mx-1">
                  {highlightText}
                </span>
                <span className="metallic-text">{texts[1]}</span>
              </motion.h1>
            ) : (
              <motion.h1 
                variants={itemVariants}
                className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl lg:mb-7 lg:text-7xl metallic-text"
              >
                {hero.title}
              </motion.h1>
            )}

            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-3xl text-muted-foreground lg:text-xl"
              dangerouslySetInnerHTML={{ __html: hero.description || "" }}
            />
            
            {hero.buttons && (
              <motion.div 
                variants={itemVariants}
                className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
              >
                {hero.buttons.map((item, i) => {
                  return (
                    <Link
                      key={i}
                      href={item.url as any}
                      target={item.target || ""}
                      className="flex items-center group"
                      onClick={(e) => handleButtonClick(e, item.url)}
                    >
                      <Button
                        className="w-full relative overflow-hidden transition-all duration-300 hover:scale-105"
                        size="lg"
                        variant={item.variant || "default"}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        {item.icon && <Icon name={item.icon} className="relative z-10" />}
                        <span className="relative z-10">{item.title}</span>
                      </Button>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}