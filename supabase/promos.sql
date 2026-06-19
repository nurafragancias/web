-- ============================================================================
-- Promociones: descuento por producto + tilde para mostrarlo en "Promociones"
-- Pegá este archivo en: Supabase -> SQL Editor -> New query -> Run
-- (Se puede correr varias veces sin romper nada.)
-- ============================================================================
alter table public.products add column if not exists discount integer not null default 0;
alter table public.products add column if not exists on_sale boolean not null default false;
