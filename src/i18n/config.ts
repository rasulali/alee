export type Locale = (typeof locales)[number];

export const locales = ['en', 'az'] as const;
export const defaultLocale: Locale = 'en';
