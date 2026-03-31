"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { StaggerChildren, staggerItem } from "@/components/ui/scroll-reveal";

export default function Feature1Enhanced({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 relative">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {section.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={section.image?.src}
                alt="placeholder hero"
                className="relative max-h-full w-full rounded-lg object-cover shadow-2xl"
              />
            </motion.div>
          )}
          <div className="flex flex-col lg:text-left">
            {section.title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="mb-6 text-pretty text-3xl font-bold lg:text-4xl"
              >
                {section.title}
              </motion.h2>
            )}
            {section.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg"
              >
                {section.description}
              </motion.p>
            )}
            <StaggerChildren className="flex flex-col justify-center gap-y-8" delay={0.3}>
              {section.items?.map((item, i) => (
                <motion.li
                  key={i}
                  variants={staggerItem}
                  className="flex group cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon && (
                    <div className="relative mr-4">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Icon
                        name={item.icon}
                        className="relative size-6 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div>
                    <div className="mb-3 h-5 text-sm font-semibold text-accent-foreground md:text-base group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground md:text-base">
                      {item.description}
                    </div>
                  </div>
                </motion.li>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </section>
  );
}