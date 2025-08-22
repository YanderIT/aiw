import html2canvas from 'yd-html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface ExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  margin?: number;
}

/**
 * 多页PDF导出工具
 * 支持自动分页，避免内容被压缩到单页
 */
export class MultiPagePDFExporter {
  private static readonly A4_WIDTH_MM = 210;
  private static readonly A4_HEIGHT_MM = 297;
  private static readonly MM_TO_PX_RATIO = 3.779527559; // 1mm = 3.78px at 96dpi

  /**
   * 导出多页PDF
   * @param elementId 要导出的元素ID
   * @param options 导出选项
   */
  static async exportMultiPagePDF(
    elementId: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      filename = `简历_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`,
      quality = 0.95,
      scale = 2,
      margin = 2
    } = options;

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`未找到ID为 ${elementId} 的元素`);
      }

      toast.loading('正在生成多页PDF，请稍候...', { id: 'pdf-export' });

      // 保存原始样式
      const originalStyle = {
        width: element.style.width,
        height: element.style.height,
        transform: element.style.transform,
        overflow: element.style.overflow,
        pageBreakInside: element.style.pageBreakInside
      };

      // 设置导出样式
      element.style.width = 'auto';
      element.style.height = 'auto';
      element.style.transform = 'none';
      element.style.overflow = 'visible';
      element.style.pageBreakInside = 'avoid';

      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 200));

      // 生成完整内容的canvas
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      // 恢复原始样式
      Object.assign(element.style, originalStyle);

      // 创建PDF并分页
      await this.createMultiPagePDF(canvas, filename, margin, quality);

      toast.success('多页PDF导出成功！', { id: 'pdf-export' });
    } catch (error) {
      console.error('多页PDF导出失败:', error);
      toast.error(`PDF导出失败: ${error instanceof Error ? error.message : '未知错误'}`, { id: 'pdf-export' });
      throw error;
    }
  }

  /**
   * 创建多页PDF
   * @param canvas 完整内容的canvas
   * @param filename 文件名
   * @param margin 页边距(mm)
   * @param quality 图片质量
   */
  private static async createMultiPagePDF(
    canvas: HTMLCanvasElement,
    filename: string,
    margin: number,
    quality: number
  ): Promise<void> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = this.A4_WIDTH_MM;
    const pdfHeight = this.A4_HEIGHT_MM;
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);

    // 计算缩放比例
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const widthRatio = (contentWidth * this.MM_TO_PX_RATIO) / canvasWidth;
    const heightRatio = (contentHeight * this.MM_TO_PX_RATIO) / canvasHeight;
    const scale = Math.min(widthRatio, 1); // 只缩小，不放大

    // 计算实际内容尺寸(mm)
    const scaledWidth = (canvasWidth / this.MM_TO_PX_RATIO) * scale;
    const scaledHeight = (canvasHeight / this.MM_TO_PX_RATIO) * scale;

    // 计算每页可容纳的内容高度(px)
    const pageContentHeightPx = contentHeight * this.MM_TO_PX_RATIO / scale;
    const totalPages = Math.ceil(canvasHeight / pageContentHeightPx);

    console.log(`内容总高度: ${canvasHeight}px, 每页高度: ${pageContentHeightPx}px, 总页数: ${totalPages}`);

    // 分页处理
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // 计算当前页的内容区域
      const startY = pageIndex * pageContentHeightPx;
      const endY = Math.min(startY + pageContentHeightPx, canvasHeight);
      const currentPageHeight = endY - startY;

      // 创建当前页的canvas
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d')!;
      pageCanvas.width = canvasWidth;
      pageCanvas.height = currentPageHeight;

      // 绘制当前页内容
      pageCtx.fillStyle = '#ffffff';
      pageCtx.fillRect(0, 0, canvasWidth, currentPageHeight);
      pageCtx.drawImage(
        canvas,
        0, startY, canvasWidth, currentPageHeight,
        0, 0, canvasWidth, currentPageHeight
      );

      // 转换为图片并添加到PDF
      const imgData = pageCanvas.toDataURL('image/jpeg', quality);
      const imgHeight = (currentPageHeight / this.MM_TO_PX_RATIO) * scale;
      
      // 居中放置
      const x = (pdfWidth - scaledWidth) / 2;
      const y = margin;

      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, imgHeight);

      // 添加页码
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `${pageIndex + 1} / ${totalPages}`,
        pdfWidth - margin - 20,
        pdfHeight - margin + 5
      );
    }

    // 保存PDF
    pdf.save(filename);
  }

  /**
   * 智能分页导出（实验性功能）
   * 尝试在合适的位置分页，避免截断重要内容
   * @param elementId 要导出的元素ID
   * @param options 导出选项
   */
  static async exportSmartPagination(
    elementId: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`未找到ID为 ${elementId} 的元素`);
    }

    // 查找所有可能的分页点（如section、div等）
    const breakPoints = this.findBreakPoints(element);
    
    // TODO: 实现智能分页逻辑
    // 目前回退到标准多页导出
    return this.exportMultiPagePDF(elementId, options);
  }

  /**
   * 查找合适的分页点
   * @param element 根元素
   * @returns 分页点数组
   */
  private static findBreakPoints(element: Element): number[] {
    const breakPoints: number[] = [];
    const sections = element.querySelectorAll('section, .resume-section, .page-break');
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = rect.top - elementRect.top;
      breakPoints.push(relativeTop);
    });

    return breakPoints.sort((a, b) => a - b);
  }
}

// 导出便捷函数
export const exportMultiPagePDF = MultiPagePDFExporter.exportMultiPagePDF.bind(MultiPagePDFExporter);
export const exportSmartPagination = MultiPagePDFExporter.exportSmartPagination.bind(MultiPagePDFExporter);