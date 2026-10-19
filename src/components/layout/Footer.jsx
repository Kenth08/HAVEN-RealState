import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { navigation, site } from '../../config/site';
import HashLink from '../ui/HashLink';
import useParallax from '../../hooks/useParallax';

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  // The oversized wordmark rises out of the bottom edge as the footer arrives.
  const wordmarkY = useParallax(scrollYProgress, [0, 1], ['45%', '0%'], '0%');

  return (
    <footer ref={ref} className="overflow-hidden bg-ink text-paper">
      <div className="container-site grid gap-12 pt-section pb-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-title">Ready when you are.</p>
          <a href={`mailto:${site.contact.email}`} className="link-line mt-6 inline-block text-lg text-stone hover:text-paper">
            {site.contact.email}
          </a>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <p className="eyebrow mb-5 text-stone">Explore</p>
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <HashLink to={item.href} className="link-line">{item.label}</HashLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5 text-stone">{site.contact.offices.length > 1 ? 'Offices' : 'Office'}</p>
          <ul className="space-y-3">
            {site.contact.offices.map((office) => (
              <li key={office}>{office}</li>
            ))}
            <li>
              <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`} className="link-line">{site.contact.phone}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-col gap-4 border-t border-line-inverse py-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p>
            © {new Date().getFullYear()} {site.name}. A concept portfolio project: homes, prices and addresses are fictional.
          </p>
          <p>
            Designed and built by{' '}
            <a href={site.author.url} className="link-line text-paper" target="_blank" rel="noreferrer">{site.author.name}</a>
            .
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/privacy" className="link-line text-paper">Privacy</Link>
            <Link to="/terms" className="link-line text-paper">Terms</Link>
            <Link to="/terms#credits" className="link-line text-paper">Photo credits</Link>
          </p>
        </div>
        <HashLink to="/#top" className="group inline-flex items-center gap-2 text-paper">
          Back to top
          <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
        </HashLink>
      </div>

      <motion.p
        aria-hidden="true"
        style={{ y: wordmarkY }}
        className="text-outline -mb-[0.2em] text-center font-serif text-[25vw] leading-[0.85] tracking-[0.04em] select-none [--outline-color:rgb(179_179_179/0.55)]"
      >
        {site.name}
      </motion.p>
    </footer>
  );
}
