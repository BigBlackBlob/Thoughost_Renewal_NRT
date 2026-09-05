import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import App from './App';
import { AboutPage } from './AboutPage';
import { DiscographyPage } from './DiscographyPage';
import { detectLocale, isLocale, pagePath } from './i18n/locale';
import { messages } from './i18n/messages';
import type { SitePage } from './i18n/locale';
import { PageTransition } from './PageTransition';

export function entryPath(languages: readonly string[], hash: string, search: string): string {
  const page = hash === '#discography' ? 'discography' : 'home';
  return pagePath(detectLocale(languages), page) + search + (page === 'home' ? hash : '');
}

function EntryRedirect() {
  const { hash, search } = useLocation();
  return <Navigate replace to={entryPath(navigator.languages, hash, search)} />;
}

function LocalizedPage({ page }: { page: SitePage }) {
  const { locale } = useParams();
  const { hash, search } = useLocation();
  const validLocale = isLocale(locale) ? locale : undefined;

  useEffect(() => {
    if (!validLocale) return;
    document.documentElement.lang = validLocale;
    document.title = messages[validLocale].pageTitles[page];
  }, [validLocale, page]);

  if (!validLocale) return <EntryRedirect />;
  if (hash === '#discography') {
    return <Navigate replace to={pagePath(validLocale, 'discography') + search} />;
  }
  if (page === 'about') return <AboutPage locale={validLocale} />;
  if (page === 'discography') return <DiscographyPage locale={validLocale} />;
  return <App locale={validLocale} page={page} />;
}

function UnknownPageRedirect() {
  const { locale } = useParams();
  return isLocale(locale) ? <Navigate replace to={pagePath(locale)} /> : <EntryRedirect />;
}

export function SiteRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EntryRedirect />} />
        <Route path="/:locale" element={<LocalizedPage page="home" />} />
        <Route path="/:locale/about" element={<LocalizedPage page="about" />} />
        <Route path="/:locale/discography" element={<LocalizedPage page="discography" />} />
        <Route path="/:locale/*" element={<UnknownPageRedirect />} />
      </Routes>
      <PageTransition />
    </>
  );
}
