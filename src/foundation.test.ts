import { describe, expect, it } from 'vitest';
import { detectLocale, languagePath } from './i18n/locale';
import { entryPath } from './routing';
import { selectAlbums } from './content/catalog';
import { prototypeCatalog } from './content/prototype';

describe('language routing', () => {
  it('honors supported browser preferences and regional variants', () => {
    expect(detectLocale(['fr-FR', 'zh-HK', 'en'])).toBe('zh');
    expect(detectLocale(['ja-JP', 'en'])).toBe('ja');
    expect(detectLocale(['de'])).toBe('en');
    expect(detectLocale([])).toBe('en');
  });
  it('preserves legacy links and query parameters', () => {
    expect(entryPath(['ja'], '#discography', '?ref=old')).toBe('/ja/discography?ref=old');
    expect(entryPath(['en'], '#news', '')).toBe('/en/#news');
  });
  it('switches language without losing the current page', () => {
    expect(languagePath('zh', { pathname: '/ja/discography', search: '?ref=x', hash: '#item' }))
      .toBe('/zh/discography?ref=x#item');
  });
});

describe('prototype catalog', () => {
  it('filters and sorts without mutating the source', () => {
    const before = [...prototypeCatalog.albums];
    const selected = selectAlbums(prototypeCatalog, 'ep-single');
    expect(selected.length).toBeGreaterThan(0);
    expect(selected.every(album => album.categories.includes('ep-single'))).toBe(true);
    expect(selected.map(album => album.releaseDate)).toEqual(selected.map(album => album.releaseDate).sort().reverse());
    expect(prototypeCatalog.albums).toEqual(before);
  });
});
