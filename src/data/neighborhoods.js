import { properties } from './properties';

const notes = {
  'Malibu, CA': { photo: 'place-coast', note: 'Bluff-top houses and a long, quiet coastline.' },
  'Aspen, CO': { photo: 'place-mountains', note: 'Mountain cabins with four real seasons.' },
  'Brooklyn, NY': { photo: 'place-city', note: 'Converted lofts and tree-lined brownstone blocks.' },
  'Hudson Valley, NY': { photo: 'place-valley', note: 'Farmhouses and new builds two hours from the city.' },
  'Palm Springs, CA': { photo: 'pavilion-pool', note: 'Desert modernism, pools and long evenings.' },
  'Miami, FL': { photo: 'place-hacienda', note: 'Courtyard villas built for life outdoors.' },
  'Austin, TX': { photo: 'cedar-day', note: 'Live music, green belts and new architecture.' },
  'Santa Barbara, CA': { photo: 'place-stucco', note: 'Mission-style calm between the mountains and the sea.' },
};

export const neighborhoods = Object.entries(notes).map(([location, info]) => ({
  location,
  name: location.split(',')[0],
  region: location.split(',')[1].trim(),
  count: properties.filter((p) => p.location === location).length,
  ...info,
}));
