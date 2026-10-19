import { motion } from 'motion/react';
import { EASE_OUT_EXPO } from '../../lib/motion';

/** Fades and lifts its children the first time they scroll into view. */
export default function Reveal({ as = 'div', delay = 0, y = 32, className = '', children, ...rest }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}
