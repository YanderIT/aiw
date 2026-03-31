// Tailwind CSS 颜色配置 - 完整的11x22种颜色
export interface ThemeColor {
  name: string;
  displayName: string;
  primary: string;    // 主色调 (500)
  secondary: string;  // 次要色调 (600)
  accent: string;     // 强调色 (700)
  light: string;      // 浅色背景 (100)
  dark: string;       // 深色文字 (900)
  header: string;     // 头部背景色 (600)
}

export const THEME_COLORS: ThemeColor[] = [
  // Slate
  { name: 'slate', displayName: '石板灰', primary: '#64748b', secondary: '#475569', accent: '#334155', light: '#f1f5f9', dark: '#0f172a', header: '#475569' },
  // Gray
  { name: 'gray', displayName: '灰色', primary: '#6b7280', secondary: '#4b5563', accent: '#374151', light: '#f9fafb', dark: '#111827', header: '#4b5563' },
  // Zinc
  { name: 'zinc', displayName: '锌色', primary: '#71717a', secondary: '#52525b', accent: '#3f3f46', light: '#fafafa', dark: '#18181b', header: '#52525b' },
  // Neutral
  { name: 'neutral', displayName: '中性色', primary: '#737373', secondary: '#525252', accent: '#404040', light: '#fafafa', dark: '#171717', header: '#525252' },
  // Stone
  { name: 'stone', displayName: '石色', primary: '#78716c', secondary: '#57534e', accent: '#44403c', light: '#fafaf9', dark: '#1c1917', header: '#57534e' },
  // Red
  { name: 'red', displayName: '红色', primary: '#ef4444', secondary: '#dc2626', accent: '#b91c1c', light: '#fef2f2', dark: '#7f1d1d', header: '#dc2626' },
  // Orange
  { name: 'orange', displayName: '橙色', primary: '#f97316', secondary: '#ea580c', accent: '#c2410c', light: '#fff7ed', dark: '#7c2d12', header: '#ea580c' },
  // Amber
  { name: 'amber', displayName: '琥珀色', primary: '#f59e0b', secondary: '#d97706', accent: '#b45309', light: '#fffbeb', dark: '#78350f', header: '#d97706' },
  // Yellow
  { name: 'yellow', displayName: '黄色', primary: '#eab308', secondary: '#ca8a04', accent: '#a16207', light: '#fefce8', dark: '#713f12', header: '#ca8a04' },
  // Lime
  { name: 'lime', displayName: '酸橙色', primary: '#84cc16', secondary: '#65a30d', accent: '#4d7c0f', light: '#f7fee7', dark: '#365314', header: '#65a30d' },
  // Green
  { name: 'green', displayName: '绿色', primary: '#22c55e', secondary: '#16a34a', accent: '#15803d', light: '#f0fdf4', dark: '#14532d', header: '#16a34a' },
  // Emerald
  { name: 'emerald', displayName: '翡翠色', primary: '#10b981', secondary: '#059669', accent: '#047857', light: '#ecfdf5', dark: '#064e3b', header: '#059669' },
  // Teal
  { name: 'teal', displayName: '青色', primary: '#14b8a6', secondary: '#0d9488', accent: '#0f766e', light: '#f0fdfa', dark: '#134e4a', header: '#0d9488' },
  // Cyan
  { name: 'cyan', displayName: '青蓝色', primary: '#06b6d4', secondary: '#0891b2', accent: '#0e7490', light: '#ecfeff', dark: '#164e63', header: '#0891b2' },
  // Sky
  { name: 'sky', displayName: '天空蓝', primary: '#0ea5e9', secondary: '#0284c7', accent: '#0369a1', light: '#f0f9ff', dark: '#0c4a6e', header: '#0284c7' },
  // Blue (默认)
  { name: 'blue', displayName: '蓝色', primary: '#3b82f6', secondary: '#2563eb', accent: '#1d4ed8', light: '#eff6ff', dark: '#1e3a8a', header: '#2563eb' },
  // Indigo
  { name: 'indigo', displayName: '靛蓝色', primary: '#6366f1', secondary: '#4f46e5', accent: '#4338ca', light: '#eef2ff', dark: '#312e81', header: '#4f46e5' },
  // Violet
  { name: 'violet', displayName: '紫罗兰色', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#6d28d9', light: '#f5f3ff', dark: '#4c1d95', header: '#7c3aed' },
  // Purple
  { name: 'purple', displayName: '紫色', primary: '#a855f7', secondary: '#9333ea', accent: '#7e22ce', light: '#faf5ff', dark: '#581c87', header: '#9333ea' },
  // Fuchsia
  { name: 'fuchsia', displayName: '洋红色', primary: '#d946ef', secondary: '#c026d3', accent: '#a21caf', light: '#fdf4ff', dark: '#701a75', header: '#c026d3' },
  // Pink
  { name: 'pink', displayName: '粉色', primary: '#ec4899', secondary: '#db2777', accent: '#be185d', light: '#fdf2f8', dark: '#831843', header: '#db2777' },
  // Rose
  { name: 'rose', displayName: '玫瑰色', primary: '#f43f5e', secondary: '#e11d48', accent: '#be123c', light: '#fff1f2', dark: '#881337', header: '#e11d48' },
];

// 从色阶格式（如 "blue-500"）获取具体的颜色值
export const getColorFromScale = (colorScale: string): string => {
  const [colorFamily, scale] = colorScale.split('-');
  const COLOR_SCALES: { [key: string]: { [key: string]: string } } = {
    slate: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
      500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617'
    },
    gray: {
      50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
      500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712'
    },
    zinc: {
      50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa',
      500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b'
    },
    neutral: {
      50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3',
      500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a'
    },
    stone: {
      50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e',
      500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09'
    },
    red: {
      50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
      500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a'
    },
    orange: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
      500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407'
    },
    amber: {
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
      500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03'
    },
    yellow: {
      50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15',
      500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006'
    },
    lime: {
      50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635',
      500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05'
    },
    green: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
      500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16'
    },
    emerald: {
      50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
      500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22'
    },
    teal: {
      50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
      500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e'
    },
    cyan: {
      50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
      500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344'
    },
    sky: {
      50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
      500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49'
    },
    blue: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
    },
    indigo: {
      50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
      500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b'
    },
    violet: {
      50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
      500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065'
    },
    purple: {
      50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc',
      500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764'
    },
    fuchsia: {
      50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9',
      500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e'
    },
    pink: {
      50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
      500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724'
    },
    rose: {
      50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
      500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519'
    }
  };

  const colorValue = COLOR_SCALES[colorFamily]?.[scale];
  if (!colorValue) {
    // 如果找不到颜色，尝试返回该颜色家族的500色阶作为备用
    return COLOR_SCALES[colorFamily]?.[500] || '#0ea5e9'; // 默认天空蓝 500
  }
  return colorValue;
};

