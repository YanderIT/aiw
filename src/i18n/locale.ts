import { Pathnames } from "next-intl/routing";

export const locales = ["en", "zh"];

export const localeNames: any = {
  // en: "English",
  zh: "中文",
};

export const defaultLocale = "zh";

export const localePrefix = "as-needed";

// 禁用自动语言检测，所有用户默认使用 defaultLocale (zh)
// 用户可以手动切换语言
export const localeDetection = false;
