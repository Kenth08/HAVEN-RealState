import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import useMediaQuery from '../../hooks/useMediaQuery';
import Photo from '../ui/Photo';

const PILLARS = [
  { title: 'Identity', text: 'Where you live says something about who you are becoming.' },
  { title: 'Progress', text: 'A move marks a new chapter. Take it with a plan, not a guess.' },
  { title: 'Lifestyle', text: 'Commute, schools, light, quiet — the details of an ordinary day.' },
  { title: 'Alignment', text: 'The right home fits your budget, your plans and your instincts.' },
];

function Pillar({ progress, index, pillar }) {
  const start = 0.56 + index * 0.08;
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const y = useTransform(progress, [start, start + 0.08], [28, 0]);
  return (
    <motion.li style={{ opacity, y }} className="border-t border-paper/30 pt-4">
      <p className="font-serif text-4xl md:text-5xl">{pillar.title}</p>
      <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-paper/80">{pillar.text}</p>
    </motion.li>
  );
}

function PillarList({ progress }) {
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
      {PILLARS.map((pillar, i) =>
        progress ? <Pillar key={pillar.title} progress={progress} index={i} pillar={pillar} /> : (
          <li key={pillar.title} className="border-t border-paper/30 pt-4">
            <p className="font-serif text-4xl md:text-5xl">{pillar.title}</p>
            <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-paper/80">{pillar.text}</p>
          </li>
        ),
      )}
    </ul>
  );
}

/**
 * Pinned scene adapted from the reference's "small frame grows to fill the
 * screen" transition: a portrait inset expands to full-bleed while the
 * headline parts around it, then four pillars resolve over the image.
 */
export default function StoryExpand() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Start large enough to read as a photograph, not a thumbnail in an empty page.
  const startInset = wide ? 'inset(19% 29% 19% 29%)' : 'inset(22% 12% 22% 12%)';
  const clipPath = useTransform(scrollYProgress, [0.04, 0.46], [startInset, 'inset(0% 0% 0% 0%)']);
  const imageScale = useTransform(scrollYProgress, [0.04, 0.46], [1.35, 1]);
  const leftX = useTransform(scrollYProgress, [0.04, 0.4], ['0%', '-55%']);
  const rightX = useTransform(scrollYProgress, [0.04, 0.4], ['0%', '55%']);
  const headingOpacity = useTransform(scrollYProgress, [0.12, 0.36], [1, 0]);
  const shade = useTransform(scrollYProgress, [0.44, 0.56], [0, 0.55]);
  const eyebrowOpacity = useTransform(scrollYProgress, [0.5, 0.58], [0, 1]);

  if (reduce) {
    return (
      <section aria-labelledby="pillars-title" className="relative isolate overflow-hidden bg-ink py-section text-paper">
        <Photo slug="story-kitchen" className="absolute inset-0 -z-10 opacity-45" />
        <div className="container-site">
          <h2 id="pillars-title" className="mb-16 max-w-[16ch] font-serif text-display">It was never just the house.</h2>
          <PillarList />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="pillars-title" className="relative h-[280vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 overflow-hidden bg-ink" style={{ clipPath }}>
          <motion.div className="size-full" style={{ scale: imageScale }}>
            <Photo slug="story-kitchen" />
          </motion.div>
          <motion.div aria-hidden="true" className="absolute inset-0 bg-ink" style={{ opacity: shade }} />
        </motion.div>

        <h2 id="pillars-title" className="pointer-events-none absolute inset-0 flex flex-col justify-between py-[8svh] font-serif text-[clamp(2.75rem,6.2vw,6.5rem)] leading-[0.92] tracking-[-0.02em] md:py-[4svh]">
          <motion.span className="block px-gutter" style={{ x: leftX, opacity: headingOpacity }}>
            It was never
          </motion.span>
          <motion.span className="block px-gutter text-right" style={{ x: rightX, opacity: headingOpacity }}>
            just the house.
          </motion.span>
        </h2>

        <div className="absolute inset-0 flex items-end text-paper md:items-center">
          <div className="container-site pb-12 md:pb-0">
            <motion.p className="eyebrow mb-10 text-paper/80" style={{ opacity: eyebrowOpacity }}>
              What a move is really about
            </motion.p>
            <PillarList progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
