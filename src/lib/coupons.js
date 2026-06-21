// Lógica de cupones de descuento.
// Los cupones se guardan como JSON (array) en site_settings -> key "coupons".
// Cada cupón tiene un "type" y parámetros según el tipo. El cálculo es 100%
// client-side: el carrito no se persiste como orden, sólo se arma el mensaje
// de WhatsApp con el descuento ya aplicado.

export const COUPON_TYPES = {
  percent_total: {
    label: 'Porcentaje sobre el total',
    help: 'Descuenta un % del total del carrito.'
  },
  percent_min: {
    label: 'Porcentaje sobre el total (con mínimo de compra)',
    help: 'Descuenta un % del total, sólo si la compra supera un monto mínimo.'
  },
  fixed_min: {
    label: 'Monto fijo (con mínimo de compra)',
    help: 'Descuenta un monto fijo en $, sólo si la compra supera un mínimo.'
  },
  scope_percent: {
    label: 'Porcentaje por categoría / marca / tamaño',
    help: 'Descuenta un % sólo sobre los productos que coinciden con el alcance elegido.'
  },
  second_unit: {
    label: 'Descuento en la 2ª unidad (la de menor valor)',
    help: 'Por cada par de unidades, la más barata recibe el % de descuento.'
  },
  nxm: {
    label: 'Promoción NxM (ej: 4x3)',
    help: 'Comprando N unidades pagás M. Siempre se regalan las unidades más baratas.'
  }
};

export const SCOPE_KINDS = {
  all: 'Todo el carrito',
  category: 'Categoría',
  brand: 'Marca',
  size: 'Tamaño / variante'
};

const norm = (s) => String(s ?? '').trim().toLowerCase();
export const normalizeCode = (s) => String(s ?? '').trim().toUpperCase();

// ¿El ítem del carrito entra en el alcance del cupón?
const matchScope = (item, coupon) => {
  const kind = coupon.scopeKind || 'all';
  if (kind === 'all') return true;
  const val = norm(coupon.scopeValue);
  if (!val) return true;
  if (kind === 'category') return norm(item.category) === val;
  if (kind === 'brand') return norm(item.brand) === val;
  if (kind === 'size') return norm(item.size) === val;
  return true;
};

// Expande los ítems que entran en el alcance a una lista de precios unitarios.
const expandUnits = (items, coupon) => {
  const units = [];
  for (const it of items) {
    if (!matchScope(it, coupon)) continue;
    const qty = Math.max(0, Number(it.quantity) || 0);
    for (let i = 0; i < qty; i++) units.push(Number(it.price) || 0);
  }
  return units;
};

const sumScoped = (items, coupon) =>
  items.reduce((s, it) => s + (matchScope(it, coupon) ? (Number(it.price) || 0) * (Number(it.quantity) || 0) : 0), 0);

const round = (n) => Math.round(n);

// Devuelve { valid, discount, reason }.
// - valid: si el cupón aplica al carrito actual.
// - discount: monto a restar (>= 0).
// - reason: explicación cuando no aplica (para mostrar al cliente).
export const computeCoupon = (coupon, items) => {
  const fail = (reason) => ({ valid: false, discount: 0, reason });
  if (!coupon || coupon.active === false) return fail('El cupón no está disponible.');
  if (!Array.isArray(items) || items.length === 0) return fail('El carrito está vacío.');

  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  const percent = Math.max(0, Number(coupon.percent) || 0);
  const amount = Math.max(0, Number(coupon.amount) || 0);
  const minTotal = Math.max(0, Number(coupon.minTotal) || 0);

  let discount = 0;

  switch (coupon.type) {
    case 'percent_total':
      discount = subtotal * percent / 100;
      break;

    case 'percent_min':
      if (subtotal < minTotal)
        return fail(`Válido en compras desde $${minTotal.toLocaleString('es-AR')}.`);
      discount = subtotal * percent / 100;
      break;

    case 'fixed_min':
      if (subtotal < minTotal)
        return fail(`Válido en compras desde $${minTotal.toLocaleString('es-AR')}.`);
      discount = Math.min(amount, subtotal);
      break;

    case 'scope_percent': {
      const scoped = sumScoped(items, coupon);
      if (scoped <= 0) return fail('No hay productos en el carrito que apliquen a este cupón.');
      discount = scoped * percent / 100;
      break;
    }

    case 'second_unit': {
      // Por cada par, la unidad más barata recibe el %.
      const units = expandUnits(items, coupon).sort((a, b) => b - a); // desc
      if (units.length < 2) return fail('Necesitás al menos 2 unidades que apliquen.');
      // En orden descendente, las posiciones impares (1,3,5...) son la
      // más barata de cada par.
      for (let i = 1; i < units.length; i += 2) discount += units[i] * percent / 100;
      break;
    }

    case 'nxm': {
      const n = Math.max(2, Number(coupon.buyQty) || 0);
      const m = Math.max(1, Number(coupon.payQty) || 0);
      if (m >= n) return fail('Configuración de cupón inválida.');
      const freePerGroup = n - m;
      const units = expandUnits(items, coupon).sort((a, b) => a - b); // asc
      if (units.length < n) return fail(`Necesitás al menos ${n} unidades que apliquen.`);
      // Por cada bloque de N (ordenado asc), las primeras (N-M) son las más
      // baratas y van gratis.
      for (let i = 0; i < units.length; i++) {
        if (i % n < freePerGroup) discount += units[i];
      }
      break;
    }

    default:
      return fail('Tipo de cupón no reconocido.');
  }

  discount = Math.min(round(discount), subtotal);
  if (discount <= 0) return fail('Este cupón no genera descuento en el carrito actual.');
  return { valid: true, discount, reason: '' };
};

// Resumen legible de la configuración (para la lista del admin).
export const describeCoupon = (c) => {
  if (!c) return '';
  const money = (n) => `$${(Number(n) || 0).toLocaleString('es-AR')}`;
  const scope = c.scopeKind && c.scopeKind !== 'all'
    ? ` en ${SCOPE_KINDS[c.scopeKind]?.toLowerCase() || c.scopeKind} "${c.scopeValue}"`
    : '';
  switch (c.type) {
    case 'percent_total': return `${c.percent}% sobre el total`;
    case 'percent_min': return `${c.percent}% sobre el total desde ${money(c.minTotal)}`;
    case 'fixed_min': return `${money(c.amount)} de descuento desde ${money(c.minTotal)}`;
    case 'scope_percent': return `${c.percent}% de descuento${scope}`;
    case 'second_unit': return `${c.percent}% en la 2ª unidad de menor valor${scope}`;
    case 'nxm': return `${c.buyQty}x${c.payQty}${scope}`;
    default: return '';
  }
};
