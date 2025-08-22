"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coins, TrendingUp } from "lucide-react";

interface QuickActionsProps {
  collapsed?: boolean;
  className?: string;
}

export default function QuickActions({ collapsed = false, className }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
 
    {
      icon: Coins,
      label: "充值积分",
      onClick: () => router.push("/pricing"),
      color: "from-purple-500/20 to-purple-600/20",
    },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={actions[0].onClick}
          className={cn(
            "relative w-full overflow-hidden group",
            "border border-orange-200/40 dark:border-orange-600/40",
            "shadow-[0_8px_32px_0_rgba(251,146,60,0.2)] hover:shadow-[0_12px_40px_0_rgba(251,146,60,0.3)]",
            "backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300",
            collapsed ? "h-12 w-12" : "h-12 justify-start gap-3 px-5"
          )}
          style={{
            background: 'linear-gradient(180deg, rgba(255, 215, 140, 0.85) 0%, rgba(255, 200, 100, 0.65) 40%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(20px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
            boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(255, 200, 100, 0.15)',
          }}
        >
          {/* Glass effect overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50 pointer-events-none"
            style={{
              borderRadius: 'inherit',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* 3D depth effect */}
          <div 
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"
            style={{
              borderRadius: 'inherit',
            }}
          />
          
          {/* Animated shine effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-200%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Icon */}
          <div className="relative z-10">
            <Coins className="h-5 w-5 text-amber-600/70" />
          </div>
          
          {!collapsed && (
            <span className="relative z-10 text-base font-medium text-amber-700/80">
              充值积分
            </span>
          )}
          
          {/* Trending up icon accent */}
          {!collapsed && (
            <motion.div
              animate={{
                y: [0, -3, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="ml-auto"
            >
              {/* <TrendingUp className="h-4 w-4 text-amber-600/60" /> */}
            </motion.div>
          )}
          
          {collapsed && (
            <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md group-hover:block whitespace-nowrap">
              充值积分
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}