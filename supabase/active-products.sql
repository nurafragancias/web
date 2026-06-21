-- ============================================================================
-- Productos: posibilidad de desactivar/activar un producto (y sus variantes).
-- Pegá este archivo en: Supabase -> SQL Editor -> New query -> Run
-- (Se puede correr varias veces sin romper nada.)
-- ============================================================================

-- 1) Columna "active" a nivel producto. Default true (todos los actuales activos).
alter table public.products add column if not exists active boolean not null default true;

-- 2) Las variantes viven dentro del JSONB "variants". Cada objeto puede tener
--    un campo "active" (boolean). Si no está, se asume true. No hace falta
--    migración: el frontend lo agrega cuando guardas un producto.
