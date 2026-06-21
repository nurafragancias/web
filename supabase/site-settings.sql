-- ============================================================================
-- Ajustes del sitio (clave/valor): número de WhatsApp y otros futuros.
-- Pegá este archivo en: Supabase -> SQL Editor -> New query -> Run
-- (Se puede correr varias veces sin romper nada.)
-- ============================================================================

create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Lectura pública (los valores se usan en el footer y el checkout del cliente)
drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings"
  on public.site_settings for select using (true);

-- Solo el admin logueado puede modificar / insertar
drop policy if exists "Authenticated write settings" on public.site_settings;
create policy "Authenticated write settings"
  on public.site_settings for all to authenticated using (true) with check (true);

-- Semilla: número de WhatsApp actual. Si ya existe, no lo pisa.
insert into public.site_settings (key, value)
values ('whatsapp_number', '543562447897')
on conflict (key) do nothing;
