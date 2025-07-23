import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Icon } from "@/components/icon";
import Link from "next/link";

export default async function CreationCenterPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  const categories = [
    { id: "all", name: "精选", active: true },
    { id: "statement", name: "陈述文书", active: false },
    { id: "recommendation", name: "推荐信", active: false },
    { id: "application", name: "申请", active: false },
    { id: "resume", name: "简历", active: false },
    { id: "cover", name: "求职", active: false },
    { id: "academic", name: "留学专业服务", active: false },
  ];

  const featuredTools = [
    // {
    //   icon: "document-polish",
    //   title: "文书专家润色",
    //   description: "资深专业的润色大师，包含文字、语境、润色及质量全流程处理",
    //   price: null,
    //   category: "featured"
    // },
    {
      icon: "personal-statement-write",
      title: "个人陈述撰写",
      description: "我们提供专业顾问的专业工具，包含文档/推荐信/个人陈述等关键问题",
      price: 100,
      category: "featured",
      url: undefined
    },
    {
      icon: "one-on-one-consulting",
      title: "1对1留学咨询",
      description: "您此时此刻的疑惑可能无数人都曾经历过，不妨和过来人聊一聊，我们会根据您的问题匹配最专业对口的老师以确保您有所收获",
      price: null,
      category: "featured",
      url: undefined
    }
  ];

  const documentTools = [
    {
      icon: "personal-statement-write",
      title: "个人陈述撰写",
      description: "我们提供专业顾问的专业工具，包含文档/推荐信/个人陈述等关键问题",
      price: 100,
      category: "statement",
      url: undefined
    },
    // {
    //   icon: "purpose-statement-write",
    //   title: "目的陈述撰写",
    //   description: "目的陈述适合个人检查专业院校的申请专业理由，协助我们进行针对性的查询意向重点处理",
    //   price: 100,
    //   category: "statement"
    // },
    // {
    //   icon: "personal-statement-polish",
    //   title: "个人陈述润色",
    //   description: "用户需要提供已有的个人陈述进行润色质量检查，我们针对该文档进行专业化处理，并根据目前文档内容提供专业化建议",
    //   price: 100,
    //   category: "statement"
    // },
    // {
    //   icon: "personal-statement-evaluate",
    //   title: "个人陈述评估",
    //   description: "不满意自己的个人陈述？个人陈述整体评估功能？让AI帮您检查文档情况",
    //   price: 60,
    //   category: "statement"
    // },
    {
      icon: "sop-statement",
      title: "SOP 目的陈述撰写",
      description: "专业的Statement of Purpose撰写服务，帮助您清晰表达学术目标和研究兴趣，展现个人动机和未来规划",
      price: 120,
      category: "statement",
      url: undefined
    },
    {
      icon: "document-polish",
      title: "Cover Letter撰写",
      description: "专业的Cover Letter撰写服务，帮助您清晰表达学术目标和研究兴趣，展现个人动机和未来规划",
      price: 90,
      category: "statement",
      url: "/cover-letter"
    }
  ];

  const recommendationTools = [
    {
      icon: "recommendation-letter-write",
      title: "推荐信撰写",
      description: "我们提供针对性的推荐信工具，支持科研推荐/实习/理科等专业推荐场景",
      price: 100,
      category: "recommendation",
      url: "/recommendation-letter"
    },
    // {
    //   icon: "recommendation-letter-polish",
    //   title: "推荐信润色",
    //   description: "用户需要提供已有的推荐信进行润色质量检查，我们ITN的专业顾问为工具提供专业化修改建议",
    //   price: 100,
    //   category: "recommendation"
    // },
    // {
    //   icon: "recommendation-letter-evaluate",
    //   title: "推荐信评估",
    //   description: "还不满意——针对推荐信进行整体具体评估？让AI帮您检查评估？",
    //   price: 50,
    //   category: "recommendation"
    // }
  ];

  const resumeTools = [
    {
      icon: "resume-generate",
      title: "简历生成",
      description: "AI智能简历生成器，根据您的个人信息、教育背景、工作经验等自动生成专业的简历模板，支持多种格式导出",
      price: 80,
      category: "resume",
      url: "/resume-generator"
    }
  ];

  const allTools = [...featuredTools, ...documentTools, ...recommendationTools, ...resumeTools];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t("creation_center.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI工具让学申请简单、高效、低价
            </p>
            
            {/* Search Bar */}
            {/* <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索工具..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={category.active ? "default" : "ghost"}
                className={category.active ? "bg-primary text-primary-foreground" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">精选</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTools.map((tool, index) => (
              tool.url ? (
                <Link key={index} href={tool.url}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Icon name={tool.icon} size={48} />
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Icon name={tool.icon} size={48} />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            ))}
          </div>
        </div>

        {/* Document Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">陈述文书</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTools.map((tool, index) => (
              tool.url ? (
                <Link key={index} href={tool.url}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Icon name={tool.icon} size={48} />
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {tool.description}
                          </CardDescription>
                          {tool.price && (
                            <div className="mt-3">
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                💰 {tool.price}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Icon name={tool.icon} size={48} />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {tool.description}
                        </CardDescription>
                        {tool.price && (
                          <div className="mt-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              💰 {tool.price}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            ))}
          </div>
        </div>

        {/* Recommendation Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">推荐信</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendationTools.map((tool, index) => (
              tool.url ? (
                <Link key={index} href={tool.url}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Icon name={tool.icon} size={48} />
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {tool.description}
                          </CardDescription>
                          {tool.price && (
                            <div className="mt-3">
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                💰 {tool.price}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Icon name={tool.icon} size={48} />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {tool.description}
                        </CardDescription>
                        {tool.price && (
                          <div className="mt-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              💰 {tool.price}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            ))}
          </div>
        </div>

        {/* Resume Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">简历</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeTools.map((tool, index) => (
              tool.url ? (
                <Link key={index} href={tool.url}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Icon name={tool.icon} size={48} />
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {tool.description}
                          </CardDescription>
                          {tool.price && (
                            <div className="mt-3">
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                💰 {tool.price}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Icon name={tool.icon} size={48} />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {tool.description}
                        </CardDescription>
                        {tool.price && (
                          <div className="mt-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              💰 {tool.price}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 