import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Locale } from './i18n/locale';
import './AboutPage.css';
import { PortraitCanvas } from './PortraitCanvas';
import { useSiteTheme } from './theme/ThemeProvider';

import chaoyin from "./assets/members/chaoyin.jpg";
import wheatfox from "./assets/members/wheatfox.jpg";
import rmdyh from "./assets/members/rmdyh.jpg";
import erua from "./assets/members/erua.jpg";
import joulez from "./assets/members/joulez2.png";
import laxeno from "./assets/members/laxeno.jpg";
import nirotiy from "./assets/members/Nirotiy.jpg";
import mashiro from "./assets/members/wangyuezhenbai.jpg";
import konseki from "./assets/members/konseki-color.png";
import novaz from './assets/members/novaz.png';
import shidoye from './assets/members/shidoye.png';
import black201 from './assets/members/black201.png';
// Portrait assignments follow the user-confirmed member roster.
const members = ['潮音きつね', 'Konseki Takane', '望月真白', 'Nirotiy', '57lab', 'Joulez', 'wheatfox', '四度夜 靈', 'Black201', 'nova+z', 'Foe Requiem', 'rmdyh'];

const portraits: Partial<Record<string, string>> = {
  '潮音きつね': chaoyin, 'Konseki Takane': konseki, '望月真白': mashiro,
  Nirotiy: nirotiy, '57lab': laxeno, Joulez: joulez, wheatfox, rmdyh, 'Foe Requiem': erua, 'nova+z': novaz, '四度夜 靈': shidoye, Black201: black201,
};

const portraitSources = members.map(name => ({ name, src: portraits[name], vertical: ['nova+z', '四度夜 靈'].includes(name) ? .7 : .5 }));

import { SiteHeader, SiteFooter } from './SiteChrome';

export function AboutPage({ locale }: { locale: Locale }) {
  const { ink } = useSiteTheme();
  const viewportRef = useRef<HTMLDivElement>(null);
  // Update before paint without a React render; zoom still fits the entire canvas.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const fit = () => {
      const { width, height } = viewport.getBoundingClientRect();
      const scale = Math.min(width / 1920, height / 1080);
      if (scale <= 0) return;
      viewport.style.setProperty('--canvas-scale', String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const activeMember = hovered ?? focused;

  const memberEvents = (name: string) => ({
    onMouseEnter: () => setHovered(name), onMouseLeave: () => setHovered(null),
    onFocus: () => setFocused(name), onBlur: () => setFocused(null),
  });
  return (
    <div className="about-viewport" ref={viewportRef}>
    <div className="about-page">
      <SiteHeader locale={locale} page="about" />
      <main className="about-content">
        <div className="about-intro" lang="en">
          <p>“All thoughts come together here.”</p>
          <p>Thoughost is a doujin music label from China.</p>
          <p>Finding interesting and creative sounds, infusing our thoughts into multi-directional works.</p>
        </div>
        <section className="about-members" aria-labelledby="members-title">
          <h1 id="members-title"><span>MEMBERS</span><span className="about-title-invert" aria-hidden="true">MEMBERS</span></h1>
          <div className="about-member-body">
            <ul>{members.map(name => <li key={name}><motion.button type="button" className="about-member-name" {...memberEvents(name)} animate={{ color: activeMember === name ? 'rgb(163, 189, 142)' : ink }} transition={{ duration: .32 }}>{name}</motion.button></li>)}</ul>
            <div className="about-portraits" aria-label="成员照片">
              <PortraitCanvas portraits={portraitSources} active={activeMember} />
              {members.map(name => <div className="about-portrait" key={name} data-member={name} tabIndex={0} {...memberEvents(name)} aria-label={name}>
              </div>)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
    </div>
  );
}




