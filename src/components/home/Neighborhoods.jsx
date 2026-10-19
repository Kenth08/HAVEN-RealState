import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { neighborhoods } from '../../data/neighborhoods';
import { EASE_IN_OUT_QUART } from '../../lib/motion';
import HashLink from '../ui/HashLink';
import Photo from '../ui/Photo';
import SplitText from '../ui/SplitText';

/**
 * Index of places. On desktop, hovering or focusing a row wipes its photo up
 * over the previous one (the reference's mask-wipe transition). Each row links
 * to the search, pre-filtered to that location.
 */
export default function Neighborhoods() {
  const [view, setView] = useState({ previous: null, current: 0 });
  const activate = (i) => setView((v) => (v.current === i ? v : { previous: v.current, current: i }));
  const active = neighborhoods[view.current];
  // Browsers fire synthetic hover events when the list scrolls under a still
  // cursor; only a pointer that actually moved should swap the image.
  const onPointerMove = (i) => (event) => (event.movementX || event.movementY) && activate(i);

  return (
    <section id="neighborhoods" aria-labelledby="neighborhoods-title" className="bg-ink py-section text-paper">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5 text-stone">Neighborhoods</p>
          <h2 id="neighborhoods-title" className="mb-12 font-serif text-title">
            <SplitText text="Where people are moving" />
          </h2>
          <ul className="border-t border-line-inverse">
            {neighborhoods.map((n, i) => (
              <li key={n.location} className="border-b border-line-inverse">
                <HashLink
                  to={`/?location=${encodeURIComponent(n.location)}#discover`}
                  onPointerMove={onPointerMove(i)}
                  onFocus={() => activate(i)}
                  className="group flex items-center gap-5 py-5"
                >
                  <span className="size-16 shrink-0 overflow-hidden lg:hidden">
                    <Photo slug={n.photo} sizes="64px" alt="" />
                  </span>
                  <span
                    className={`flex-1 font-serif text-[clamp(2.25rem,5vw,4.25rem)] leading-none transition-colors duration-500 group-hover:text-paper ${
                      view.current === i ? 'lg:text-paper' : 'lg:text-stone/70'
                    }`}
                  >
                    {n.name}
                  </span>
                  <span className="hidden text-right text-sm text-stone sm:block">
                    {n.region}
                    <br />
                    {n.count} {n.count === 1 ? 'home' : 'homes'}
                  </span>
                  <ArrowRight aria-hidden="true" className="arrow-nudge size-5 shrink-0 text-stone group-hover:text-paper" strokeWidth={1.5} />
                </HashLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
              {view.previous !== null && (
                <div className="absolute inset-0">
                  <Photo slug={neighborhoods[view.previous].photo} sizes="30vw" alt="" />
                </div>
              )}
              <motion.div
                key={view.current}
                className="absolute inset-0"
                initial={{ clipPath: view.previous === null ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 0.9, ease: EASE_IN_OUT_QUART }}
              >
                <motion.div className="size-full" initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE_IN_OUT_QUART }}>
                  <Photo slug={active.photo} sizes="30vw" />
                </motion.div>
              </motion.div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone" aria-live="polite">
              <span className="text-paper">{active.name}.</span> {active.note}
            </p>
            {/* Warm the cache so the wipe never reveals a half-loaded photo. */}
            <div aria-hidden="true" className="sr-only">
              {neighborhoods.map((n) => (
                <Photo key={n.location} slug={n.photo} sizes="30vw" alt="" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
