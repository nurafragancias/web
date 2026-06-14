// Optimiza las imágenes de productos in-place: auto-orienta, redimensiona a un
// máximo razonable y recomprime, manteniendo el mismo nombre y extensión para
// no romper ninguna referencia del catálogo. Las originales quedan en el
// historial de git, así que la operación es reversible.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'public', 'images', 'products');

const MAX_DIM = 1200;     // ancho/alto máximo (suficiente para cards y modal en pantallas retina)
const JPEG_Q = 80;
const PNG_Q = 80;
const WEBP_Q = 80;

const fmt = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const reencode = (img, ext) => {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return img.jpeg({ quality: JPEG_Q, mozjpeg: true });
    case '.png':
      return img.png({ compressionLevel: 9, quality: PNG_Q, palette: true });
    case '.webp':
      return img.webp({ quality: WEBP_Q });
    default:
      return null;
  }
};

const run = async () => {
  const entries = await readdir(DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && /\.(jpe?g|png|webp)$/i.test(e.name))
    .map((e) => e.name);

  let totalBefore = 0;
  let totalAfter = 0;
  let optimized = 0;
  let skipped = 0;
  let failed = 0;

  for (const name of files) {
    const full = path.join(DIR, name);
    const ext = path.extname(name).toLowerCase();
    try {
      const input = await readFile(full);
      totalBefore += input.length;

      const pipeline = reencode(
        sharp(input, { failOn: 'none' })
          .rotate() // aplica orientación EXIF y la "hornea" en los píxeles
          .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true }),
        ext
      );

      if (!pipeline) {
        totalAfter += input.length;
        skipped++;
        continue;
      }

      const output = await pipeline.toBuffer();

      // Solo reemplazamos si realmente ahorramos espacio.
      if (output.length < input.length) {
        await writeFile(full, output);
        totalAfter += output.length;
        optimized++;
        const pct = (100 * (1 - output.length / input.length)).toFixed(0);
        console.log(`✓ ${name}  ${fmt(input.length)} → ${fmt(output.length)}  (-${pct}%)`);
      } else {
        totalAfter += input.length;
        skipped++;
        console.log(`· ${name}  ya estaba optimizada (sin cambios)`);
      }
    } catch (err) {
      failed++;
      console.warn(`✗ ${name}  ERROR: ${err.message}`);
    }
  }

  console.log('\n──────── Resumen ────────');
  console.log(`Archivos procesados: ${files.length}`);
  console.log(`Optimizados: ${optimized} | Sin cambios: ${skipped} | Fallidos: ${failed}`);
  console.log(`Tamaño total: ${fmt(totalBefore)} → ${fmt(totalAfter)}`);
  console.log(`Ahorro: ${fmt(totalBefore - totalAfter)} (-${(100 * (1 - totalAfter / totalBefore)).toFixed(1)}%)`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
