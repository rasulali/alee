export const locales = ["az", "en", "ru"] as const;
export const defaultLocale = "az" as const;
export const COOKIE_NAME = "NEXT_LOCALE";

export type Locale = (typeof locales)[number];
