import { saveAs } from 'file-saver';
import {
  AlignmentType,
  BorderStyle,
  Document,
  Paragraph,
  Packer,
  TabStopType,
  TextRun,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  WidthType
} from 'docx';
import { StandardResumeData } from '@/lib/resume-field-mapping';

type SectionKey = keyof StandardResumeData['sections'];

interface DocxExportOptions {
  filename?: string;
  themePrimary?: string;
  sectionTitles?: Partial<Record<SectionKey, string>>;
}

const FONT_FAMILY = 'Times New Roman';
const BASE_FONT_SIZE = 22;
const BASE_TEXT_COLOR = '000000';
const SECONDARY_TEXT_COLOR = '000000';
const PAGE_WIDTH_TWIP = 11906; // A4 width in twips (8.27in * 1440)
const PAGE_MARGIN_LEFT = 250;
const PAGE_MARGIN_RIGHT = 250;
const TEXT_WIDTH = PAGE_WIDTH_TWIP - PAGE_MARGIN_LEFT - PAGE_MARGIN_RIGHT;
const RIGHT_TAB_POSITION = TEXT_WIDTH;
const MAIN_COLUMN_RIGHT_PADDING = 240;

const toPlainText = (content?: string): string => {
  if (!content) return '';
  const temp = document.createElement('div');
  temp.innerHTML = content;
  const raw = temp.textContent || temp.innerText || '';
  const normalizedLines = raw
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.replace(/[^\S\n]+/g, ' ').trim())
    .filter((line, index, lines) => line !== '' || (index > 0 && lines[index - 1] !== ''));
  return normalizedLines.join('\n').trim();
};

const normalizeColor = (color?: string): string => {
  if (!color) {
    return '1F4E79';
  }
  const hex = color.startsWith('#') ? color.slice(1) : color;
  if (hex.length === 3) {
    return hex
      .split('')
      .map(char => char + char)
      .join('')
      .toUpperCase();
  }
  return hex.toUpperCase();
};

interface ContactLineOptions {
  color?: string;
  alignment?: AlignmentType;
  spacing?: { before?: number; after?: number };
  includeCustomFields?: boolean;
  includeWebsite?: boolean;
}

const createContactLine = (
  basics: StandardResumeData['basics'],
  options: ContactLineOptions = {}
) => {
  const parts: string[] = [];
  const push = (value?: string) => {
    const trimmed = toPlainText(value);
    if (trimmed) {
      parts.push(trimmed);
    }
  };

  push(basics.phone);
  push(basics.location);
  push(basics.email);

  const includeCustomFields = options.includeCustomFields ?? true;
  if (includeCustomFields) {
    basics.customFields.forEach(field => push(`${field.name}: ${field.value}`));
  }

  const includeWebsite = options.includeWebsite ?? includeCustomFields;
  if (includeWebsite) {
    push(basics.url?.href);
  }

  if (!parts.length) {
    return null;
  }

  const color = options.color ?? SECONDARY_TEXT_COLOR;
  const alignment = options.alignment ?? AlignmentType.CENTER;
  const before = options.spacing?.before ?? 80;
  const after = options.spacing?.after ?? 160;

  return new Paragraph({
    children: [
      new TextRun({
        text: parts.join(' • '),
        font: FONT_FAMILY,
        size: 20,
        color
      })
    ],
    alignment,
    spacing: { before, after }
  });
};

const createSectionHeading = (
  title: string,
  themeColor: string,
  sectionIndex: number
) =>
  new Paragraph({
    children: [
      new TextRun({
        text: toPlainText(title),
        font: FONT_FAMILY,
        bold: true,
        size: 26,
        color: themeColor
      })
    ],
    spacing: { before: sectionIndex === 0 ? 200 : 360, after: 100 },
    border: {
      bottom: {
        color: themeColor,
        space: 1,
        size: 6,
        value: BorderStyle.SINGLE
      }
    }
  });

type AlignedParagraphOptions = {
  left?: string;
  right?: string;
  leftBold?: boolean;
  leftItalic?: boolean;
  rightBold?: boolean;
  rightItalic?: boolean;
  leftColor?: string;
  rightColor?: string;
  fontSize?: number;
  spacingBefore?: number;
  spacingAfter?: number;
  rightIndent?: number;
  tabStopPosition?: number;
};

