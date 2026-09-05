import type { ReviewState } from './types';

export type DiscographyRelease = {
  id: string;
  title: string;
  href: string;
  cover: string;
  releaseDate: string;
};

// Public title/cover/link associations read from Bandcamp on 2026-09-05.
// This visual sample does not approve categories, summaries, translations or tracks.
const entries = [
  ['KAKUSATSU SHOUJO 4', 'album/kakusatsu-shoujo-4', '0209168015', '2026-07-20'],
  ['thoughts 2', 'album/thoughts-2', '2124124055', '2026-04-26'],
  ['2000% INVASION', 'album/2000-invasion', '1622141907', '2025-10-26'],
  ['MOONSHINE #001', 'album/moonshine-001', '2585905353', '2025-10-26'],
  ['春ノ終焉', 'track/--17', '0670042704', '2025-07-25'],
  ['thoughts', 'album/thoughts', '0245106055', '2025-04-27'],
  ['Asteria', 'album/asteria', '3164232145', '2025-04-27'],
  ['palette of clouds', 'album/palette-of-clouds', '1778016514', '2024-10-27'],
  ['KAKUSATSU SHOUJO 3', 'album/kakusatsu-shoujo-3', '0654656327', '2024-08-12'],
  ['Ephemanent', 'album/ephemanent', '1421791472', '2024-04-28'],
  ['16:48', 'album/16-48', '0494011467', '2023-05-02'],
  ['After the Forerunner e.p.', 'album/after-the-forerunner-e-p', '0402384760', '2023-04-30'],
  ['蒼 -depressive & emotional compilation-', 'album/depressive-emotional-compilation', '4267324310', '2022-10-30'],
  ['KAKUSATSU SHOUJO 2', 'album/kakusatsu-shoujo-2', '0230682000', '2022-04-24'],
  ['S.L.V.T: MIXTURE', 'album/s-l-v-t-mixture', '3663708238', '2022-03-12'],
  ['TRIXXCK', 'album/trixxck', '0898066633', '2021-11-03'],
  ['GROUND ATTACK!!!', 'album/ground-attack', '0058421280', '2021-04-05'],
  ['Perpetual Status -転生する天使-', 'track/perpetual-status', '2231313451', '2020-09-09'],
  ['Series Planet Exploration - Miranda -', 'track/series-planet-exploration-miranda', '2789864379', '2020-07-10'],
  ['KAKUSATSU SHOUJO', 'album/kakusatsu-shoujo', '1091052231', '2020-06-05'],
] as const;

export const discographyReview = {
  source: 'https://thoughost.bandcamp.com/music',
  checkedOn: '2026-09-05',
  categories: 'pending' satisfies ReviewState,
  releases: entries.map(([title, path, image, releaseDate]) => ({
    id: path,
    title,
    href: `https://thoughost.bandcamp.com/${path}`,
    cover: `https://f4.bcbits.com/img/a${image}_2.jpg`,
    releaseDate,
  })) satisfies readonly DiscographyRelease[],
};

// ISO dates sort chronologically; equal-date releases retain the official catalog order.
export const discographyReleases = discographyReview.releases.toSorted((a, b) => b.releaseDate.localeCompare(a.releaseDate));
export const releasesPerPage = 18;

export const discographyCategories = ['all', 'compilation', 'ep', 'solo', 'single'] as const;
export type DiscographyCategory = typeof discographyCategories[number];

// Deliberately partial demonstration assignments, separate from the pending catalog review.
export const categoryDemo = {
  compilation: [
    'album/kakusatsu-shoujo-4',
    'album/thoughts-2',
    'album/2000-invasion',
    'album/moonshine-001',
    'track/--17',
    'album/thoughts',
    'album/kakusatsu-shoujo-3',
    'album/ephemanent',
    'album/depressive-emotional-compilation',
    'album/kakusatsu-shoujo-2',
    'album/s-l-v-t-mixture',
    'album/ground-attack',
    'album/kakusatsu-shoujo',
  ],
  ep: ['album/asteria', 'album/palette-of-clouds', 'album/after-the-forerunner-e-p', 'album/trixxck'],
  solo: ['album/16-48'],
  single: ['track/--17', 'track/perpetual-status', 'track/series-planet-exploration-miranda'],
} as const satisfies Record<Exclude<DiscographyCategory, 'all'>, readonly (typeof entries[number][1])[]>;

export function parseDiscographyCategory(value: string | null): DiscographyCategory {
  return discographyCategories.find(category => category === value) ?? 'all';
}

/** Filtering preserves newest-first order and never assigns unlisted releases by inference. */
export function selectDiscography(category: DiscographyCategory): readonly DiscographyRelease[] {
  if (category === 'all') return discographyReleases;
  const ids: readonly string[] = categoryDemo[category];
  return discographyReleases.filter(release => ids.includes(release.id));
}

