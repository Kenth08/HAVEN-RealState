import { useRef } from 'react';
import { Link, useParams } from 'react-router';
import { motion, useScroll } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProperty, properties } from '../data/properties';
import { formatArea, formatPrice, formatSpecs } from '../lib/format';
import { EASE_IN_OUT_QUART } from '../lib/motion';
import usePageMeta from '../hooks/usePageMeta';
import { photoSrc } from '../data/photos';
import useParallax from '../hooks/useParallax';
import Photo from '../components/ui/Photo';
import SplitText from '../components/ui/SplitText';
import Reveal from '../components/ui/Reveal';
import StatusBadge from '../components/property/StatusBadge';
import PropertyGallery from '../components/property/PropertyGallery';
import InquiryForm from '../components/property/InquiryForm';
import NotFound from './NotFound';

/** Main photo: opens from an inset frame on arrival, then drifts on scroll. */
function PropertyHeroImage({ slug }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useParallax(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <motion.div
      ref={ref}
      className="relative h-[70svh] overflow-hidden bg-ink md:h-[88svh]"
      initial={{ clipPath: 'inset(8% 10% 8% 10%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 1.4, ease: EASE_IN_OUT_QUART, delay: 0.15 }}
    >
      <motion.div className="size-full" style={{ y }} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE_IN_OUT_QUART, delay: 0.15 }}>
        <Photo slug={slug} priority />
      </motion.div>
    </motion.div>
  );
}

function Facts({ property }) {
  const facts = [
    ['Price', formatPrice(property.price)],
    ['Bedrooms', property.bedrooms],
    ['Bathrooms', property.bathrooms],
    ['Interior', formatArea(property.area)],
    ['Type', property.type],
    ['Built', property.yearBuilt],
  ];
  return (
    <dl className="container-site grid grid-cols-2 border-b border-line sm:grid-cols-3 lg:grid-cols-6">
      {facts.map(([label, value]) => (
        <div key={label} className="border-line py-6 pr-4 lg:border-r lg:pl-5 lg:first:pl-0 lg:last:border-r-0">
          <dt className="eyebrow text-mute">{label}</dt>
          <dd className="mt-2 font-serif text-3xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function NextProperty({ property }) {
  return (
    <Link to={`/properties/${property.id}`} className="group block bg-ink text-paper">
      <div className="container-site flex items-end justify-between gap-6 pt-section pb-10">
        <div>
          <p className="eyebrow mb-4 text-stone">Next home</p>
          <p className="font-serif text-display">{property.title}</p>
        </div>
        <ArrowRight aria-hidden="true" className="arrow-nudge mb-3 size-8 shrink-0" strokeWidth={1.25} />
      </div>
      <div className="h-[40svh] overflow-hidden md:h-[55svh]">
        <Photo slug={property.images[0]} className="transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.05]" />
      </div>
    </Link>
  );
}

export default function PropertyPage() {
  const { id } = useParams();
  const property = getProperty(id);
  usePageMeta(
    property
      ? {
          title: property.title,
          description: `${property.summary} ${property.location} · ${formatPrice(property.price)} · ${formatSpecs(property)}.`,
          path: `/properties/${property.id}`,
          image: photoSrc(property.images[0], 1600),
        }
      : { title: 'Home not found', noindex: true },
  );
  if (!property) return <NotFound />;

  const next = properties[(properties.indexOf(property) + 1) % properties.length];

  return (
    <>
      <article aria-labelledby="property-title">
        <header className="container-site grid gap-8 pt-28 pb-10 md:pt-36 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Link to="/#discover" className="group eyebrow inline-flex items-center gap-2 text-mute hover:text-ink">
              <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.5} />
              All homes
            </Link>
            <p className="eyebrow mt-10 mb-4">{property.location}</p>
            <h1 id="property-title" className="font-serif text-display">
              <SplitText text={property.title} play delay={0.1} />
            </h1>
          </div>
          <Reveal className="flex items-center gap-4 lg:col-span-4 lg:justify-end lg:pb-3">
            <StatusBadge status={property.status} className="border border-line" />
            <p className="text-2xl">{formatPrice(property.price)}</p>
          </Reveal>
        </header>

        <PropertyHeroImage slug={property.images[0]} />
        <Facts property={property} />

        <section aria-labelledby="about-title" className="container-site grid gap-10 py-section lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="about-title" className="eyebrow mb-6 text-mute">About the home</h2>
            <p className="font-serif text-lead">{property.summary}</p>
          </div>
          <Reveal className="space-y-5 leading-relaxed text-mute lg:col-span-6 lg:col-start-7">
            {property.description.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <h3 className="eyebrow pt-6 text-ink">Highlights</h3>
            <ul className="divide-y divide-line border-y border-line text-ink">
              {property.features.map((feature) => (
                <li key={feature} className="py-3">{feature}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <PropertyGallery images={property.images.slice(1)} />

        <section aria-labelledby="viewing-title" className="container-site grid gap-12 pb-section lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="viewing-title" className="font-serif text-title">
              <SplitText text="Arrange a viewing" />
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-mute">Tell us when suits you and we'll confirm a time with the listing agent.</p>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <InquiryForm property={property} />
          </Reveal>
        </section>
      </article>
      <NextProperty property={next} />
    </>
  );
}
