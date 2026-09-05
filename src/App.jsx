import { useEffect, useState } from 'react';
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

const updates = [
  'NNNNNNNNNNuN',
  'NNNNNNNNNNuN',
  'NNNNNNNNNNuNN\nNNNNNNNNN',
  'NNNNNNNNNNuN',
];

const categories = [
  { id: 'all', label: 'ALL', display: 'ALL' },
  { id: 'compilation-solo', label: 'COMPILATION\nSOLO', display: 'COMPILATION SOLO' },
  { id: 'ep-single', label: 'EP\nSINGLE', display: 'EP SINGLE' },
];

const albums = [
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

const sortByNewest = (items) =>
  [...items].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

function Header({ onOpenDiscography, onOpenHomeSection }) {
  return (
    <header className="site-header" id="about">
      <a href="#" aria-label="Thoughost home" onClick={(event) => onOpenHomeSection(event, '')}>
        <img className="brand-logo" src={logo} alt="Thoughost" />
      </a>
      <nav className="main-nav" aria-label="Primary">
        <button
          className="nav-about"
          onClick={(event) => onOpenHomeSection(event, '#about')}
          onPointerDown={(event) => onOpenHomeSection(event, '#about')}
          type="button"
        >
          ABOUT
        </button>
        <button
          className="nav-news"
          onClick={(event) => onOpenHomeSection(event, '#news')}
          onPointerDown={(event) => onOpenHomeSection(event, '#news')}
          type="button"
        >
          NEWS
        </button>
        <button
          className="nav-discography"
          onClick={onOpenDiscography}
          onPointerDown={onOpenDiscography}
          type="button"
        >
          DISCOGRAPHY
        </button>
        <button
          className="nav-contact"
          onClick={(event) => onOpenHomeSection(event, '#contact')}
          onPointerDown={(event) => onOpenHomeSection(event, '#contact')}
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

function Footer({ page = 'home' }) {
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

function HomePage({ onOpenDiscography, onOpenHomeSection }) {
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
          onPointerDown={onOpenDiscography}
        >
          <span>MORE</span>
        </a>
      </section>

      <Footer />
    </>
  );
}

function DiscographyPage({ onOpenDiscography, onOpenHomeSection }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeAlbumId, setActiveAlbumId] = useState(albums[0].id);
  const [visiblePageIndex, setVisiblePageIndex] = useState(0);

  const selectedCategoryMeta = categories.find((category) => category.id === selectedCategory) ?? categories[0];
  const filteredAlbums = sortByNewest(
    selectedCategory === 'all'
      ? albums
      : albums.filter((album) => album.categories.includes(selectedCategory)),
  );
  const visibleAlbums = filteredAlbums.slice(visiblePageIndex * 8, visiblePageIndex * 8 + 8);

  const activateAlbum = (albumId) => {
    const albumIndex = filteredAlbums.findIndex((album) => album.id === albumId);
    if (albumIndex === -1) {
      return;
    }

    setActiveAlbumId(albumId);
    setVisiblePageIndex(Math.floor(albumIndex / 8));
  };

  const selectCategory = (categoryId) => {
    const nextAlbums = sortByNewest(
      categoryId === 'all' ? albums : albums.filter((album) => album.categories.includes(categoryId)),
    );

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
          <div className="album-list" tabIndex="0">
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

function App() {
  const [scale, setScale] = useState(() => Math.min(1, window.innerWidth / 1920));
  const [route, setRoute] = useState(() => window.location.hash);
  const isDiscographyPage = route === '#discography';

  useEffect(() => {
    const updateScale = () => setScale(Math.min(1, window.innerWidth / 1920));
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  const openDiscography = (event) => {
    event?.preventDefault();
    window.history.pushState(null, '', '#discography');
    setRoute('#discography');
  };

  const openHomeSection = (event, targetHash) => {
    event?.preventDefault();
    window.history.pushState(null, '', targetHash || window.location.pathname);
    setRoute(targetHash);
  };

  return (
    <main className="page-shell" aria-label={isDiscographyPage ? 'Thoughost discography' : 'Thoughost home'}>
      <div
        className="scale-frame"
        style={{
          '--scale': scale,
          width: `${1920 * scale}px`,
          height: `${1080 * scale}px`,
        }}
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
