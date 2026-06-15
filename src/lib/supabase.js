import { createClient } from '@supabase/supabase-js';

// Lee la configuración desde variables de entorno (Vite expone las que empiezan
// con VITE_). En local viven en .env.local; en producción se cargan en Vercel.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si todavía no está configurado, la app sigue funcionando con el snapshot
// estático (catalog.json) — así nada se rompe antes de terminar la conexión.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

// Bucket de Storage donde se guardan las imágenes subidas desde el admin.
export const PRODUCT_IMAGES_BUCKET = 'product-images';
