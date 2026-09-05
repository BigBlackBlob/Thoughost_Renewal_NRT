import { describe, expect, it } from 'vitest';
import { discographyReleases, parseDiscographyCategory, selectDiscography } from './content/discography';

describe('discography demonstration categories', () => {
  it('uses the specified releases without filling SOLO with invented assignments', () => {
    expect(selectDiscography('ep').map(release => release.title)).toEqual(['Asteria', 'palette of clouds', 'After the Forerunner e.p.', 'TRIXXCK']);
    expect(selectDiscography('solo').map(release => release.title)).toEqual(['16:48']);
    expect(selectDiscography('single').map(release => release.title)).toEqual(['春ノ終焉', 'Perpetual Status -転生する天使-', 'Series Planet Exploration - Miranda -']);
    expect(selectDiscography('all')).toHaveLength(20);
  });

  it('falls back to ALL for unknown URL categories without altering the source order', () => {
    const before = discographyReleases.map(release => release.id);
    expect(parseDiscographyCategory('ep')).toBe('ep');
    expect(parseDiscographyCategory('unknown')).toBe('all');
    expect(parseDiscographyCategory(null)).toBe('all');
    selectDiscography('single');
    expect(discographyReleases.map(release => release.id)).toEqual(before);
    expect(discographyReleases[0]?.title).toBe('KAKUSATSU SHOUJO 4');
    expect(discographyReleases.at(-1)?.title).toBe('KAKUSATSU SHOUJO');
  });
});
