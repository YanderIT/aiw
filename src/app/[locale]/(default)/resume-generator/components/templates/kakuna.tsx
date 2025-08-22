import React, { useEffect, useRef, useState } from "react";
import { StandardResumeData } from "@/lib/resume-field-mapping";
import { cn, isEmptyString } from "./shared/utils";
import { Rating } from "./shared/components";
import { getThemeColor, getThemeFromScale } from "./shared/theme-colors";

// Page break component
const PageBreak = ({ pageNumber, themeColor }: { pageNumber: number; themeColor: string }) => {
  return (
    <div className="page-break-indicator" style={{
      display: 'flex',
      alignItems: 'center',
      margin: '10px 0',
      color: themeColor,
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      <div style={{
        flex: 1,
        height: '2px',
        backgroundColor: themeColor,
        marginRight: '10px'
      }}></div>
      <span>Page {pageNumber}</span>
      <div style={{
        flex: 1,
        height: '2px',
        backgroundColor: themeColor,
        marginLeft: '10px'
      }}></div>
    </div>
  );
};

const Header = ({ resume, theme }: { resume: StandardResumeData; theme: any }) => {
  const { basics } = resume;

  // 获取社交媒体图标和显示名称
  const getSocialIcon = (url: string, name: string) => {
    const lowerName = name.toLowerCase();
    const lowerUrl = url.toLowerCase();

    if (lowerName.includes('linkedin') || lowerUrl.includes('linkedin')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5" style={{verticalAlign: 'middle'}}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    }
    if (lowerName.includes('github') || lowerUrl.includes('github')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000" style={{verticalAlign: 'middle'}}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    }
    return '🔗';
  };

  const getSocialDisplayName = (url: string, name: string) => {
    const lowerName = name.toLowerCase();
    const lowerUrl = url.toLowerCase();

    if (lowerName.includes('linkedin') || lowerUrl.includes('linkedin')) {
      const username = url.split('/').pop() || name;
      return `${username}`;
    }
    if (lowerName.includes('github') || lowerUrl.includes('github')) {
      const username = url.split('/').pop() || name;
      return `${username}`;
    }
    return name;
  };

  return (
    <div className="flex flex-col items-center justify-center text-center mb-1">
      <div>
        {/* 头像 - 居中显示在姓名上方 */}
        {basics.picture?.url && !basics.picture?.effects?.hidden && (
          <div className="flex justify-center mb-3">
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundImage: `url(${basics.picture.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        )}
        <div className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>{basics.name}</div>
        {basics.headline && <div className="text-lg text-gray-600">{basics.headline}</div>}
      </div>

      <div className="flex flex-wrap justify-center text-base">
        {[
          basics.location,
          basics.phone && <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">{basics.phone}</a>,
          basics.email && <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">{basics.email}</a>
        ].filter(Boolean).map((item, index, arr) => (
          <span key={index}>
            {item}
            {index < arr.length - 1 && <span className="mx-2">|</span>}
          </span>
        ))}
        {basics.url?.href && (
          <div className="flex items-center gap-x-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.primary} className="inline-block">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
            <a href={basics.url.href} target="_blank" rel="noreferrer">
              {basics.url.label || basics.url.href}
            </a>
          </div>
        )}
        {basics.customFields?.map((item) => (
          <div key={item.id} className="flex items-center ml-2">
            {getSocialIcon(item.value, item.name)}
            <p className="ml-2">
              {/* <a href={item.value} target="_blank" rel="noreferrer noopener nofollow"> */}
              {getSocialDisplayName(item.value, item.name)}
              {/* </a> */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section = ({
  section,
  children,
  title,
  theme
}: {
  section: any;
  children: React.ReactNode;
  title?: string;
  theme: any;
}) => {
  if (!section?.visible || (section?.items && section?.items?.length === 0)) return null;

  return (
    <section id={section.id} className="grid" style={{ breakInside: 'avoid' }}>
      <h4 className="mb-3 text-left font-bold text-lg h-10" style={{
        color: theme.primary,
        borderBottom: `1px solid ${theme.primary}`
      }}>
        {title || section?.name}
      </h4>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

const MainContent = ({ resume, theme, layoutConfiguration }: {
  resume: StandardResumeData;
  theme: any;
  layoutConfiguration?: { mainSections: string[]; sidebarSections: string[] }
}) => {
  const { sections } = resume;

  // 定义各个模块的渲染函数
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'experience':
        return (
          <Section section={sections.experience} title="INTERNSHIP EXPERIENCE" theme={theme}>
            {sections.experience?.items?.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="mb-2">
                  {/* 第一行：公司名称（左） + 地址（右） */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-xl">{item.company}</div>
                    {item.location && <div className="font-bold text-base text-black">{item.location}</div>}
                  </div>
                  {/* 第二行：职位（左） + 时间（右） */}
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg text-black">{item.position}</div>
                    <div className="whitespace-nowrap text-right">
                      <div className="text-base text-black">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
                {item.summary && !isEmptyString(item.summary) && (
                  <div className="text-base whitespace-pre-line text-black">
                    {item.summary}
                  </div>
                )}
              </div>
            ))}
          </Section>
        );
      case 'education':
        return (
          <Section section={sections.education} title="EDUCATION" theme={theme}>
            {sections.education?.items?.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="mb-1">
                  {/* 第一行：大学名称（左） + 地址（右） */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-xl">{item.institution}</div>
                    {item.location && <div className="font-bold text-base text-black">{item.location}</div>}
                  </div>
                  {/* 第二行：专业/学位（左） + 时间（右） */}
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg text-black">
                      {item.area}
                      {item.score && <span>, GPA: {item.score}</span>}
                    </div>
                    <div className="whitespace-nowrap text-right">
                      <div className="text-base text-black">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
                {item.courses && !isEmptyString(item.courses) && (
                  <div className="mb-1 text-base text-black ml-4">
                    <span className="text-[1.2rem] font-medium italic">Relevant coursework:</span> <span className="text-[1.2rem]">{item.courses.split(',').map(course => course.trim()).join(', ')}</span>
                  </div>
                )}
                {/* {item.summary && !isEmptyString(item.summary) && (
                  <div className="text-base text-black">
                    {item.summary}
                  </div>
                )} */}
              </div>
            ))}
          </Section>
        );
      case 'research':
        const projectsSection = sections.projects;
        return (
          <Section section={projectsSection} title="RESEARCH EXPERIENCE" theme={theme}>
            {projectsSection?.items?.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="mb-2">
                  {/* 第一行：项目名称（左） + 时间（右） */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-xl">{item.name}</div>
                    <div className="whitespace-nowrap text-right">
                      <div className="text-base text-black">
                        {item.date}
                      </div>
                    </div>
                  </div>
                  {/* 第二行：项目描述（左） */}
                  {item.description && (
                    <div className="font-bold text-lg text-black">{item.description}</div>
                  )}
                </div>
                {item.keywords && item.keywords.length > 0 && (
                  <div className="mb-2 text-base text-black">
                    <strong>Tools:</strong> {item.keywords.map(keyword => keyword.trim()).join(' • ')}
                  </div>
                )}
                {item.summary && !isEmptyString(item.summary) && (
                  <div className="text-base whitespace-pre-line text-black">
                    {item.summary}
                  </div>
                )}
              </div>
            ))}
          </Section>
        );
      case 'activities':
        return (
          <Section section={sections.activities} title="LEADERSHIP & VOLUNTEERING EXPERIENCE" theme={theme}>
            {sections.activities?.items?.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="mb-2">
                  {/* 第一行：活动名称（左） + 地址（右） */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-xl">{item.name}</div>
                    {item.location && <div className="font-bold text-base text-black">{item.location}</div>}
                  </div>
                  {/* 第二行：角色（左） + 时间（右） */}
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg text-black">{item.role}</div>
                    <div className="whitespace-nowrap text-right">
                      <div className="text-base text-black">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
                {item.summary && !isEmptyString(item.summary) && (
                  <div className="text-base whitespace-pre-line text-black">
                    {item.summary}
                  </div>
                )}
              </div>
            ))}
          </Section>
        );
      case 'skills':
        return sections.skills?.visible && sections.skills?.items?.length > 0 && (
          <Section section={sections.skills} title="SKILLS AND COMPETENCIES" theme={theme}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {sections.skills?.items?.flatMap((skill) => {
                // 如果有 keywords，展开每个 keyword 为独立项
                if (skill.keywords && skill.keywords.length > 0) {
                  return skill.keywords.map((keyword, index) => (
                    <div key={`${skill.id}-${index}`} className="flex items-start text-base">
                      <span className="mr-2">•</span>
                      <span>{keyword}</span>
                    </div>
                  ));
                }
                // 如果只有 description，返回单个项
                if (skill.description) {
                  return (
                    <div key={skill.id} className="flex items-start text-base">
                      <span className="mr-2">•</span>
                      <span>{skill.description}</span>
                    </div>
                  );
                }
                return [];
              })}
            </div>
          </Section>
        );
      case 'certifications':
        return sections.certifications?.visible && sections.certifications?.items?.length > 0 && (
          <Section section={sections.certifications} title="Certifications" theme={theme}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.certifications?.items?.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="font-bold text-xl">{item.name}</div>
                  <div className="font-bold text-lg text-black">{item.issuer}</div>
                  <div className="text-base text-black">{item.date}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'awards':
        return sections.awards?.visible && sections.awards?.items?.length > 0 && (
          <Section section={sections.awards} title="HONOURS & AWARDS" theme={theme}>
            {sections.awards?.items?.map((item) => {
              // 提取年份（从日期字符串中）
              const year = item.date ? item.date.split('/').pop() || item.date : '';

              // 判断是奖项还是证书（基于是否有 title 或其他标识）
              const displayTitle = item.title || ''; // 可能是 award_name 或 certificate_name
              const displayIssuer = item.awarder || ''; // 可能是 award_issuer 或 certificate_issuer
              const displayRank = item.summary || ''; // award_rank

              return (
                <div key={item.id} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div className="text-base">
                      {displayTitle}
                      {/* 如果有发证单位/颁奖机构，显示在标题后 */}
                      {displayIssuer && <span>, {displayIssuer}</span>}
                      {/* 如果有排名信息，显示在括号中 */}
                      {displayRank && <span> ({displayRank})</span>}
                    </div>
                    <div className="whitespace-nowrap text-base">{year}</div>
                  </div>
                </div>
              );
            })}
          </Section>
        );
      case 'languages':
        return sections.languages?.visible && sections.languages?.items?.length > 0 && (
          <Section section={sections.languages} title="Languages" theme={theme}>
            <div className="flex flex-wrap gap-3">
              {sections.languages?.items?.map((item) => (
                <div key={item.id}>
                  {item.name === 'Other Languages' && item.description ? (
                    item.description.split(',').map((lang: string, index: number) => (
                      <span key={index} className="inline-block mr-3 mb-1">
                        <span className="font-bold text-xl">{lang.trim()}</span>
                      </span>
                    ))
                  ) : (
                    <div>
                      <span className="font-bold text-xl">{item.name}</span>
                      {item.description && item.description !== 'Native' && (
                        <span className="text-base text-black"> – {item.description}</span>
                      )}
                      {item.description === 'Native' && (
                        <span className="text-base text-black"> – Native Speaker</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  // 使用布局配置或默认配置
  // 对于 kakuna 模板，合并主要部分和侧边栏部分，因为它是单栏布局
  const allSections = layoutConfiguration
    ? [...layoutConfiguration.mainSections, ...layoutConfiguration.sidebarSections.filter(s => s !== 'profiles')] // 排除 profiles，因为它不适合在主内容中显示
    : ['experience', 'education', 'research', 'activities', 'skills', 'awards', 'languages'];

  return (
    <div className="space-y-1">
      {/* 根据配置渲染所有内容 */}
      {allSections.map((sectionId) => (
        <div key={sectionId}>
          {renderSectionContent(sectionId)}
        </div>
      ))}
    </div>
  );
};

export const KakunaTemplate = ({ resume, themeColor = 'sky-500', layoutConfiguration }: {
  resume: StandardResumeData;
  themeColor?: string;
  layoutConfiguration?: { mainSections: string[]; sidebarSections: string[] }
}) => {
  // 判断是否是新的色阶格式（如 "blue-500"）或旧的格式（如 "blue"）
  const theme = themeColor.includes('-') ? getThemeFromScale(themeColor) : getThemeColor(themeColor);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  const A4_HEIGHT_PX = 297 * 3.78; // Convert mm to pixels (1mm ≈ 3.78px at 96dpi)

  useEffect(() => {
    const calculatePageBreaks = () => {
      if (!containerRef.current) return;

      const containerHeight = containerRef.current.scrollHeight;
      const pageCount = Math.ceil(containerHeight / A4_HEIGHT_PX);

      if (pageCount > 1) {
        const breaks = [];
        for (let i = 1; i < pageCount; i++) {
          breaks.push(i * A4_HEIGHT_PX);
        }
        setPageBreaks(breaks);
      } else {
        setPageBreaks([]);
      }
    };

    // Calculate on mount
    calculatePageBreaks();

    // Use ResizeObserver to recalculate when content changes
    const resizeObserver = new ResizeObserver(calculatePageBreaks);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [resume, themeColor]);

  return (
    <div
      ref={containerRef}
      className="mx-auto bg-white shadow-lg resume-content"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '32px',
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#333333',
        fontFamily: 'Times New Roman, serif',
      }}
    >
      <Header resume={resume} theme={theme} />
      <MainContent resume={resume} theme={theme} layoutConfiguration={layoutConfiguration} />

      {/* Page break indicators */}
      {pageBreaks.map((breakHeight, index) => (
        <div
          key={index}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${breakHeight}px`,
            zIndex: 10
          }}
        >
          <PageBreak pageNumber={index + 2} themeColor={theme.primary} />
        </div>
      ))}

      {/* CSS for page breaks and scrolling */}
      <style jsx global>{`
        @media print {
          .resume-page {
            page-break-after: always;
          }
          section {
            break-inside: avoid;
          }
          .page-break-indicator {
            display: none;
          }
        }
        
        /* Smooth scrolling for resume preview */
        .resume-scroll-container {
          scroll-behavior: smooth;
        }
        
        /* Ensure content flows naturally */
        .resume-content {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        
        /* Style adjustments for Kakuna template - scoped to resume content only */
        .resume-content .text-primary { color: ${theme.primary}; }
        .resume-content .bg-primary { background-color: ${theme.primary}; }
        .resume-content .border-primary { border-color: ${theme.primary}; }
      `}</style>
    </div>
  );
};