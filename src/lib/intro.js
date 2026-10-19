import { createContext, useContext } from 'react';

// 'loading' → loader covers the page; 'revealing' → loader is lifting and the
// hero entrance plays underneath; 'done' → no intro (or it has finished).
export const IntroContext = createContext('done');
export const useIntro = () => useContext(IntroContext);

const KEY = 'haven:intro-seen';

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== '1';
  } catch {
    return true;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable — the intro will simply play again */
  }
}