// 从色阶格式创建主题对象
export const getThemeFromScale = (colorScale: string) => {
  const [colorFamily, scale] = colorScale.split('-');
  const primaryColor = getColorFromScale(colorScale);
  
  // 根据选择的色阶生成相关的颜色
  const generateRelatedColors = (family: string, currentScale: string) => {
    const scaleNum = parseInt(currentScale);
    
    // 当色阶大于700时，accent颜色固定为该颜色家族的700，否则按原本规则
    const accentScale = scaleNum > 700 ? 700 : Math.min(scaleNum + 200, 950);
    
    const result = {
      primary: primaryColor,
      secondary: getColorFromScale(`${family}-${Math.min(scaleNum + 100, 900)}`),
      accent: getColorFromScale(`${family}-${accentScale}`),
      light: getColorFromScale(`${family}-${Math.max(scaleNum - 400, 50)}`),
      dark: getColorFromScale(`${family}-${Math.max(scaleNum + 400, 950)}`),
      header: getColorFromScale(`${family}-${Math.min(scaleNum + 100, 900)}`)
    };
    
    // 调试信息（仅在需要时启用）
    // console.log(`Theme colors for ${colorScale}:`, {
    //   primary: result.primary,
    //   accent: result.accent,
    //   accentScale: accentScale,
    //   originalScale: scaleNum
    // });
    
    return result;
  };

  return generateRelatedColors(colorFamily, scale);
};

export const getThemeColor = (themeName: string): ThemeColor => {
  return THEME_COLORS.find(color => color.name === themeName) || THEME_COLORS[14]; // 默认使用天空蓝（索引14）
};

export const getThemeColorName = (themeName: string): string => {
  return THEME_COLORS.find(color => color.name === themeName)?.displayName || '天空蓝';
};