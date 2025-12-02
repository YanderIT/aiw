"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Trophy,
  CheckSquare,
  Eye,
  Layout,
  LayoutGrid,
  Palette,
  Download,
  ChevronRight,
  ChevronDown,
  FileText,
  Search,
  BookOpen,
  Zap,
  Sparkles,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import zhMessages from "@/i18n/pages/help/zh.json";
import enMessages from "@/i18n/pages/help/en.json";

interface HelpClientProps {
  locale: string;
}

const sectionIcons: Record<string, React.ReactNode> = {
  getting_started: <BookOpen className="w-4 h-4" />,
  personal_info: <User className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  work_experience: <Briefcase className="w-4 h-4" />,
  research_projects: <FlaskConical className="w-4 h-4" />,
  activities: <Trophy className="w-4 h-4" />,
  module_selection: <CheckSquare className="w-4 h-4" />,
  preview_edit: <Eye className="w-4 h-4" />,
  template_selection: <Layout className="w-4 h-4" />,
  layout_management: <LayoutGrid className="w-4 h-4" />,
  theme_color: <Palette className="w-4 h-4" />,
  export: <Download className="w-4 h-4" />,
};

// 分类配置
const categories = {
  zh: {
    quick_start: {
      title: "快速开始",
      icon: <Zap className="w-4 h-4" />,
      sections: ["getting_started"],
    },
    basic_info: {
      title: "基础信息填写",
      icon: <FileText className="w-4 h-4" />,
      sections: ["personal_info", "education", "work_experience", "research_projects", "activities"],
    },
    advanced: {
      title: "高级功能",
      icon: <Sparkles className="w-4 h-4" />,
      sections: ["module_selection", "preview_edit", "template_selection", "layout_management", "theme_color", "export"],
    },
  },
  en: {
    quick_start: {
      title: "Quick Start",
      icon: <Zap className="w-4 h-4" />,
      sections: ["getting_started"],
    },
    basic_info: {
      title: "Basic Information",
      icon: <FileText className="w-4 h-4" />,
      sections: ["personal_info", "education", "work_experience", "research_projects", "activities"],
    },
    advanced: {
      title: "Advanced Features",
      icon: <Sparkles className="w-4 h-4" />,
      sections: ["module_selection", "preview_edit", "template_selection", "layout_management", "theme_color", "export"],
    },
  },
};

