import { motion } from 'motion/react';
import { EASE_OUT_EXPO } from '../../lib/motion';

/**
 * Word-by-word mask reveal: each word slides up out of its own clipped line.
 * Screen readers get the plain sentence; the animated copy is aria-hidden.
 *
 * `play` lets a parent hold the reveal (e.g. until the intro loader is done);
 * leave it undefined to reveal on first scroll into view.
 */
export default function SplitText({ text, as: Tag = 'span', className = '', delay = 0, stagger = 0.06, duration = 1.1, play }) {
  const words = text.split(' ');
  const controlled = play !== undefined;
  const variants = {
    hidden: { y: '110%' },
    shown: (i) => ({ y: '0%', transition: { duration, ease: EASE_OUT_EXPO, delay: delay + i * stagger } }),
  };

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        {...(controlled ? { animate: play ? 'shown' : 'hidden' } : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]">
            <motion.span className="inline-block will-change-transform" custom={i} variants={variants}>
              {word}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
