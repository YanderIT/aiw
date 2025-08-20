import { ResumeData } from '@/app/[locale]/(default)/resume-generator/components/ResumeContext';

// Helper function to format date to MM/YYYY format
function formatDateToMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  
  // Handle "Present" or "现在" case
  if (dateStr.toLowerCase() === 'present' || dateStr === '现在' || dateStr.toLowerCase() === 'current') {
    return 'Present';
  }
  
  // Try to parse the date string
  const date = new Date(dateStr);
  
  // Check if the date is valid
  if (!isNaN(date.getTime())) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
  
  // If parsing fails, try to extract month and year from the string
  // Handle formats like "2023-07", "07/2023", "July 2023", etc.
  const monthYearMatch = dateStr.match(/(\d{1,2})[-/](\d{4})|(\d{4})[-/](\d{1,2})/);
  if (monthYearMatch) {
    const month = monthYearMatch[1] || monthYearMatch[4];
    const year = monthYearMatch[2] || monthYearMatch[3];
    return `${month.padStart(2, '0')}/${year}`;
  }
  
  // Return original string if unable to parse
  return dateStr;
}

// Define the standardized resume structure for templates
export interface StandardResumeData {
  basics: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    url: { href: string; label: string };
    customFields: Array<{
      id: string;
      name: string;
      value: string;
      icon: string;
    }>;
    picture: {
      url: string;
      size: number;
      aspectRatio: number;
      borderRadius: number;
      effects: {
        hidden: boolean;
        border: boolean;
        grayscale: boolean;
      };
    };
  };
  sections: {
    summary: {
      id: string;
      name: string;
      content: string;
      visible: boolean;
      columns: number;
    };
    experience: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        company: string;
        position: string;
        location: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    education: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        institution: string;
        area: string;
        studyType: string;
        score: string;
        date: string;
        summary: string;
        location: string;
        courses: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    skills: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        level: number;
        keywords: string[];
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
    };
    projects: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        date: string;
        summary: string;
        keywords: string[];
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    awards: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        title: string;
        awarder: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    activities: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        role: string;
        location: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    languages: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        level: number;
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
    };
    certifications: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    references: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
  };
  metadata: {
    template: string;
    layout: string[][][];
    theme: {
      background: string;
      text: string;
      primary: string;
    };
    typography: {
      font: {
        family: string;
        size: number;
      };
      lineHeight: number;
      hideIcons: boolean;
      underlineLinks: boolean;
    };
  };
}

