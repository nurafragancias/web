import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useCatalog } from '../context/CatalogContext';
import './Home.css';

const Home = () => {
  const { getFilteredProducts } = useCatalog();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBrand = searchParams.get('marca') || null;

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

      <section className="catalog" id="catalogo">
        <div className="catalog__container">
          <div className="catalog__header animate-fade-in-up">
            <span className="catalog__label">Colección Exclusiva</span>
            <h2 className="catalog__title">Nuestras Fragancias</h2>
            <p className="catalog__subtitle">
              Cada perfume cuenta una historia. Encontrá la tuya.
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
    </>
  );
};

export default Home;
