import { Link } from 'react-router';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta({ title: 'Page not found', noindex: true });
  return (
    <section className="container-site flex min-h-[80svh] flex-col justify-end pt-32 pb-section">
      <p className="eyebrow mb-6 text-mute">404</p>
      <h1 className="max-w-[14ch] font-serif text-display">This address doesn't exist.</h1>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="btn-dark">Back to home</Link>
        <Link to="/#discover" className="btn-outline">Browse homes</Link>
      </div>
    </section>
  );
}
