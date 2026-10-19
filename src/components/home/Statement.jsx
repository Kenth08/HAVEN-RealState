import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { site } from '../../config/site';
import useParallax from '../../hooks/useParallax';
import HashLink from '../ui/HashLink';
import Reveal from '../ui/Reveal';

const STATEMENT =
  'Homes change because lives do. A new job, a growing family, a slower pace. We pair you with an agent who listens first, then help you move with clarity and confidence.';

function Word({ progress, range, children }) {
  const opacity = useParallax(progress, range, [0.16, 1], 1);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** Opening statement: words light up in reading order as the paragraph scrolls through. */
export default function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const words = STATEMENT.split(' ');

  return (
    <section id="story" aria-labelledby="story-title" className="relative z-10 bg-paper pt-section pb-[clamp(3rem,6vw,6rem)]">
      <div className="container-site grid gap-8 lg:grid-cols-12">
        <h2 id="story-title" className="eyebrow pt-4 text-mute lg:col-span-3">
          Why {site.name}
        </h2>
        <div className="lg:col-span-9">
          <p ref={ref} className="font-serif text-[clamp(1.9rem,3.7vw,3.6rem)] leading-[1.08] tracking-[-0.01em]">
            {words.map((word, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {word}
              </Word>
            ))}
          </p>
          <Reveal className="mt-12 grid gap-8 border-t border-line pt-8 text-mute sm:grid-cols-2">
            <p className="max-w-md leading-relaxed">
              Buying, selling or renting, you work with one agent from first call to final signature, backed by mortgage, legal and inspection partners we trust.
            </p>
            <div className="sm:justify-self-end">
              <HashLink to="/#contact" className="group inline-flex items-center gap-3 font-medium text-ink">
                <span className="link-line pb-0.5">Meet an agent</span>
                <ArrowRight aria-hidden="true" className="arrow-nudge size-4" strokeWidth={1.75} />
              </HashLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
