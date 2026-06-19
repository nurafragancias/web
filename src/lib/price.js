// Precios con descuento (promociones).
// Un producto está "en promo" si tiene el tilde on_sale y un descuento > 0.

export const isOnPromo = (product) =>
  !!product?.on_sale && Number(product?.discount) > 0;

export const discountedPrice = (price, product) =>
  isOnPromo(product)
    ? Math.round(Number(price) * (1 - Number(product.discount) / 100))
    : Number(price);
