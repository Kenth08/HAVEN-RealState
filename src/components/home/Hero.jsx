import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { site } from '../../config/site';
import { useIntro } from '../../lib/intro';
import { EASE_OUT_EXPO } from '../../lib/motion';
import useParallax from '../../hooks/useParallax';
import SplitText from '../ui/SplitText';
import HashLink from '../ui/HashLink';

const SCENE_SIZE = 'max(100vw, 100svh)';
const heroSet = (layer) => `/images/hero-${layer}-1000.webp 1000w, /images/hero-${layer}-2000.webp 2000w`;

/**
 * Layered hero: photo → giant wordmark → the same photo with its sky cut out.
 * The house therefore sits in front of the type (the "subject over display
 * type" treatment from the reference). The three layers live in one square
 * scene, top-anchored like object-fit: cover, so the wordmark stays locked to
 * the roofline at any aspect ratio.
 *
 * The section is pinned: the next section slides up over it like a curtain
 * while the scene pushes in, darkens and the wordmark sinks behind the roof.
 * Must be rendered inside a `relative` wrapper together with that section.
 */
export default function Hero() {
  const play = useIntro() !== 'loading';
  // Measured on a static marker: the section itself is sticky, and a sticky
  // element's measured position drifts once it pins.
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const sceneScale = useParallax(scrollYProgress, [0, 1], [1, 1.08]);
  const wordmarkY = useParallax(scrollYProgress, [0, 1], ['0%', '60%']); // sinks behind the roof
  const contentY = useParallax(scrollYProgress, [0, 1], ['0%', '-14%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  return (
    <>
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[100svh]" />
    <section id="top" aria-label="Introduction" className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-ink text-paper">
      <motion.div className="absolute inset-0" style={{ scale: sceneScale, transformOrigin: '50% 35%' }}>
        <motion.div
          className="absolute top-0 left-1/2 aspect-square [container-type:inline-size]"
          style={{ width: SCENE_SIZE, marginLeft: `calc(${SCENE_SIZE} / -2)`, transformOrigin: '50% 25%' }}
          initial={{ scale: 1.14 }}
          animate={{ scale: play ? 1 : 1.14 }}
          transition={{ duration: 2.4, ease: EASE_OUT_EXPO }}
        >
          <img
            src="/images/hero-bg-2000.webp"
            srcSet={heroSet('bg')}
            sizes={SCENE_SIZE}
            alt="A white modernist house with stacked cubic volumes, a pine tree and a clear blue sky"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full"
          />

          <motion.p aria-hidden="true" className="absolute inset-x-0 bottom-[69.5%] flex justify-center" style={{ y: wordmarkY }}>
            {site.name.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block font-serif text-[min(23cqw,31vw)] leading-[0.72] tracking-[-0.01em] text-paper"
                // Starts fully below the roofline, hidden by the cut-out
                // house layer, then rises out from behind it.
                initial={{ y: '105%' }}
                animate={{ y: play ? '0%' : '105%' }}
                transition={{ duration: 1.8, ease: EASE_OUT_EXPO, delay: 0.2 + i * 0.08 }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.p>

          <img src="/images/hero-cut-2000.webp" srcSet={heroSet('cut')} sizes={SCENE_SIZE} alt="" decoding="async" className="pointer-events-none absolute inset-0 size-full" />
        </motion.div>
      </motion.div>

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-ink" style={{ opacity: shade }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-ink/85 via-ink/40 to-transparent" />

      <motion.div className="relative z-10 flex h-full flex-col justify-end" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="container-site grid gap-6 pb-10 md:pb-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="font-serif text-display text-balance lg:col-span-7">
            <SplitText text={site.tagline} play={play} delay={0.55} stagger={0.08} />
          </h1>
          <motion.div
            className="lg:col-span-4 lg:col-start-9 lg:pb-2"
            initial={{ opacity: 0, y: 24 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 1 }}
          >
            <p className="max-w-sm text-base leading-relaxed text-paper/85">{site.heroLead}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <HashLink to={site.heroCta.href} className="btn-light group">
                {site.heroCta.label}
                <ArrowRight aria-hidden="true" className="arrow-nudge size-4" strokeWidth={1.75} />
              </HashLink>
              <HashLink to="/#contact" className="link-line pb-0.5 text-sm">
                Talk to an agent
              </HashLink>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
    </>
  );
}
