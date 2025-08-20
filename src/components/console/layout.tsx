"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/types/blocks/sidebar";
import SidebarNav from "@/components/console/sidebar/nav";
import QuickActions from "@/components/console/sidebar/quick-actions";
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
  const pathname = usePathname();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container max-w-none mx-auto">
          <div className="flex min-h-screen">
            {/* 桌面端 Sidebar */}
            {sidebar?.nav?.items && (
              <aside className="hidden lg:flex w-64 xl:w-72 flex-col">
                <div className="flex h-full flex-col overflow-y-auto px-6">
                  {/* Quick Actions - aligned with main content */}
                  <div className={`${pathname?.includes('/creation-center') ? 'pt-58' : 'pt-28'} pb-6`}>
                    <QuickActions />
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex-1">
                    <SidebarNav items={sidebar.nav.items} />
                  </nav>
                </div>
              </aside>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Mobile Header */}
              {isMobile && sidebar?.nav?.items && (
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">打开菜单</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                      <div className="flex h-full flex-col">
                        <div className="px-6 py-6 border-b border-border/50">
                          <h2 className="text-lg font-semibold">菜单</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-6">
                          <div className="mb-6">
                            <QuickActions />
                          </div>
                          <SidebarNav 
                            items={sidebar.nav.items} 
                            className="flex flex-col space-y-1 w-full"
                            onItemClick={() => setIsOpen(false)}
                          />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <h1 className="text-lg font-semibold">控制台</h1>
                </header>
              )}

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
      <GlobalLoadingWrapper />
    </>
  );
}
