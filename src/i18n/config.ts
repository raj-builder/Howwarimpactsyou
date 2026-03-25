export const defaultLocale = 'en'
export const locales = ['en', 'ar', 'tl'] as const
export type Locale = (typeof locales)[number]
