import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetailModal.css';

// Parse Fragrantica-style description to extract perfume notes
const parseNotes = (description) => {
  if (!description) return null;

  const notes = { salida: [], corazon: [], fondo: [] };

  // Matches "Las Notas de Salida son X, Y, Z;" etc.
  const salidaMatch = description.match(/Notas?\s+de\s+Salida\s+(?:son|es)\s+([^;.]+)/i);
  const corazonMatch = description.match(/Notas?\s+de\s+Coraz[oó]n\s+(?:son|es)\s+([^;.]+)/i);
  const fondoMatch = description.match(/Notas?\s+de\s+Fondo\s+(?:son|es)\s+([^;.]+)/i);

  const splitNotes = (str) => str.split(/,|\sy\s/).map(s => s.trim()).filter(Boolean);

  if (salidaMatch) notes.salida = splitNotes(salidaMatch[1]);
  if (corazonMatch) notes.corazon = splitNotes(corazonMatch[1]);
  if (fondoMatch) notes.fondo = splitNotes(fondoMatch[1]);

  if (!notes.salida.length && !notes.corazon.length && !notes.fondo.length) return null;
  return notes;
};

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  const variant = product.variants[selectedVariant];
  const notes = parseNotes(product.description);
  const hasImages = product.images && product.images.length > 0 && !imageError;

  const handleAdd = () => {
    addToCart(product, variant);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <>
      <div className="product-modal__overlay" onClick={onClose} />
      <div className="product-modal" role="dialog" aria-modal="true">
        <button className="product-modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </button>

        <div className="product-modal__top">
          {/* Images */}
          <div className="product-modal__gallery">
            <div className="product-modal__main-image">
              {hasImages ? (
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="product-modal__placeholder">
                  <div className="product-modal__placeholder-icon">🌙</div>
                  <span>{product.name}</span>
                </div>
              )}
            </div>
            {hasImages && product.images.length > 1 && (
              <div className="product-modal__thumbs">
                {product.images.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`product-modal__thumb${i === currentImage ? ' product-modal__thumb--active' : ''}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-modal__info">
            <span className="product-modal__brand">{product.brand}</span>
            <h2 className="product-modal__name">{product.name}</h2>
            <span className="product-modal__category">{product.category}</span>

            <div className="product-modal__price">
              <span className="product-modal__price-currency">$</span>
              <span className="product-modal__price-amount">
                {variant.price.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="product-modal__variants">
              <span className="product-modal__variants-label">Tamaño</span>
              <div className="product-modal__variants-grid">
                {product.variants.map((v, i) => (
                  <button
                    key={v.size}
                    type="button"
                    className={`product-modal__variant${i === selectedVariant ? ' product-modal__variant--active' : ''}`}
                    onClick={() => setSelectedVariant(i)}
                  >
                    <span className="product-modal__variant-size">{v.size}</span>
                    <span className="product-modal__variant-price">${v.price.toLocaleString('es-AR')}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`product-modal__add-btn${isAdding ? ' product-modal__add-btn--added' : ''}`}
              onClick={handleAdd}
              disabled={isAdding}
            >
              {isAdding ? (
                <><Check size={18} /> Agregado al carrito</>
              ) : (
                <><ShoppingBag size={18} /> Agregar a la bolsa</>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-modal__tabs">
          <button
            type="button"
            className={`product-modal__tab${activeTab === 'descripcion' ? ' product-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('descripcion')}
          >
            Descripción
          </button>
          <button
            type="button"
            className={`product-modal__tab${activeTab === 'ingredientes' ? ' product-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('ingredientes')}
          >
            Ingredientes
          </button>
        </div>

        <div className="product-modal__tab-content">
          {activeTab === 'descripcion' && (
            <div className="product-modal__desc">
              {product.description
                ? <p>{product.description}</p>
                : <p className="product-modal__empty">Sin descripción disponible.</p>}
            </div>
          )}

          {activeTab === 'ingredientes' && (
            <div className="product-modal__notes">
              {notes ? (
                <>
                  {notes.salida.length > 0 && (
                    <div className="product-modal__note-group">
                      <h4 className="product-modal__note-title">Notas de Salida</h4>
                      <div className="product-modal__note-chips">
                        {notes.salida.map((n, i) => (
                          <span key={i} className="product-modal__note-chip">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {notes.corazon.length > 0 && (
                    <div className="product-modal__note-group">
                      <h4 className="product-modal__note-title">Notas de Corazón</h4>
                      <div className="product-modal__note-chips">
                        {notes.corazon.map((n, i) => (
                          <span key={i} className="product-modal__note-chip">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {notes.fondo.length > 0 && (
                    <div className="product-modal__note-group">
                      <h4 className="product-modal__note-title">Notas de Fondo</h4>
                      <div className="product-modal__note-chips">
                        {notes.fondo.map((n, i) => (
                          <span key={i} className="product-modal__note-chip">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="product-modal__empty">
                  No hay información de notas olfativas disponible para este perfume.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailModal;
