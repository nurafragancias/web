import { describe, it, expect } from 'vitest';
import { isOnPromo, discountedPrice } from '../price.js';

describe('isOnPromo', () => {
  it('true si on_sale=true y discount>0', () => {
    expect(isOnPromo({ on_sale: true, discount: 20 })).toBe(true);
  });

  it('false si on_sale=false, aunque tenga discount', () => {
    expect(isOnPromo({ on_sale: false, discount: 20 })).toBe(false);
  });

  it('false si discount=0', () => {
    expect(isOnPromo({ on_sale: true, discount: 0 })).toBe(false);
  });

  it('tolera producto null/undefined sin romper', () => {
    expect(isOnPromo(null)).toBe(false);
    expect(isOnPromo(undefined)).toBe(false);
  });
});

describe('discountedPrice', () => {
  it('aplica descuento y redondea', () => {
    expect(discountedPrice(10000, { on_sale: true, discount: 20 })).toBe(8000);
    expect(discountedPrice(8200, { on_sale: true, discount: 20 })).toBe(6560);
  });

  it('deja el precio intacto si no hay promo', () => {
    expect(discountedPrice(10000, { on_sale: false, discount: 20 })).toBe(10000);
    expect(discountedPrice(10000, { on_sale: true, discount: 0 })).toBe(10000);
  });

  it('convierte strings a numero', () => {
    expect(discountedPrice('5000', { on_sale: true, discount: 10 })).toBe(4500);
  });
});
