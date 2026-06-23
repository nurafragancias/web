-- ============================================================================
-- ARREGLO: revierte a .png las 8 imágenes de Supabase Storage que se
-- rompieron al correr images-png-to-jpg.sql.
--
-- Esas 8 imágenes están subidas en Supabase Storage como .png (no son
-- las que se comprimieron en /public/images/products/). El reemplazo
-- masivo .png -> .jpg también las afectó por error, pero los archivos
-- en Storage siguen siendo .png. Este script las vuelve a apuntar bien.
--
-- Pegá en: Supabase -> SQL Editor -> New query -> Run
-- Es seguro: cada UPDATE busca el filename exacto y lo cambia solo en
-- ese producto. No toca el resto de imágenes ni archivos.
-- ============================================================================

update public.products set images = replace(images::text, '1782167311374-bfaazs-UNTOLD.jpg',                     '1782167311374-bfaazs-UNTOLD.png')::jsonb,                     updated_at = now() where id = '11';
update public.products set images = replace(images::text, '1781905888468-b70jan-BHARARA-KING.jpg',               '1781905888468-b70jan-BHARARA-KING.png')::jsonb,               updated_at = now() where id = '22';
update public.products set images = replace(images::text, '1782068863018-e54cfl-Eros-Flame.jpg',                 '1782068863018-e54cfl-Eros-Flame.png')::jsonb,                 updated_at = now() where id = '72';
update public.products set images = replace(images::text, '1782068898680-13cmqo-ChatGPT-Image-14-jun-2026--01_47_43-p.m.jpg', '1782068898680-13cmqo-ChatGPT-Image-14-jun-2026--01_47_43-p.m.png')::jsonb, updated_at = now() where id = '71';
update public.products set images = replace(images::text, '1781905921237-wk65n7-ODYSSEY-HOMME-WHITE.jpg',        '1781905921237-wk65n7-ODYSSEY-HOMME-WHITE.png')::jsonb,        updated_at = now() where id = '15';
update public.products set images = replace(images::text, '1781906001554-svrgw9-JPG-LE-BEAU-EDT.jpg',            '1781906001554-svrgw9-JPG-LE-BEAU-EDT.png')::jsonb,            updated_at = now() where id = '26';
update public.products set images = replace(images::text, '1782069009896-rm2o1g-Valentino-born-in-roma-Intense.jpg', '1782069009896-rm2o1g-Valentino-born-in-roma-Intense.png')::jsonb, updated_at = now() where id = '70';
update public.products set images = replace(images::text, '1782071662839-fjcjyn-Lattafa-jasoor.jpg',             '1782071662839-fjcjyn-Lattafa-jasoor.png')::jsonb,             updated_at = now() where id = '1781554918807';