const createAlignedParagraph = ({
  left,
  right,
  leftBold = false,
  leftItalic = false,
  rightBold = false,
  rightItalic = false,
  leftColor = BASE_TEXT_COLOR,
  rightColor = SECONDARY_TEXT_COLOR,
  fontSize = BASE_FONT_SIZE,
  spacingBefore = 140,
  spacingAfter = 40,
  rightIndent = 0,
  tabStopPosition
}: AlignedParagraphOptions): Paragraph | null => {
  const leftText = toPlainText(left);
  const rightText = toPlainText(right);

  if (!leftText && !rightText) {
    return null;
  }

  const children: TextRun[] = [];

  if (leftText) {
    children.push(
      new TextRun({
        text: leftText,
        font: FONT_FAMILY,
        bold: leftBold,
        italics: leftItalic,
        size: fontSize,
        color: leftColor
      })
    );
  }

  if (rightText) {
    if (children.length) {
      children.push(new TextRun({ text: '\t' }));
    }

    children.push(
      new TextRun({
        text: rightText,
        font: FONT_FAMILY,
        bold: rightBold,
        italics: rightItalic,
        size: Math.max(fontSize - 2, 20),
        color: rightColor
      })
    );
  }

  return new Paragraph({
    children,
    tabStops: rightText
      ? [
          {
            type: TabStopType.RIGHT,
            position: Math.max(
              (tabStopPosition ?? RIGHT_TAB_POSITION) - rightIndent,
              0
            )
          }
        ]
      : undefined,
    indent: {
      left: 0,
      right: rightIndent
    },
    spacing: { before: spacingBefore, after: spacingAfter }
  });
};

const createBulletParagraphs = (
  content?: string,
  options: {
    color?: string;
    fontSize?: number;
    spacingBeforeFirst?: number;
    spacingBetween?: number;
    asHyphen?: boolean;
  } = {}
): Paragraph[] => {
  const plain = toPlainText(content);
  if (!plain) {
    return [];
  }

  const lines = plain
    .split(/\r?\n+/)
    .map(line => line.replace(/^[•\-\u2022]\s*/, '').trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const text = options.asHyphen ? `- ${line}` : line;
    return new Paragraph({
      children: [
        new TextRun({
          text,
          font: FONT_FAMILY,
          size: options.fontSize ?? BASE_FONT_SIZE,
          color: options.color ?? BASE_TEXT_COLOR
        })
      ],
      spacing: {
        before:
          index === 0
            ? options.spacingBeforeFirst ?? 60
            : options.spacingBetween ?? 30,
        after: options.spacingBetween ?? 30
      },
      bullet: options.asHyphen
        ? undefined
        : {
            level: 0
          },
      indent: options.asHyphen ? undefined : undefined
    });
  });
};

const createPlainParagraph = (
  text?: string,
  {
    italics = false,
    bold = false,
    spacingBefore = 100,
    spacingAfter = 60,
    size = BASE_FONT_SIZE,
    color = BASE_TEXT_COLOR,
    alignment,
    indent
  }: {
    italics?: boolean;
    bold?: boolean;
    spacingBefore?: number;
    spacingAfter?: number;
    size?: number;
    color?: string;
    alignment?: AlignmentType;
    indent?: { left?: number; right?: number; hanging?: number };
  } = {}
): Paragraph | null => {
  const plain = toPlainText(text);
  if (!plain) {
    return null;
  }

  return new Paragraph({
    children: [
      new TextRun({
        text: plain,
        font: FONT_FAMILY,
        size,
        italics,
        bold,
        color
      })
    ],
    spacing: { before: spacingBefore, after: spacingAfter },
    alignment,
    indent
  });
};

const appendIfTruthy = <T>(collection: T[], item: T | null | undefined) => {
  if (item) {
    collection.push(item);
  }
};

const DITTO_TEXT_COLOR = '333333';
const DITTO_SECONDARY_COLOR = '333333';

type HeaderLine = {
  text?: string;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  fontSize?: number;
};

const createMainEntryHeaderTable = ({
  leftLines,
  rightLines,
  spacingBefore,
  spacingAfter
}: {
  leftLines: HeaderLine[];
  rightLines: HeaderLine[];
  spacingBefore: number;
  spacingAfter: number;
}): Table | null => {
  const normalizedLeft = leftLines
    .map(line => ({
      ...line,
      text: toPlainText(line.text)
    }))
    .filter(line => Boolean(line.text));

  const normalizedRight = rightLines
    .map(line => ({
      ...line,
      text: toPlainText(line.text)
    }))
    .filter(line => Boolean(line.text));

  if (!normalizedLeft.length && !normalizedRight.length) {
    return null;
  }

  const makeParagraphs = (
    lines: typeof normalizedLeft,
    alignRight: boolean
  ): Paragraph[] => {
    if (!lines.length) {
      return [
        new Paragraph({
          children: [new TextRun({ text: '' })],
          spacing: { before: spacingBefore, after: spacingAfter },
          alignment: alignRight ? AlignmentType.RIGHT : AlignmentType.LEFT
        })
      ];
    }

    return lines.map((line, index) => {
      const isFirst = index === 0;
      const isLast = index === lines.length - 1;

      return new Paragraph({
        children: [
          new TextRun({
            text: line.text!,
            font: FONT_FAMILY,
            bold: line.bold,
            italics: line.italics,
            size: line.fontSize ?? (alignRight ? Math.max(BASE_FONT_SIZE - 2, 20) : BASE_FONT_SIZE),
            color: line.color ?? DITTO_TEXT_COLOR
          })
        ],
        spacing: {
          before: isFirst ? spacingBefore : 0,
          after: isLast ? spacingAfter : 20
        },
        alignment: alignRight ? AlignmentType.RIGHT : AlignmentType.LEFT
      });
    });
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideH: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideV: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            margins: { left: 0, right: 0, top: 0, bottom: 0 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
            },
            verticalAlign: VerticalAlign.TOP,
            children: makeParagraphs(normalizedLeft, false)
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            margins: {
              left: 0,
              right: MAIN_COLUMN_RIGHT_PADDING,
              top: 0,
              bottom: 0
            },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
            },
            verticalAlign: VerticalAlign.TOP,
            children: makeParagraphs(normalizedRight, true)
          })
        ]
      })
    ]
  });
};

