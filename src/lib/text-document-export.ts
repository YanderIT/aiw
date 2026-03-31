import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Packer
} from 'docx';
import { toast } from 'sonner';

export interface TextDocumentExportOptions {
  filename: string;
  title?: string;
  author?: string;
  language?: 'en' | 'zh';
}

/**
 * 文本文档导出工具类
 * 支持将纯文本/Markdown内容导出为 PDF 和 DOCX 格式
 */
export class TextDocumentExporter {
  // A4 页面尺寸 (mm)
  private static readonly A4_WIDTH_MM = 210;
  private static readonly A4_HEIGHT_MM = 297;

  // 页边距 (mm)
  private static readonly MARGIN_TOP = 20;
  private static readonly MARGIN_BOTTOM = 20;
  private static readonly MARGIN_LEFT = 20;
  private static readonly MARGIN_RIGHT = 20;

  // 内容区域
  private static readonly CONTENT_WIDTH = this.A4_WIDTH_MM - this.MARGIN_LEFT - this.MARGIN_RIGHT;
  private static readonly CONTENT_HEIGHT = this.A4_HEIGHT_MM - this.MARGIN_TOP - this.MARGIN_BOTTOM;

  /**
   * 导出为 PDF 格式
   * @param content 文本内容
   * @param options 导出选项
   */
  static async exportToPDF(
    content: string,
    options: TextDocumentExportOptions
  ): Promise<void> {
    const { filename, title, author, language = 'en' } = options;

    try {
      toast.loading('正在生成 PDF，请稍候...', { id: 'pdf-export' });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 设置文档元数据
      if (title) {
        pdf.setProperties({ title });
      }
      if (author) {
        pdf.setProperties({ author });
      }

      // 设置字体和字号
      pdf.setFont('helvetica', 'normal');
      const fontSize = 11;
      const lineHeight = 6; // 行高 (mm)
      pdf.setFontSize(fontSize);

      // 解析内容为段落
      const paragraphs = this.parseContentToParagraphs(content);

      let currentY = this.MARGIN_TOP;
      let currentPage = 1;

      // 遍历每个段落
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];

        // 将段落分行以适应页面宽度
        const lines = pdf.splitTextToSize(paragraph, this.CONTENT_WIDTH);

        // 检查是否需要换页
        const requiredHeight = lines.length * lineHeight + (i > 0 ? lineHeight : 0); // 段落间距

        if (currentY + requiredHeight > this.A4_HEIGHT_MM - this.MARGIN_BOTTOM) {
          // 添加页码
          this.addPageNumber(pdf, currentPage);

          // 换页
          pdf.addPage();
          currentPage++;
          currentY = this.MARGIN_TOP;
        } else if (i > 0) {
          // 段落间距
          currentY += lineHeight;
        }

        // 绘制段落文本
        pdf.text(lines, this.MARGIN_LEFT, currentY);
        currentY += lines.length * lineHeight;
      }

      // 添加最后一页的页码
      this.addPageNumber(pdf, currentPage);

      // 保存 PDF
      pdf.save(filename);

      toast.success('PDF 导出成功！', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF 导出失败:', error);
      toast.error(
        `PDF 导出失败: ${error instanceof Error ? error.message : '未知错误'}`,
        { id: 'pdf-export' }
      );
      throw error;
    }
  }

  /**
   * 导出为 DOCX 格式
   * @param content 文本内容
   * @param options 导出选项
   */
  static async exportToDOCX(
    content: string,
    options: TextDocumentExportOptions
  ): Promise<void> {
    const { filename, title, author, language = 'en' } = options;

    try {
      toast.loading('正在生成 Word 文档，请稍候...', { id: 'docx-export' });

      // 解析内容为段落
      const paragraphs = this.parseContentToParagraphs(content);

      // 创建文档段落
      const docParagraphs: Paragraph[] = [];

      // 如果有标题，添加标题段落
      if (title) {
        docParagraphs.push(
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400
            }
          })
        );
      }

      // 添加内容段落
      paragraphs.forEach((para: string, index: number) => {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para,
                font: language === 'zh' ? '宋体' : 'Times New Roman',
                size: 24 // 12pt = 24 half-points
              })
            ],
            spacing: {
              before: index === 0 ? 0 : 200,
              after: 200,
              line: 360 // 1.5倍行距
            },
            alignment: AlignmentType.JUSTIFIED
          })
        );
      });

      // 创建文档
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440, // 1 inch = 1440 twips
                  bottom: 1440,
                  left: 1440,
                  right: 1440
                }
              }
            },
            children: docParagraphs
          }
        ],
        creator: author || 'Essmote AI',
        title: title || 'Document'
      });

      // 生成并保存文档
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);

      toast.success('Word 文档导出成功！', { id: 'docx-export' });
    } catch (error) {
      console.error('DOCX 导出失败:', error);
      toast.error(
        `Word 文档导出失败: ${error instanceof Error ? error.message : '未知错误'}`,
        { id: 'docx-export' }
      );
      throw error;
    }
  }

  /**
   * 解析内容为段落数组
   * 按双换行符分割段落
   */
  private static parseContentToParagraphs(content: string): string[] {
    return content
      .split('\n\n')
      .map((para: string) => para.trim())
      .filter((para: string) => para.length > 0);
  }

  /**
   * 添加页码到 PDF
   */
  private static addPageNumber(pdf: jsPDF, pageNumber: number): void {
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `${pageNumber}`,
      this.A4_WIDTH_MM / 2,
      this.A4_HEIGHT_MM - this.MARGIN_BOTTOM / 2,
      { align: 'center' }
    );
  }
}

/**
 * 便捷导出函数 - PDF
 */
export async function exportTextToPDF(
  content: string,
  options: TextDocumentExportOptions
): Promise<void> {
  return TextDocumentExporter.exportToPDF(content, options);
}

/**
 * 便捷导出函数 - DOCX
 */
export async function exportTextToDOCX(
  content: string,
  options: TextDocumentExportOptions
): Promise<void> {
  return TextDocumentExporter.exportToDOCX(content, options);
}
