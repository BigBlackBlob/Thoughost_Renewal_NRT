import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/noto-sans-sc';
import './fonts.css';
import './App.css';
import { BrowserRouter } from 'react-router';
import { SiteRoutes } from './routing';
import { MotionProvider } from './motion/MotionProvider';
import { ThemeProvider } from './theme/ThemeProvider';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');

createRoot(root).render(
  <React.StrictMode>
    <MotionProvider>
      <ThemeProvider><BrowserRouter><SiteRoutes /></BrowserRouter></ThemeProvider>
    </MotionProvider>
  </React.StrictMode>
);
