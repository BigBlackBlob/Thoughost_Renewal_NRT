import type { LocalizedText } from '../i18n/locale';

export type ReviewState = 'pending' | 'approved' | 'placeholder';
export type Reviewed<T> = { value: T; review: ReviewState };

export type Track = { title: string; artist: string };

// Review prose and track credits independently: approval of one never approves the other.
export type EditorialContent = {
  summary: Reviewed<Partial<LocalizedText>>;
  tracks: Reviewed<readonly Track[]>;
};

export type CategoryId = 'all' | 'compilation-solo' | 'ep-single';
export type Album = {
  id: string;
  title: string;
  categories: readonly Exclude<CategoryId, 'all'>[];
  releaseDate: string;
  cover: string;
  href: string;
};

export type Catalog = {
  source: 'prototype';
  albums: readonly Album[];
};
