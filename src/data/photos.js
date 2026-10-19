// Every photograph used on the site, keyed by a local slug.
// `id` is the Unsplash photo id (images.unsplash.com/photo-<id>); files are
// downloaded into /public/images by `npm run images` under the Unsplash License.

export const PHOTO_WIDTHS = [800, 1600];

export const photos = {
  // Glass Pavilion
  'pavilion-pool': { id: '1582268611958-ebfd161ef9cf', alt: 'Single-storey glass house opening onto a long swimming pool' },
  'pavilion-stair': { id: '1600573472550-8090b5e0745e', alt: 'Floating timber stair beside floor-to-ceiling glass and a pool terrace' },
  'pavilion-living': { id: '1600585154084-4e5fe7c39198', alt: 'Open-plan living room with stone fireplace and sliding glass walls' },
  // Arden House
  'arden-dusk': { id: '1600585154340-be6161a56a0c', alt: 'Timber and black-clad house glowing at dusk beneath a large gum tree' },
  'arden-garden': { id: '1600607688969-a5bfcd646154', alt: 'Two-storey timber house seen across a green lawn' },
  'arden-lounge': { id: '1600607687939-ce8a6c25118c', alt: 'Lounge with grey sofa, timber feature wall and kitchen beyond' },
  // Saltwater Villa
  'saltwater-front': { id: '1613490493576-7fde63acd811', alt: 'White modern villa with cedar soffits above a striped infinity pool' },
  'saltwater-dining': { id: '1537726235470-8504e3beef77', alt: 'Dining room with a glass wall looking straight out to the ocean' },
  'saltwater-terrace': { id: '1580587771525-78b9dba3b914', alt: 'Cantilevered modern home above a pool and lawn' },
  // Cedar Line
  'cedar-day': { id: '1600566753190-17f0baa2a6c3', alt: 'Timber-screened modern house with a raked roof on a quiet street' },
  'cedar-night': { id: '1600566753376-12c8ab7fb75b', alt: 'The same timber house lit from within at night' },
  'cedar-living': { id: '1600566753086-00f18fb6b3ea', alt: 'Long living room with an open timber stair and tall windows' },
  // White Court
  'court-pool': { id: '1600596542815-ffad4c1539a9', alt: 'Three-storey white villa beside a turquoise pool' },
  'court-living': { id: '1613545325278-f24b0cae1224', alt: 'Bright double-height living room with a linear fireplace' },
  'court-kitchen': { id: '1600585152220-90363fe7e115', alt: 'White kitchen island with four timber stools and pendant lights' },
  // Ridge Cabin
  'ridge-exterior': { id: '1568605114967-8130f3a36994', alt: 'Gabled timber cabin with warm lit windows at twilight' },
  'ridge-bedroom': { id: '1616594039964-ae9021a400a0', alt: 'Dark-walled bedroom with a sculptural brass chandelier' },
  'ridge-lounge': { id: '1618221195710-dd6b41faaea6', alt: 'Low-slung lounge with clerestory windows and timber ceiling' },
  // Meadow Farmhouse
  'meadow-porch': { id: '1570129477492-45c003edd2be', alt: 'White farmhouse with a deep wraparound porch and autumn trees' },
  'meadow-dining': { id: '1617806118233-18e1de247200', alt: 'Dining room with green velvet chairs and a round mirror' },
  'meadow-bedroom': { id: '1595526114035-0d45ed16cfbf', alt: 'Calm white bedroom with a reading chair by the window' },
  // Harbor Lofts
  'harbor-facade': { id: '1515263487990-61b07816b324', alt: 'Black-framed apartment building against a clear blue sky' },
  'harbor-living': { id: '1600121848594-d8644e57abab', alt: 'Apartment living room with grey sofas and built-in shelving' },
  'harbor-kitchen': { id: '1484154218962-a197022b5858', alt: 'White kitchen with black pendant lights and breakfast bar' },
  // Casa Blanca
  'blanca-garden': { id: '1512917774080-9991f1c4c750', alt: 'White single-level home with full-height glazing and a pool' },
  'blanca-living': { id: '1631679706909-1844bbd07221', alt: 'Neutral living room with rattan mirrors and a white sofa' },
  'blanca-bedroom': { id: '1600607687644-c7171b42498f', alt: 'Minimal bedroom opening onto a garden through black-framed doors' },
  // Linden Row
  'linden-street': { id: '1494526585095-c41746248156', alt: 'Townhouse entrance with a lit porch at sunset' },
  'linden-living': { id: '1600210492486-724fe5c67fb0', alt: 'Sunny living room with leather sofa and a gallery wall' },
  'linden-bedroom': { id: '1505693416388-ac5ce068fe85', alt: 'Bedroom with a tufted headboard and bedside lamps' },
  // Corten House
  'corten-facade': { id: '1600047509807-ba8f99d2cdde', alt: 'Modern house with a weathered steel volume over white render' },
  'corten-stair': { id: '1600047508788-786f3865b4b9', alt: 'Open timber staircase and living area with brass pendants' },
  'corten-bath': { id: '1552321554-5fefe8c9ef14', alt: 'Bright bathroom with a checkerboard floor and plants' },
  // Orchard Estate
  'orchard-pool': { id: '1564013799919-ab600027ffc6', alt: 'Colonial-style white estate with balconies above a pool and palms' },
  'orchard-living': { id: '1560448204-e02f11c3d0e2', alt: 'Light-filled living and dining room with tall windows' },
  'orchard-stair': { id: '1502005229762-cf1b2da7c5d6', alt: 'Suspended staircase in a white double-height hallway' },
  // Story + neighbourhoods
  'story-kitchen': { id: '1556909114-f6e7ad7d3136', alt: 'Two people cooking together in a bright kitchen' },
  'place-coast': { id: '1507525428034-b723cf961d3e', alt: 'Turquoise surf rolling onto a sandy beach at sunrise' },
  'place-mountains': { id: '1506905925346-21bda4d32df4', alt: 'Snow-capped mountain peaks above a sea of clouds' },
  'place-city': { id: '1449824913935-59a10b8d2000', alt: 'City street lined with tall buildings and yellow taxis' },
  'place-valley': { id: '1449844908441-8829872d2607', alt: 'Brick house among tall trees in low morning sun' },
  'place-stucco': { id: '1599809275671-b5942cabc7a2', alt: 'Warm stucco villa with a spa and pool at golden hour' },
  'place-hacienda': { id: '1416331108676-a22ccb276e35', alt: 'Spanish-style courtyard house around a pool at dusk' },
};

export function photoSrc(slug, width = 1600) {
  return `/images/${slug}-${width}.webp`;
}

export function photoSrcSet(slug) {
  return PHOTO_WIDTHS.map((w) => `${photoSrc(slug, w)} ${w}w`).join(', ');
}
