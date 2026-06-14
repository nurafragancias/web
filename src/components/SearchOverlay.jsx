import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import ProductDetailModal from './ProductDetailModal';
import './SearchOverlay.css';

// Normalize: lowercase + remove accents
const normalize = (str) => (str || '')
  .toString()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '');

const matchesProduct = (product, terms) => {
  // Build a single haystack from all searchable fields
  const haystack = normalize([
    product.name,
    product.brand,
    product.description,
    product.category
  ].filter(Boolean).join(' '));

  // All terms must be present (AND search)
  return terms.every(term => haystack.includes(term));
};

const SearchOverlay = ({ open, onClose }) => {
  const { products } = useCatalog();
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const inputRef = useRef(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (!open) setQuery('');
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const terms = normalize(trimmed).split(/\s+/).filter(Boolean);
    return products.filter(p => matchesProduct(p, terms)).slice(0, 30);
  }, [query, products]);

  if (!open) return null;

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="search-overlay__backdrop" onClick={onClose} />
      <div className="search-overlay" role="dialog" aria-modal="true">
        <div className="search-overlay__header">
          <Search size={22} className="search-overlay__icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar perfumes por nombre, marca o nota..."
            className="search-overlay__input"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="search-overlay__close"
            aria-label="Cerrar búsqueda"
          >
            <X size={22} />
          </button>
        </div>

        <div className="search-overlay__results">
          {query.trim() === '' ? null : results.length === 0 ? (
            <div className="search-overlay__empty">
              <p>No encontramos perfumes para <strong>"{query}"</strong></p>
              <p className="search-overlay__empty-hint">Intentá con otras palabras clave o probá con la marca.</p>
            </div>
          ) : (
            <>
              <div className="search-overlay__count">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </div>
              <div className="search-overlay__grid">
                {results.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    className="search-result"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="search-result__image">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="search-result__placeholder">🌙</div>
                      )}
                    </div>
                    <div className="search-result__info">
                      <span className="search-result__brand">{product.brand}</span>
                      <span className="search-result__name">{product.name}</span>
                      <span className="search-result__price">
                        ${product.variants[0]?.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <span className={`search-result__cat search-result__cat--${product.category}`}>
                      {product.category}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default SearchOverlay;
