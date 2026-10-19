# HAVEN — Where Life Moves Next

[![CI](https://github.com/Kenth08/HAVEN-RealState/actions/workflows/ci.yml/badge.svg)](https://github.com/Kenth08/HAVEN-RealState/actions/workflows/ci.yml)

**Live site:** https://haven-real-state-taupe.vercel.app

A cinematic real-estate website built with React, Vite, Tailwind CSS, Motion and Lenis. It is a concept portfolio project: every listing, price and address is fictional. The contact and viewing forms are real and deliver to the author's inbox through Web3Forms.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build on http://localhost:4173
npm run lint
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright) against the production build
```

Before the first end-to-end run, install the browser once with `npx playwright install chromium`.

Requires Node 20.19+ (tested on Node 24).

### Inquiry form (Web3Forms)

Inquiries from the contact form and the "Arrange a viewing" form are emailed to you through [Web3Forms](https://web3forms.com), a free form-to-email service that needs no backend.

1. Go to web3forms.com, enter the email address that should receive inquiries, and copy the access key they email you.
2. Copy `.env.example` to `.env.local` and set `VITE_WEB3FORMS_KEY=your-key`.
3. Restart `npm run dev`. On your host (Netlify, Vercel, …), add the same variable in the dashboard before building.

The key is meant to be public: it can only send to the inbox it was created for. `.env.local` is git-ignored anyway.
- **Without a key**, the forms say inquiries aren't connected yet and offer the email address instead.
- **Each message** includes the visitor's name, email, phone, buy/sell/rent choice and message. A viewing request also includes the property and a link to its page.
- **Spam** is filtered with a hidden honeypot field.
- **If sending fails**, the visitor keeps their text and gets an email link as a fallback.

> **Windows note:** if `npm run build` fails with `Cannot find module '@rolldown/binding-win32-x64-msvc'`, npm skipped Rolldown's native binary. This is a known npm optional-dependency bug. It is listed in `optionalDependencies` here, so Linux and macOS installs (such as Vercel's) skip it. If it recurs, delete `node_modules` and `package-lock.json` and reinstall.

### Publishing (GitHub → Vercel)

- `vercel.json` handles deep links: refreshing `/properties/...` serves the app instead of a 404. It also sets long caching on built assets and basic security headers.
- `robots.txt` and `sitemap.xml` are generated on every build from the listing data.
- Environment variables on Vercel (Project → Settings → Environment Variables):
  - `VITE_WEB3FORMS_KEY`: optional. The site's public Web3Forms key is built in (`src/lib/inquiry.js`); set this only to use a different key.
  - `VITE_SITE_URL`: optional. The default is the live address `https://haven-real-state-taupe.vercel.app`. Set it if you connect a custom domain. It is used for canonical URLs, social previews and the sitemap.
- Vercel Web Analytics loads only on the deployed site. Enable it in the project's **Analytics** tab.
- Social preview image: `public/og-image.jpg`, 1200×630, a capture of the hero.
- App icons: `public/apple-touch-icon.png`, `icon-192/512.png`, `icon-maskable-512.png` and `site.webmanifest`.
- Legal pages: `/privacy` and `/terms`. Photo credits are at `/terms#credits`. These are general templates, not legal advice. Review them, and if you hold a real-estate license, add your license number and any fair-housing notices your state requires.

### Assets

Photos are already in `public/images`. To re-create them:

```bash
npm run images                                   # downloads every photo in src/data/photos.js (Unsplash, WebP, 800w + 1600w)
python scripts/make-hero-cutout.py <source.jpg>  # rebuilds the layered hero (needs opencv-python + numpy)
```

The hero source is Unsplash photo `1523217582562-09d0def993a6` at `w=2400`.

## Reference and design decisions

**Reference video** (`39bbc545-…mp4`, 17 s TikTok by @marcelodesignx). It shows four AI-concept product sites (ELYSIAN perfume, AquaFuture, NEXT GEN apparel, ETERNA), each for about 2 s as a small screen mockup. It does **not** show a real-estate site or the FIND brand. These motion techniques were observed and adapted:

| Observed in the video | Used here |
|---|---|
| Small inset image grows to fill the frame (ELYSIAN) | Story section inset → full-bleed; featured panels open from an inset; property hero opens from an inset |
| Scene-to-scene zoom transitions (AquaFuture, NEXT GEN) | Featured homes stack: next panel opens over a receding, darkening previous panel |
| Subject in front of oversized display type (ETERNA) | Layered hero: photo → giant wordmark → same photo with the sky cut out |
| Mask wipe reveal (ETERNA) | Neighborhood preview image wipes upward on hover/focus |
| Spinning-mark loader (ETERNA) | Short intro loader, shown once per session, that waits for the hero layers to decode |
| Editorial serif titles (ELYSIAN) | Instrument Serif display type |

**Brand.** The site is published as **HAVEN — Where Life Moves Next**. Early drafts borrowed the FIND name and headline from findrealestate.com, a real brokerage, as a placeholder; those were replaced before publishing. The section themes, Instrument Sans and the `#151717` / `#ededed` palette were inspired by that site, but no logo, photography, testimonials, agent names or contact details were copied. All brand text lives in `src/config/site.js`.

**Not verifiable from the reference:** exact timing and easing, scroll behaviour, hover states and mobile layouts. These are design decisions, not reproductions.

### Design system

| Token | Value |
|---|---|
| Colours | ink `#151717`, paper `#ededed`, bone `#f6f5f3`, mute `#5b5f5f` (5.6:1 on paper), stone `#b3b3b3` (8.9:1 on ink), accent `#d92424` (status only) |
| Type | Instrument Serif for display; Instrument Sans Variable for UI and body. Both are self-hosted via Fontsource with metric-matched fallbacks, so the font swap causes no layout shift |
| Scale | display `clamp(3rem, 7.2vw, 7.5rem)`, title `clamp(2.25rem, 4.6vw, 4.75rem)`, lead `clamp(1.5rem, 2.6vw, 2.5rem)` |
| Spacing | gutter `clamp(1rem, 3.2vw, 2.75rem)`, section `clamp(5rem, 11vw, 10rem)`, max width 90rem, 12-column grid |
| Shape | square-edged images, pill buttons, 1px hairline dividers, no shadows |
| Images | listings 4:5, full-bleed panels 100svh, property hero 88svh |
| Motion | ease-out-expo `cubic-bezier(.16,1,.3,1)` for reveals, ease-in-out-quart `cubic-bezier(.76,0,.24,1)` for masks; 0.5–0.6 s UI, 0.9–1.4 s reveals |
| Breakpoints | Tailwind defaults: 640 / 768 / 1024 / 1280 |

All tokens live in `src/styles/index.css` (`@theme`).

## Features

- **Home:** layered hero, scroll-lit statement, pinned story scene, stacked featured homes, searchable collection, neighborhood index, inquiry form, footer.
- **Search:** filters for location, type, minimum bedrooms and min/max price, with Search and Reset. Sort by featured, price or newest. Filters live in the URL query string, so searches are shareable and survive reloads. Min > max is swapped automatically, and there is an empty state with a "Clear filters" action.
- **Neighborhood links** open the search pre-filtered to that location.
- **Property pages** (`/properties/:id`): facts strip, description, highlights, parallax gallery, a viewing form pre-filled with the property, and a next-home link.
- **404 handling** for unknown routes and unknown property ids.
- **Header:** transparent over the hero and solid once scrolled. It hides while scrolling down and returns on scroll up or keyboard focus. Active-section underline, skip link, and a full-screen mobile menu with focus management, Escape to close and scroll lock.
- **Scroll restoration:** back and forward restore position. In-page anchors scroll smoothly. Fresh loads start at the top.

### Scroll and animation architecture

- **Lenis** (`src/lib/smoothScroll.js`), also used by the reference site, interpolates wheel and trackpad input. Every scroll-linked effect is driven by Motion's `useScroll`, which reads that smoothed position, so effects move continuously rather than in wheel-sized steps. Touch scrolling stays native, and Lenis turns smoothing off under `prefers-reduced-motion`. Scroll locks (loader, mobile menu) and anchor scrolling go through the same module. An anchor clicked from the open mobile menu is queued until the lock lifts.
- **Motion** handles everything else: entrance sequences, in-view reveals, scroll-linked transforms and interaction states. GSAP is not used; no effect needed it, and two animation systems would compete for the same elements.
- **Sticky scenes** (hero curtain, story, featured stack) measure scroll progress from static marker elements. A sticky element's measured position drifts once it pins.
- **In-page navigation** has a single path: `HashLink` → `scrollToSection()` in `src/lib/smoothScroll.js`.
  - **Section links** (`/#discover`, …) only scroll. They keep the current search query, so an active filter is not wiped.
  - **Links that carry a query** (neighborhood links) apply it first and scroll after React has rendered the new results, so the target is measured against the final layout.
  - **When a glide ends**, the section's real position is checked and corrected once if the layout shifted on the way.
  - **`#top`** scrolls to position 0, because the sticky hero's on-screen position is not its document position.
  - **The address bar** shows the section hash via `history.replaceState`. A router hash change would make ScrollRestoration jump.
  - **Direct links** such as `/#contact` land on their section on a fresh load.
- **Header** hides only when the *user* scrolls down, and returns on scroll up or keyboard focus. It stays visible during and after a navigation glide, and the active link holds on the destination instead of flickering through the sections passed on the way. The active section comes from an IntersectionObserver band across the middle of the viewport, so there are no per-frame React updates.

### Animation techniques

Word-by-word masked headline reveals · hero curtain (the statement slides over the pinned hero while it pushes in and darkens) · type that rises from behind a cut-out photo · scroll-linked `clip-path` expansion (inset → full-bleed) · sticky stacked panels with dwell, recede and dim · scroll-linked word opacity · mask-wipe image swap · fade-up on first view · layout-animated filter results (`AnimatePresence` + `layout`) · route fade · hover image zoom, underline draw and arrow nudge · oversized footer wordmark rising on scroll.

Everything uses transforms, opacity or `clip-path`; no layout properties are animated. Under `prefers-reduced-motion`, `MotionConfig reducedMotion="user"` disables transform animations. Scroll-linked effects collapse to their resting state through `useParallax`, the story scene renders as a static section, and the loader is skipped.

## Project structure

```
src/
  config/site.js            brand, navigation, contact (edit to re-skin)
  data/properties.js        listing data model + sample listings
  data/neighborhoods.js     derived location index
  data/photos.js            photo manifest (slug → Unsplash id, alt text)
  lib/filterProperties.js   pure filter/sort logic + URL (de)serialisation
  lib/format.js, motion.js, intro.js
  hooks/                    useParallax, useActiveSection, useMediaQuery, useDocumentTitle
  components/layout/        Layout, Header, MobileMenu, Loader, Footer
  components/home/          Hero, Statement, StoryExpand, FeaturedHomes, Discover, Neighborhoods, Contact
  components/property/      PropertyCard, PropertyGrid, PropertyFilters, PropertyGallery, InquiryForm, StatusBadge
  components/ui/            Photo, SplitText, Reveal, HashLink
  pages/                    Home, PropertyPage, NotFound
scripts/                    fetch-images.mjs, make-hero-cutout.py
```

## Revision 2: audit and fixes

The audit was based on the screen recording of the previous build plus measurements:

| Priority | Finding | Fix |
|---|---|---|
| Critical | Scroll-linked motion followed raw, stepped wheel input: 37% of frames stalled during wheel scrolling, with 79 px single-frame jumps | Lenis smoothing: 4% stalled, 19 px max jump |
| Critical | Neighborhood images swapped when the list scrolled under a still cursor (synthetic hover events); 20% janky frames at 4× CPU | React only to real pointer movement (`movementX/Y`) or focus |
| Important | The dark hero cut abruptly to a near-empty white page | Curtain transition; larger editorial statement type |
| Important | Story section opened as a small thumbnail in a large empty area | Starting frame enlarged (30% → 42% of the width on desktop, 64% → 76% on mobile), headline resized to frame it, section shortened to 280vh |
| Important | White gap between the shaded story photo and the featured homes | Featured section is now dark, continuing the story's final frame |
| Polish | Doubled footer heading seen in the video | Checked in the browser: camera motion blur, not a rendering bug |

Frame timing while wheel-scrolling the whole page at 4× CPU throttling: **8.1% → 0%** frames over 25 ms.

## Revision 3: navbar navigation

Reproduced with Playwright before fixing. Section links landed correctly from a clean state, but:

1. With a search active (`?location=…`, e.g. after clicking a neighborhood), **Neighborhoods** and **Contact** landed about 2,180 px short, inside the property grid. The click also cleared the search. The handler navigated to `/`, which re-rendered the full grid and pushed later sections down, but the scroll target had already been measured against the old layout.
2. The header hid itself during the navigation glide, because it counted as a downward scroll. The navbar disappeared right after every click, and rapid clicks were impossible.
3. "Back to top" targeted the sticky hero, whose on-screen position is not its document position.

All three are fixed (see *Scroll and animation architecture*). The navigation regression check covers 29 cases per run:
- every link from the top, middle and bottom of the page;
- the same link twice;
- links with an active filter;
- rapid clicks;
- neighborhood links;
- back to top;
- a direct `/#contact` load.

It passes 29/29 at 1536×864, 1280×720 and 390×844 (through the mobile menu), and with reduced motion. The active-link checks (during a glide, during manual scrolling both ways, at the footer, and keyboard Enter) also pass.

## Tests and CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, unit tests and end-to-end tests on every push and pull request. A failed run uploads the Playwright report.

- **Unit tests:** `src/lib/filterProperties.test.js` covers filtering, price ranges, sorting and the URL round trip.
- **End-to-end tests:** in `tests/e2e`, run at desktop (1440×900) and mobile (Pixel 7) sizes:
  - the home sections, intro loader, skip link, 404s and legal pages;
  - search: filters, URL sync and reload, the min/max swap, the empty state, sorting, and card → property → back;
  - inquiries: validation and focus, successful send, failed send with the email fallback, and the pre-filled viewing form;
  - header navigation with an active search, direct section links, the mobile menu (focus, Escape, link scroll) and horizontal overflow.

  The Web3Forms endpoint is mocked or blocked in every test, so the suite never sends email. Any console error fails the test.

## Verification (last run)

- `npm run lint` and `npm run build` pass with no errors.
- **Playwright end-to-end (39/39 on the production build, no console errors or warnings):** loader; skip link; header anchors; every filter, the min/max swap, sorting, empty state and reset; URL sync; neighborhood pre-filtering; card → property page; page titles; form validation, focus on the first invalid field and the demo confirmation; next-home link; back navigation; 404s; mobile menu (focus in, Escape, focus return, scroll lock, anchor scroll); reduced-motion behaviour.
- **Visual passes** at 1440×900, 820×1180 and 390×844 using scrolled screenshot sequences. No horizontal overflow at any width.
- **Measured with Chromium performance APIs** on `vite preview`. These are not Lighthouse scores:

  | Page / profile | FCP | LCP | CLS |
  |---|---|---|---|
  | Home, desktop | 0.48 s | 0.48 s | 0.01 |
  | Home, mobile (slow 4G, 4× CPU) | 3.2 s | 3.2 s | 0 |
  | Property, mobile (slow 4G, 4× CPU) | 2.7 s | 4.5 s | 0 |

## Limitations and simulated features

- **No backend.** Listings are static sample data. Inquiries are delivered by Web3Forms using the built-in public key (or `VITE_WEB3FORMS_KEY`).
- **Intro loader.** On a first visit, the hero is covered for at least 1.1 s (at most 3 s) while its layers decode. The LCP element paints underneath the loader, so the measured LCP is earlier than the moment the hero visibly appears.
- **Bundle size.** The JS bundle is about 173 kB gzipped, mostly React DOM, Motion and React Router; Lenis adds about 5 kB. Scrolling the whole home page loads about 4.6 MB of lazy images on desktop.
- **Photos and attribution.** Photographer names could not be retrieved (Unsplash's API sits behind bot protection here). The Unsplash License does not require attribution; photo ids are listed in `src/data/photos.js`.
- **Hero cut-out.** The mask is hand-tuned for one photo, so changing the hero image requires a new cut-out.
- **Testing scope.** Tested in headless Chromium only, without a GPU; Safari and Firefox have not been verified. Lenis smoothing applies to wheel and trackpad, not touch.
