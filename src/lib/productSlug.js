// Convierte "Lattafa Khamrah EDP 100ml" → "lattafa-khamrah-edp-100ml".
// Usado para deep-links del estilo /?p=lattafa-khamrah-edp-100ml — el cliente
// abre el modal del perfume directo desde una historia de Instagram, etc.
export const productSlug = (product) => {
  if (!product) return '';
  const base = `${product.brand || ''} ${product.name || ''}`.trim();
  return base
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const findProductBySlug = (products, slug) => {
  if (!slug) return null;
  const target = String(slug).toLowerCase();
  return products.find(p => productSlug(p) === target) || null;
};

export const productShareUrl = (product) => {
  const slug = productSlug(product);
  if (!slug) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/?p=${slug}`;
};
