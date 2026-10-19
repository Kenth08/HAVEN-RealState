import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, Search, X } from 'lucide-react';
import { navigation, site } from '../../config/site';
import { EASE_OUT_EXPO } from '../../lib/motion';
import useActiveSection from '../../hooks/useActiveSection';
import { onNavigationScroll } from '../../lib/smoothScroll';
import HashLink from '../ui/HashLink';
import MobileMenu from './MobileMenu';

const sectionIds = navigation.map((item) => item.href.split('#')[1]);

/**
 * Transparent over the home hero, solid paper once scrolled. Slides away while
 * the user scrolls down and returns on any upward scroll or keyboard focus.
 * It never hides because of a navigation glide: it stays put while a link
 * scrolls the page and afterwards, so the next destination is one click away.
 */
export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const observedActive = useActiveSection(sectionIds, isHome);
  // While a link is gliding the page, hold the header in place and show the
  // destination as active instead of flickering through sections in between.
  const [navigatingTo, setNavigatingTo] = useState(null);
  const active = navigatingTo ?? observedActive;
  // Instant jumps (reduced motion) start and end before React re-renders, and
  // their scroll event arrives a frame later — ignore direction briefly.
  const holdUntil = useRef(0);

  useEffect(
    () =>
      onNavigationScroll(({ type, id }) => {
        holdUntil.current = performance.now() + 400;
        setHidden(false);
        setNavigatingTo(type === 'start' ? id : null);
      }),
    [],
  );

  useMotionValueEvent(scrollY, 'change', (y) => {
    setAtTop(y < 40);
    if (navigatingTo || performance.now() < holdUntil.current) return;
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 420);
  });

  const overlay = isHome && atTop && !menuOpen;
  const tone = menuOpen || overlay ? 'text-paper' : 'text-ink';
  const surface = menuOpen || overlay ? 'bg-transparent border-transparent' : 'bg-paper border-line';

  const closeMenu = useCallback(({ restoreFocus = true } = {}) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed top-3 left-3 z-[80] rounded-full bg-ink px-4 py-2 text-sm text-paper">
        Skip to content
      </a>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${tone} ${surface}`}
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="container-site flex h-16 items-center justify-between gap-6 md:h-20">
          <Link to="/" className="font-serif text-2xl tracking-[0.18em] md:text-[1.75rem]" aria-label={`${site.name} — home`} onClick={() => closeMenu({ restoreFocus: false })}>
            {site.name}
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-10 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <HashLink to={item.href} className="link-line pb-1" aria-current={active === item.href.split('#')[1] ? 'true' : undefined}>
                    {item.label}
                  </HashLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <HashLink
              to="/#discover"
              className={`btn hidden py-2.5 sm:inline-flex ${overlay || menuOpen ? 'bg-paper text-ink hover:bg-white' : 'bg-ink text-paper hover:bg-ink-soft'}`}
              onClick={() => closeMenu({ restoreFocus: false })}
            >
              <Search aria-hidden="true" className="size-4" strokeWidth={1.75} />
              Search homes
            </HashLink>
            <button
              ref={toggleRef}
              type="button"
              className="grid size-11 place-items-center rounded-full lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            >
              {menuOpen ? <X aria-hidden="true" strokeWidth={1.5} /> : <Menu aria-hidden="true" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
