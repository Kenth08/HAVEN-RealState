import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { site } from '../../config/site';
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from '../../lib/motion';
import { lockScroll } from '../../lib/smoothScroll';

const MIN_MS = 1100;
const MAX_MS = 3000;

function heroSources() {
  const needed = Math.max(window.innerWidth, window.innerHeight) * (window.devicePixelRatio || 1);
  const width = needed > 1000 ? 2000 : 1000;
  return [`/images/hero-bg-${width}.webp`, `/images/hero-cut-${width}.webp`];
}

function decode(src) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
}

/** Spinning mark + wordmark that holds until the hero layers are decoded, then wipes upward. */
export default function Loader({ onReveal, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    Promise.race([Promise.all([wait(MIN_MS), ...heroSources().map(decode)]), wait(MAX_MS)]).then(() => {
      if (cancelled) return;
      setLeaving(true);
      onReveal();
    });
    return () => {
      cancelled = true;
    };
  }, [onReveal]);

  useEffect(() => {
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 bg-ink text-paper"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: leaving ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 1.1, ease: EASE_IN_OUT_QUART }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <span className="sr-only">Loading {site.name}</span>
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="size-14"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, ease: 'linear', repeat: Infinity }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="32" cy="32" rx="5" ry="22" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 15} 32 32)`} />
        ))}
      </motion.svg>
      <div aria-hidden="true" className="flex overflow-hidden font-serif text-4xl tracking-[0.2em]">
        {site.name.split('').map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '100%' }}
            animate={{ y: leaving ? '-100%' : '0%' }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: leaving ? i * 0.03 : 0.15 + i * 0.07 }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