const createDittoSectionHeading = (title: string, isFirst: boolean): Paragraph =>
  new Paragraph({
    children: [
      new TextRun({
        text: toPlainText(title),
        font: FONT_FAMILY,
        bold: true,
        size: 28,
        color: DITTO_TEXT_COLOR
      })
    ],
    spacing: { before: isFirst ? 80 : 140, after: 40 }
  });

const createDittoSidebarHeading = (title: string, isFirst: boolean): Paragraph =>
  new Paragraph({
    children: [
      new TextRun({
        text: toPlainText(title),
        font: FONT_FAMILY,
        bold: true,
        size: 28,
        color: DITTO_TEXT_COLOR
      })
    ],
    spacing: { before: isFirst ? 40 : 120, after: 40 }
  });

const buildDittoDocument = (
  resume: StandardResumeData,
  options: {
    themeColor: string;
    sectionTitles?: Partial<Record<SectionKey, string>>;
  }
): Document => {
  const sections = resume.sections;
  const accentColor = options.themeColor || DITTO_TEXT_COLOR;

  const headingDefaults: Partial<Record<SectionKey, string>> = {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    activities: 'Activities',
    skills: 'Skills',
    certifications: 'Certifications',
    awards: 'Awards',
    languages: 'Languages',
    references: 'References'
  };

  const resolveTitle = (key: SectionKey, fallback: string) =>
    options.sectionTitles?.[key] ?? headingDefaults[key] ?? fallback;

  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? (value as string[]) : [];

  const isSectionKey = (value: string): value is SectionKey =>
    Object.prototype.hasOwnProperty.call(sections, value);

  const layoutPages = resume.metadata?.layout ?? [];
  const firstPageLayout = layoutPages[0] ?? [];
  const layoutMainRaw = asStringArray(firstPageLayout[0]).filter(isSectionKey);
  const layoutSidebarRaw = asStringArray(firstPageLayout[1]);

  const allowedMainSections: SectionKey[] = [
    'summary',
    'experience',
    'education',
    'projects',
    'activities'
  ];

  const mainOrder = Array.from(
    new Set<SectionKey>([
      ...layoutMainRaw.filter(section => allowedMainSections.includes(section)),
      ...allowedMainSections
    ])
  );

  const defaultSidebarOrder: Array<SectionKey | 'profiles'> = [
    'profiles',
    'skills',
    'awards',
    'languages',
    'certifications',
    'references'
  ];

  const sidebarOrder = Array.from(
    new Set([
      ...layoutSidebarRaw.filter(item => item === 'profiles' || isSectionKey(item)),
      ...defaultSidebarOrder
    ])
  );

  const mainParagraphs: Array<Paragraph | Table> = [];
  let isFirstMain = true;

  const pushMainSection = (
    key: SectionKey,
    fallback: string,
    paragraphs: Array<Paragraph | Table>
  ) => {
    const filtered = paragraphs.filter(Boolean);
    if (!filtered.length) {
      return;
    }

    const title = resolveTitle(key, fallback);
    mainParagraphs.push(createDittoSectionHeading(title, isFirstMain));
    mainParagraphs.push(...filtered);
    mainParagraphs.push(new Paragraph({ text: '', spacing: { before: 0, after: 20 } }));
    isFirstMain = false;
  };

  const buildExperience = (): Array<Paragraph | Table> => {
    if (!sections.experience.visible || sections.experience.items.length === 0) {
      return [];
    }

    return sections.experience.items.flatMap((item, index) => {
      const paragraphs: Array<Paragraph | Table> = [];
      appendIfTruthy(
        paragraphs,
        createMainEntryHeaderTable({
          leftLines: [
            { text: item.company, bold: true, fontSize: 26 },
            { text: item.position, bold: true, fontSize: 24 }
          ],
          rightLines: [
            { text: item.date, bold: true, fontSize: 26 },
            { text: item.location, bold: true, fontSize: 24 }
          ],
          spacingBefore: index === 0 ? 60 : 80,
          spacingAfter: 12
        })
      );
      paragraphs.push(
        ...createBulletParagraphs(item.summary, {
          color: DITTO_SECONDARY_COLOR,
          spacingBeforeFirst: 15,
          spacingBetween: 15,
          fontSize: BASE_FONT_SIZE,
          asHyphen: true
        })
      );
      return paragraphs;
    });
  };

  const buildEducation = (): Array<Paragraph | Table> => {
    if (!sections.education.visible || sections.education.items.length === 0) {
      return [];
    }

    return sections.education.items.flatMap((item, index) => {
      const paragraphs: Array<Paragraph | Table> = [];
      appendIfTruthy(
        paragraphs,
        createMainEntryHeaderTable({
          leftLines: [
            { text: item.institution, bold: true, fontSize: 26 },
            { text: item.location, bold: true, fontSize: 24 }
          ],
          rightLines: [
            { text: item.date, bold: true, fontSize: 26 },
            {
              text: [item.studyType, item.area].filter(Boolean).map(toPlainText).join(', '),
              bold: true,
              fontSize: 24
            }
          ],
          spacingBefore: index === 0 ? 60 : 80,
          spacingAfter: 12
        })
      );

      const detailLine = [
        item.score ? `GPA: ${toPlainText(item.score)}` : '',
        toPlainText(item.summary)
      ]
        .filter(Boolean)
        .join(' • ');
      if (detailLine) {
        appendIfTruthy(
          paragraphs,
          createPlainParagraph(detailLine, {
            spacingBefore: 0,
            spacingAfter: 20,
            color: DITTO_TEXT_COLOR,
            size: BASE_FONT_SIZE
          })
        );
      }

      if (item.courses) {
        appendIfTruthy(
          paragraphs,
          createPlainParagraph(
            item.courses
              .split(',')
              .map(course => course.trim())
              .filter(Boolean)
              .join(' • '),
            {
              spacingBefore: 0,
              spacingAfter: 30,
              color: accentColor,
              size: BASE_FONT_SIZE - 2
            }
          )
        );
      }

      return paragraphs;
    });
  };

  const buildProjects = (): Array<Paragraph | Table> => {
    if (!sections.projects.visible || sections.projects.items.length === 0) {
      return [];
    }

    return sections.projects.items.flatMap((item, index) => {
      const paragraphs: Array<Paragraph | Table> = [];
      appendIfTruthy(
        paragraphs,
        createMainEntryHeaderTable({
          leftLines: [{ text: item.name, bold: true, fontSize: 28 }],
          rightLines: [{ text: item.date, bold: true, fontSize: 26 }],
          spacingBefore: index === 0 ? 60 : 80,
          spacingAfter: 12
        })
      );

      if (item.description) {
        appendIfTruthy(
          paragraphs,
          createPlainParagraph(item.description, {
            spacingBefore: 0,
            spacingAfter: 20,
            bold: true,
            size: 24,
            color: DITTO_TEXT_COLOR
          })
        );
      }

      if (item.keywords && item.keywords.length > 0) {
        appendIfTruthy(
          paragraphs,
          createPlainParagraph(item.keywords.join(' • '), {
            spacingBefore: 0,
            spacingAfter: 20,
            color: accentColor,
            size: BASE_FONT_SIZE - 2
          })
        );
      }

      paragraphs.push(
        ...createBulletParagraphs(item.summary, {
          color: DITTO_SECONDARY_COLOR,
          spacingBeforeFirst: 15,
          spacingBetween: 15,
          fontSize: BASE_FONT_SIZE,
          asHyphen: true
        })
      );

      return paragraphs;
    });
  };

  const buildActivities = (): Array<Paragraph | Table> => {
    if (!sections.activities.visible || sections.activities.items.length === 0) {
      return [];
    }

    return sections.activities.items.flatMap((item, index) => {
      const paragraphs: Array<Paragraph | Table> = [];
      appendIfTruthy(
        paragraphs,
        createMainEntryHeaderTable({
          leftLines: [
            { text: item.name, bold: true, fontSize: 28 },
            { text: item.role, bold: true, fontSize: 24 }
          ],
          rightLines: [
            { text: item.date, bold: true, fontSize: 26 },
            { text: item.location, bold: true, fontSize: 24 }
          ],
          spacingBefore: index === 0 ? 60 : 80,
          spacingAfter: 15
        })
      );

      paragraphs.push(
        ...createBulletParagraphs(item.summary, {
          color: DITTO_SECONDARY_COLOR,
          spacingBeforeFirst: 15,
          spacingBetween: 15,
          fontSize: BASE_FONT_SIZE,
          asHyphen: true
        })
      );

      return paragraphs;
    });
  };

  const buildAwards = (): Array<Paragraph | Table> => {
    if (!sections.awards.visible || sections.awards.items.length === 0) {
      return [];
    }

    return sections.awards.items.flatMap((item, index) => {
      const paragraphs: Array<Paragraph | Table> = [];
      appendIfTruthy(
        paragraphs,
        createMainEntryHeaderTable({
          leftLines: [{ text: item.title ?? '', bold: true, fontSize: 22 }],
          rightLines: [{ text: item.date, bold: true, fontSize: 22 }],
          spacingBefore: index === 0 ? 40 : 60,
          spacingAfter: 10
        })
      );

      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.awarder, {
          spacingBefore: 0,
          spacingAfter: 10,
          color: DITTO_SECONDARY_COLOR,
          size: BASE_FONT_SIZE - 2
        })
      );

      paragraphs.push(
        ...createBulletParagraphs(item.summary, {
          color: accentColor,
          spacingBeforeFirst: 10,
          spacingBetween: 15,
          fontSize: BASE_FONT_SIZE,
          asHyphen: true
        })
      );

      return paragraphs;
    });
  };

  const buildCertifications = (): Paragraph[] => {
    if (!sections.certifications.visible || sections.certifications.items.length === 0) {
      return [];
    }

    return sections.certifications.items.map((item, index) => {
      const paragraphs: Paragraph[] = [];
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.name, {
          bold: true,
          size: 22,
          color: DITTO_TEXT_COLOR,
          spacingBefore: index === 0 ? 20 : 40,
          spacingAfter: 10
        })
      );
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.issuer, {
          color: DITTO_SECONDARY_COLOR,
          size: BASE_FONT_SIZE - 2,
          spacingBefore: 0,
          spacingAfter: 6
        })
      );
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.date, {
          color: DITTO_SECONDARY_COLOR,
          size: BASE_FONT_SIZE - 2,
          spacingBefore: 0,
          spacingAfter: 10
        })
      );
      return paragraphs;
    }).flat();
  };

  const buildLanguages = (): Paragraph[] => {
    if (!sections.languages.visible || sections.languages.items.length === 0) {
      return [];
    }

    return sections.languages.items.map((item, index) => {
      const paragraphs: Paragraph[] = [];
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.name, {
          bold: true,
          size: 22,
          color: DITTO_TEXT_COLOR,
          spacingBefore: index === 0 ? 20 : 40,
          spacingAfter: 6
        })
      );
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.description, {
          color: DITTO_SECONDARY_COLOR,
          size: BASE_FONT_SIZE - 2,
          spacingBefore: 0,
          spacingAfter: 10
        })
      );
      return paragraphs;
    }).flat();
  };

  const buildSkills = (): Paragraph[] => {
    if (!sections.skills.visible || sections.skills.items.length === 0) {
      return [];
    }

    return sections.skills.items.map((item, index) => {
      const paragraphs: Paragraph[] = [];
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.name, {
          bold: true,
          size: 22,
          color: DITTO_TEXT_COLOR,
          spacingBefore: index === 0 ? 20 : 40,
          spacingAfter: 6
        })
      );

      if (item.keywords && item.keywords.length > 0) {
        appendIfTruthy(
          paragraphs,
          createPlainParagraph(item.keywords.join(' • '), {
            color: accentColor,
            size: BASE_FONT_SIZE - 2,
            spacingBefore: 0,
            spacingAfter: 10
          })
        );
      } else if (item.description) {
        appendIfTruthy(
          paragraphs,
          createPlainParagraph(item.description, {
            color: DITTO_SECONDARY_COLOR,
            size: BASE_FONT_SIZE - 2,
            spacingBefore: 0,
            spacingAfter: 10
          })
        );
      }

      return paragraphs;
    }).flat();
  };

  const buildReferences = (): Paragraph[] => {
    if (!sections.references.visible || sections.references.items.length === 0) {
      return [];
    }

    return sections.references.items.map((item, index) => {
      const paragraphs: Paragraph[] = [];
      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.name, {
          bold: true,
          size: 22,
          color: DITTO_TEXT_COLOR,
          spacingBefore: index === 0 ? 20 : 40,
          spacingAfter: 6
        })
      );

      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.description, {
          color: DITTO_SECONDARY_COLOR,
          size: BASE_FONT_SIZE - 2,
          spacingBefore: 0,
          spacingAfter: 10
        })
      );

      appendIfTruthy(
        paragraphs,
        createPlainParagraph(item.url?.href, {
          color: accentColor,
          size: BASE_FONT_SIZE - 2,
          spacingBefore: 0,
          spacingAfter: 10
        })
      );

      return paragraphs;
    }).flat();
  };

  const summaryParagraph = createPlainParagraph(sections.summary.content, {
    spacingBefore: 140,
    spacingAfter: 60,
    color: DITTO_TEXT_COLOR
  });

  mainOrder.forEach((sectionKey) => {
    switch (sectionKey) {
      case 'summary':
        if (sections.summary.visible && summaryParagraph) {
          pushMainSection('summary', sections.summary.name, [summaryParagraph]);
        }
        break;
      case 'experience':
        pushMainSection('experience', sections.experience.name, buildExperience());
        break;
      case 'education':
        pushMainSection('education', sections.education.name, buildEducation());
        break;
      case 'projects':
        pushMainSection('projects', sections.projects.name, buildProjects());
        break;
      case 'activities':
        pushMainSection('activities', sections.activities.name, buildActivities());
        break;
      default:
        break;
    }
  });

  const sidebarParagraphs: Paragraph[] = [];
  let isFirstSidebar = true;

  const pushSidebarSection = (title: string, paragraphs: Paragraph[]) => {
    const filtered = paragraphs.filter(Boolean);
    if (!filtered.length) {
      return;
    }
    sidebarParagraphs.push(createDittoSidebarHeading(title, isFirstSidebar));
    sidebarParagraphs.push(...filtered);
    isFirstSidebar = false;
  };

  const customFields = (resume.basics.customFields || []).filter(
    field => field && field.value
  );

  const profilesContent = customFields.map((field, index) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createPlainParagraph(field.name, {
        bold: true,
        size: 22,
        color: DITTO_TEXT_COLOR,
        spacingBefore: index === 0 ? 20 : 40,
        spacingAfter: 6
      })
    );
    appendIfTruthy(
      paragraphs,
      createPlainParagraph(field.value, {
        color: accentColor,
        size: BASE_FONT_SIZE - 2,
        spacingBefore: 0,
        spacingAfter: 10
      })
    );
    return paragraphs;
  }).flat();

  const sectionsAlreadyInMain = new Set<SectionKey>(mainOrder);

  sidebarOrder.forEach((item) => {
    if (item === 'profiles') {
      pushSidebarSection('Profiles', profilesContent);
      return;
    }

    if (!isSectionKey(item)) {
      return;
    }

    if (sectionsAlreadyInMain.has(item as SectionKey)) {
      // 已经在主内容中渲染过，避免重复显示
      return;
    }

    switch (item as SectionKey) {
      case 'skills':
        pushSidebarSection(resolveTitle('skills', sections.skills.name), buildSkills());
        break;
      case 'certifications':
        pushSidebarSection(resolveTitle('certifications', sections.certifications.name), buildCertifications());
        break;
      case 'awards':
        pushSidebarSection(resolveTitle('awards', sections.awards.name), buildAwards());
        break;
      case 'languages':
        pushSidebarSection(resolveTitle('languages', sections.languages.name), buildLanguages());
        break;
      case 'references':
        pushSidebarSection(resolveTitle('references', sections.references.name), buildReferences());
        break;
      default:
        break;
    }
  });

  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideH: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideV: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            margins: { left: 50, right: 50, top: 50, bottom: 50 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
            },
            verticalAlign: VerticalAlign.TOP,
            children: sidebarParagraphs.length
              ? sidebarParagraphs
              : [new Paragraph({ text: '' })]
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            margins: { left: 0, right: 0, top: 0, bottom: 0 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
            },
            verticalAlign: VerticalAlign.TOP,
            children: mainParagraphs.length
              ? mainParagraphs
              : [new Paragraph({ text: '' })]
          })
        ]
      })
    ]
  });

  const nameRun = new TextRun({
    text: toPlainText(resume.basics.name || '未命名'),
    font: FONT_FAMILY,
    bold: true,
    size: 48,
    color: 'FFFFFF'
  });

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: accentColor },
      bottom: { style: BorderStyle.NONE, size: 0, color: accentColor },
      left: { style: BorderStyle.NONE, size: 0, color: accentColor },
      right: { style: BorderStyle.NONE, size: 0, color: accentColor },
      insideH: { style: BorderStyle.NONE, size: 0, color: accentColor },
      insideV: { style: BorderStyle.NONE, size: 0, color: accentColor }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: accentColor },
            margins: { left: 0, right: 0, top: 320, bottom: 240 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: accentColor },
              bottom: { style: BorderStyle.NONE, size: 0, color: accentColor },
              left: { style: BorderStyle.NONE, size: 0, color: accentColor },
              right: { style: BorderStyle.NONE, size: 0, color: accentColor }
            },
            children: [
              new Paragraph({
                children: [nameRun],
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 0 }
              })
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            margins: { left: 0, right: 0, top: 180, bottom: 180 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
            },
            children: (() => {
              const paragraphs: Paragraph[] = [];
              const headlineParagraph = createPlainParagraph(resume.basics.headline, {
                spacingBefore: 0,
                spacingAfter: 40,
                color: DITTO_TEXT_COLOR,
                size: BASE_FONT_SIZE,
                alignment: AlignmentType.LEFT
              });

              if (headlineParagraph) {
                paragraphs.push(headlineParagraph);
              }

              const contactParagraph = createContactLine(resume.basics, {
                color: accentColor,
                alignment: AlignmentType.LEFT,
                spacing: { before: 20, after: 20 },
                includeCustomFields: false,
                includeWebsite: false
              });

              if (contactParagraph) {
                paragraphs.push(contactParagraph);
              }

              return paragraphs.length ? paragraphs : [new Paragraph({ text: '' })];
            })()
          })
        ]
      })
    ]
  });

  const documentChildren: Array<Paragraph | Table> = [headerTable];

  documentChildren.push(new Paragraph({ text: '', spacing: { before: 80, after: 80 } }));
  documentChildren.push(table);

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: BASE_FONT_SIZE,
            color: DITTO_TEXT_COLOR
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: PAGE_MARGIN_LEFT,
              right: PAGE_MARGIN_RIGHT
            }
          }
        },
        children: documentChildren
      }
    ]
  });
};

