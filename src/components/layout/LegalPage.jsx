import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

/** Shared editorial layout for policy pages. Sections: [{ heading, body: ReactNode }]. */
export default function LegalPage({ eyebrow, title, updated, intro, sections }) {
  return (
    <article className="container-site grid gap-12 pt-32 pb-section md:pt-40 lg:grid-cols-12">
      <header className="lg:col-span-4">
        <div className="lg:sticky lg:top-32">
          <Link to="/" className="group eyebrow inline-flex items-center gap-2 text-mute hover:text-ink">
            <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.5} />
            Home
          </Link>
          <p className="eyebrow mt-10 mb-4 text-mute">{eyebrow}</p>
          <h1 className="font-serif text-title">{title}</h1>
          <p className="mt-6 text-sm text-mute">Last updated {updated}</p>
        </div>
      </header>
      <div className="max-w-2xl lg:col-span-7 lg:col-start-6">
        <p className="font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] leading-snug">{intro}</p>
        {sections.map(({ heading, body }) => (
          <section key={heading} className="mt-12 border-t border-line pt-8">
            <h2 className="eyebrow mb-4">{heading}</h2>
            <div className="space-y-4 leading-relaxed text-mute [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">{body}</div>
          </section>
        ))}
      </div>
    </article>
  );
}
