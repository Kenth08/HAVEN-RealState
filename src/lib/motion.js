// Shared motion tokens — mirror --ease-* in styles/index.css.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  shown: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT_EXPO } },
};
