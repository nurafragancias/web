-- ============================================================================
-- Actualización masiva de stock a partir del listado físico del dueño.
-- Pegá en: Supabase -> SQL Editor -> New query -> Run
-- ============================================================================

-- 79 productos existentes: actualiza el stock (no toca nada más).
update public.products set stock = 2, updated_at = now() where id = '1';   -- AFNAN 9 AM DIVE EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '2';   -- AFNAN 9 PM MASC EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '3';   -- AFNAN 9 PM REBEL EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '4';   -- AL HARAMAIN AMBER OUD DUBAI NIGHT EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '5';   -- AL HARAMAIN AMBER OUD GOLD EDITION EDP 120ML
update public.products set stock = 1, updated_at = now() where id = '6';   -- AL WATANIAH SABAH AL WARD 100ML
update public.products set stock = 1, updated_at = now() where id = '7';   -- ARMAF CLUB DE NUIT ICONIC EDP 105ML
update public.products set stock = 1, updated_at = now() where id = '8';   -- ARMAF CLUB DE NUIT INTENSE MAN EDT 105ML
update public.products set stock = 1, updated_at = now() where id = '9';   -- ARMAF CLUB DE NUIT MILESTONE EDP 105ML
update public.products set stock = 1, updated_at = now() where id = '10';  -- ARMAF CLUB DE NUIT SILLAGE EDP 105ML
update public.products set stock = 2, updated_at = now() where id = '11';  -- ARMAF CLUB DE NUIT UNTOLD EDP 105ML
update public.products set stock = 0, updated_at = now() where id = '12';  -- ARMAF CLUB DE NUIT URBAN MAN ELIXIR EDP 105ML
update public.products set stock = 1, updated_at = now() where id = '13';  -- ARMAF CLUB DE NUIT WOMAN EDP 105ML
update public.products set stock = 1, updated_at = now() where id = '14';  -- ARMAF ODYSSEY CANDEE EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '15';  -- ARMAF ODYSSEY HOMME WHITE EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '16';  -- ARMAF ODYSSEY LIMONI EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '17';  -- ARMAF ODYSSEY MANDARIN SKY EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '18';  -- ARMAF VENTANA MARINE EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '19';  -- ARMANI STRONGER WITH YOU INTENSELY EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '20';  -- ASDAAF ANDALEEB EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '22';  -- BHARARA KING EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '23';  -- BHARARA VIKING BEIRUT EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '24';  -- DAR EL WARD FATTAH 100ML
update public.products set stock = 2, updated_at = now() where id = '21';  -- FRENCH AVENUE LIQUID BRUN 100ML
update public.products set stock = 1, updated_at = now() where id = '25';  -- RASASI HAWAS FOR HIM EDP 100ML  (tu lista: "HAWAS BY RASASI")
update public.products set stock = 1, updated_at = now() where id = '30';  -- LATTAFA AL NOBLE SAFEER EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '31';  -- LATTAFA QAED AL FURSAN EDP 90ml
update public.products set stock = 2, updated_at = now() where id = '32';  -- LATTAFA QAED AL FURSAN UNLIMITED EDP 90ml
update public.products set stock = 2, updated_at = now() where id = '33';  -- LATTAFA BADE'E AL OUD AMETHYST EDP 100ML
update public.products set stock = 0, updated_at = now() where id = '34';  -- LATTAFA BADE'E AL OUD FOR GLORY EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '35';  -- LATTAFA BADE'E AL OUD HONOR & GLORY EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '36';  -- LATTAFA BADE'E AL OUD NOBLE BLUSH EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '37';  -- LATTAFA BADE'E AL OUD SUBLIME EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '38';  -- LATTAFA ECLAIRE EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '39';  -- LATTAFA EMEER EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '40';  -- LATTAFA FAKHAR BLACK EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '41';  -- LATTAFA FAKHAR EXTRAIT EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '42';  -- LATTAFA FAKHAR WOMAN EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '43';  -- LATTAFA HAYA EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '44';  -- LATTAFA HAYAATI GOLD ELIXIR EDP 100ML
update public.products set stock = 3, updated_at = now() where id = '45';  -- LATTAFA KHAMRAH EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '46';  -- LATTAFA MAAHIR BLACK EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '47';  -- LATTAFA MAAHIR GOLD EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '48';  -- LATTAFA MAYAR CHERRY INTENSE 100ML
update public.products set stock = 2, updated_at = now() where id = '49';  -- LATTAFA MAYAR EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '50';  -- LATTAFA MUSK CANDY ROSE EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '51';  -- LATTAFA SEHR EDP 100ML  (tu lista: "SHERK", confirmado que es el mismo)
update public.products set stock = 1, updated_at = now() where id = '52';  -- LATTAFA THE KINGDOM FOR MEN EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '53';  -- LATTAFA VINTAGE RADIO 100ML
update public.products set stock = 4, updated_at = now() where id = '54';  -- LATTAFA ASAD EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '55';  -- LATTAFA ASAD BOURBON EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '56';  -- LATTAFA YARA CANDY WOMAN EDP 100ML
update public.products set stock = 2, updated_at = now() where id = '57';  -- LATTAFA YARA MOI EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '58';  -- LATTAFA YARA TOUS EDP 100ML
update public.products set stock = 3, updated_at = now() where id = '59';  -- LATTAFA YARA WOMAN EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '60';  -- MAISON ALHAMBRA CORAL BLUSH 80ML
update public.products set stock = 0, updated_at = now() where id = '61';  -- MAISON ALHAMBRA JEAN LOWE OMBRE EDP 100ML (NOIR)
update public.products set stock = 0, updated_at = now() where id = '62';  -- MAISON ALHAMBRA PHILOS PURA EDP 100ML
update public.products set stock = 1, updated_at = now() where id = '63';  -- KARSELL MASCARA CAPILAR COLLAGEN 500ML
update public.products set stock = 2, updated_at = now() where id = '64';  -- STELLA DUSTIN LOCION CORPORAL COCONUT DREAM
update public.products set stock = 4, updated_at = now() where id = '65';  -- STELLA DUSTIN LOCION CORPORAL ROMANCE DREAM
update public.products set stock = 1, updated_at = now() where id = '66';  -- STELLA DUSTIN LOCION CORPORAL VAINILLA DREAM
update public.products set stock = 2, updated_at = now() where id = '67';  -- STELLA DUSTIN MIST CORPORAL COCONUT DREAM
update public.products set stock = 4, updated_at = now() where id = '68';  -- STELLA DUSTIN MIST CORPORAL ROMANCE DREAM
update public.products set stock = 0, updated_at = now() where id = '69';  -- STELLA DUSTIN MIST CORPORAL VAINILLA DREAM
update public.products set stock = 2, updated_at = now() where id = '73';  -- VICTORIA'S SECRET LOCION CORPORAL AMBER ROMANCE
update public.products set stock = 3, updated_at = now() where id = '74';  -- VICTORIA'S SECRET LOCION CORPORAL COCONUT PASSION
update public.products set stock = 1, updated_at = now() where id = '75';  -- VICTORIA'S SECRET LOCION CORPORAL LOVE SPELL
update public.products set stock = 3, updated_at = now() where id = '76';  -- VICTORIA'S SECRET LOCION CORPORAL PURE SEDUCTION
update public.products set stock = 2, updated_at = now() where id = '77';  -- VICTORIA'S SECRET LOCION CORPORAL VAINILLA
update public.products set stock = 1, updated_at = now() where id = '78';  -- VICTORIA'S SECRET MIST CORPORAL AMBER ROMANCE 250ML
update public.products set stock = 1, updated_at = now() where id = '79';  -- VICTORIA'S SECRET MIST CORPORAL AQUA KISS 250ML
update public.products set stock = 2, updated_at = now() where id = '80';  -- VICTORIA'S SECRET MIST CORPORAL COCONUT PASSION 250ML
update public.products set stock = 2, updated_at = now() where id = '81';  -- VICTORIA'S SECRET MIST CORPORAL JAZMINE 250ML
update public.products set stock = 1, updated_at = now() where id = '82';  -- VICTORIA'S SECRET MIST CORPORAL LOVE SPELL 250ML
update public.products set stock = 0, updated_at = now() where id = '83';  -- VICTORIA'S SECRET MIST CORPORAL MIDNIGHT BLOOM 250ML
update public.products set stock = 0, updated_at = now() where id = '84';  -- VICTORIA'S SECRET MIST CORPORAL PURE SEDUCTION 250ML
update public.products set stock = 0, updated_at = now() where id = '85';  -- VICTORIA'S SECRET MIST CORPORAL VAINILLA 250ML
update public.products set stock = 1, updated_at = now() where id = '86';  -- VICTORIA'S SECRET MIST CORPORAL VAINILLA CON BRILLO 250ML

-- 2 productos nuevos: no existían en el catálogo. Se crean con el stock
-- indicado, categoría y precio en 0 como placeholder. Entrá al admin y
-- completá precio, descripción y fotos.
insert into public.products (id, name, brand, description, category, variants, images, position, stock, discount, on_sale, active)
values
  ('87', 'HIS CONFESSION EDP 100ML', 'LATTAFA', '', 'masculino', '[{"size":"5ml","price":0},{"size":"100ml","price":0}]'::jsonb, '[]'::jsonb, 87, 2, 0, false, true),
  ('88', 'VOYAGE 100ML', 'NAUTICA', '', 'masculino', '[{"size":"5ml","price":0},{"size":"100ml","price":0}]'::jsonb, '[]'::jsonb, 88, 1, 0, false, true)
on conflict (id) do nothing;
