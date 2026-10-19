import { Fragment, useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { properties } from '../../data/properties';
import { formatPrice, formatSpecs } from '../../lib/format';
import useParallax from '../../hooks/useParallax';
import HashLink from '../ui/HashLink';
import Photo from '../ui/Photo';
import SplitText from '../ui/SplitText';
import Reveal from '../ui/Reveal';

const featured = properties.filter((p) => p.featured);
const pad = (n) => String(n).padStart(2, '0');

// Scroll distance each panel holds still before the next one starts to cover it.
const DWELL = 0.5; // × viewport height

/**
 * One full-screen listing. Panels are sticky siblings, so each new one slides
 * over the last; on the way in its frame opens from an inset to full-bleed and
 * the panel underneath recedes and darkens (adapted from the reference's
 * frame-into-frame transitions).
 */
function FeaturedPanel({ property, index, isLast }) {
  // Scroll progress is measured on a static marker at the panel's resting
  // position — measuring the sticky element itself drifts once it pins.
  const ref = useRef(null);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  // Starts once this panel has dwelt for DWELL × 100svh, ends when fully covered.
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: [`${DWELL} start`, `${1 + DWELL} start`] });

  const clipPath = useParallax(enter, [0, 1], ['inset(14% 7% 0% 7%)', 'inset(0% 0% 0% 0%)'], 'inset(0% 0% 0% 0%)');
  const imageScale = useParallax(enter, [0, 1], [1.25, 1], 1);
  const recede = useParallax(leave, [0, 1], [1, isLast ? 1 : 0.9], 1);
  const dim = useTransform(leave, [0, 1], [0, isLast ? 0 : 0.7]);

  return (
    <>
      <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-[100svh]" style={{ top: `${index * (1 + DWELL) * 100}svh` }} />
      <article aria-labelledby={`featured-${property.id}`} className="sticky top-0 h-[100svh] overflow-hidden">
      <motion.div className="relative size-full" style={{ scale: recede }}>
        <motion.div className="relative size-full overflow-hidden bg-ink text-paper" style={{ clipPath }}>
          <motion.div className="size-full" style={{ scale: imageScale }}>
            <Photo slug={property.images[0]} />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-ink/10" />

          <div className="absolute inset-0 flex items-end">
            <div className="container-site grid gap-6 pb-10 md:pb-14 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="eyebrow mb-4 text-paper/80">
                  {pad(index + 1)} / {pad(featured.length)} — {property.location}
                </p>
                <h3 id={`featured-${property.id}`} className="font-serif text-display">
                  {property.title}
                </h3>
              </div>
              <div className="lg:col-span-4 lg:pb-2">
                <p className="max-w-sm leading-relaxed text-paper/85">{property.summary}</p>
                <p className="mt-4 text-sm text-paper/70">{formatSpecs(property)}</p>
                <div className="mt-6 flex items-center gap-6">
                  <Link to={`/properties/${property.id}`} className="btn-light group">
                    View home
                    <ArrowRight aria-hidden="true" className="arrow-nudge size-4" strokeWidth={1.75} />
                  </Link>
                  <span className="text-lg">{formatPrice(property.price)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: dim }} />
      </motion.div>
      </article>
    </>
  );
}

export default function FeaturedHomes() {
  return (
    <section id="featured" aria-labelledby="featured-title" className="bg-ink text-paper">
      <div className="container-site flex flex-col justify-between gap-8 pt-section pb-14 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-5 text-stone">Selected homes</p>
          <h2 id="featured-title" className="max-w-[12ch] font-serif text-title">
            <SplitText text="Places worth moving for" />
          </h2>
        </div>
        <Reveal className="max-w-sm">
          <p className="leading-relaxed text-stone">Three homes our agents keep talking about this season, each chosen for how it lives, not just how it looks.</p>
          <HashLink to="/#discover" className="group mt-5 inline-flex items-center gap-3 font-medium">
            <span className="link-line pb-0.5">Browse every home</span>
            <ArrowRight aria-hidden="true" className="arrow-nudge size-4" strokeWidth={1.75} />
          </HashLink>
        </Reveal>
      </div>
      <div className="relative">
        {featured.map((property, i) => {
          const isLast = i === featured.length - 1;
          return (
            <Fragment key={property.id}>
              <FeaturedPanel property={property} index={i} isLast={isLast} />
              {!isLast && <div aria-hidden="true" style={{ height: `${DWELL * 100}svh` }} />}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
