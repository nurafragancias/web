// Exportación / importación de precios en Excel para actualización masiva.
// Formato: ID | Producto | Marca | Tamaño 1 | Precio 1 | Tamaño 2 | Precio 2 ...
// Sólo se editan las columnas "Precio N". El ID identifica al producto.

const maxVariants = (products) =>
  products.reduce((m, p) => Math.max(m, (p.variants || []).length), 1);

// Filas listas para exportar (ordenadas por marca y nombre).
export const buildPriceRows = (products) => {
  const maxV = maxVariants(products);
  return products
    .slice()
    .sort((a, b) =>
      (a.brand || '').localeCompare(b.brand || '', 'es') ||
      (a.name || '').localeCompare(b.name || '', 'es'))
    .map((p) => {
      const row = { ID: p.id, Producto: (p.name || '').trim(), Marca: p.brand || '' };
      for (let i = 0; i < maxV; i++) {
        const v = (p.variants || [])[i];
        row[`Tamaño ${i + 1}`] = v ? v.size : '';
        row[`Precio ${i + 1}`] = v ? Number(v.price) || 0 : '';
      }
      return row;
    });
};

// Convierte el valor de una celda de precio a un entero de pesos.
// Acepta números (8200) o texto ("8.200", "$ 8200"). Devuelve null si está
// vacío y NaN si no se puede interpretar.
const parsePrice = (raw) => {
  if (raw === '' || raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Math.round(raw);
  const digits = String(raw).replace(/[^\d]/g, '');
  if (!digits) return NaN;
  return parseInt(digits, 10);
};

// Toma las filas importadas y el catálogo actual, y calcula qué cambia.
// Devuelve { updates, errors, changedCount, unchanged }.
//   updates: [{ id, name, variants (nuevas), changes:[{size, from, to}] }]
export const parsePriceRows = (rows, products) => {
  const byId = {};
  for (const p of products) byId[String(p.id)] = p;
  const maxV = maxVariants(products);

  const updates = [];
  const errors = [];
  let unchanged = 0;

  for (const row of rows) {
    const id = String(row.ID ?? row.id ?? '').trim();
    if (!id) continue; // fila vacía o sin ID
    const prod = byId[id];
    if (!prod) {
      errors.push(`ID "${id}"${row.Producto ? ` (${row.Producto})` : ''}: no existe ese producto, se omite.`);
      continue;
    }

    const newVariants = (prod.variants || []).map((v) => ({ ...v }));
    const changes = [];

    for (let i = 0; i < maxV; i++) {
      const variant = newVariants[i];
      if (!variant) continue; // este producto no tiene esa variante
      const price = parsePrice(row[`Precio ${i + 1}`]);
      if (price === null) continue;            // celda vacía → no se toca
      if (Number.isNaN(price) || price <= 0) {
        errors.push(`${prod.name?.trim()} (${variant.size}): precio inválido "${row[`Precio ${i + 1}`]}", se omite.`);
        continue;
      }
      if (price !== Number(variant.price)) {
        changes.push({ size: variant.size, from: Number(variant.price) || 0, to: price });
        variant.price = price;
      }
    }

    if (changes.length > 0) {
      updates.push({ id: prod.id, name: (prod.name || '').trim(), variants: newVariants, changes });
    } else {
      unchanged++;
    }
  }

  return { updates, errors, changedCount: updates.length, unchanged };
};
