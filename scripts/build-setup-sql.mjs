// Combina schema.sql + seed.sql en un único supabase/setup.sql,
// para correr toda la preparación de Supabase en una sola pegada.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'supabase');

const schema = await readFile(path.join(dir, 'schema.sql'), 'utf8');
const seed = await readFile(path.join(dir, 'seed.sql'), 'utf8');

const combined =
  `-- ============================================================================
-- SETUP COMPLETO (todo en uno). Pegá este archivo entero en:
-- Supabase -> SQL Editor -> New query -> Run
-- Crea la tabla + seguridad + bucket de imágenes y carga los 86 productos.
-- Se puede correr varias veces sin romper nada (es idempotente).
-- ============================================================================

${schema}

${seed}`;

await writeFile(path.join(dir, 'setup.sql'), combined, 'utf8');
console.log('supabase/setup.sql generado');
