-- ============================================================================
-- Actualiza las rutas de imágenes de .png a .jpg tras comprimir los 9 PNG
-- pesados a JPEG (misma imagen, 70% más liviana).
-- Pegá este archivo en: Supabase -> SQL Editor -> New query -> Run
-- Es seguro: sólo cambia ".png" por ".jpg" en las rutas guardadas. Los
-- archivos .jpg ya están subidos en el deploy, y los .png viejos siguen
-- existiendo por las dudas.
-- ============================================================================

update public.products
set images = replace(images::text, '.png', '.jpg')::jsonb,
    updated_at = now()
where images::text like '%.png%';
