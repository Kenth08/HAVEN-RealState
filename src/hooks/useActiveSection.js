import { useEffect, useState } from 'react';

/** Returns the id of whichever section currently crosses the middle of the viewport. */
export default function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled) return undefined;
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(sections.find((s) => visible.has(s.id))?.id ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}
