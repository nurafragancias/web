import React, { useState, useRef } from 'react';
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
  const [slideDir, setSlideDir] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const hasMultipleImages = product.images && product.images.length > 1;

  // En la tarjeta se muestra UNA sola imagen a la vez (la que apunta
  // currentImage). Se puede DESLIZAR sobre ella (mobile) o usar flechas/dots
  // (desktop). A propósito NO renderizamos todas las imágenes en un track:
  // eso metía hasta 3 imágenes por tarjeta en el DOM (140+ en total) y, con
  // fotos grandes, Safari en iPhone se quedaba sin memoria y recargaba la
  // página. Al deslizar sólo cambiamos el src de la única imagen, así la
  // memoria queda acotada. La galería completa sigue en el modal del producto.
  const go = (dir) => {
    const len = product.images.length;
    setSlideDir(dir > 0 ? 'next' : 'prev');
    setCurrentImage(c => ((c + dir) % len + len) % len);
  };
  const showImage = (i) => {
    setSlideDir(i > currentImage ? 'next' : 'prev');
    setCurrentImage(((i % product.images.length) + product.images.length) % product.images.length);
  };

  // Swipe táctil: detectamos un deslizamiento horizontal sobre la imagen.
  // No hacemos preventDefault, así el scroll vertical de la página sigue
  // funcionando normal. swipedRef evita que el "tap" que sigue al swipe
  // abra el modal.
  const touchRef = useRef({ x: 0, y: 0 });
  const swipedRef = useRef(false);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!hasMultipleImages) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swipedRef.current = true;
      go(dx < 0 ? 1 : -1);
      setTimeout(() => { swipedRef.current = false; }, 350);
    }
  };

  const openDetail = () => {
    if (swipedRef.current) { swipedRef.current = false; return; }
    setShowDetail(true);
  };

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
        onClick={openDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setShowDetail(true); }}
      >
        <div
          className="product-card__image-wrap"
          onTouchStart={hasMultipleImages ? onTouchStart : undefined}
          onTouchEnd={hasMultipleImages ? onTouchEnd : undefined}
        >
          {product.images && product.images.length > 0 && !imageError ? (
            <>
              <img
                key={currentImage}
                src={product.images[currentImage]}
                alt={product.name}
                className={`product-card__image${slideDir ? ' product-card__image--' + slideDir : ''}`}
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
                draggable={false}
              />
              {hasMultipleImages && (
                <>
                  <button
                    className="product-card__img-nav product-card__img-nav--prev"
                    onClick={(e) => { e.stopPropagation(); go(-1); }}
                    aria-label="Imagen anterior"
                  >&#8249;</button>
                  <button
                    className="product-card__img-nav product-card__img-nav--next"
                    onClick={(e) => { e.stopPropagation(); go(1); }}
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
