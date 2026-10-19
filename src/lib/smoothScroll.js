import Lenis from 'lenis';

// One Lenis instance for the whole app. It interpolates wheel/trackpad input
// so every scroll-linked effect (parallax, clip reveals, pinned scenes) moves
// continuously instead of in wheel-sized steps — the reference site does the
// same. Touch scrolling stays native, and Lenis drops smoothing on its own
// when the user prefers reduced motion.
//
// All in-page navigation goes through scrollToSection() so there is exactly
// one thing moving the page when a link is clicked.
let lenis = null;
let pendingAfterUnlock = null;
let pendingAfterRender = null;
const listeners = new Set();
const isLocked = () => document.documentElement.style.overflow === 'hidden';

export function startSmoothScroll() {
  if (!lenis) {
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, stopInertiaOnNavigate: true });
    // An overlay may have locked scroll before Lenis existed (child effects run first).
    if (isLocked()) lenis.stop();
  }
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Subscribe to navigation scrolls: ({ type: 'start' | 'end', id }) => void. */
export function onNavigationScroll(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function glideTo(id) {
  // "top" is the hero, which is sticky: its on-screen position is not its
  // document position, so the top of the page is simply scroll position 0.
  const target = id === 'top' ? 0 : document.getElementById(id);
  if (target === null) return;

  // Reflect the section in the address bar without a router navigation
  // (a router hash change would make ScrollRestoration jump).
  const hash = id === 'top' ? '' : `#${id}`;
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
  listeners.forEach((listener) => listener({ type: 'start', id }));

  let finished = false;
  let fallback;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    listeners.forEach((listener) => listener({ type: 'end', id }));
  };
  // If the user takes over mid-glide, Lenis never calls onComplete.
  fallback = setTimeout(finish, 2500);

  if (!lenis) {
    if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  lenis.resize(); // the page may have just changed height
  lenis.scrollTo(target, {
    duration: 1.2,
    force: true,
    onComplete: () => {
      // Layout can still shift while gliding (late images, re-filtered
      // results). Check where the section really is and correct once.
      const offset = target === 0 ? window.scrollY : target.getBoundingClientRect().top;
      if (Math.abs(offset) > 2) lenis.scrollTo(target, { duration: 0.5, force: true, onComplete: finish });
      else finish();
    },
  });
}

/** Smooth-scrolls to a section by id, waiting for any scroll lock to lift. */
export function scrollToSection(id) {
  if (isLocked()) pendingAfterUnlock = () => glideTo(id);
  else glideTo(id);
}

/** Queues a section scroll for after the next route render (for links that also change the URL). */
export function scrollToSectionAfterRender(id) {
  pendingAfterRender = id;
}

/** Called by the layout once a navigation has committed to the DOM. */
export function flushScrollAfterRender() {
  if (pendingAfterRender === null) return;
  const id = pendingAfterRender;
  pendingAfterRender = null;
  requestAnimationFrame(() => scrollToSection(id));
}

/** Locks page scroll for overlays (loader, mobile menu). */
export function lockScroll(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (locked) {
    lenis?.stop();
    return;
  }
  lenis?.start();
  if (pendingAfterUnlock) {
    const run = pendingAfterUnlock;
    pendingAfterUnlock = null;
    requestAnimationFrame(run);
  }
}
