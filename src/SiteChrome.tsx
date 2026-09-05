import { motion } from 'motion/react';
import { Link } from 'react-router';
import type { Locale, SitePage } from './i18n/locale';
import { pagePath } from './i18n/locale';
import logo from './assets/thoughost.svg';
import bandcamp from './assets/bandcamp.svg';
import soundcloud from './assets/soundcloud.svg';
import xLogo from './assets/x.svg';
import './AboutPage.css';
import { useSiteTheme } from './theme/ThemeProvider';

const MotionLink = motion.create(Link);

const labelMotion = {
  rest: { x: 0, scale: 1 },
  hover: { x: 3 },
  tap: { x: 2, scale: .92, transition: { duration: .14 } },
};

/** Marker-bearing actions animate their label only, keeping the marker anchored. */
export function useSiteInteraction(fixedMarker = false) {
  const { ink } = useSiteTheme();
  return {
    initial: false as const,
    animate: 'rest',
    whileHover: 'hover',
    whileFocus: 'hover',
    whileTap: 'tap',
    variants: {
      rest: { x: 0, scale: 1, color: ink },
      hover: { x: fixedMarker ? 0 : 3, color: 'rgb(163, 189, 142)' },
      tap: { x: fixedMarker ? 0 : 2, scale: fixedMarker ? 1 : .92, transition: { duration: .14 } },
    },
    transition: { duration: .42, ease: [.22, 1, .36, 1] as const },
    className: 'about-action',
  };
}

export function SiteHeader({ locale, page }: { locale: Locale; page: SitePage }) {
  const interaction = useSiteInteraction(true);
  const { theme, toggleTheme } = useSiteTheme();
  const themeLabels = {
    en: { light: 'Switch to dark mode', dark: 'Switch to light mode' },
    zh: { light: '切换到深色模式', dark: '切换到浅色模式' },
    ja: { light: 'ダークモードに切り替える', dark: 'ライトモードに切り替える' },
  };
  const themeLabel = themeLabels[locale][theme];
  return (
      <header className="about-header">
        <div className="about-brand">
          <motion.button className="about-theme-toggle" type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} aria-pressed={theme === 'dark'} whileHover={{ opacity: .7 }} transition={{ duration: .18 }}><img src={logo} alt="" /></motion.button>
          <Link className="about-wordmark" to={pagePath(locale)} aria-label="Thoughost home"><img src={logo} alt="Thoughost" /></Link>
        </div>
        <nav aria-label="Primary">
          <MotionLink {...interaction} to={pagePath(locale, 'about')} aria-current={page === 'about' ? 'page' : undefined}><motion.span className="about-action-label" variants={labelMotion} transition={interaction.transition}>ABOUT</motion.span> <span className="about-action-arrow" aria-hidden="true" /></MotionLink>
          <MotionLink {...interaction} to={pagePath(locale, 'discography')} aria-current={page === 'discography' ? 'page' : undefined}><motion.span className="about-action-label" variants={labelMotion} transition={interaction.transition}>DISCOGRAPHY</motion.span> <span className="about-action-arrow" aria-hidden="true" /></MotionLink>
          <MotionLink {...interaction} to={pagePath(locale) + '#news'}><motion.span className="about-action-label" variants={labelMotion} transition={interaction.transition}>NEWS</motion.span> <span className="about-action-arrow" aria-hidden="true" /></MotionLink>
          <motion.a {...interaction} href="#contact"><motion.span className="about-action-label" variants={labelMotion} transition={interaction.transition}>CONTACT</motion.span> <span className="about-action-arrow" aria-hidden="true" /></motion.a>
        </nav>
        <div className="about-social"><motion.a {...interaction} href="https://thoughost.bandcamp.com/" aria-label="Thoughost Bandcamp"><motion.img variants={labelMotion} transition={interaction.transition} src={bandcamp} alt="" /></motion.a><motion.span {...interaction} tabIndex={0} title="SoundCloud 地址待补"><motion.img variants={labelMotion} transition={interaction.transition} src={soundcloud} alt="SoundCloud" /></motion.span><motion.span {...interaction} tabIndex={0} title="X 地址待补"><motion.img variants={labelMotion} transition={interaction.transition} src={xLogo} alt="X" /></motion.span></div>
      </header>
  );
}

export function SiteFooter() {
  const interaction = useSiteInteraction();
  return (
      <footer className="about-footer" id="contact">
        <div><span>Email</span><motion.a {...interaction} href="mailto:thoughost.dm@gmail.com">thoughost.dm@gmail.com</motion.a></div>
        <div><span>Follow us</span><span className="about-follow-links"><motion.span {...interaction} tabIndex={0} title="地址待补">bilibili</motion.span><motion.span {...interaction} tabIndex={0} title="地址待补">YouTube</motion.span><motion.a {...interaction} href="https://www.dizzylab.net/l/Thoughost/">dizzylab</motion.a></span></div>
        <div>Copyright © 2020–2026 Thoughost All rights reserved.</div>
      </footer>
  );
}
