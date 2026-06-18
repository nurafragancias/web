-- ============================================================================
-- NURA FRAGANCIAS — Sistema de gestión (stock, ventas, compras, cuenta corriente)
-- Pegá este archivo completo en: Supabase -> SQL Editor -> New query -> Run
-- Se puede correr varias veces sin romper nada (idempotente).
-- Estos datos son PRIVADOS: solo el admin logueado puede verlos/modificarlos.
-- ============================================================================

-- 1) Stock por producto (en frascos completos) --------------------------------
alter table public.products add column if not exists stock integer not null default 0;

-- 2) Contactos (clientes / proveedores) ---------------------------------------
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text,
  note       text,
  created_at timestamptz not null default now()
);

-- 3) Ventas -------------------------------------------------------------------
create table if not exists public.sales (
  id             uuid primary key default gen_random_uuid(),
  date           date not null default current_date,
  contact_id     uuid references public.contacts(id) on delete set null,
  contact_name   text,                       -- nombre libre si no hay contacto
  total          numeric(12,2) not null default 0,
  payment_method text not null,              -- efectivo | transferencia | cuenta_corriente
  paid           numeric(12,2) not null default 0,  -- pagado al momento de la venta
  note           text,
  created_at     timestamptz not null default now()
);

create table if not exists public.sale_items (
  id           uuid primary key default gen_random_uuid(),
  sale_id      uuid not null references public.sales(id) on delete cascade,
  product_id   text references public.products(id) on delete set null,
  product_name text,
  size         text,
  qty          integer not null default 1,
  unit_price   numeric(12,2) not null default 0,
  affects_stock boolean not null default false
);

-- 4) Compras ------------------------------------------------------------------
create table if not exists public.purchases (
  id             uuid primary key default gen_random_uuid(),
  date           date not null default current_date,
  contact_id     uuid references public.contacts(id) on delete set null,
  contact_name   text,
  total          numeric(12,2) not null default 0,
  payment_method text not null,
  paid           numeric(12,2) not null default 0,
  note           text,
  created_at     timestamptz not null default now()
);

create table if not exists public.purchase_items (
  id           uuid primary key default gen_random_uuid(),
  purchase_id  uuid not null references public.purchases(id) on delete cascade,
  product_id   text references public.products(id) on delete set null,
  product_name text,
  size         text,
  qty          integer not null default 1,
  unit_cost    numeric(12,2) not null default 0,
  affects_stock boolean not null default false
);

-- 5) Pagos parciales (entregas a cuenta) para cuenta corriente ----------------
create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  date        date not null default current_date,
  kind        text not null,                 -- 'sale' | 'purchase'
  sale_id     uuid references public.sales(id) on delete cascade,
  purchase_id uuid references public.purchases(id) on delete cascade,
  amount      numeric(12,2) not null default 0,
  method      text,
  note        text,
  created_at  timestamptz not null default now()
);

-- 6) Seguridad: datos privados, solo el admin autenticado ---------------------
alter table public.contacts        enable row level security;
alter table public.sales           enable row level security;
alter table public.sale_items      enable row level security;
alter table public.purchases       enable row level security;
alter table public.purchase_items  enable row level security;
alter table public.payments        enable row level security;

do $$
declare t text;
begin
  foreach t in array array['contacts','sales','sale_items','purchases','purchase_items','payments']
  loop
    execute format('drop policy if exists "admin all %1$s" on public.%1$s', t);
    execute format(
      'create policy "admin all %1$s" on public.%1$s for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Índices útiles
create index if not exists sale_items_sale_idx     on public.sale_items (sale_id);
create index if not exists purchase_items_purch_idx on public.purchase_items (purchase_id);
create index if not exists payments_sale_idx       on public.payments (sale_id);
create index if not exists payments_purchase_idx   on public.payments (purchase_id);
create index if not exists sales_date_idx          on public.sales (date);
create index if not exists purchases_date_idx      on public.purchases (date);
