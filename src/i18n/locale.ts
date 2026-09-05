export const locales = ['en', 'zh', 'ja'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

/** Honor browser preference order; unsupported languages fall back to English. */
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split(/[-_]/)[0];
    if (isLocale(base)) return base;
  }
  return 'en';
}

export type SitePage = 'home' | 'discography' | 'about';

export function pagePath(locale: Locale, page: SitePage = 'home'): string {
  return `/${locale}/${page === 'home' ? '' : page}`;
}

/** Switching language preserves a localized page, query and fragment. */
export function languagePath(locale: Locale, location: Pick<Location, 'pathname' | 'search' | 'hash'>): string {
  const [, currentLocale, ...segments] = location.pathname.split('/');
  const suffix = isLocale(currentLocale) ? segments.join('/') : '';
  return `/${locale}/${suffix}${location.search}${location.hash}`;
}
