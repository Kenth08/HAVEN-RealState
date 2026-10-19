import { useEffect } from 'react';
import { useRouteError } from 'react-router';
import { site } from '../config/site';

/**
 * Last-resort screen if something crashes while rendering. Deliberately
 * self-contained (no layout, no animation) so it can always render.
 */
export default function ErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
    document.title = `Something went wrong — ${site.name}`;
    document.documentElement.style.overflow = '';
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col justify-between bg-ink p-gutter text-paper">
      <a href="/" className="font-serif text-2xl tracking-[0.18em]">
        {site.name}
      </a>
      <div className="max-w-2xl py-16">
        <p className="eyebrow mb-6 text-stone">Something went wrong</p>
        <h1 className="font-serif text-display">This page didn&apos;t load properly.</h1>
        <p className="mt-6 max-w-md leading-relaxed text-stone">
          Please try again. If it keeps happening, email us at{' '}
          <a href={`mailto:${site.contact.email}`} className="text-paper underline underline-offset-2">
            {site.contact.email}
          </a>
          .
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={() => window.location.reload()} className="btn-light">
            Try again
          </button>
          <a href="/" className="btn border border-paper/40 hover:bg-paper hover:text-ink">
            Back to home
          </a>
        </div>
      </div>
      <p className="text-xs text-stone">{site.contact.phone}</p>
    </main>
  );
}
