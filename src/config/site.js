// Brand, navigation and contact content in one place so the site can be
// re-skinned without touching components.

export const site = {
  name: 'HAVEN',
  // Resolved at build time from VITE_SITE_URL (see vite.config.js / config/seo.js).
  url: import.meta.env.VITE_SITE_URL,
  tagline: 'Where Life Moves Next',
  heroLead: 'Agents who listen first, homes chosen with care, and a clear path from first viewing to the keys in your hand.',
  heroCta: { label: 'Find properties', href: '/#discover' },
  contact: {
    email: 'kenthrepollo@gmail.com',
    phone: '+63 997 728 7201',
    offices: ['Philippines'],
  },
  // Credit line in the footer (this is a portfolio piece).
  author: { name: 'Kenth08', url: 'https://github.com/Kenth08' },
};

export const navigation = [
  { label: 'Properties', href: '/#discover' },
  { label: 'Neighborhoods', href: '/#neighborhoods' },
  { label: 'Our story', href: '/#story' },
  { label: 'Contact', href: '/#contact' },
];
