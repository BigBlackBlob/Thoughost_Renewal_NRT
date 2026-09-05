import type { Locale } from './locale';

type Messages = {
  pageTitles: { home: string; about: string; discography: string };
  navigation: { about: string; news: string; discography: string; contact: string };
};

// UI copy is available for future designs; existing visible prototype copy is retained.
export const messages = {
  en: { pageTitles: { home: 'Thoughost', about: 'About · Thoughost', discography: 'Discography · Thoughost' }, navigation: { about: 'About', news: 'News', discography: 'Discography', contact: 'Contact' } },
  zh: { pageTitles: { home: 'Thoughost', about: 'About · Thoughost', discography: '作品目录 · Thoughost' }, navigation: { about: '关于', news: '动态', discography: '作品目录', contact: '联系' } },
  ja: { pageTitles: { home: 'Thoughost', about: 'About · Thoughost', discography: 'ディスコグラフィー · Thoughost' }, navigation: { about: '概要', news: 'ニュース', discography: 'ディスコグラフィー', contact: 'お問い合わせ' } },
} satisfies Record<Locale, Messages>;
