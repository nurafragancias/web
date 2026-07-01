import { describe, it, expect } from 'vitest';
import { parseMl, variantAffectsStock, visibleVariants } from '../stock.js';

describe('parseMl', () => {
  it('extrae ml de strings comunes', () => {
    expect(parseMl('100ml')).toBe(100);
    expect(parseMl('5ml')).toBe(5);
    expect(parseMl('120 ml')).toBe(120);
  });

  it('vuelve 0 si no hay numero', () => {
    expect(parseMl('probador')).toBe(0);
    expect(parseMl('')).toBe(0);
    expect(parseMl(undefined)).toBe(0);
  });
});

describe('variantAffectsStock', () => {
  it('respeta el flag explicito cuando esta seteado', () => {
    expect(variantAffectsStock({ size: '5ml', affectsStock: true })).toBe(true);
    expect(variantAffectsStock({ size: '100ml', affectsStock: false })).toBe(false);
  });

  it('sin flag: infiere por tamaño (>=30ml es frasco)', () => {
    expect(variantAffectsStock({ size: '100ml' })).toBe(true);
    expect(variantAffectsStock({ size: '30ml' })).toBe(true);
    expect(variantAffectsStock({ size: '5ml' })).toBe(false);
    expect(variantAffectsStock({ size: '10ml' })).toBe(false);
  });

  it('tolera variante null/undefined', () => {
    expect(variantAffectsStock(null)).toBe(false);
    expect(variantAffectsStock(undefined)).toBe(false);
  });
});

describe('visibleVariants — filtro del catalogo publico', () => {
  it('con stock > 0 muestra todas las variantes activas', () => {
    const product = {
      stock: 3,
      variants: [
        { size: '5ml', affectsStock: false, active: true },
        { size: '100ml', affectsStock: true, active: true }
      ]
    };
    expect(visibleVariants(product)).toHaveLength(2);
  });

  it('regresión: stock=0 oculta la variante "frasco" aunque active=true', () => {
    // Bug histórico: productos con stock 0 seguían mostrando la opción 100ml
    // porque el filtro solo miraba v.active, y la variante quedó active=true
    // en DB. Este test lo previene.
    const product = {
      stock: 0,
      variants: [
        { size: '5ml', affectsStock: false, active: true },
        { size: '100ml', affectsStock: true, active: true }
      ]
    };
    const visible = visibleVariants(product);
    expect(visible).toHaveLength(1);
    expect(visible[0].size).toBe('5ml');
  });

  it('nunca muestra variantes marcadas como active=false', () => {
    const product = {
      stock: 5,
      variants: [
        { size: '5ml', active: false },
        { size: '100ml', affectsStock: true, active: true }
      ]
    };
    const visible = visibleVariants(product);
    expect(visible).toHaveLength(1);
    expect(visible[0].size).toBe('100ml');
  });

  it('cuando stock=0 y todas las variantes son "frasco", vuelve vacío', () => {
    const product = {
      stock: 0,
      variants: [{ size: '100ml', affectsStock: true, active: true }]
    };
    expect(visibleVariants(product)).toHaveLength(0);
  });

  it('tolera producto sin variants (no crashea)', () => {
    expect(visibleVariants(null)).toEqual([]);
    expect(visibleVariants({ stock: 3 })).toEqual([]);
    expect(visibleVariants({ stock: 3, variants: null })).toEqual([]);
  });
});
