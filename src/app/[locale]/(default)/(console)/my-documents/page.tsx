import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Trash2, FileText, Calendar } from "lucide-react";

export default async function MyDocumentsPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  // Mock data for documents
  const documents = [
    {
      id: 1,
      title: "测测测测",
      content: "测测测测撰写身上的微打孔大六大学",
      date: "26 Jun",
      category: "个人陈述",
      wordCount: null,
      isToday: true
    },
    {
      id: 2,
      title: "Demo document",
      content: "The basics. Mispellings and grammatical errors can effect your...",
      date: "26 Jun",
      category: "推荐信", 
      wordCount: 23,
      isToday: true
    },
    {
      id: 3,
      title: "学术论文草稿",
      content: "关于机器学习在自然语言处理中的应用研究...",
      date: "25 Jun",
      category: "学术论文",
      wordCount: 156,
      isToday: false
    },
    {
      id: 4,
      title: "求职信模板",
      content: "尊敬的招聘经理，我对贵公司的软件工程师职位...",
      date: "24 Jun", 
      category: "求职信",
      wordCount: 89,
      isToday: false
    }
  ];

  const todayDocuments = documents.filter(doc => doc.isToday);
  const olderDocuments = documents.filter(doc => !doc.isToday);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("my_documents.title")}
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2">管理您的所有文档</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* View Toggle - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-muted-foreground"></div>
                  <div className="w-2 h-2 bg-muted-foreground"></div>
                  <div className="w-2 h-2 bg-muted-foreground"></div>
                  <div className="w-2 h-2 bg-muted-foreground"></div>
                </div>
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-foreground"></div>
                  <div className="w-4 h-0.5 bg-foreground"></div>
                  <div className="w-4 h-0.5 bg-foreground"></div>
                </div>
              </Button>
            </div>

            {/* Search and New Button Container */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full sm:w-64"
                />
              </div>

              {/* New Document Button */}
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                New document
              </Button>
            </div>
          </div>
        </div>

        {/* Today Section */}
        {todayDocuments.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {todayDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer group p-4 sm:p-6 min-w-0 h-64 sm:h-72 lg:h-80 flex flex-col">
                  <CardHeader className="pb-4 sm:pb-6 lg:pb-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between flex-1">
                      <div className="flex-1 flex flex-col">
                        <div className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 lg:mb-4">{doc.date}</div>
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-base sm:text-lg line-clamp-3 sm:line-clamp-4 leading-relaxed sm:leading-loose flex-1">
                          {doc.content}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-1 sm:pb-2 mt-auto">
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm lg:text-base text-muted-foreground whitespace-nowrap">{doc.category}</span>
                        {doc.wordCount && (
                          <Badge variant="secondary" className="text-xs sm:text-sm lg:text-base bg-primary/10 text-primary rounded-full px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 flex-shrink-0">
                            {doc.wordCount}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 opacity-0 group-hover:opacity-100 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 sm:ml-3 lg:ml-4">
                        <Button variant="ghost" size="sm" className="p-2 sm:p-2 lg:p-3">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2 sm:p-2 lg:p-3">
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Older Documents Section */}
        {olderDocuments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Recent</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {olderDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer group p-4 sm:p-6 min-w-0 h-64 sm:h-72 lg:h-80 flex flex-col">
                  <CardHeader className="pb-4 sm:pb-6 lg:pb-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between flex-1">
                      <div className="flex-1 flex flex-col">
                        <div className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 lg:mb-4">{doc.date}</div>
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-base sm:text-lg line-clamp-3 sm:line-clamp-4 leading-relaxed sm:leading-loose flex-1">
                          {doc.content}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-1 sm:pb-2 mt-auto">
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm lg:text-base text-muted-foreground whitespace-nowrap">{doc.category}</span>
                        {doc.wordCount && (
                          <Badge variant="secondary" className="text-xs sm:text-sm lg:text-base bg-primary/10 text-primary rounded-full px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 flex-shrink-0">
                            {doc.wordCount}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 opacity-0 group-hover:opacity-100 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 sm:ml-3 lg:ml-4">
                        <Button variant="ghost" size="sm" className="p-2 sm:p-2 lg:p-3">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2 sm:p-2 lg:p-3">
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 px-4">Create your first document to get started</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 