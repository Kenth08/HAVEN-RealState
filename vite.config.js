import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { DEFAULT_SITE_URL } from './src/config/seo.js';
import { properties } from './src/data/properties.js';

const STATIC_ROUTES = ['/', '/privacy', '/terms'];

/**
 * Fills the site URL into index.html (canonical + social tags) and emits
 * robots.txt and sitemap.xml at build time, so they always list every
 * property page with the right domain.
 */
function seoFiles(siteUrl) {
  return {
    name: 'haven-seo-files',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const paths = [...STATIC_ROUTES, ...properties.map((p) => `/properties/${p.id}`)];
      const urls = paths.map((path) => `  <url><loc>${siteUrl}${path}</loc><lastmod>${today}</lastmod></url>`).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl)],
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
    // React DOM + Motion + React Router account for ~170 kB gzipped; that is
    // expected for this stack, so only warn if the bundle grows well past it.
    build: { chunkSizeWarningLimit: 650 },
  };
});
