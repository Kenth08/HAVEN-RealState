import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { properties } from '../../data/properties';
import { EMPTY_FILTERS, SORT_OPTIONS, filterProperties, filtersFromParams, filtersToParams, hasActiveFilters } from '../../lib/filterProperties';
import PropertyFilters from '../property/PropertyFilters';
import PropertyGrid from '../property/PropertyGrid';
import SplitText from '../ui/SplitText';
import Reveal from '../ui/Reveal';

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const results = useMemo(() => filterProperties(properties, filters), [filters]);

  const apply = (next) => setParams(filtersToParams(next), { preventScrollReset: true, replace: true });
  const reset = () => apply(EMPTY_FILTERS);

  return (
    <section id="discover" aria-labelledby="discover-title" className="bg-bone py-section">
      <div className="container-site">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5 text-mute">The collection</p>
            <h2 id="discover-title" className="font-serif text-title">
              <SplitText text="Find your next address" />
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-mute">Filter by place, type, size and budget. Your search is saved in the address bar, so you can share it.</p>
        </div>

        <Reveal className="border-y border-line py-8">
          <PropertyFilters key={params.toString()} initial={filters} onApply={apply} onReset={reset} />
        </Reveal>

        <div className="mt-10 mb-8 flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm text-mute">
            {results.length} {results.length === 1 ? 'home' : 'homes'}
            {hasActiveFilters(filters) ? ' match your search' : ' in the collection'}
          </p>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-mute">Sort</span>
            <select
              value={filters.sort}
              onChange={(e) => apply({ ...filters, sort: e.target.value })}
              className="field select-chevron w-auto cursor-pointer border-b-0 py-1"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <PropertyGrid properties={results} onReset={reset} />
      </div>
    </section>
  );
}
