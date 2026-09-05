import { useEffect, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { pagePath } from './i18n/locale';
import type { Locale, SitePage } from './i18n/locale';
import { updates, categories, prototypeCatalog } from './content/prototype';
import { selectAlbums } from './content/catalog';
import type { CategoryId } from './content/types';
type NavigationEvent = MouseEvent<HTMLAnchorElement | HTMLButtonElement>;
type NavigationProps = { onOpenDiscography: (event: NavigationEvent) => void; onOpenHomeSection: (event: NavigationEvent, hash: string) => void };
type CanvasStyle = CSSProperties & { '--scale': number };
import logo from './assets/thoughost.svg';
import xLogo from './assets/x.svg';
import soundcloudLogo from './assets/soundcloud.svg';
import bandcampLogo from './assets/bandcamp.svg';
import invasionCover from './assets/albums/2000-invasion.jpg';
import asteriaCover from './assets/albums/asteria.jpg';
import ephemanentCover from './assets/albums/ephemanent.jpg';
import kakushojoCover from './assets/albums/kakushojo3.jpg';
import moonshineCover from './assets/albums/moonshine01.jpg';
import paletteCover from './assets/albums/paletteofclouds.jpg';
import thoughtsCover from './assets/albums/thoughts.jpg';
import thoughts2Cover from './assets/albums/thoughts2.jpg';

function Header({ onOpenDiscography, onOpenHomeSection }: NavigationProps) {
  return (
    <header className="site-header" id="about">
      <a href="#" aria-label="Thoughost home" onClick={(event) => onOpenHomeSection(event, '')}>
        <img className="brand-logo" src={logo} alt="Thoughost" />
      </a>
      <nav className="main-nav" aria-label="Primary">
        <button
          className="nav-about"
          onClick={(event) => onOpenHomeSection(event, '#about')}
          type="button"
        >
          ABOUT
        </button>
        <button
          className="nav-news"
          onClick={(event) => onOpenHomeSection(event, '#news')}
          type="button"
        >
          NEWS
        </button>
        <button
          className="nav-discography"
          onClick={onOpenDiscography}
          type="button"
        >
          DISCOGRAPHY
        </button>
        <button
          className="nav-contact"
          onClick={(event) => onOpenHomeSection(event, '#contact')}
          type="button"
        >
          CONTACT
        </button>
      </nav>
      <nav className="social-nav" aria-label="Social links">
        <a className="social-link social-x" href="#x" aria-label="X">
          <img src={xLogo} alt="" />
        </a>
        <a className="social-link social-soundcloud" href="#soundcloud" aria-label="SoundCloud">
          <img src={soundcloudLogo} alt="" />
        </a>
        <a className="social-link social-bandcamp" href="#bandcamp" aria-label="Bandcamp">
          <img src={bandcampLogo} alt="" />
        </a>
      </nav>
    </header>
  );
}

function Footer({ page = 'home' }: { page?: SitePage }) {
  return (
    <footer className={`site-footer ${page === 'discography' ? 'discography-footer' : ''}`} id="contact">
      <div className="footer-rule" />
      <div className="footer-email">
        <span>Email</span>
        <a href="mailto:thoughost.dm@gmail.com">thoughost.dm@gmail.com</a>
      </div>
      <div className="footer-follow">
        <span>Follow us</span>
        <div>
          <a href="#bilibili">bilibili</a>
          <a href="#youtube">YouTube</a>
          <a href="#dizzylab">dizzylab</a>
        </div>
      </div>
      <p className="copyright">Copyright © 2020-2026 Thoughost All rights reserved.</p>
    </footer>
  );
}

function HomePage({ onOpenDiscography, onOpenHomeSection }: NavigationProps) {
  return (
    <>
      <Header onOpenDiscography={onOpenDiscography} onOpenHomeSection={onOpenHomeSection} />

      <section className="updates" id="news" aria-label="News">
        {updates.map((item, index) => (
          <a className="update-row" href="#news" key={`${item}-${index}`}>
            <span>{item}</span>
            <span className="corner" aria-hidden="true" />
          </a>
        ))}
      </section>

      <a className="black-panel" href="#contact" aria-label="Contact Thoughost" />

      <section className="gallery-grid" aria-label="Featured discography">
        <a className="album-tile tile-large" href="#thoughts-2" aria-label="thoughts 2">
          <img src={thoughts2Cover} alt="" />
        </a>
        <a className="album-tile tile-mid mid-a" href="#2000-invasion" aria-label="2000% invasion">
          <img src={invasionCover} alt="" />
        </a>
        <a className="album-tile tile-mid mid-b" href="#thoughts" aria-label="thoughts">
          <img src={thoughtsCover} alt="" />
        </a>
        <a className="album-tile tile-mid mid-c" href="#moonshine-001" aria-label="moonshine 001">
          <img src={moonshineCover} alt="" />
        </a>
        <a className="album-tile tile-mid mid-d" href="#asteria" aria-label="asteria">
          <img src={asteriaCover} alt="" />
        </a>
        <a className="album-tile tile-small small-a" href="#palette" aria-label="palette">
          <img src={paletteCover} alt="" />
        </a>
        <a className="album-tile tile-small small-b" href="#kaku-shojo" aria-label="kaku shojo">
          <img src={kakushojoCover} alt="" />
        </a>
        <a className="album-tile tile-small small-c" href="#ephemanent" aria-label="ephemanent">
          <img src={ephemanentCover} alt="" />
        </a>
        <a
          className="album-more tile-small small-d"
          href="#discography"
          aria-label="More discography"
          onClick={onOpenDiscography}
        >
          <span>MORE</span>
        </a>
      </section>

      <Footer />
    </>
  );
}

function DiscographyPage({ onOpenDiscography, onOpenHomeSection }: NavigationProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [activeAlbumId, setActiveAlbumId] = useState(prototypeCatalog.albums[0]?.id ?? '');
  const [visiblePageIndex, setVisiblePageIndex] = useState(0);

  const selectedCategoryMeta = categories.find((category) => category.id === selectedCategory) ?? categories[0];
  const filteredAlbums = selectAlbums(prototypeCatalog, selectedCategory);
  const visibleAlbums = filteredAlbums.slice(visiblePageIndex * 8, visiblePageIndex * 8 + 8);

  const activateAlbum = (albumId: string) => {
    const albumIndex = filteredAlbums.findIndex((album) => album.id === albumId);
    if (albumIndex === -1) {
      return;
    }

    setActiveAlbumId(albumId);
    setVisiblePageIndex(Math.floor(albumIndex / 8));
  };

  const selectCategory = (categoryId: CategoryId) => {
    const nextAlbums = selectAlbums(prototypeCatalog, categoryId);

    setSelectedCategory(categoryId);
    setVisiblePageIndex(0);
    setActiveAlbumId(nextAlbums[0]?.id ?? '');
  };

  return (
    <>
      <Header onOpenDiscography={onOpenDiscography} onOpenHomeSection={onOpenHomeSection} />

      <section className="discography-page" id="discography" aria-label="Discography">
        <div className="album-wall" key={`${selectedCategory}-${visiblePageIndex}`}>
          {visibleAlbums.map((album) => (
            <a
              className={`album-cover${activeAlbumId === album.id ? ' is-active' : ''}`}
              href={album.href}
              key={album.id}
              onClick={(event) => event.preventDefault()}
              onFocus={() => activateAlbum(album.id)}
              onMouseEnter={() => activateAlbum(album.id)}
            >
              <img src={album.cover} alt={album.title} />
            </a>
          ))}
        </div>

        <nav className="category-nav" aria-label="Discography categories">
          {categories.map((category) => (
            <button
              className={`category-button${selectedCategory === category.id ? ' is-selected' : ''}`}
              key={category.id}
              onClick={() => selectCategory(category.id)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </nav>

        <aside className="album-index" aria-label={`${selectedCategoryMeta.display} releases`}>
          <h1>{selectedCategoryMeta.display}</h1>
          <div className="album-index-rule" aria-hidden="true" />
          <div className="album-list" tabIndex={0}>
            {filteredAlbums.map((album) => (
              <a
                className={`album-list-item${activeAlbumId === album.id ? ' is-active' : ''}`}
                href={album.href}
                key={album.id}
                onClick={(event) => event.preventDefault()}
                onFocus={() => activateAlbum(album.id)}
                onMouseEnter={() => activateAlbum(album.id)}
              >
                {album.title}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <Footer page="discography" />
    </>
  );
}

function App({ locale, page }: { locale: Locale; page: SitePage }) {
  const navigate = useNavigate();
  const [scale, setScale] = useState(() => Math.min(1, window.innerWidth / 1920));
  const isDiscographyPage = page === 'discography';

  useEffect(() => {
    const updateScale = () => setScale(Math.min(1, window.innerWidth / 1920));
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const openDiscography = (event: NavigationEvent) => {
    event.preventDefault();
    void navigate(pagePath(locale, 'discography'));
  };
  const openHomeSection = (event: NavigationEvent, targetHash: string) => {
    event.preventDefault();
    void navigate(targetHash === '#about' ? pagePath(locale, 'about') : pagePath(locale) + targetHash);
  };

  return (
    <main className="page-shell" aria-label={isDiscographyPage ? 'Thoughost discography' : 'Thoughost home'}>
      <div
        className="scale-frame"
        style={{
          '--scale': scale,
          width: `${1920 * scale}px`,
          height: `${1080 * scale}px`,
        } as CanvasStyle}
      >
        <section className={`design-canvas ${isDiscographyPage ? 'discography-canvas' : 'home-canvas'}`}>
          {isDiscographyPage
            ? <DiscographyPage onOpenDiscography={openDiscography} onOpenHomeSection={openHomeSection} />
            : <HomePage onOpenDiscography={openDiscography} onOpenHomeSection={openHomeSection} />}
        </section>
      </div>
    </main>
  );
}

export default App;