const getTemplateSectionTitleOverrides = (
  template?: string
): Partial<Record<SectionKey, string>> => {
  if (template === 'kakuna') {
    return {
      summary: 'SUMMARY',
      experience: 'INTERNSHIP EXPERIENCE',
      education: 'EDUCATION',
      projects: 'RESEARCH EXPERIENCE',
      activities: 'LEADERSHIP & VOLUNTEERING EXPERIENCE',
      skills: 'SKILLS AND COMPETENCIES',
      certifications: 'Certifications',
      awards: 'HONOURS & AWARDS',
      languages: 'Languages',
      references: 'References'
    };
  }

  return {};
};

export const exportResumeDocx = async (
  resume: StandardResumeData,
  options: DocxExportOptions = {}
): Promise<void> => {
  const {
    filename = `简历_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.docx`,
    themePrimary,
    sectionTitles
  } = options;
  const themeColor = normalizeColor(themePrimary ?? resume.metadata?.theme?.primary);

  if (resume.metadata?.template === 'ditto') {
    const doc = buildDittoDocument(resume, {
      themeColor,
      sectionTitles
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    return;
  }

  const sectionTitleOverrides: Partial<Record<SectionKey, string>> = {
    ...getTemplateSectionTitleOverrides(resume.metadata?.template),
    ...(sectionTitles ?? {})
  };

  const docChildren: Paragraph[] = [];

  // Header
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: toPlainText(resume.basics.name || '未命名'),
          font: FONT_FAMILY,
          bold: true,
          size: 36,
          color: BASE_TEXT_COLOR
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 }
    })
  );

  appendIfTruthy(docChildren, createPlainParagraph(resume.basics.headline, {
    spacingBefore: 0,
    spacingAfter: 40,
    italics: false,
    bold: false
  }));

  const contactLine = createContactLine(resume.basics);
  if (contactLine) {
    docChildren.push(contactLine);
  }

  let sectionIndex = 0;
  const pushSection = (
    key: SectionKey,
    fallbackTitle: string,
    visible: boolean,
    paragraphs: Array<Paragraph | null>
  ) => {
    const filtered = paragraphs.filter(
      (paragraph): paragraph is Paragraph => paragraph != null
    );
    if (!visible || filtered.length === 0) {
      return;
    }
    const normalizedFallback =
      fallbackTitle?.trim().length
        ? fallbackTitle.trim().toUpperCase()
        : (key as string).toUpperCase();
    const heading = sectionTitleOverrides[key] ?? normalizedFallback;
    docChildren.push(createSectionHeading(heading, themeColor, sectionIndex));
    docChildren.push(...filtered);
    sectionIndex += 1;
  };

  // Summary
  pushSection('summary', resume.sections.summary.name, resume.sections.summary.visible, [
    createPlainParagraph(resume.sections.summary.content, {
      spacingBefore: 140,
      spacingAfter: 80
    })
  ]);

  // Work Experience
  const experienceParagraphs: Array<Paragraph | null> = resume.sections.experience.items.flatMap((item, idx) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.company,
        right: item.location,
        leftBold: true,
        rightBold: true,
        spacingBefore: idx === 0 ? 160 : 240,
        spacingAfter: 20
      })
    );
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.position,
        right: item.date,
        leftItalic: true,
        spacingBefore: 0,
        spacingAfter: 30
      })
    );
    paragraphs.push(...createBulletParagraphs(item.summary));
    return paragraphs;
  });
  pushSection('experience', resume.sections.experience.name, resume.sections.experience.visible, experienceParagraphs);

  // Education
  const educationParagraphs: Array<Paragraph | null> = resume.sections.education.items.flatMap((item, idx) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.institution,
        right: item.location,
        leftBold: true,
        rightBold: true,
        spacingBefore: idx === 0 ? 160 : 240,
        spacingAfter: 20
      })
    );

    const degreeParts = [
      item.studyType,
      item.area,
      item.score ? `GPA: ${item.score}` : ''
    ]
      .map(toPlainText)
      .filter(Boolean)
      .join(', ');

    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: degreeParts,
        right: item.date,
        leftItalic: true,
        spacingBefore: 0,
        spacingAfter: 20
      })
    );

    appendIfTruthy(
      paragraphs,
      createPlainParagraph(item.summary, {
        spacingBefore: 40,
        spacingAfter: 40
      })
    );

    appendIfTruthy(
      paragraphs,
      createPlainParagraph(
        item.courses ? `Relevant coursework: ${item.courses}` : '',
        {
          spacingBefore: 0,
          spacingAfter: 40,
          italics: true
        }
      )
    );

    return paragraphs;
  });
  pushSection('education', resume.sections.education.name, resume.sections.education.visible, educationParagraphs);

  // Projects
  const projectParagraphs: Array<Paragraph | null> = resume.sections.projects.items.flatMap((item, idx) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.name,
        right: item.date,
        leftBold: true,
        spacingBefore: idx === 0 ? 160 : 220,
        spacingAfter: 20
      })
    );

    appendIfTruthy(
      paragraphs,
      createPlainParagraph(
        [item.url?.href, item.keywords?.join(', ')].filter(Boolean).join(' • '),
        { spacingBefore: 0, spacingAfter: 30, italics: true }
      )
    );

    paragraphs.push(...createBulletParagraphs(item.summary || item.description));
    return paragraphs;
  });
  pushSection('projects', resume.sections.projects.name, resume.sections.projects.visible, projectParagraphs);

  // Skills
  const skillParagraphs: Array<Paragraph | null> = resume.sections.skills.items.map((item, idx) =>
    new Paragraph({
      children: [
        new TextRun({
          text: toPlainText(item.name),
          font: FONT_FAMILY,
          bold: true,
          size: BASE_FONT_SIZE
        }),
        ...(item.description
          ? [
              new TextRun({
                text: ` – ${toPlainText(item.description)}`,
                font: FONT_FAMILY,
                size: BASE_FONT_SIZE
              })
            ]
          : []),
        ...(item.keywords?.length
          ? [
              new TextRun({
                text: ` (${item.keywords.map(toPlainText).join(', ')})`,
                font: FONT_FAMILY,
                size: BASE_FONT_SIZE
              })
            ]
          : [])
      ],
      spacing: { before: idx === 0 ? 160 : 120, after: 40 }
    })
  );
  pushSection('skills', resume.sections.skills.name, resume.sections.skills.visible, skillParagraphs);

  // Awards
  const awardParagraphs: Array<Paragraph | null> = resume.sections.awards.items.flatMap((item, idx) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.title,
        right: item.date,
        leftBold: true,
        spacingBefore: idx === 0 ? 160 : 220,
        spacingAfter: 20
      })
    );

    appendIfTruthy(
      paragraphs,
      createPlainParagraph(item.awarder, {
        spacingBefore: 0,
        spacingAfter: 30,
        italics: true
      })
    );

    paragraphs.push(...createBulletParagraphs(item.summary));
    return paragraphs;
  });
  pushSection('awards', resume.sections.awards.name, resume.sections.awards.visible, awardParagraphs);

  // Activities
  const activityParagraphs: Array<Paragraph | null> = resume.sections.activities.items.flatMap((item, idx) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.name,
        right: item.location,
        leftBold: true,
        rightBold: true,
        spacingBefore: idx === 0 ? 160 : 220,
        spacingAfter: 20
      })
    );
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.role,
        right: item.date,
        leftItalic: true,
        spacingBefore: 0,
        spacingAfter: 30
      })
    );
    paragraphs.push(...createBulletParagraphs(item.summary));
    return paragraphs;
  });
  pushSection('activities', resume.sections.activities.name, resume.sections.activities.visible, activityParagraphs);

  // Languages
  const languageParagraphs: Array<Paragraph | null> = resume.sections.languages.items.map((item, idx) =>
    new Paragraph({
      children: [
        new TextRun({
          text: toPlainText(item.name),
          font: FONT_FAMILY,
          bold: true,
          size: BASE_FONT_SIZE
        }),
        ...(item.description
          ? [
              new TextRun({
                text: ` – ${toPlainText(item.description)}`,
                font: FONT_FAMILY,
                size: BASE_FONT_SIZE
              })
            ]
          : [])
      ],
      spacing: { before: idx === 0 ? 160 : 120, after: 40 }
    })
  );
  pushSection('languages', resume.sections.languages.name, resume.sections.languages.visible, languageParagraphs);

  // Certifications
  const certificationParagraphs: Array<Paragraph | null> = resume.sections.certifications.items.flatMap((item, idx) => {
    const paragraphs: Paragraph[] = [];
    appendIfTruthy(
      paragraphs,
      createAlignedParagraph({
        left: item.name,
        right: item.date,
        leftBold: true,
        spacingBefore: idx === 0 ? 160 : 220,
        spacingAfter: 20
      })
    );
    appendIfTruthy(
      paragraphs,
      createPlainParagraph(item.issuer, {
        spacingBefore: 0,
        spacingAfter: 30,
        italics: true
      })
    );
    paragraphs.push(...createBulletParagraphs(item.summary));
    return paragraphs;
  });
  pushSection('certifications', resume.sections.certifications.name, resume.sections.certifications.visible, certificationParagraphs);

  // References
  const referenceParagraphs: Array<Paragraph | null> = resume.sections.references.items.map((item, idx) =>
    new Paragraph({
      children: [
        new TextRun({
          text: toPlainText(item.name),
          font: FONT_FAMILY,
          bold: true,
          size: BASE_FONT_SIZE
        }),
        ...(item.description
          ? [
              new TextRun({
                text: ` – ${toPlainText(item.description)}`,
                font: FONT_FAMILY,
                size: BASE_FONT_SIZE
              })
            ]
          : []),
        ...(item.url?.href
          ? [
              new TextRun({
                text: ` (${toPlainText(item.url.href)})`,
                font: FONT_FAMILY,
                size: BASE_FONT_SIZE
              })
            ]
          : [])
      ],
      spacing: { before: idx === 0 ? 160 : 120, after: 40 }
    })
  );
  pushSection('references', resume.sections.references.name, resume.sections.references.visible, referenceParagraphs);

  if (docChildren.length === 0) {
    docChildren.push(
      new Paragraph({
        text: '暂无可导出的内容。',
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 }
      })
    );
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: BASE_FONT_SIZE,
            color: BASE_TEXT_COLOR
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: PAGE_MARGIN_LEFT,
              right: PAGE_MARGIN_RIGHT
            }
          }
        },
        children: docChildren
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
