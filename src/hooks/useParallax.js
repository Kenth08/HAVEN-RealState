import { useReducedMotion, useTransform } from 'motion/react';

/**
 * useTransform that collapses to its resting value when the user prefers
 * reduced motion, so scroll-linked movement switches off cleanly.
 * `rest` defaults to the first output value.
 */
export default function useParallax(progress, input, output, rest = output[0]) {
  const reduce = useReducedMotion();
  return useTransform(progress, input, reduce ? output.map(() => rest) : output);
}
