import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { productSlug, findProductBySlug, productShareUrl } from '../productSlug.js';

describe('productSlug', () => {
  it('genera slug kebab-case de marca + nombre', () => {
    expect(productSlug({ brand: 'LATTAFA', name: 'Khamrah EDP 100ML' }))
      .toBe('lattafa-khamrah-edp-100ml');
  });

  it('normaliza tildes españolas para que el link no se rompa', () => {
    expect(productSlug({ brand: 'MISSHA', name: 'Corazón' })).toBe('missha-corazon');
    expect(productSlug({ brand: 'ARMANI', name: 'Acqua di Gío' })).toBe('armani-acqua-di-gio');
    expect(productSlug({ brand: 'PARIS', name: 'Séduction' })).toBe('paris-seduction');
  });

  it('tolera espacios extra, ampersands y otros símbolos', () => {
    expect(productSlug({ brand: '  ARMAF  ', name: 'Club de Nuit & More!' }))
      .toBe('armaf-club-de-nuit-more');
  });

  it('vuelve string vacío para producto null/undefined', () => {
    expect(productSlug(null)).toBe('');
    expect(productSlug(undefined)).toBe('');
  });

  it('tolera marca o nombre vacío', () => {
    expect(productSlug({ brand: '', name: 'Solo Nombre' })).toBe('solo-nombre');
    expect(productSlug({ brand: 'Solo Marca', name: '' })).toBe('solo-marca');
  });
});

describe('findProductBySlug', () => {
  const products = [
    { brand: 'LATTAFA', name: 'Khamrah EDP 100ML' },
    { brand: 'AFNAN', name: '9 AM DIVE EDP 100ML' },
    { brand: 'ARMAF', name: 'Club de Nuit Intense Man EDT 105ML' }
  ];

  it('devuelve el producto correcto por slug', () => {
    const p = findProductBySlug(products, 'lattafa-khamrah-edp-100ml');
    expect(p).toBeTruthy();
    expect(p.name).toBe('Khamrah EDP 100ML');
  });

  it('es case-insensitive con el slug de entrada', () => {
    const p = findProductBySlug(products, 'LATTAFA-KHAMRAH-EDP-100ML');
    expect(p?.name).toBe('Khamrah EDP 100ML');
  });

  it('devuelve null para slug inexistente (no rompe)', () => {
    expect(findProductBySlug(products, 'no-existe')).toBeNull();
  });

  it('devuelve null para slug vacío o nulo', () => {
    expect(findProductBySlug(products, null)).toBeNull();
    expect(findProductBySlug(products, '')).toBeNull();
    expect(findProductBySlug(products, undefined)).toBeNull();
  });
});

describe('productShareUrl', () => {
  // Mockeamos window.location.origin (vitest corre en node por defecto).
  beforeAll(() => {
    vi.stubGlobal('window', { location: { origin: 'https://nurafragancias.com' } });
  });
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('arma URL con origin + ?p=slug', () => {
    const url = productShareUrl({ brand: 'LATTAFA', name: 'Khamrah EDP 100ML' });
    expect(url).toBe('https://nurafragancias.com/?p=lattafa-khamrah-edp-100ml');
  });

  it('vuelve vacío para producto null', () => {
    expect(productShareUrl(null)).toBe('');
  });
});
