// Runs before every build (npm "prebuild"). iPhones save photos as HEIC, which the
// site's image tools can't read, sometimes even with a .jpg name. This finds HEIC
// files under content/ by their actual bytes and converts them to real JPEGs:
// - a HEIC file named .jpg/.jpeg/.png is converted in place, keeping its name;
// - a .heic/.heif file gets a .jpg copy next to it (the original is left alone).
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import convert from 'heic-convert';

const ROOT = 'content';
const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'];

function isHeic(buf) {
  if (buf.length < 12 || buf.toString('ascii', 4, 8) !== 'ftyp') return false;
  return HEIC_BRANDS.includes(buf.toString('ascii', 8, 12));
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let converted = 0;
for (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.heic', '.heif'].includes(ext)) continue;
  const input = readFileSync(file);
  if (!isHeic(input)) continue;
  const target = ext === '.heic' || ext === '.heif' ? file.slice(0, -ext.length) + '.jpg' : file;
  if (target !== file && existsSync(target)) continue;
  const output = await convert({ buffer: input, format: 'JPEG', quality: 0.9 });
  writeFileSync(target, Buffer.from(output));
  converted++;
  console.log(`converted HEIC → JPEG: ${target}`);
}
if (converted) console.log(`${converted} HEIC photo(s) converted.`);
