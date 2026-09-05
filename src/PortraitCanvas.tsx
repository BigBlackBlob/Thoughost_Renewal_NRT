import { useEffect, useRef, useState } from 'react';
import { createScopedAnimate } from 'motion';

const animate = createScopedAnimate({ reduceMotion: false });

export interface PortraitSource {
  name: string;
  src: string | undefined;
  vertical: number;
}

const tileWidth = 860;
const tileHeight = 495;
const width = tileWidth * 3;
const height = tileHeight * 4;

// Both color states share one bitmap and integer tile edges, including during motion.
export function PortraitCanvas({ portraits, active }: {
  portraits: readonly PortraitSource[];
  active: string | null;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const progress = useRef<number[]>(portraits.map(() => 1));
  const [layers, setLayers] = useState<{ color: HTMLCanvasElement; mono: HTMLCanvasElement } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const images = await Promise.all(portraits.map(async portrait => {
        if (!portrait.src) return null;
        const image = new Image();
        image.src = portrait.src;
        try { await image.decode(); return image; } catch { return null; }
      }));
      if (cancelled) return;
      const color = document.createElement('canvas');
      const mono = document.createElement('canvas');
      color.width = mono.width = width;
      color.height = mono.height = height;
      const c = color.getContext('2d');
      const m = mono.getContext('2d');
      if (!c || !m) return;
      c.fillStyle = '#d9d9d9';
      c.fillRect(0, 0, width, height);
      images.forEach((image, index) => {
        if (!image) return;
        const scale = Math.max(tileWidth / image.naturalWidth, tileHeight / image.naturalHeight);
        const sw = tileWidth / scale;
        const sh = tileHeight / scale;
        c.drawImage(image, (image.naturalWidth - sw) / 2,
          (image.naturalHeight - sh) * (portraits[index]?.vertical ?? .5), sw, sh,
          index % 3 * tileWidth, Math.floor(index / 3) * tileHeight, tileWidth, tileHeight);
      });
      m.filter = 'grayscale(1)';
      m.drawImage(color, 0, 0);
      setLayers({ color, mono });
    };
    void load();
    return () => { cancelled = true; };
  }, [portraits]);

  useEffect(() => {
    const context = ref.current?.getContext('2d');
    if (!layers || !context) return;
    const from = [...progress.current];
    const to = portraits.map(portrait => active === null || portrait.name === active ? 1 : 0);
    const draw = (fraction: number) => {
      context.drawImage(layers.mono, 0, 0);
      portraits.forEach((_, index) => {
        const value = (from[index] ?? 0) + ((to[index] ?? 0) - (from[index] ?? 0)) * fraction;
        progress.current[index] = value;
        if (value <= 0) return;
        const x = index % 3 * tileWidth;
        const y = Math.floor(index / 3) * tileHeight;
        context.save();
        // Fade the entire portrait into color on the existing shared canvas.
        context.globalAlpha = value;
        context.drawImage(layers.color, x, y, tileWidth, tileHeight, x, y, tileWidth, tileHeight);
        context.restore();
      });
    };
    if (to.every((value, index) => value === from[index])) {
      draw(1);
      return;
    }
    draw(0);
    const animation = animate(0, 1, { duration: .45, ease: 'easeInOut', onUpdate: draw });
    return () => animation.stop();
  }, [active, layers, portraits]);

  return <canvas ref={ref} width={width} height={height} className="about-portrait-canvas" aria-hidden="true" />;
}
