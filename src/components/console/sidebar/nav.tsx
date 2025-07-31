"use client";

import { Link } from "@/i18n/navigation";
import { NavItem } from "@/types/blocks/base";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MetallicIcon } from "@/components/icons/metallic";

export default function ({
  className,
  items,
  onItemClick,
  ...props
}: {
  className?: string;
  items: NavItem[];
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1.5",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isActive = item.is_active || pathname.includes(item.url as any);
        
        return (
          <Link
            key={index}
            href={item.url as any}
            onClick={onItemClick}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
              "hover:bg-accent/5"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            
            {/* Icon with subtle animation */}
            {item.icon && (
              <div className="relative z-10">
                <MetallicIcon 
                  name={item.icon} 
                  className={cn(
                    "h-5 w-5 transition-all duration-200 text-gray-500 dark:text-gray-400",
                    "group-hover:scale-110"
                  )}
                />
              </div>
            )}
            
            {/* Text */}
            <span className={cn(
              "relative z-10 truncate transition-all duration-200",
              isActive && "font-semibold"
            )}>
              {item.title}
            </span>
            
            {/* Hover effect */}
            <div className={cn(
              "absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 transition-opacity duration-200",
              "group-hover:opacity-100",
              isActive && "opacity-0"
            )} />
          </Link>
        );
      })}
    </nav>
  );
}
