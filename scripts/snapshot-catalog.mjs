// Copia data/catalog.json -> public/catalog.json antes de compilar.
// En un hosting estático no existe el servidor /api/catalog, así que este
// snapshot es el que la web usa para mostrar el catálogo actualizado.
// Se ejecuta automáticamente como "prebuild" (ver package.json).
import { copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '..', 'data', 'catalog.json');
const dest = path.resolve(__dirname, '..', 'public', 'catalog.json');

try {
  await access(src);
} catch {
  console.error(`No se encontró el catálogo en ${src}`);
  process.exit(1);
}

await copyFile(src, dest);
console.log('Snapshot del catálogo copiado a public/catalog.json');
