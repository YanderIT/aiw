"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Sparkles, Loader2 } from "lucide-react";

interface AITextareaProps extends React.ComponentProps<"textarea"> {
  onAIGenerate?: () => void;
  aiGenerating?: boolean;
  showAIButton?: boolean;
  contextHint?: string;
  autoResize?: boolean;
  maxHeight?: number;
}

const AITextarea = React.forwardRef<HTMLTextAreaElement, AITextareaProps>(
  (
    {
      className,
      onAIGenerate,
      aiGenerating = false,
      showAIButton = true,
      contextHint,
      disabled,
      value,
      onChange,
      autoResize = true,
      maxHeight = 400,
      ...props
    },
    forwardedRef
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    // Combine refs
    const textareaRef = React.useCallback((node: HTMLTextAreaElement | null) => {
      (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    }, [forwardedRef]);

    // Auto-resize effect
    React.useEffect(() => {
      if (!autoResize || !internalRef.current) return;
      
      const textarea = internalRef.current;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      
      // Set the new height
      textarea.style.height = `${newHeight}px`;
      
      // Add overflow-y auto when max height is reached
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }, [value, autoResize, maxHeight]);

    const handleAIGenerate = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!aiGenerating && onAIGenerate) {
        onAIGenerate();
      }
    };

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Textarea
          ref={textareaRef}
          className={cn(
            "resize-none pr-24 transition-height duration-200",
            showAIButton && "min-h-[100px]",
            className
          )}
          disabled={disabled || aiGenerating}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={onChange}
          {...props}
        />
        
        {showAIButton && !disabled && (
          <div
            className={cn(
              "absolute bottom-2 right-2 transition-opacity duration-200",
              (isFocused || isHovered) ? "opacity-100" : "opacity-70"
            )}
          >
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              className={cn(
                "h-7 px-2.5 text-xs font-medium",
                "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
                "border-orange-200 dark:border-orange-800",
                "text-orange-700 dark:text-orange-300",
                "hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-950/50 dark:hover:to-amber-950/50",
                "hover:border-orange-300 dark:hover:border-orange-700",
                "hover:text-orange-800 dark:hover:text-orange-200",
                "transition-all duration-200",
                aiGenerating && "cursor-wait opacity-80"
              )}
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI 生成
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

AITextarea.displayName = "AITextarea";

export { AITextarea };