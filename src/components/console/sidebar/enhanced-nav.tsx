"use client";

import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { NavItem } from "@/types/blocks/base";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface EnhancedNavProps {
  className?: string;
  items: NavItem[];
  onItemClick?: () => void;
  showLabels?: boolean;
  collapsed?: boolean;
}

export default function EnhancedNav({
  className,
  items,
  onItemClick,
  showLabels = true,
  collapsed = false,
  ...props
}: EnhancedNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "relative flex flex-col space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isActive = item.is_active || pathname.includes(item.url as any);
        
        return (
          <motion.div
            key={index}
            initial={false}
            animate={{ 
              scale: 1,
              opacity: 1 
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={item.url as any}
              onClick={onItemClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {/* Background gradient for active state */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Active indicator line */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Icon container with glow effect */}
              {item.icon && (
                <div className="relative z-10 flex items-center justify-center">
                  <div className={cn(
                    "relative transition-all duration-300",
                    isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                  )}>
                    <Icon 
                      name={item.icon} 
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isActive 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-foreground",
                        "group-hover:rotate-6 group-hover:scale-110"
                      )} 
                    />
                  </div>
                </div>
              )}
              
              {/* Text with fade animation */}
              <AnimatePresence>
                {showLabels && !collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative z-10 flex-1 truncate transition-all duration-300",
                      isActive && "font-semibold tracking-wide"
                    )}
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Arrow indicator for active item */}
              <AnimatePresence>
                {isActive && showLabels && !collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="relative z-10 ml-auto"
                  >
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Hover overlay effect */}
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-xl bg-gradient-to-r from-muted/0 via-muted/50 to-muted/0",
                  "opacity-0 transition-opacity duration-300",
                  !isActive && "group-hover:opacity-100"
                )}
                initial={false}
                whileHover={{
                  opacity: isActive ? 0 : 0.5,
                }}
              />
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md group-hover:block">
                  {item.title}
                </div>
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}