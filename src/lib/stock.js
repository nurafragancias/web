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
