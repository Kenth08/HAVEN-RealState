import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import useParallax from '../../hooks/useParallax';
import Photo from '../ui/Photo';

/** Two offset frames that drift at different speeds for a layered feel. */
export default function PropertyGallery({ images }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const slow = useParallax(scrollYProgress, [0, 1], ['6%', '-6%'], '0%');
  const fast = useParallax(scrollYProgress, [0, 1], ['18%', '-18%'], '0%');
  const [first, second] = images;

  return (
    <section ref={ref} aria-label="Gallery" className="container-site grid gap-6 py-section md:grid-cols-12 md:gap-8">
      <motion.figure className="md:col-span-7" style={{ y: slow }}>
        <div className="aspect-[4/5] overflow-hidden md:aspect-[5/6]">
          <Photo slug={first} sizes="(min-width: 768px) 56vw, 92vw" />
        </div>
      </motion.figure>
      {second && (
        <motion.figure className="md:col-span-4 md:col-start-9 md:mt-[30%]" style={{ y: fast }}>
          <div className="aspect-[4/5] overflow-hidden">
            <Photo slug={second} sizes="(min-width: 768px) 32vw, 92vw" />
          </div>
        </motion.figure>
      )}
    </section>
  );
}
