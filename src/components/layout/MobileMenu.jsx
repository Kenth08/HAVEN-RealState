import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { navigation, site } from '../../config/site';
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from '../../lib/motion';
import HashLink from '../ui/HashLink';
import { lockScroll } from '../../lib/smoothScroll';

export default function MobileMenu({ open, onClose }) {
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    firstLinkRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 text-paper lg:hidden"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.8, ease: EASE_IN_OUT_QUART }}
        >
          <nav aria-label="Mobile" className="container-site flex-1">
            <ul className="space-y-2">
              {[{ label: 'Home', href: '/#top' }, ...navigation].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.25 + i * 0.06 }}
                  >
                    <HashLink
                      ref={i === 0 ? firstLinkRef : undefined}
                      to={item.href}
                      onClick={() => onClose({ restoreFocus: false })}
                      className="block py-1 font-serif text-[clamp(2.75rem,12vw,4.5rem)] leading-none"
                    >
                      {item.label}
                    </HashLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="container-site flex flex-wrap justify-between gap-4 border-t border-line-inverse py-6 text-sm text-stone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <a href={`mailto:${site.contact.email}`} className="link-line">{site.contact.email}</a>
            <span>{site.contact.offices.join(' · ')}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
