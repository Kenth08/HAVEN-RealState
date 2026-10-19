import { describe, expect, it } from 'vitest';
import { properties } from '../data/properties';
import { EMPTY_FILTERS, filterProperties, filtersFromParams, filtersToParams, hasActiveFilters } from './filterProperties';

const search = (overrides) => filterProperties([...properties], { ...EMPTY_FILTERS, ...overrides });

describe('filterProperties', () => {
  it('returns every listing with no filters', () => {
    expect(search({})).toHaveLength(properties.length);
  });

  it('filters by location, type and minimum bedrooms', () => {
    expect(search({ location: 'Austin, TX' }).every((p) => p.location === 'Austin, TX')).toBe(true);
    expect(search({ type: 'Villa' }).every((p) => p.type === 'Villa')).toBe(true);
    expect(search({ beds: '5' }).every((p) => p.bedrooms >= 5)).toBe(true);
  });

  it('keeps prices inside an inclusive range', () => {
    const results = search({ min: '1000000', max: '2000000' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.price >= 1000000 && p.price <= 2000000)).toBe(true);
  });

  it('sorts by price and by build year', () => {
    const prices = search({ sort: 'price-asc' }).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    const years = search({ sort: 'newest' }).map((p) => p.yearBuilt);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('lists featured homes first by default', () => {
    const results = search({});
    const firstUnfeatured = results.findIndex((p) => !p.featured);
    expect(results.slice(firstUnfeatured).some((p) => p.featured)).toBe(false);
  });

  it('falls back to the featured order for an unknown sort', () => {
    expect(search({ sort: 'nonsense' })).toEqual(search({}));
  });
});

describe('URL round trip', () => {
  it('omits defaults and restores the same filters', () => {
    const filters = { ...EMPTY_FILTERS, location: 'Malibu, CA', beds: '3' };
    const params = filtersToParams(filters);
    expect(params.has('sort')).toBe(false);
    expect(filtersFromParams(params)).toEqual(filters);
  });

  it('ignores unknown query parameters', () => {
    expect(filtersFromParams(new URLSearchParams('utm_source=x'))).toEqual(EMPTY_FILTERS);
  });

  it('treats sort alone as no active filter', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, sort: 'price-asc' })).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, type: 'Cabin' })).toBe(true);
  });
});
