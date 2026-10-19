const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const compactUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 });
const number = new Intl.NumberFormat('en-US');

export const formatPrice = (value) => usd.format(value);
export const formatCompactPrice = (value) => compactUsd.format(value);
export const formatArea = (sqft) => `${number.format(sqft)} sq ft`;

export function formatSpecs({ bedrooms, bathrooms, area }) {
  return `${bedrooms} bd · ${bathrooms} ba · ${formatArea(area)}`;
}
