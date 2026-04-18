import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'public/images/logo.png');
const output = path.join(root, 'public/images/logo-trimmed.png');

const before = await sharp(input).metadata();

const trimmed = sharp(input).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 });
await trimmed.toFile(output);
const after = await sharp(output).metadata();

console.log(`before: ${before.width}x${before.height}`);
console.log(`after:  ${after.width}x${after.height}`);
console.log(`written: ${output}`);
