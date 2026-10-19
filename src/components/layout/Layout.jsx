import { useCallback, useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { IntroContext, markIntroSeen, shouldPlayIntro } from '../../lib/intro';
import { flushScrollAfterRender, startSmoothScroll } from '../../lib/smoothScroll';
import Header from './Header';
import Footer from './Footer';
import Loader from './Loader';

// Every fresh page load gets the location key "default", so by default a new
// load would inherit the scroll position saved by a different page. Key
// initial entries by their full URL instead (a direct "/#contact" link then
// lands on its section); in-app navigations keep their unique keys.
const scrollKey = (location) => (location.key === 'default' ? location.pathname + location.search + location.hash : location.key);

// Vercel Web Analytics (cookieless). Only on a deployed site: the tracking
// script is served by Vercel and does not exist on localhost.
const analyticsEnabled = import.meta.env.PROD && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

export default function Layout() {
  const { pathname, key } = useLocation();
  const [intro, setIntro] = useState(() => (pathname === '/' && shouldPlayIntro() ? 'loading' : 'done'));

  // Fade between routes, but not on the very first paint (it would delay the hero/LCP).
  const [firstPath] = useState(pathname);

  useEffect(() => startSmoothScroll(), []);
  // Links that change the URL (e.g. a neighbourhood filter) scroll only after
  // the new content has rendered, so the target is measured correctly.
  useEffect(() => flushScrollAfterRender(), [key]);

  const handleReveal = useCallback(() => setIntro('revealing'), []);
  const handleDone = useCallback(() => {
    markIntroSeen();
    setIntro('done');
  }, []);

  return (
    // reducedMotion="user": transform animations are skipped when the OS asks
    // for reduced motion; scroll-linked effects check the preference themselves.
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={intro}>
        <AnimatePresence>{intro !== 'done' && <Loader key="loader" onReveal={handleReveal} onDone={handleDone} />}</AnimatePresence>
        <Header />
        <motion.main
          id="main"
          tabIndex={-1}
          className="outline-none"
          key={pathname}
          initial={pathname === firstPath ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.main>
        <Footer />
        <ScrollRestoration getKey={scrollKey} />
        {analyticsEnabled && <Analytics />}
      </IntroContext.Provider>
    </MotionConfig>
  );
}
