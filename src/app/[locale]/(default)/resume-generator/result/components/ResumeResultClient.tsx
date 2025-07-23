"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { 
  CheckCircle, 
  Square, 
  CheckSquare, 
  Download, 
  FileText,
  Edit3,
  Layout,
  ChevronDown,
  GripVertical,
  ArrowRight,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";


// Import context and modules
import { ResumeProvider, useResume } from "../../components/ResumeContext";
import HeaderModule from "../../components/modules/HeaderModule";
import EducationModule from "../../components/modules/EducationModule";
import WorkExperienceModule from "../../components/modules/WorkExperienceModule";
import ResearchModule from "../../components/modules/ResearchModule";
import ActivitiesModule from "../../components/modules/ActivitiesModule";
import AwardsModule from "../../components/modules/AwardsModule";
import SkillsLanguageModule from "../../components/modules/SkillsLanguageModule";
import { CompactThemeColorPicker } from "../../components/templates/shared/CompactThemeColorPicker";
import { getThemeColor, getThemeFromScale, getColorFromScale } from "../../components/templates/shared/theme-colors";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Import SVG icons
import HeaderIcon from "../../components/icons/HeaderIcon";
import EducationIcon from "../../components/icons/EducationIcon";
import WorkExperienceIcon from "../../components/icons/WorkExperienceIcon";
import ResearchIcon from "../../components/icons/ResearchIcon";
import ActivitiesIcon from "../../components/icons/ActivitiesIcon";
import AwardsIcon from "../../components/icons/AwardsIcon";
import SkillsLanguageIcon from "../../components/icons/SkillsLanguageIcon";

// Import template system
import { mapToStandardFormat } from "@/lib/resume-field-mapping";
import { KakunaTemplate } from "../../components/templates/kakuna";
import { DittoTemplate } from "../../components/templates/ditto";
import { TemplateSelector } from "../../components/TemplateSelector";


export interface ResumeModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// 可拖拽的模块组件
const DraggableModuleItem = ({ 
  moduleId, 
  title, 
  area, 
  index,
  onMoveToMain, 
  onMoveToSidebar,
  onReorder
}: {
  moduleId: string;
  title: string;
  area: 'main' | 'sidebar';
  index: number;
  onMoveToMain: (moduleId: string) => void;
  onMoveToSidebar: (moduleId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number, area: 'main' | 'sidebar') => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'module',
    item: { id: moduleId, area, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'module',
    hover: (item: { id: string; area: 'main' | 'sidebar'; index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      // 如果是同一个元素，不处理
      if (item.id === moduleId) {
        return;
      }

      // 如果是不同区域，移动到对应区域
      if (item.area !== area) {
        if (area === 'main') {
          onMoveToMain(item.id);
        } else {
          onMoveToSidebar(item.id);
        }
        return;
      }

      // 同一区域内重新排序
      if (item.area === area && item.index !== index) {
        onReorder(item.index, index, area);
        item.index = index;
      }
    },
  });

  const targetArea = area === 'main' ? 'sidebar' : 'main';
  const handleMove = () => {
    if (area === 'main') {
      onMoveToSidebar(moduleId);
    } else {
      onMoveToMain(moduleId);
    }
  };

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`
        flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm
        cursor-move transition-all duration-200 hover:shadow-md
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${area === 'main' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}
      `}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleMove}
        className="p-1 h-6 w-6"
        title={`移动到 ${targetArea === 'main' ? '主要区域' : '侧边栏'}`}
      >
        {area === 'main' ? (
          <ArrowRight className="w-3 h-3" />
        ) : (
          <ArrowLeft className="w-3 h-3" />
        )}
      </Button>
    </div>
  );
};




// 获取模板组件
const getTemplateComponent = (templateName: string) => {
  switch (templateName) {
    case "kakuna":
      return KakunaTemplate;
    case "ditto":
      return DittoTemplate;
    case "gengar":
      return KakunaTemplate; // 暂时使用Kakuna模板，待GengarTemplate开发完成后替换
    default:
      return DittoTemplate; // 默认使用 Ditto 模板
  }
};

