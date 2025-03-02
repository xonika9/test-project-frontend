export const LANGUAGES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
] as const;

export const THEMES = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Темная' },
] as const;

export type Language = typeof LANGUAGES[number]['value'];
export type Theme = typeof THEMES[number]['value'];
