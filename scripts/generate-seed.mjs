// Genera supabase/seed.sql a partir de data/catalog.json.
// El SQL resultante se pega en el editor SQL de Supabase para cargar los
// 86 productos actuales en la tabla public.products. Es idempotente:
// si lo corrés de nuevo, actualiza en vez de duplicar (on conflict).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '..', 'data', 'catalog.json');
const outDir = path.resolve(__dirname, '..', 'supabase');
const out = path.join(outDir, 'seed.sql');

const sqlStr = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const sqlJson = (v) => `'${JSON.stringify(v ?? []).replace(/'/g, "''")}'::jsonb`;

const products = JSON.parse(await readFile(src, 'utf8'));

const rows = products
  .map((p, i) =>
    `  (${sqlStr(p.id)}, ${sqlStr(p.name)}, ${sqlStr(p.brand)}, ${sqlStr(p.description)}, ` +
    `${sqlStr(p.category)}, ${sqlJson(p.variants)}, ${sqlJson(p.images)}, ${i})`
  )
  .join(',\n');

const sql = `-- Carga inicial del catálogo (${products.length} productos) generada desde data/catalog.json
-- Pegá este archivo completo en: Supabase -> SQL Editor -> New query -> Run
insert into public.products (id, name, brand, description, category, variants, images, position) values
${rows}
on conflict (id) do update set
  name        = excluded.name,
  brand       = excluded.brand,
  description = excluded.description,
  category    = excluded.category,
  variants    = excluded.variants,
  images      = excluded.images,
  position    = excluded.position;
`;

await mkdir(outDir, { recursive: true });
await writeFile(out, sql, 'utf8');
console.log(`seed.sql generado con ${products.length} productos en ${out}`);
