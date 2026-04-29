import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const desktop = path.join(os.homedir(), 'Desktop');
const outDir = path.join(root, 'public/images/team');

const sources = [
  { in: path.join(desktop, 'MartaAndreoli.jpeg'),         slug: 'marta-andreoli' },
  { in: path.join(desktop, 'MassimilianoAndreoli.jpeg'),  slug: 'massimiliano-andreoli' },
];

for (const s of sources) {
  const meta = await sharp(s.in).metadata();
  const base = sharp(s.in).rotate().resize({ width: 900, withoutEnlargement: true });

  const jpgPath  = path.join(outDir, `${s.slug}.jpg`);
  const webpPath = path.join(outDir, `${s.slug}.webp`);

  await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath);
  await base.clone().webp({ quality: 80 }).toFile(webpPath);

  const a = await sharp(jpgPath).metadata();
  const b = await sharp(webpPath).metadata();
  console.log(`${s.slug}: src ${meta.width}x${meta.height} → jpg ${a.width}x${a.height} · webp ${b.width}x${b.height}`);
}
