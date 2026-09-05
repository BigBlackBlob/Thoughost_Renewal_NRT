import invasionCover from '../assets/albums/2000-invasion.jpg';
import asteriaCover from '../assets/albums/asteria.jpg';
import ephemanentCover from '../assets/albums/ephemanent.jpg';
import kakushojoCover from '../assets/albums/kakushojo3.jpg';
import moonshineCover from '../assets/albums/moonshine01.jpg';
import paletteCover from '../assets/albums/paletteofclouds.jpg';
import thoughtsCover from '../assets/albums/thoughts.jpg';
import thoughts2Cover from '../assets/albums/thoughts2.jpg';
import type { Album, Catalog } from './types';
// Unverified layout fixtures; not the official catalog.
export const updates = [
  'NNNNNNNNNNuN',
  'NNNNNNNNNNuN',
  'NNNNNNNNNNuNN\nNNNNNNNNN',
  'NNNNNNNNNNuN',
];

export const categories = [
  { id: 'all', label: 'ALL', display: 'ALL' },
  { id: 'compilation-solo', label: 'COMPILATION\nSOLO', display: 'COMPILATION SOLO' },
  { id: 'ep-single', label: 'EP\nSINGLE', display: 'EP SINGLE' },
] as const;

const albums: readonly Album[] = [
  {
    id: 'thoughts-2',
    title: 'thoughts 2',
    categories: ['ep-single'],
    releaseDate: '2026-04-20',
    cover: thoughts2Cover,
    href: '#thoughts-2',
  },
  {
    id: '2000-invasion',
    title: '2000% INVASION',
    categories: ['compilation-solo'],
    releaseDate: '2026-03-12',
    cover: invasionCover,
    href: '#2000-invasion',
  },
  {
    id: 'moonshine-001',
    title: 'MOONSHINE #001',
    categories: ['ep-single'],
    releaseDate: '2026-02-18',
    cover: moonshineCover,
    href: '#moonshine-001',
  },
  {
    id: 'haru-no-owari',
    title: '春ノ終焉',
    categories: ['compilation-solo'],
    releaseDate: '2026-01-10',
    cover: kakushojoCover,
    href: '#haru-no-owari',
  },
  {
    id: 'asteria',
    title: 'Asteria',
    categories: ['compilation-solo'],
    releaseDate: '2025-12-05',
    cover: asteriaCover,
    href: '#asteria',
  },
  {
    id: 'thoughts',
    title: 'thoughts',
    categories: ['ep-single'],
    releaseDate: '2025-10-26',
    cover: thoughtsCover,
    href: '#thoughts',
  },
  {
    id: 'palette-of-clouds',
    title: 'palette of clouds',
    categories: ['compilation-solo'],
    releaseDate: '2025-09-02',
    cover: paletteCover,
    href: '#palette-of-clouds',
  },
  {
    id: 'kakusatsu-shoujo-3',
    title: 'KAKUSATSU SHOUJO 3',
    categories: ['ep-single'],
    releaseDate: '2025-07-19',
    cover: kakushojoCover,
    href: '#kakusatsu-shoujo-3',
  },
  {
    id: 'ephemanent',
    title: 'Ephemanent',
    categories: ['compilation-solo'],
    releaseDate: '2025-04-21',
    cover: ephemanentCover,
    href: '#ephemanent',
  },
  {
    id: 'sixteen-forty-eight',
    title: '16:48',
    categories: ['ep-single'],
    releaseDate: '2025-02-08',
    cover: invasionCover,
    href: '#sixteen-forty-eight',
  },
  {
    id: 'moonshine-alt',
    title: 'MOONSHINE #001 - reprise',
    categories: ['compilation-solo'],
    releaseDate: '2024-11-16',
    cover: moonshineCover,
    href: '#moonshine-alt',
  },
  {
    id: 'asteria-live',
    title: 'Asteria live edit',
    categories: ['ep-single'],
    releaseDate: '2024-08-04',
    cover: asteriaCover,
    href: '#asteria-live',
  },
];

export const prototypeCatalog = { source: 'prototype', albums } satisfies Catalog;
