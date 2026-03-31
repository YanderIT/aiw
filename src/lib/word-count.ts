/**
 * 智能字数统计工具
 * 根据语言自动选择统计方式：
 * - 英文：按单词数（Word Count）
 * - 中文：按字符数（Character Count）
 */

export type CountType = 'words' | 'characters';

export interface WordCountResult {
  count: number;
  type: CountType;
  label: string;
}

/**
 * 统计英文单词数
 * 按空格分隔，符合美国大学申请标准
 *
 * @param text 要统计的文本
 * @returns 单词数量
 *
 * @example
 * countWords("I am a student")  // 返回 4
 * countWords("Hello,  world!")  // 返回 2
 */
export function countWords(text: string): number {
  if (!text || text.trim() === '') return 0;

  // 移除多余空格，按空格分割
  const words = text
    .trim()
    .replace(/\s+/g, ' ')  // 将多个空格（包括换行）替换为单个空格
    .split(' ')
    .filter((word: string) => word.length > 0);  // 过滤空字符串

  return words.length;
}

/**
 * 统计中文字符数（不含空格）
 *
 * @param text 要统计的文本
 * @returns 字符数量
 *
 * @example
 * countChineseCharacters("我是一名学生")  // 返回 6
 */
export function countChineseCharacters(text: string): number {
  if (!text) return 0;

  // 移除所有空白字符
  const textWithoutSpaces = text.replace(/\s/g, '');
  return textWithoutSpaces.length;
}

/**
 * 智能统计字数
 * 根据语言类型自动选择统计方式
 *
 * @param text 要统计的文本
 * @param language 语言类型 ('English' | 'Chinese')
 * @returns 字数统计结果，包含数量、类型和标签
 *
 * @example
 * smartWordCount("I am applying for PhD", "English")
 * // 返回 { count: 5, type: 'words', label: 'words' }
 *
 * smartWordCount("我正在申请博士项目", "Chinese")
 * // 返回 { count: 9, type: 'characters', label: '字' }
 */
export function smartWordCount(
  text: string,
  language: 'English' | 'Chinese' = 'English'
): WordCountResult {
  if (language === 'Chinese') {
    return {
      count: countChineseCharacters(text),
      type: 'characters',
      label: '字'
    };
  } else {
    return {
      count: countWords(text),
      type: 'words',
      label: 'words'
    };
  }
}

/**
 * 检测文本主要语言
 * 使用简单启发式：如果中文字符超过30%，判定为中文
 *
 * @param text 要检测的文本
 * @returns 'English' | 'Chinese'
 *
 * @example
 * detectLanguage("I am a student")  // 返回 'English'
 * detectLanguage("我是学生")        // 返回 'Chinese'
 * detectLanguage("I am 学生")       // 返回 'English' (中文比例<30%)
 */
export function detectLanguage(text: string): 'English' | 'Chinese' {
  if (!text || text.trim() === '') return 'English';

  const chineseCharPattern = /[\u4e00-\u9fa5]/g;
  const chineseChars = text.match(chineseCharPattern) || [];
  const totalChars = text.replace(/\s/g, '').length;

  if (totalChars === 0) return 'English';

  const chineseRatio = chineseChars.length / totalChars;

  return chineseRatio > 0.3 ? 'Chinese' : 'English';
}

/**
 * 格式化字数显示
 *
 * @param count 字数
 * @param language 语言类型
 * @returns 格式化的字数字符串
 *
 * @example
 * formatWordCount(1234, "English")  // "1,234 words"
 * formatWordCount(1234, "Chinese")  // "1,234 字"
 */
export function formatWordCount(
  count: number,
  language: 'English' | 'Chinese' = 'English'
): string {
  const formattedCount = count.toLocaleString();
  const label = language === 'Chinese' ? '字' : 'words';
  return `${formattedCount} ${label}`;
}