// Field mapping function - converts your data to standardized format
export function mapToStandardFormat(data: ResumeData, selectedTemplate: string = 'kakuna'): StandardResumeData {
  return {
    basics: {
      name: data.header.full_name || '',
      headline: '', // You don't have this field, so empty
      email: data.header.email || '',
      phone: data.header.phone || '',
      location: `${data.header.city}${data.header.country ? `, ${data.header.country}` : ''}`,
      url: { href: '', label: '' }, // No website field in your form
      customFields: [
        ...(data.header.linkedin ? [{
          id: 'linkedin',
          name: 'LinkedIn',
          value: data.header.linkedin,
          icon: 'linkedin-logo'
        }] : []),
        ...(data.header.github ? [{
          id: 'github',
          name: 'GitHub',
          value: data.header.github,
          icon: 'github-logo'
        }] : [])
      ],
      picture: {
        url: data.header.profilePicture?.url || '',
        size: 64,
        aspectRatio: 1,
        borderRadius: 0,
        effects: { hidden: !data.header.profilePicture, border: false, grayscale: false }
      }
    },
    sections: {
      summary: {
        id: 'summary',
        name: 'Summary',
        content: '', // You don't have a summary section
        visible: false,
        columns: 1
      },
      experience: {
        id: 'experience',
        name: 'Work Experience',
        items: data.workExperience.map((exp, index) => ({
          id: `exp-${index}`,
          company: exp.company || '',
          position: exp.job_title || '',
          location: `${exp.work_city}${exp.work_country ? `, ${exp.work_country}` : ''}`,
          date: `${formatDateToMMYYYY(exp.work_start_date)} - ${formatDateToMMYYYY(exp.work_end_date)}`,
          summary: exp.responsibilities || '',
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.workExperience && data.workExperience.length > 0,
        columns: 1,
        separateLinks: true
      },
      education: {
        id: 'education',
        name: 'Education',
        items: data.moduleSelection.education ? [{
          id: 'edu-0',
          institution: data.education.school_name || '',
          area: data.education.degree || '',
          studyType: '', // You don't distinguish study type
          score: data.education.gpa_or_rank || '',
          date: `${formatDateToMMYYYY(data.education.edu_start_date)} - ${formatDateToMMYYYY(data.education.edu_end_date)}`,
          summary: data.education.relevant_courses || '',
          location: `${data.education.edu_city}${data.education.edu_country ? `, ${data.education.edu_country}` : ''}`,
          courses: data.education.relevant_courses || '',
          url: { href: '', label: '' },
          visible: true
        }] : [],
        visible: data.moduleSelection.education,
        columns: 1,
        separateLinks: true
      },
      skills: {
        id: 'skills',
        name: 'Skills',
        items: data.moduleSelection.skillsLanguage && data.skillsLanguage.skills ? [{
          id: 'skills-0',
          name: 'Technical Skills',
          description: data.skillsLanguage.skills,
          level: 0,
          keywords: data.skillsLanguage.skills.split(',').map(s => s.trim()),
          visible: true
        }] : [],
        visible: data.moduleSelection.skillsLanguage,
        columns: 1
      },
      projects: {
        id: 'projects',
        name: 'Research Projects',
        items: data.research.map((proj, index) => ({
          id: `proj-${index}`,
          name: proj.project_title || '',
          description: proj.lab_or_unit || '',
          date: `${formatDateToMMYYYY(proj.res_start_date)} - ${formatDateToMMYYYY(proj.res_end_date)}`,
          summary: [
            proj.project_background && `Background: ${proj.project_background}`,
            proj.your_contributions && `Contributions: ${proj.your_contributions}`,
            proj.outcomes && `Outcomes: ${proj.outcomes}`
          ].filter(Boolean).join('\n'),
          keywords: proj.tools_used ? proj.tools_used.split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.research && data.research.length > 0,
        columns: 1,
        separateLinks: true
      },
      activities: {
        id: 'activities',
        name: 'Activities',
        items: data.activities.map((activity, index) => ({
          id: `activity-${index}`,
          name: activity.activity_name || '',
          role: activity.role || '',
          location: `${activity.act_city}${activity.act_country ? `, ${activity.act_country}` : ''}`,
          date: `${formatDateToMMYYYY(activity.act_start_date)} - ${formatDateToMMYYYY(activity.act_end_date)}`,
          summary: activity.description || '',
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.activities && data.activities.length > 0,
        columns: 1,
        separateLinks: true
      },
      awards: {
        id: 'awards',
        name: 'Awards',
        items: data.awards.flatMap((award, index) => {
          const items = [];
          
          // 如果有奖项信息，添加奖项
          if (award.award_name) {
            items.push({
              id: `award-${index}-a`,
              title: award.award_name,
              awarder: award.award_issuer || '',
              date: formatDateToMMYYYY(award.award_year) || '',
              summary: award.award_rank || '',
              url: { href: '', label: '' },
              visible: true
            });
          }
          
          // 如果有证书信息，添加证书
          if (award.certificate_name) {
            items.push({
              id: `award-${index}-c`,
              title: award.certificate_name,
              awarder: award.certificate_issuer || '',
              date: formatDateToMMYYYY(award.award_year) || '',
              summary: '',
              url: { href: '', label: '' },
              visible: true
            });
          }
          
          // 如果既没有奖项也没有证书，返回空项
          if (items.length === 0 && (award.award_year || award.award_rank)) {
            items.push({
              id: `award-${index}`,
              title: '',
              awarder: '',
              date: formatDateToMMYYYY(award.award_year) || '',
              summary: award.award_rank || '',
              url: { href: '', label: '' },
              visible: true
            });
          }
          
          return items;
        }),
        visible: data.moduleSelection.awards && data.awards.length > 0,
        columns: 1,
        separateLinks: true
      },
      languages: {
        id: 'languages',
        name: 'Languages',
        items: [
          ...(data.skillsLanguage.english_level ? [{
            id: 'lang-en',
            name: 'English',
            description: data.skillsLanguage.english_level,
            level: 0,
            visible: true
          }] : []),
          ...(data.skillsLanguage.native_language ? [{
            id: 'lang-native',
            name: data.skillsLanguage.native_language,
            description: 'Native',
            level: 5,
            visible: true
          }] : []),
          ...(data.skillsLanguage.other_languages ? [{
            id: 'lang-other',
            name: 'Other Languages',
            description: data.skillsLanguage.other_languages,
            level: 0,
            visible: true
          }] : [])
        ],
        visible: data.moduleSelection.skillsLanguage && !!(data.skillsLanguage.english_level || data.skillsLanguage.native_language || data.skillsLanguage.other_languages),
        columns: 1
      },
      certifications: {
        id: 'certifications',
        name: 'Certifications',
        items: [], // No certifications data in current form
        visible: false,
        columns: 1,
        separateLinks: true
      },
      references: {
        id: 'references',
        name: 'References',
        items: [], // No references data in current form
        visible: false,
        columns: 1,
        separateLinks: true
      }
    },
    metadata: {
      template: selectedTemplate,
      layout: [
        [
          ['experience', 'education', 'projects', 'awards'],
          ['skills']
        ]
      ],
      theme: {
        background: '#ffffff',
        text: '#000000',
        primary: '#2563eb'
      },
      typography: {
        font: {
          family: 'Inter',
          size: 14
        },
        lineHeight: 1.5,
        hideIcons: false,
        underlineLinks: true
      }
    }
  };
}