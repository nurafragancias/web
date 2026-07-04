import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { isOnPromo, discountedPrice } from '../lib/price';
import ProductDetailModal from './ProductDetailModal';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  const hasMultipleImages = product.images && product.images.length > 1;

  // En la tarjeta se muestra UNA sola imagen a la vez (la que apunta
  // currentImage) y se cambia con las flechas/dots. Antes se renderizaban
  // TODAS las imágenes del producto en un track para swipear, pero eso metía
  // hasta 3 imágenes por tarjeta en el DOM (140+ en total); en iPhone, con
  // fotos grandes, Safari se quedaba sin memoria y recargaba la página. La
  // galería completa con swipe sigue estando en el modal del producto.
  const showImage = (i) =>
    setCurrentImage(((i % product.images.length) + product.images.length) % product.images.length);

  const variant = product.variants[selectedVariant];

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, variant);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const placeholderGradients = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #1a1a1a 0%, #2d1b3d 50%, #1a1a2e 100%)',
    'linear-gradient(135deg, #1a1a1a 0%, #1b2d1b 50%, #0a0a0a 100%)',
    'linear-gradient(135deg, #2d1b1b 0%, #1a1a1a 50%, #1b1b2d 100%)',
    'linear-gradient(135deg, #1b2d2d 0%, #1a1a2e 50%, #2d1b2d 100%)',
    'linear-gradient(135deg, #2d2d1b 0%, #1a1a1a 50%, #1b2d1b 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #2d1b1b 50%, #1a2e1a 100%)',
    'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #2d1b3d 100%)',
  ];

  return (
    <>
      <div
        className="product-card"
        // Escalonamos SOLO las primeras tarjetas (entrada linda del primer
        // pantallazo) y con un tope bajo. Antes era index*0.1s: la tarjeta 40
        // (la mitad del catalogo) quedaba invisible 4s y la 80 hasta 8s, asi
        // que al scrollear hacia el medio "aparecian" tarde y parecia que la
        // web se recargaba. Con tope 0.5s, ya estan todas visibles al llegar.
        style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}
        onClick={() => setShowDetail(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setShowDetail(true); }}
      >
        <div className="product-card__image-wrap">
          {product.images && product.images.length > 0 && !imageError ? (
            <>
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="product-card__image"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
                draggable={false}
              />
              {hasMultipleImages && (
                <>
                  <button
                    className="product-card__img-nav product-card__img-nav--prev"
                    onClick={(e) => { e.stopPropagation(); showImage(currentImage - 1); }}
                    aria-label="Imagen anterior"
                  >&#8249;</button>
                  <button
                    className="product-card__img-nav product-card__img-nav--next"
                    onClick={(e) => { e.stopPropagation(); showImage(currentImage + 1); }}
                    aria-label="Imagen siguiente"
                  >&#8250;</button>
                  <div className="product-card__img-dots">
                    {product.images.map((_, i) => (
                      <span
                        key={i}
                        className={`product-card__img-dot${i === currentImage ? ' product-card__img-dot--active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); showImage(i); }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div
              className="product-card__placeholder"
              style={{ background: placeholderGradients[index % placeholderGradients.length] }}
            >
              <div className="product-card__placeholder-icon">🌙</div>
              <span className="product-card__placeholder-text">{product.name}</span>
            </div>
          )}
          <div className="product-card__image-overlay"></div>
          <span className="product-card__category-tag">{product.category}</span>
          {isOnPromo(product) && (
            <span className="product-card__promo-badge">-{product.discount}%</span>
          )}
        </div>

        <div className="product-card__body">
          <div className="product-card__header">
            <span className="product-card__brand">{product.brand}</span>
            <h3 className="product-card__name">{product.name}</h3>
          </div>

          <div className="product-card__variants">
            {product.variants.map((v, i) => (
              <button
                key={v.size}
                className={`product-card__variant ${i === selectedVariant ? 'product-card__variant--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelectedVariant(i); }}
              >
                {v.size}
              </button>
            ))}
          </div>

          <div className="product-card__footer">
            {isOnPromo(product) ? (
              <div className="product-card__price product-card__price--promo">
                <span className="product-card__price-old">${variant.price.toLocaleString('es-AR')}</span>
                <span className="product-card__price-amount">
                  <span className="product-card__price-currency">$</span>
                  {discountedPrice(variant.price, product).toLocaleString('es-AR')}
                </span>
              </div>
            ) : (
              <div className="product-card__price">
                <span className="product-card__price-currency">$</span>
                <span className="product-card__price-amount">
                  {variant.price.toLocaleString('es-AR')}
                </span>
              </div>
            )}

            <button
              className={`product-card__add-btn ${isAdding ? 'product-card__add-btn--added' : ''}`}
              onClick={handleAdd}
              disabled={isAdding}
              id={`add-to-cart-${product.id}`}
            >
              {isAdding ? (
                <>
                  <Check size={16} />
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Agregar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showDetail && (
        <ProductDetailModal
          product={product}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
