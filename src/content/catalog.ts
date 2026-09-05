import type { Album, Catalog, CategoryId } from './types';

/** Keep the prototype content behind one boundary until verified content is approved. */
export function selectAlbums(catalog: Catalog, category: CategoryId = 'all'): Album[] {
  return catalog.albums
    .filter((album) => category === 'all' || album.categories.includes(category))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}
