import { describe, it, expect } from 'vitest';
import { computeCoupon, normalizeCode } from '../coupons.js';

const item = (over = {}) => ({
  price: 10000, quantity: 1, category: 'masculino', brand: 'AFNAN', size: '100ml', ...over
});

describe('normalizeCode', () => {
  it('trim + upper', () => {
    expect(normalizeCode('  descuento10  ')).toBe('DESCUENTO10');
  });
});

describe('computeCoupon — validaciones básicas', () => {
  it('cupón inactivo → no aplica', () => {
    const r = computeCoupon({ type: 'percent_total', percent: 10, active: false }, [item()]);
    expect(r.valid).toBe(false);
  });
  it('carrito vacío → no aplica', () => {
    const r = computeCoupon({ type: 'percent_total', percent: 10 }, []);
    expect(r.valid).toBe(false);
  });
  it('tipo desconocido → no aplica', () => {
    const r = computeCoupon({ type: 'no-existe', percent: 10 }, [item()]);
    expect(r.valid).toBe(false);
  });
});

describe('percent_total', () => {
  it('descuenta % sobre el total', () => {
    const r = computeCoupon({ type: 'percent_total', percent: 10 }, [item(), item()]);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(2000); // 20000 * 10%
  });
});

describe('percent_min', () => {
  it('bloquea si no llega al minimo', () => {
    const r = computeCoupon({ type: 'percent_min', percent: 20, minTotal: 30000 }, [item()]);
    expect(r.valid).toBe(false);
  });
  it('aplica cuando pasa el minimo', () => {
    const r = computeCoupon({ type: 'percent_min', percent: 20, minTotal: 15000 }, [item(), item()]);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(4000);
  });
});

describe('fixed_min', () => {
  it('bloquea si no llega al minimo', () => {
    const r = computeCoupon({ type: 'fixed_min', amount: 3000, minTotal: 30000 }, [item()]);
    expect(r.valid).toBe(false);
  });
  it('descuenta el monto fijo cuando aplica', () => {
    const r = computeCoupon({ type: 'fixed_min', amount: 3000, minTotal: 15000 }, [item(), item()]);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(3000);
  });
  it('nunca descuenta mas que el subtotal', () => {
    const r = computeCoupon({ type: 'fixed_min', amount: 999999, minTotal: 0 }, [item({ price: 5000 })]);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(5000);
  });
});

describe('scope_percent', () => {
  it('descuenta solo sobre lo que matchea el scope', () => {
    const items = [
      item({ brand: 'AFNAN', price: 10000 }),
      item({ brand: 'ARMANI', price: 20000 })
    ];
    const r = computeCoupon({ type: 'scope_percent', percent: 50, scopeKind: 'brand', scopeValue: 'AFNAN' }, items);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(5000); // 50% de 10000
  });
  it('rechaza si no hay items en el scope', () => {
    const r = computeCoupon({ type: 'scope_percent', percent: 50, scopeKind: 'brand', scopeValue: 'NOEXISTE' }, [item()]);
    expect(r.valid).toBe(false);
  });
});

describe('second_unit — 2da unidad al X%', () => {
  it('con 2 unidades iguales aplica el % a una', () => {
    const r = computeCoupon({ type: 'second_unit', percent: 50 }, [item({ quantity: 2 })]);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(5000); // la más barata (10000) al 50%
  });
  it('con 1 unidad rechaza', () => {
    const r = computeCoupon({ type: 'second_unit', percent: 50 }, [item()]);
    expect(r.valid).toBe(false);
  });
  it('con precios distintos, la unidad más barata recibe el %', () => {
    const items = [item({ price: 20000, quantity: 1 }), item({ price: 5000, quantity: 1 })];
    const r = computeCoupon({ type: 'second_unit', percent: 50 }, items);
    expect(r.discount).toBe(2500); // 50% de la mas barata (5000)
  });
});

describe('nxm — promo NxM (ej 3x2, 4x3)', () => {
  it('3x2 con 3 unidades regala la más barata', () => {
    const items = [
      item({ price: 5000, quantity: 1 }),
      item({ price: 10000, quantity: 1 }),
      item({ price: 15000, quantity: 1 })
    ];
    const r = computeCoupon({ type: 'nxm', buyQty: 3, payQty: 2 }, items);
    expect(r.valid).toBe(true);
    expect(r.discount).toBe(5000);
  });
  it('con menos unidades que N rechaza', () => {
    const r = computeCoupon({ type: 'nxm', buyQty: 3, payQty: 2 }, [item(), item()]);
    expect(r.valid).toBe(false);
  });
  it('config inválida (payQty >= buyQty) rechaza', () => {
    const r = computeCoupon({ type: 'nxm', buyQty: 2, payQty: 2 }, [item({ quantity: 5 })]);
    expect(r.valid).toBe(false);
  });
  it('con 6 unidades en 3x2 regala 2 (las 2 más baratas)', () => {
    const items = [item({ price: 1000, quantity: 6 })];
    const r = computeCoupon({ type: 'nxm', buyQty: 3, payQty: 2 }, items);
    expect(r.discount).toBe(2000); // 2 regaladas × 1000
  });
});

describe('regresión — bugs históricos que ya arreglamos', () => {
  it('un cupón con descuento 0 (no genera beneficio real) no debería aplicar como "válido"', () => {
    const r = computeCoupon({ type: 'percent_total', percent: 0 }, [item()]);
    expect(r.valid).toBe(false);
  });
});
