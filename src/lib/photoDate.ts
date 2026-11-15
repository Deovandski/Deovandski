import sharp from 'sharp';

/**
 * The day a photo was taken, as ISO "YYYY-MM-DD", or null when we can't tell.
 * 1. EXIF DateTimeOriginal (falls back to IFD0 DateTime), read from the original file.
 * 2. A date in the filename (see FILENAME_PATTERNS).
 * EXIF dates carry no timezone, so they're used exactly as the camera wrote them.
 */
export async function photoDate(path: string, file: string): Promise<string | null> {
  return (await exifDate(path)) ?? filenameDate(file);
}

// Display formatting (MM/DD/YYYY, or --/--/---- when null) lives in TravelerFacet.astro's script.

function validDate(y: number, m: number, d: number): string | null {
  const maxYear = new Date().getFullYear() + 1;
  if (y < 1990 || y > maxYear || m < 1 || m > 12 || d < 1) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null; // e.g. 02/30
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// A date in the name: any standalone 8-digit YYYYMMDD run (PXL_20231210_…, IMG_20231218_…, 20160522_…,
// WhatsApp IMG-20231113-WA0022, GridArt_20240819_…) or YYYY-MM-DD anywhere. Camera counters like
// IMG_5251 or DSC00632 are too short to match, and impossible dates (month 13, Feb 30) are rejected.
const FILENAME_PATTERNS = [/(?<!\d)(\d{4})(\d{2})(\d{2})(?!\d)/, /(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/];

export function filenameDate(file: string): string | null {
  for (const re of FILENAME_PATTERNS) {
    const m = file.match(re);
    if (m) {
      const iso = validDate(+m[1], +m[2], +m[3]);
      if (iso) return iso;
    }
  }
  return null;
}

async function exifDate(path: string): Promise<string | null> {
  try {
    const { exif } = await sharp(path).metadata();
    if (!exif) return null;
    const raw = readExifDate(exif);
    const m = raw?.match(/^(\d{4}):(\d{2}):(\d{2})/);
    return m ? validDate(+m[1], +m[2], +m[3]) : null;
  } catch {
    return null;
  }
}

/** Minimal TIFF/EXIF reader: DateTimeOriginal (0x9003) in the Exif IFD, else DateTime (0x0132) in IFD0. */
function readExifDate(buf: Buffer): string | null {
  let base = 0;
  if (buf.subarray(0, 6).toString('latin1') === 'Exif\0\0') base = 6;
  const order = buf.subarray(base, base + 2).toString('latin1');
  if (order !== 'II' && order !== 'MM') return null;
  const le = order === 'II';
  const u16 = (o: number) => (le ? buf.readUInt16LE(base + o) : buf.readUInt16BE(base + o));
  const u32 = (o: number) => (le ? buf.readUInt32LE(base + o) : buf.readUInt32BE(base + o));
  const inBounds = (o: number, n: number) => base + o >= 0 && base + o + n <= buf.length;

  const readIfd = (off: number) => {
    const tags = new Map<number, { type: number; count: number; value: number }>();
    if (!inBounds(off, 2)) return tags;
    const n = u16(off);
    for (let i = 0; i < n; i++) {
      const e = off + 2 + i * 12;
      if (!inBounds(e, 12)) break;
      tags.set(u16(e), { type: u16(e + 2), count: u32(e + 4), value: u32(e + 8) });
    }
    return tags;
  };
  const ascii = (t?: { type: number; count: number; value: number }) => {
    if (!t || t.type !== 2 || t.count < 10 || !inBounds(t.value, t.count)) return null;
    return buf.subarray(base + t.value, base + t.value + t.count).toString('latin1').replace(/\0+$/, '');
  };

  const ifd0 = readIfd(u32(4));
  const exifPtr = ifd0.get(0x8769);
  const original = exifPtr ? ascii(readIfd(exifPtr.value).get(0x9003)) : null;
  const usable = (s: string | null) => (s && !/^0000|^\s*$/.test(s) ? s : null);
  return usable(original) ?? usable(ascii(ifd0.get(0x0132)));
}
