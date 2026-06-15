-- ============================================================================
-- NURA FRAGANCIAS — Esquema de base de datos para Supabase
-- Pegá este archivo completo en: Supabase -> SQL Editor -> New query -> Run
-- (Corré PRIMERO este schema.sql y DESPUÉS seed.sql)
-- ============================================================================

-- 1) Tabla del catálogo --------------------------------------------------------
create table if not exists public.products (
  id          text primary key,
  name        text not null,
  brand       text,
  description text,
  category    text,
  variants    jsonb not null default '[]'::jsonb,
  images      jsonb not null default '[]'::jsonb,
  position    integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- Índice para ordenar el catálogo
create index if not exists products_position_idx on public.products (position);

-- 2) Seguridad a nivel de fila (RLS) ------------------------------------------
alter table public.products enable row level security;

-- Cualquiera puede VER el catálogo (lectura pública)
drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  using (true);

-- Solo usuarios autenticados (el admin logueado) pueden MODIFICAR
drop policy if exists "Authenticated insert products" on public.products;
create policy "Authenticated insert products"
  on public.products for insert to authenticated with check (true);

drop policy if exists "Authenticated update products" on public.products;
create policy "Authenticated update products"
  on public.products for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated delete products" on public.products;
create policy "Authenticated delete products"
  on public.products for delete to authenticated using (true);

-- 3) Almacenamiento de imágenes -----------------------------------------------
-- Bucket público para las fotos nuevas que se suban desde el admin.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Lectura pública de las imágenes del bucket
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Subir imágenes: solo autenticados
drop policy if exists "Authenticated upload product images" on storage.objects;
create policy "Authenticated upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

-- Borrar imágenes: solo autenticados
drop policy if exists "Authenticated delete product images" on storage.objects;
create policy "Authenticated delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');