export default function HelpClient({ locale }: HelpClientProps) {
  const messages = locale === "zh" ? zhMessages.help : enMessages.help;
  const categoryConfig = locale === "zh" ? categories.zh : categories.en;

  const [activeSection, setActiveSection] = useState<string>("getting_started");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["quick_start", "basic_info", "advanced"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sections = messages.sections;

  type SectionKey = keyof typeof sections;

  // 监听滚动更新当前section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (const [categoryKey, category] of Object.entries(categoryConfig)) {
        for (const key of category.sections) {
          const element = sectionRefs.current[key];
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(key);
              // 确保分类展开
              if (!expandedCategories.includes(categoryKey)) {
                setExpandedCategories((prev) => [...prev, categoryKey]);
              }
              return;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categoryConfig, expandedCategories]);

  // 滚动到指定section
  const scrollToSection = (key: string) => {
    setActiveSection(key);
    setIsMobileMenuOpen(false);
    const element = sectionRefs.current[key];
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  // 搜索过滤
  const filterSections = (sectionKeys: string[]) => {
    if (!searchQuery.trim()) return sectionKeys;
    return sectionKeys.filter((key) => {
      const section = sections[key as SectionKey];
      if (!section) return false;
      const sectionData = section as { title: string; description: string; tips?: string[] };
      const searchText = `${sectionData.title} ${sectionData.description} ${sectionData.tips?.join(" ") || ""}`.toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    });
  };

  // 切换分类展开
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 渲染左侧导航项
  const renderNavItem = (key: string) => {
    const section = sections[key as SectionKey];
    if (!section) return null;
    const sectionData = section as { title: string };

    return (
      <button
        key={key}
        onClick={() => scrollToSection(key)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-left",
          activeSection === key
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <span className="truncate">{sectionData.title}</span>
      </button>
    );
  };

  // 渲染内容区section
  const renderSection = (key: string) => {
    const section = sections[key as SectionKey];
    if (!section) return null;

    const sectionData = section as {
      title: string;
      description: string;
      tips?: string[];
      after_tips?: string;
      extra_tips?: string[];
      warning?: string;
      image?: string;
      image_alt?: string;
      after_image?: string;
      extra_tips2?: string[];
      final_text?: string;
      image2?: string;
      image2_alt?: string;
      after_image2?: string;
      features?: {
        order?: { title: string; description: string; examples?: string[] };
        layout?: { title: string; description: string };
      };
      colors?: { name: string; style: string }[];
      formats?: {
        pdf?: { title: string; suitable_for: string[] };
        word?: { title: string; suitable_for: string[] };
      };
      tip?: string;
    };

    // 解析 markdown 加粗
    const renderTextWithBold = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part: string, i: number) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    return (
      <div
        key={key}
        ref={(el) => { sectionRefs.current[key] = el; }}
        id={key}
        className="scroll-mt-24 pb-8 border-b border-border/50 last:border-b-0"
      >
        {/* Section Title */}
        <h2 className="text-xl font-semibold mb-4">
          {sectionData.title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {sectionData.description}
        </p>

        {/* Tips */}
        {sectionData.tips && sectionData.tips.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {sectionData.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground/50 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* After Tips Text */}
        {sectionData.after_tips && (
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {sectionData.after_tips}
          </p>
        )}

        {/* Extra Tips */}
        {sectionData.extra_tips && sectionData.extra_tips.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {sectionData.extra_tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground/50 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Image */}
        {sectionData.image && (
          <div className="mb-4">
            <Image
              src={sectionData.image}
              alt={sectionData.image_alt || ""}
              width={400}
              height={200}
              className="max-w-full h-auto"
              unoptimized
            />
          </div>
        )}

        {/* After Image Text */}
        {sectionData.after_image && (
          <p className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-line">
            {renderTextWithBold(sectionData.after_image)}
          </p>
        )}

        {/* Extra Tips 2 */}
        {sectionData.extra_tips2 && sectionData.extra_tips2.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {sectionData.extra_tips2.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground/50 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Final Text */}
        {sectionData.final_text && (
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {sectionData.final_text}
          </p>
        )}

        {/* Image 2 */}
        {sectionData.image2 && (
          <div className="mb-4">
            <Image
              src={sectionData.image2}
              alt={sectionData.image2_alt || ""}
              width={400}
              height={200}
              className="max-w-full h-auto"
              unoptimized
            />
          </div>
        )}

        {/* After Image 2 Text */}
        {sectionData.after_image2 && (
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {renderTextWithBold(sectionData.after_image2)}
          </p>
        )}

        {/* Warning */}
        {sectionData.warning && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <span className="font-medium">{locale === "zh" ? "注意：" : "Note: "}</span>
              {sectionData.warning}
            </p>
          </div>
        )}

        {/* Features (for layout_management) */}
        {sectionData.features && (
          <div className="mb-6 space-y-4">
            {sectionData.features.order && (
              <div>
                <h4 className="font-medium text-sm mb-2">{sectionData.features.order.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{sectionData.features.order.description}</p>
                {sectionData.features.order.examples && (
                  <div className="flex flex-wrap gap-2">
                    {sectionData.features.order.examples.map((example: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {sectionData.features.layout && (
              <div>
                <h4 className="font-medium text-sm mb-2">{sectionData.features.layout.title}</h4>
                <p className="text-sm text-muted-foreground">{sectionData.features.layout.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Colors (for theme_color) */}
        {sectionData.colors && (
          <div className="mb-6 flex flex-wrap gap-3">
            {sectionData.colors.map((color: { name: string; style: string }, i: number) => (
              <div
                key={i}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm",
                  color.name === "红色" || color.name === "Red"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : color.name === "蓝色" || color.name === "Blue"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : color.name === "绿色" || color.name === "Green"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {color.name} - {color.style}
              </div>
            ))}
          </div>
        )}

        {/* Formats (for export) */}
        {sectionData.formats && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {sectionData.formats.pdf && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm mb-2">{sectionData.formats.pdf.title}</div>
                <ul className="space-y-1">
                  {sectionData.formats.pdf.suitable_for.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-muted-foreground/50">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sectionData.formats.word && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm mb-2">{sectionData.formats.word.title}</div>
                <ul className="space-y-1">
                  {sectionData.formats.word.suitable_for.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-muted-foreground/50">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Extra tip */}
        {sectionData.tip && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {sectionData.tip}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background shadow-md"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        {/* Left Sidebar */}
        <aside
          className={cn(
            "w-64 shrink-0 border-r border-border",
            "fixed lg:fixed top-16 left-0",
            "h-[calc(100vh-4rem)]",
            "bg-background",
            "z-40",
            "transform transition-transform duration-200",
            "overflow-y-auto",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="p-4 space-y-4">
            {/* Logo/Title */}
            <div className="px-2 py-1">
              <span className="font-medium text-sm">{messages.label}</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={locale === "zh" ? "搜索..." : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-muted/50 border-0"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {Object.entries(categoryConfig).map(([categoryKey, category]) => {
                const filteredSections = filterSections(category.sections);
                if (filteredSections.length === 0) return null;
                const isExpanded = expandedCategories.includes(categoryKey);

                return (
                  <div key={categoryKey}>
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <span>{category.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {filteredSections.map((key) => renderNavItem(key))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Breadcrumb */}
          <div className="border-b border-border bg-muted/30">
            <div className="max-w-4xl mx-auto px-6 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span>{messages.label}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-3">{messages.title}</h1>
              <p className="text-muted-foreground">{messages.description}</p>
            </div>

            {/* Quick Tips */}
            <div className="mb-10 p-4 bg-muted/30 rounded-lg">
              <div className="font-medium mb-3">{messages.quick_tips.title}</div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {messages.quick_tips.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-medium">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {Object.entries(categoryConfig).map(([categoryKey, category]) => {
                const filteredSections = filterSections(category.sections);
                if (filteredSections.length === 0) return null;

                return (
                  <div key={categoryKey}>
                    {/* Category Header */}
                    <div className="mb-6 pb-2 border-b border-border">
                      <h2 className="text-lg font-semibold">{category.title}</h2>
                    </div>
                    {/* Sections */}
                    <div className="space-y-8">
                      {filteredSections.map((key) => renderSection(key))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {searchQuery && Object.values(categoryConfig).every(
              (cat) => filterSections(cat.sections).length === 0
            ) && (
              <div className="text-center py-16">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {locale === "zh" ? "未找到相关内容" : "No results found"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "zh"
                    ? "请尝试使用其他关键词搜索"
                    : "Try searching with different keywords"}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right TOC (optional, for larger screens) */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-20 p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {locale === "zh" ? "本页内容" : "On this page"}
            </div>
            <nav className="space-y-1">
              {Object.values(categoryConfig).flatMap((category) =>
                filterSections(category.sections).map((key) => {
                  const section = sections[key as SectionKey];
                  if (!section) return null;
                  const sectionData = section as { title: string };
                  return (
                    <button
                      key={key}
                      onClick={() => scrollToSection(key)}
                      className={cn(
                        "block w-full text-left text-xs py-1 px-2 rounded transition-colors truncate",
                        activeSection === key
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {sectionData.title}
                    </button>
                  );
                })
              )}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
