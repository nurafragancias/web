import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import BrandsCarousel from '../components/BrandsCarousel';
import ProductDetailModal from '../components/ProductDetailModal';
import { useCatalog } from '../context/CatalogContext';
import { findProductBySlug } from '../lib/productSlug';
import './Home.css';

const VALID_CATEGORIES = ['todos', 'masculino', 'femenino', 'unisex', 'combos'];

const Home = () => {
  const { getFilteredProducts, publicProducts } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBrand = searchParams.get('marca') || null;
  const categoryFromUrl = searchParams.get('categoria');
  const productSlugFromUrl = searchParams.get('p');
  const initialCategory = VALID_CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : 'todos';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Deep-link a un producto: /?p=lattafa-khamrah-edp-100ml abre el modal del
  // perfume directo (para usar como link en historias de Instagram, etc).
  const deepLinkedProduct = useMemo(
    () => findProductBySlug(publicProducts, productSlugFromUrl),
    [publicProducts, productSlugFromUrl]
  );

  const closeDeepLink = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('p');
    setSearchParams(next, { replace: true });
  };

  // Si el cliente entra con ?categoria=combos (ej. desde el navbar),
  // sincronizamos el filtro y hacemos scroll al catálogo.
  useEffect(() => {
    if (VALID_CATEGORIES.includes(categoryFromUrl) && categoryFromUrl !== activeCategory) {
      setActiveCategory(categoryFromUrl);
      const el = document.getElementById('catalogo');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl]);

  let filteredProducts = getFilteredProducts(activeCategory);
  if (activeBrand) {
    filteredProducts = filteredProducts.filter(
      p => (p.brand || '').trim() === activeBrand
    );
  }

  // Scroll to the catalog when a brand filter is applied from the navbar
  useEffect(() => {
    if (activeBrand) {
      const el = document.getElementById('catalogo');
      if (el) {
        // Let the layout settle, then scroll
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      }
    }
  }, [activeBrand]);

  const clearBrand = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('marca');
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <Hero />

      <BrandsCarousel />

      <section className="catalog" id="catalogo">
        <div className="catalog__container">
          <div className="catalog__header animate-fade-in-up">
            <span className="catalog__label">Colección Exclusiva</span>
            <h2 className="catalog__title">Nuestras Fragancias</h2>
            <p className="catalog__subtitle">
              Cada perfume cuenta una historia.<br />Encontrá la tuya.
            </p>
          </div>

          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

          {activeBrand && (
            <div className="catalog__brand-filter">
              <span className="catalog__brand-filter-label">Marca:</span>
              <button
                type="button"
                className="catalog__brand-chip"
                onClick={clearBrand}
                title="Quitar filtro de marca"
              >
                {activeBrand}
                <X size={14} />
              </button>
            </div>
          )}

          <div className="catalog__grid" key={`${activeCategory}-${activeBrand || 'all'}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            ) : (
              <div className="catalog__empty">
                <p>
                  {activeBrand
                    ? `No hay fragancias de ${activeBrand} en esta categoría.`
                    : 'No hay fragancias en esta categoría aún.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {deepLinkedProduct && (
        <ProductDetailModal
          product={deepLinkedProduct}
          onClose={closeDeepLink}
        />
      )}
    </>
  );
};

export default Home;
