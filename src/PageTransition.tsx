import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import './PageTransition.css';

const transitionDuration = 760;

export function PageTransition() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), transitionDuration);
    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.search, location.hash]);

  return visible ? <div className="page-transition" aria-hidden="true" /> : null;
}
