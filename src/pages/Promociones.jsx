import React from 'react';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../context/CatalogContext';
import { isOnPromo } from '../lib/price';
import './Home.css';
import './Promociones.css';

const Promociones = () => {
  const { publicProducts } = useCatalog();
  const promos = publicProducts.filter(isOnPromo);

  return (
    <section className="catalog promos-page" id="promociones">
      <div className="catalog__container">
        <div className="catalog__header animate-fade-in-up">
          <span className="catalog__label">Ofertas</span>
          <h2 className="catalog__title">Promociones</h2>
          <p className="catalog__subtitle">
            Aprovechá los descuentos vigentes — perfumes y decants en oferta.
          </p>
        </div>

        <div className="catalog__grid">
          {promos.length > 0 ? (
            promos.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          ) : (
            <div className="catalog__empty">
              <p>No hay promociones activas en este momento. ¡Volvé pronto! ✨</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Promociones;
