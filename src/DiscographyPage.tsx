import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createScopedAnimate, motion, useMotionValue } from 'motion/react';
import { useSearchParams } from 'react-router';
import { SiteFooter, SiteHeader, useSiteInteraction } from './SiteChrome';
import { discographyCategories, discographyReleases, parseDiscographyCategory, selectDiscography, releasesPerPage } from './content/discography';
import type { DiscographyCategory, DiscographyRelease } from './content/discography';
import type { Locale } from './i18n/locale';
import './DiscographyPage.css';
import { useSiteTheme } from './theme/ThemeProvider';

const animate = createScopedAnimate({ reduceMotion: false });

const labels = {
  en: { unavailable: 'Cover unavailable', wall: 'Releases', filter: 'Release categories', previous: 'Previous page', next: 'Next page', pages: 'Release pages' },
  zh: { unavailable: '封面暂不可用', wall: '作品封面', filter: '作品分类', previous: '上一页', next: '下一页', pages: '作品分页' },
  ja: { unavailable: 'ジャケットを表示できません', wall: '作品一覧', filter: '作品の分類', previous: '前のページ', next: '次のページ', pages: '作品のページ' },
};

/** Keep each release mounted so interrupted filters continue from its current position. */
function ReleaseTile({ slot, children }: {
  slot: number; children: ReactNode;
}) {
  const visible = slot >= 0;
  const x = useMotionValue(visible ? slot % 6 * 220 : 0);
  const y = useMotionValue(visible ? Math.floor(slot / 6) * 220 : 0);
  const opacity = useMotionValue(visible ? 1 : 0);

  useLayoutEffect(() => {
    const timing = { ease: [.22, 1, .36, 1] as const };
    if (slot < 0) {
      const exit = animate(opacity, 0, { ...timing, duration: .16 });
      return () => exit.stop();
    }
    const nextX = slot % 6 * 220;
    const nextY = Math.floor(slot / 6) * 220;
    const alreadyVisible = opacity.get() > .01;
    const moving = alreadyVisible && (x.get() !== nextX || y.get() !== nextY);
    // Off-page releases have no visible origin; enter directly at the destination.
    if (!alreadyVisible) { x.set(nextX); y.set(nextY); }
    const travel = { ...timing, duration: .62, delay: !moving ? 0 : .16 };
    const animations = [
      animate(x, nextX, travel),
      animate(y, nextY, travel),
      animate(opacity, 1, { ...timing, duration: .32, delay: alreadyVisible ? 0 : .22 }),
    ];
    return () => animations.forEach(animation => animation.stop());
  }, [slot, x, y, opacity]);

  return <motion.li inert={!visible} aria-hidden={!visible} style={{ x, y, opacity, pointerEvents: visible ? 'auto' : 'none', zIndex: visible ? 1 : 0 }}>{children}</motion.li>;
}

/** Keep original color at rest; desaturate only the other covers during interaction. */
function ReleaseCover({ release, colored, unavailable }: {
  release: DiscographyRelease; colored: boolean; unavailable: string;
}) {
  const id = useId().replace(/:/g, '');
  const [failed, setFailed] = useState(false);
  return failed ? <span className="disc-cover-fallback">{release.title}<small>{unavailable}</small></span> : (
    <svg className="disc-cover-art" viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <filter id={`${id}-mono`} colorInterpolationFilters="sRGB">
          <motion.feColorMatrix type="saturate" initial={false} animate={{ values: colored ? 1 : 0 }} transition={{ duration: .45, ease: 'easeInOut' }} />
        </filter>
      </defs>
      <image href={release.cover} width="220" height="220" preserveAspectRatio="xMidYMid meet" filter={`url(#${id}-mono)`} onError={() => setFailed(true)} />
    </svg>
  );
}

export function DiscographyPage({ locale }: { locale: Locale }) {
  const { ink } = useSiteTheme();
  const viewportRef = useRef<HTMLDivElement>(null);
  const interaction = useSiteInteraction();
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [params, setParams] = useSearchParams();
  const category = parseDiscographyCategory(params.get('category'));
  const filteredReleases = selectDiscography(category);
  const pageCount = Math.max(1, Math.ceil(filteredReleases.length / releasesPerPage));
  const requestedPage = Number(params.get('page') ?? 1);
  const page = Number.isInteger(requestedPage) ? Math.min(pageCount, Math.max(1, requestedPage)) : 1;
  const releases = filteredReleases.slice((page - 1) * releasesPerPage, page * releasesPerPage);
  const changeCategory = (next: DiscographyCategory) => {
    if (next === category) return;
    setHovered(null);
    setFocused(null);
    setParams(current => {
      const updated = new URLSearchParams(current);
      updated.delete('page');
      if (next === 'all') updated.delete('category');
      else updated.set('category', next);
      return updated;
    });
  };
  const changePage = (next: number) => {
    if (next < 1 || next > pageCount) return;
    setHovered(null);
    setFocused(null);
    setParams(current => {
      const updated = new URLSearchParams(current);
      if (next === 1) updated.delete('page');
      else updated.set('page', String(next));
      return updated;
    });
  };
  const active = [hovered, focused].find(href => releases.some(release => release.href === href)) ?? null;
  const text = labels[locale];

  // This finite 6 × 3 page fits its approved 1920 × 1080 composition as a whole.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const fit = () => {
      const { width, height } = viewport.getBoundingClientRect();
      const scale = Math.min(width / 1920, height / 1080);
      if (scale > 0) viewport.style.setProperty('--disc-scale', String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="disc-viewport" ref={viewportRef}>
      <div className="disc-page">
        <SiteHeader locale={locale} page="discography" />
        <main className="disc-main">
          <h1><span className="disc-title-dark">DISCOGRAPHY</span><span className="disc-title-overlap" aria-hidden="true">DISCOGRAPHY</span></h1>
          <nav className="disc-categories" aria-label={text.filter}>
            {discographyCategories.map(item => <motion.button {...interaction} key={item} type="button"
              aria-pressed={category === item}
              animate={{ color: category === item ? '#a3bd8e' : ink }}
              onClick={() => changeCategory(item)}>
              {item.toUpperCase()}
            </motion.button>)}
          </nav>
          <ul className="disc-wall" aria-label={text.wall}>
            {discographyReleases.map(release => <ReleaseTile key={release.id} slot={releases.findIndex(item => item.id === release.id)}>
              <a className="disc-cover" href={release.href} aria-label={release.title}
                onMouseEnter={() => setHovered(release.href)} onMouseLeave={() => setHovered(null)}
                onFocus={() => setFocused(release.href)} onBlur={() => setFocused(null)}>
                <ReleaseCover release={release} colored={active === null || active === release.href} unavailable={text.unavailable} />
              </a>
            </ReleaseTile>)}
          </ul>
          <p className="disc-release-title" aria-live="polite">{releases.find(release => release.href === active)?.title ?? ''}</p>
          <nav className="disc-pagination" aria-label={text.pages}>
            <motion.button {...interaction} type="button" aria-label={text.previous} aria-disabled={page === 1} onClick={() => changePage(page - 1)}>←</motion.button>
            <span aria-live="polite">{String(page).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
            <motion.button {...interaction} type="button" aria-label={text.next} aria-disabled={page === pageCount} onClick={() => changePage(page + 1)}>→</motion.button>
          </nav>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}

