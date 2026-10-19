import { photos, photoSrc, photoSrcSet } from '../../data/photos';

/** Responsive <img> for a photo slug from data/photos.js. */
export default function Photo({ slug, sizes = '100vw', priority = false, alt, className = '', ...rest }) {
  const photo = photos[slug];
  if (!photo) throw new Error(`Unknown photo slug: ${slug}`);

  return (
    <img
      src={photoSrc(slug, 1600)}
      srcSet={photoSrcSet(slug)}
      sizes={sizes}
      alt={alt ?? photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable="false"
      className={`h-full w-full object-cover ${className}`}
      {...rest}
    />
  );
}
