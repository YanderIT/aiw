import React from "react";
import { cn, isUrl } from "./utils";

export const Rating = ({ level }: { level: number }) => (
  <div className="flex items-center gap-x-1.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className={cn("h-3 w-5 rounded border-2 border-primary", level > index && "bg-primary")}
      />
    ))}
  </div>
);

export const Link = ({ 
  url, 
  icon, 
  iconOnRight, 
  label, 
  className 
}: {
  url: { href: string; label?: string };
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
}) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon ?? <span className="text-primary">🔗</span>)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight && (icon ?? <span className="text-primary">🔗</span>)}
    </div>
  );
};