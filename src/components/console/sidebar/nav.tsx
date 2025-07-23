"use client";

import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { NavItem } from "@/types/blocks/base";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

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
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.url as any}
          onClick={onItemClick}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            item.is_active || pathname.includes(item.url as any)
              ? "bg-muted/50 text-primary hover:bg-muted hover:text-primary"
              : "hover:bg-transparent hover:underline",
            "justify-start w-full"
          )}
        >
          {item.icon && <Icon name={item.icon} className="w-4 h-4 mr-2" />}
          <span className="truncate">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
