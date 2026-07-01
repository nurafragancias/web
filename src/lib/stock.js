// Reglas de stock para Nura.
// El stock se cuenta en FRASCOS COMPLETOS. Un decant (tamaño chico) sale del
// probador y NO descuenta stock; el frasco completo SÍ.

export const parseMl = (size) => {
  const m = String(size ?? '').match(/(\d+)/);
  return m ? Number(m[1]) : 0;
};

// Si la variante no tiene marcado explícito (productos viejos), se infiere por
// el tamaño: >= 30ml se considera frasco completo (descuenta stock).
export const variantAffectsStock = (variant) =>
  typeof variant?.affectsStock === 'boolean'
    ? variant.affectsStock
    : parseMl(variant?.size) >= 30;

// Devuelve las variantes que el catálogo PÚBLICO debe mostrar. Excluye:
// - variantes marcadas como inactivas (v.active === false)
// - variantes "frasco" (affectsStock) cuando el stock del producto es 0
// El segundo filtro cubre productos con stock 0 histórico que aún tienen
// v.active === true en DB — sin él seguirían apareciendo con opción 100ml.
export const visibleVariants = (product) => {
  const stock = product?.stock ?? 0;
  return (product?.variants || []).filter(v => {
    if (v?.active === false) return false;
    if (variantAffectsStock(v) && stock <= 0) return false;
    return true;
  });
};
