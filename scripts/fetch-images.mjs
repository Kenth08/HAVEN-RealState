// Downloads every photo in src/data/photos.js from Unsplash as WebP into
// public/images. Existing files are skipped, so it is safe to re-run.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { photos, PHOTO_WIDTHS } from '../src/data/photos.js';

const OUT_DIR = new URL('../public/images/', import.meta.url);
await mkdir(OUT_DIR, { recursive: true });

const exists = (url) => access(url).then(() => true, () => false);
let downloaded = 0;
let failed = 0;

for (const [slug, { id }] of Object.entries(photos)) {
  for (const width of PHOTO_WIDTHS) {
    const target = new URL(`${slug}-${width}.webp`, OUT_DIR);
    if (await exists(target)) continue;
    const url = `https://images.unsplash.com/photo-${id}?w=${width}&q=${width > 1000 ? 55 : 68}&fm=webp&fit=max`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`✗ ${slug} (${width}w): HTTP ${res.status}`);
      failed++;
      continue;
    }
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    downloaded++;
  }
}

console.log(`Downloaded ${downloaded} file(s), ${failed} failure(s).`);
if (failed) process.exitCode = 1;
