import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice, formatSpecs } from '../../lib/format';
import Photo from '../ui/Photo';
import StatusBadge from './StatusBadge';

export default function PropertyCard({ property }) {
  const href = `/properties/${property.id}`;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <Photo
          slug={property.images[0]}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="transition-transform duration-[1.4s] ease-out-expo group-focus-within:scale-[1.06] group-hover:scale-[1.06]"
        />
        {property.status !== 'Available' && <StatusBadge status={property.status} className="absolute top-4 left-4" />}
        <span
          aria-hidden="true"
          className="absolute right-4 bottom-4 grid size-12 scale-50 place-items-center rounded-full bg-paper text-ink opacity-0 transition duration-500 ease-out-expo group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" strokeWidth={1.5} />
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-[1.85rem] leading-none">
            {/* Stretched link: the whole card is clickable, one tab stop. */}
            <Link to={href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ink">
              {property.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-mute">
            {property.location} · {property.type}
          </p>
        </div>
        <p className="shrink-0 pt-1 font-medium">{formatPrice(property.price)}</p>
      </div>
      <p className="mt-4 border-t border-line pt-3 text-sm text-mute">{formatSpecs(property)}</p>
    </article>
  );
}
