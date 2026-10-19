// Pure search logic. Filters live in the URL query string so results are
// shareable and survive reloads; this module converts between the two.

export const EMPTY_FILTERS = { location: '', type: '', beds: '', min: '', max: '', sort: 'featured' };

export const PRICE_STEPS = [500000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000];
export const BED_OPTIONS = [1, 2, 3, 4, 5];
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'newest', label: 'Newest build' },
];

export function filtersFromParams(params) {
  const filters = { ...EMPTY_FILTERS };
  for (const key of Object.keys(EMPTY_FILTERS)) {
    const value = params.get(key);
    if (value) filters[key] = value;
  }
  return filters;
}

export function filtersToParams(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== EMPTY_FILTERS[key]) params.set(key, value);
  }
  return params;
}

export function hasActiveFilters(filters) {
  return ['location', 'type', 'beds', 'min', 'max'].some((key) => filters[key]);
}

const statusRank = { Available: 0, 'Under offer': 1, Sold: 2 };

export function filterProperties(list, filters) {
  const min = Number(filters.min) || 0;
  const max = Number(filters.max) || Infinity;
  const beds = Number(filters.beds) || 0;

  const results = list.filter(
    (p) =>
      (!filters.location || p.location === filters.location) &&
      (!filters.type || p.type === filters.type) &&
      p.bedrooms >= beds &&
      p.price >= min &&
      p.price <= max,
  );

  const sorters = {
    featured: (a, b) => Number(b.featured) - Number(a.featured) || statusRank[a.status] - statusRank[b.status],
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    newest: (a, b) => b.yearBuilt - a.yearBuilt,
  };
  return results.sort(sorters[filters.sort] ?? sorters.featured);
}
