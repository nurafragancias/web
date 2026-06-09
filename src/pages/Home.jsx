import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useCatalog } from '../context/CatalogContext';
import './Home.css';

const Home = () => {
  const { getFilteredProducts } = useCatalog();
  const [activeCategory, setActiveCategory] = useState('todos');

  const filteredProducts = getFilteredProducts(activeCategory);

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

          <div className="catalog__grid" key={activeCategory}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            ) : (
              <div className="catalog__empty">
                <p>No hay fragancias en esta categoría aún.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
