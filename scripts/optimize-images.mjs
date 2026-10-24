// Runs before every build: makes small, fast WebP copies of the project
// screenshots uploaded through Pages CMS. Originals are left untouched.
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const projectsDir = path.join(root, 'src/content/projects');
const outDir = path.join(root, 'public/images/cards');
const WIDTHS = [700, 1200];

export const slug = (s) => s.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

await mkdir(outDir, { recursive: true });
let made = 0;
for (const file of await readdir(projectsDir)) {
  if (!file.endsWith('.md')) continue;
  const text = await readFile(path.join(projectsDir, file), 'utf8');
  const m = text.match(/^image:\s*["']?(.+?)["']?\s*$/m);
  if (!m || !m[1].trim()) continue;
  const src = path.join(root, 'public', decodeURIComponent(m[1].trim()).replace(/^\//, ''));
  if (!existsSync(src)) { console.warn(`[images] missing: ${src}`); continue; }
  const base = slug(path.basename(src));
  for (const w of WIDTHS) {
    const out = path.join(outDir, `${base}-${w}.webp`);
    if (existsSync(out)) continue;
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    made++;
  }
}
console.log(`[images] ${made} card image(s) generated`);
