import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT_EXPO } from '../../lib/motion';
import PropertyCard from './PropertyCard';

export default function PropertyGrid({ properties, onReset }) {
  if (!properties.length) {
    return (
      <div className="border-y border-line py-20 text-center">
        <p className="font-serif text-4xl">No homes match those filters.</p>
        <p className="mt-3 text-mute">Try widening the price range or choosing another location.</p>
        <button type="button" onClick={onReset} className="btn-outline mt-8">
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {properties.map((property) => (
          <motion.li
            key={property.id}
            layout
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <PropertyCard property={property} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
