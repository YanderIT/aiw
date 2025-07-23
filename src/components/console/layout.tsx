"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import SidebarNav from "@/components/console/sidebar/nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlobalLoadingWrapper } from "@/components/ui/global-loading-wrapper";

export default function ConsoleLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: Sidebar;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <div className="container max-w-none py-4 md:py-8 mx-auto px-4 md:px-8">
        <div className="w-full space-y-6 p-2 md:p-4 pb-16 block">
          {/* 移动端顶部导航栏 */}
          {isMobile && sidebar?.nav?.items && (
            <div className="flex items-center justify-between pb-4 border-b lg:hidden">
              <h1 className="text-xl font-semibold">控制台</h1>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">打开菜单</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[300px] overflow-y-auto">
                  <SheetHeader className="text-left">
                    <SheetTitle>导航菜单</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 h-full overflow-y-auto">
                    <SidebarNav 
                      items={sidebar.nav.items} 
                      className="flex flex-col space-y-1 w-full"
                      onItemClick={() => setIsOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* 主要内容区域 */}
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full">
            {/* 桌面端sidebar */}
            {sidebar?.nav?.items && (
              <aside className="hidden lg:block md:min-w-40 flex-shrink-0">
                <div className="sticky top-8">
                  <SidebarNav items={sidebar.nav.items} />
                </div>
              </aside>
            )}
            
            {/* 主内容区域 */}
            <div className="flex-1 w-full min-w-0 max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
      <GlobalLoadingWrapper />
    </>
  );
}