function ResumeResultContent() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("header");
  const [zoomLevel, setZoomLevel] = useState(1); // Will be calculated dynamically
  const [defaultZoom, setDefaultZoom] = useState(1); // Store the calculated default
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    data, 
    isModuleSelected, 
    isModuleRequired,
    toggleModuleSelection,
    updateSelectedTemplate,
    updateThemeColor,
    moveModuleToMain,
    moveModuleToSidebar,
    reorderMainSections,
    reorderSidebarSections
  } = useResume();
  
  // 使用 context 中的模板选择，而不是本地 state
  const selectedTemplate = data.selectedTemplate;

  // 计算适合屏幕的默认缩放比例
  const calculateDefaultZoom = () => {
    if (!resumeContainerRef.current) return 1;
    
    const container = resumeContainerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // A4 paper dimensions in pixels at 96 DPI
    const a4Width = 794; // 210mm at 96 DPI
    const a4Height = 1123; // 297mm at 96 DPI
    
    // Calculate zoom to fit width with some padding
    const paddingFactor = 0.9; // 90% of container width
    const zoomToFitWidth = (containerWidth * paddingFactor) / a4Width;
    const zoomToFitHeight = (containerHeight * paddingFactor) / a4Height;
    
    // Use the smaller zoom to ensure it fits both width and height
    let calculatedZoom = Math.min(zoomToFitWidth, zoomToFitHeight);
    
    // Clamp between min and max zoom levels
    calculatedZoom = Math.max(0.5, Math.min(2, calculatedZoom));
    
    return calculatedZoom;
  };

  // Set initial zoom based on screen size
  useEffect(() => {
    // Small delay to ensure container is fully rendered
    setTimeout(() => {
      const initialZoom = calculateDefaultZoom();
      setDefaultZoom(initialZoom);
      setZoomLevel(initialZoom);
    }, 100);
  }, []);

  // Update zoom when window resizes
  useEffect(() => {
    const handleResize = () => {
      const newDefaultZoom = calculateDefaultZoom();
      setDefaultZoom(newDefaultZoom);
      // Optionally update current zoom to match new default
      // setZoomLevel(newDefaultZoom);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取模块显示名称
  const getSectionDisplayName = (moduleId: string): string => {
    const sectionNames: { [key: string]: string } = {
      'experience': '工作经历',
      'education': '教育背景',
      'research': '研究项目', 
      'activities': '课外活动',
      'profiles': '个人资料',
      'skills': '技能',
      'certifications': '证书',
      'awards': '获奖情况',
      'languages': '语言'
    };
    return sectionNames[moduleId] || moduleId;
  };

  // 处理重新排序
  const handleReorder = (dragIndex: number, hoverIndex: number, area: 'main' | 'sidebar') => {
    if (area === 'main') {
      const newMainSections = [...data.layoutConfiguration.mainSections];
      const draggedItem = newMainSections.splice(dragIndex, 1)[0];
      newMainSections.splice(hoverIndex, 0, draggedItem);
      reorderMainSections(newMainSections);
    } else {
      const newSidebarSections = [...data.layoutConfiguration.sidebarSections];
      const draggedItem = newSidebarSections.splice(dragIndex, 1)[0];
      newSidebarSections.splice(hoverIndex, 0, draggedItem);
      reorderSidebarSections(newSidebarSections);
    }
  };

  // 缩放控制函数
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 50%
  };

  const handleZoomReset = () => {
    setZoomLevel(defaultZoom); // Reset to calculated default
  };

  // 处理滚轮缩放
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + delta)));
    }
  };

  // 可用模板选项
  const templateOptions = [
    { 
      value: "kakuna", 
      label: "Kakuna", 
      subtitle: "留学申研", 
      description: "简洁现代的单栏布局，适合大多数职业应用",
      color: "from-blue-500 to-purple-600",
      image: "/imgs/templates/kakuna.jpg"
    },
    { 
      value: "ditto", 
      label: "Ditto", 
      subtitle: "求职简历", 
      description: "专业的双栏侧边栏布局，信息层次清晰",
      color: "from-emerald-500 to-teal-600",
      image: "/imgs/templates/ditto.jpg"
    },
    { 
      value: "gengar", 
      label: "Gengar", 
      subtitle: "创意设计", 
      description: "独特的创意布局，适合设计类职业",
      color: "from-purple-500 to-pink-600",
      image: "/imgs/templates/gengar.jpg"
    }
  ];

  const modules: ResumeModule[] = [
    {
      id: "template",
      title: "选择模板",
      icon: Layout,
      component: TemplateSelector,
    },
    {
      id: "header",
      title: "个人背景",
      icon: HeaderIcon,
      component: HeaderModule,
    },
    {
      id: "education",
      title: "教育经历",
      icon: EducationIcon,
      component: EducationModule,
    },
    {
      id: "workExperience",
      title: "实习/工作经历",
      icon: WorkExperienceIcon,
      component: WorkExperienceModule,
    },
    {
      id: "research",
      title: "学术研究兴趣",
      icon: ResearchIcon,
      component: ResearchModule,
    },
    {
      id: "activities",
      title: "课外活动",
      icon: ActivitiesIcon,
      component: ActivitiesModule,
    },
    {
      id: "awards",
      title: "获奖情况",
      icon: AwardsIcon,
      component: AwardsModule,
    },
    {
      id: "skillsLanguage",
      title: "技能语言",
      icon: SkillsLanguageIcon,
      component: SkillsLanguageModule,
    },
  ];


  const editableModules = modules.slice(1); // Exclude template selector
  const currentModule = editableModules.find(m => m.id === activeTab);
  const ActiveComponent = currentModule?.component || HeaderModule;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b">
        <div className="w-full max-w-none px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">简历模板预览</h1>
                <p className="text-muted-foreground text-base">
                  编辑内容并预览您的简历模板
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                模板预览
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-none px-6 py-3">
        <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-150px)] w-full">
          
          {/* Left Column - Module Navigation Tabs */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm h-full lg:h-full min-h-[300px]">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-6">
                内容模块
              </h3>
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto">
                {modules.slice(1).map((module) => { // Skip template selector module
                  const Icon = module.icon;
                  // Map module IDs to context keys
                  const moduleKey = module.id === 'workExperience' ? 'workExperience' : 
                                   module.id === 'skillsLanguage' ? 'skillsLanguage' : 
                                   module.id;
                  const isSelected = isModuleSelected(moduleKey as any);
                  const isRequired = isModuleRequired(moduleKey as any);
                  
                  return (
                    <div key={module.id} className="group relative">
                      <button
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 relative ${
                          activeTab === module.id
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : isSelected
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "hover:bg-muted/50 text-foreground"
                        }`}
                        onClick={() => setActiveTab(module.id)}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{module.title}</div>
                          {isRequired && (
                            <div className="text-xs text-red-500 font-medium"></div>
                          )}
                        </div>
                        
                        {/* 集成的选择按钮 */}
                        <button
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isRequired 
                              ? "bg-gray-100 text-red-300 cursor-not-allowed" 
                              : isSelected 
                              ? "bg-primary text-primary-foreground shadow-sm hover:scale-110" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-110"
                          } ${activeTab === module.id && !isRequired ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isRequired) {
                              toggleModuleSelection(moduleKey as any);
                            }
                          }}
                          disabled={isRequired}
                          title={isRequired ? "此模块为必选，无法取消" : undefined}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Column - Module Editing + Resume Preview */}
          <div className="w-full lg:flex-1 flex flex-col lg:flex-row gap-4">
            {/* Module Editing Area */}
            <div className="w-full lg:w-1/3 lg:min-w-[280px] flex-shrink-0">
              <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm h-full flex flex-col min-h-[600px]">
                {/* Active Module Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {currentModule ? (
                        <>
                          <currentModule.icon className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">
                            {currentModule.title}
                          </h3>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">
                            选择模块进行编辑
                          </h3>
                        </>
                      )}
                    </div>
                    <ActiveComponent />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Preview Area */}
            <div className="w-full lg:flex-1 lg:min-w-[400px] flex-shrink-0">
              <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm h-full flex flex-col min-h-[600px]">
                {/* Preview Header */}
                <div className="border-b border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">简历预览</h3>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            const currentTemplate = templateOptions.find(t => t.value === selectedTemplate);
                            return `当前模板: ${currentTemplate?.label || '未选择'}`;
                          })()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="bg-white/80 border-white/20 shadow-sm hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      打印
                    </Button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 p-1 relative">
                  <div 
                    ref={resumeContainerRef}
                    className="w-full h-full overflow-y-auto overflow-x-auto rounded-xl relative resume-scroll-container"
                    style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                    }}
                    onWheel={handleWheel}
                  >
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-xl pointer-events-none"></div>
                    <div className="absolute top-4 left-4 w-16 h-16 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-secondary/10 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
                    
                    <div className="relative flex justify-center p-2">
                      {(() => {
                        const TemplateComponent = getTemplateComponent(selectedTemplate);
                        const standardResumeData = mapToStandardFormat(data, selectedTemplate);
                        
                        return (
                          <div 
                            className="transform-gpu origin-top transition-all duration-300 ease-out"
                            style={{
                              transform: `scale(${zoomLevel})`,
                              filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))',
                              boxShadow: `
                                0 0 0 1px rgba(255, 255, 255, 0.8),
                                0 20px 40px -12px rgba(0, 0, 0, 0.25),
                                0 8px 16px -8px rgba(0, 0, 0, 0.3),
                                0 0 80px -20px rgba(59, 130, 246, 0.15)
                              `
                            }}
                          >
                            <TemplateComponent 
                              resume={standardResumeData} 
                              themeColor={data.themeColor} 
                              layoutConfiguration={data.layoutConfiguration}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 0.5}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleZoomReset}
                      className="h-8 px-3 text-xs font-medium"
                    >
                      {Math.round(zoomLevel * 100)}%
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 2}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Template & Color Selection */}
          <div className="w-full lg:w-[15%] lg:min-w-[280px] xl:min-w-[340px] flex-shrink-0">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm h-full flex flex-col min-h-[500px]">
              {/* Template Selection Section */}
              <div className="border-b border-border p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layout className="w-3 h-3 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">选择模板</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {templateOptions.map((template) => (
                    <div
                      key={template.value}
                      className={`relative group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md ${
                        selectedTemplate === template.value
                          ? 'ring-2 ring-primary ring-offset-1 ring-offset-background shadow-md'
                          : 'hover:shadow-sm'
                      }`}
                      onClick={() => updateSelectedTemplate(template.value)}
                    >
                      {/* Template Preview */}
                      <div className="relative aspect-[3/4] bg-white">
                        <img 
                          src={template.image} 
                          alt={template.label}
                          className="w-full h-full object-cover object-top"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Selected Badge */}
                        {selectedTemplate === template.value && (
                          <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            选中
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-2 bg-white border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${template.color}`}></div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-foreground">{template.label}</h4>
                            <p className="text-xs text-muted-foreground">{template.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Management Section */}
              <div className="border-b border-border p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layout className="w-3 h-3 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">布局管理</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Main Content Area */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <h4 className="text-sm font-medium text-foreground">主要内容</h4>
                      <span className="text-xs text-muted-foreground">({data.layoutConfiguration.mainSections.length}个模块)</span>
                    </div>
                    <div className="space-y-2">
                      {data.layoutConfiguration.mainSections.map((moduleId, index) => (
                        <DraggableModuleItem
                          key={moduleId}
                          moduleId={moduleId}
                          title={getSectionDisplayName(moduleId)}
                          area="main"
                          index={index}
                          onMoveToMain={moveModuleToMain}
                          onMoveToSidebar={moveModuleToSidebar}
                          onReorder={handleReorder}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Area */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <h4 className="text-sm font-medium text-foreground">侧边栏</h4>
                      <span className="text-xs text-muted-foreground">({data.layoutConfiguration.sidebarSections.length}个模块)</span>
                    </div>
                    <div className="space-y-2">
                      {data.layoutConfiguration.sidebarSections.map((moduleId, index) => (
                        <DraggableModuleItem
                          key={moduleId}
                          moduleId={moduleId}
                          title={getSectionDisplayName(moduleId)}
                          area="sidebar"
                          index={index}
                          onMoveToMain={moveModuleToMain}
                          onMoveToSidebar={moveModuleToSidebar}
                          onReorder={handleReorder}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Selection Section */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: data.themeColor.includes('-') ? getColorFromScale(data.themeColor) : getThemeColor(data.themeColor).primary }} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">主题颜色</h3>
                </div>
                
                <CompactThemeColorPicker 
                  currentTheme={data.themeColor} 
                  onThemeChange={(color) => {
                    updateThemeColor(color);
                  }} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </DndProvider>
  );
}

export default function ResumeResultClient() {
  return (
    <ResumeProvider>
      <ResumeResultContent />
    </ResumeProvider>
  );
} 