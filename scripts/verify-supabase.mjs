// Verifica la conexión con Supabase y que la tabla products esté cargada.
// Uso: node --env-file=.env.local scripts/verify-supabase.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

const { count, error } = await supabase
  .from('products')
  .select('id', { count: 'exact', head: true });

if (error) {
  console.error('ERROR:', error.message);
  process.exit(1);
}

console.log('Conexión OK ✅  Productos en la tabla:', count);
