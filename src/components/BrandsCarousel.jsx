import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import './BrandsCarousel.css';

// Marcas con logo descargado (en /public/brands/). Si una marca del catálogo
// no figura acá, se muestra como texto estilizado (fallback) — así seguimos
// mostrándola en el carrusel aunque aún no tenga logo.
const BRAND_LOGOS = {
  'AFNAN': '/brands/afnan.jpg',
  'AL WATANIAH': '/brands/al-wataniah.jpg',
  'ARMAF': '/brands/armaf.jpg',
  'ARMANI': '/brands/armani.png',
  'JEAN PAUL GAULTIER': '/brands/jean-paul-gaultier.png',
  'LATTAFA': '/brands/lattafa.jpg',
  'NAUTICA': '/brands/nautica.png',
  'RABANNE': '/brands/rabanne.jpg',
  'RASASI': '/brands/rasasi.jpg',
  'VALENTINO': '/brands/valentino.jpg',
  'VERSACE': '/brands/versace.png'
};

const BrandsCarousel = () => {
  const { publicProducts } = useCatalog();
  const navigate = useNavigate();

  // Marcas únicas del catálogo público, ordenadas alfabéticamente.
  const brands = useMemo(() => {
    const set = new Set();
    publicProducts.forEach(p => {
      const b = (p.brand || '').trim().toUpperCase();
      if (b) set.add(b);
    });
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }, [publicProducts]);

  if (brands.length === 0) return null;

  // Duplicamos la lista para que el scroll infinito no tenga "salto".
  const loop = [...brands, ...brands];

  const handleSelect = (brand) => {
    navigate({
      pathname: '/',
      search: `?marca=${encodeURIComponent(brand)}`,
      hash: '#catalogo'
    });
  };

  return (
    <section className="brands-carousel" aria-label="Marcas disponibles">
      <div className="brands-carousel__track">
        {loop.map((brand, i) => {
          const logo = BRAND_LOGOS[brand];
          return (
            <button
              type="button"
              key={`${brand}-${i}`}
              className={`brands-carousel__item${logo ? '' : ' brands-carousel__item--text'}`}
              onClick={() => handleSelect(brand)}
              title={`Ver fragancias de ${brand}`}
              aria-label={`Filtrar por ${brand}`}
            >
              {logo ? (
                <img src={logo} alt={brand} loading="lazy" decoding="async" />
              ) : (
                <span>{brand}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default BrandsCarousel;
