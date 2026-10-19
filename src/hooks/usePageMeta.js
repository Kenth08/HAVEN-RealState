import { useEffect } from 'react';
import { site } from '../config/site';
import { SITE_DESCRIPTION } from '../config/seo';

function setTag(selector, attribute, value) {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

/**
 * Per-page <title>, description, canonical URL and social tags. Search
 * engines that render JavaScript (Google) see these; link previews on
 * Facebook/Messenger read the static defaults in index.html.
 */
export default function usePageMeta({ title, description = SITE_DESCRIPTION, path = '/', image, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
    const url = `${site.url}${path}`;
    const imageUrl = `${site.url}${image ?? '/og-image.jpg'}`;

    document.title = fullTitle;
    setTag('meta[name="description"]', 'content', description);
    setTag('link[rel="canonical"]', 'href', url);
    setTag('meta[property="og:title"]', 'content', fullTitle);
    setTag('meta[property="og:description"]', 'content', description);
    setTag('meta[property="og:url"]', 'content', url);
    setTag('meta[property="og:image"]', 'content', imageUrl);
    setTag('meta[name="twitter:title"]', 'content', fullTitle);
    setTag('meta[name="twitter:description"]', 'content', description);
    setTag('meta[name="twitter:image"]', 'content', imageUrl);

    let robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.append(robots);
      }
      robots.content = 'noindex';
    } else {
      robots?.remove();
    }
  }, [title, description, path, image, noindex]);
}
