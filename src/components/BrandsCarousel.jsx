import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useSettings } from '../context/SettingsContext';
import './BrandsCarousel.css';

// Logos por defecto, empaquetados con la app en /public/brands/.
// El admin puede agregar/sobrescribir logos via Ajustes (se guardan en
// site_settings.brand_logos y pisan a estos por defecto).
const DEFAULT_BRAND_LOGOS = {
  'AFNAN': '/brands/afnan.jpg',
  'AL WATANIAH': '/brands/al-wataniah.jpg',
  'ARMAF': '/brands/armaf.jpg',
  'ARMANI': '/brands/armani.png',
  'BHARARA': '/brands/bharara.jpg',
  'JEAN PAUL GAULTIER': '/brands/jean-paul-gaultier.png',
  'LATTAFA': '/brands/lattafa.jpg',
  'MAISON ALHAMBRA': '/brands/maison-alhambra.jpg',
  'NAUTICA': '/brands/nautica.png',
  'RABANNE': '/brands/rabanne.jpg',
  'RASASI': '/brands/rasasi.jpg',
  'VALENTINO': '/brands/valentino.jpg',
  'VERSACE': '/brands/versace.png'
};

const BrandsCarousel = () => {
  const { publicProducts } = useCatalog();
  const { getJsonSetting } = useSettings();
  const navigate = useNavigate();

  // Logos custom subidos desde el admin (claves en MAYÚSCULAS).
  const customLogos = getJsonSetting('brand_logos', {});

  // Marcas únicas del catálogo público con logo disponible (default o custom).
  const brandsWithLogo = useMemo(() => {
    const brands = new Set();
    publicProducts.forEach(p => {
      const b = (p.brand || '').trim().toUpperCase();
      if (b) brands.add(b);
    });
    const merged = { ...DEFAULT_BRAND_LOGOS, ...customLogos };
    return Array.from(brands)
      .filter(b => merged[b])
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
      .map(b => ({ name: b, logo: merged[b] }));
  }, [publicProducts, customLogos]);

  if (brandsWithLogo.length === 0) return null;

  // Duplicamos la lista para que el scroll infinito no tenga "salto".
  const loop = [...brandsWithLogo, ...brandsWithLogo];

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
        {loop.map((b, i) => (
          <button
            type="button"
            key={`${b.name}-${i}`}
            className="brands-carousel__item"
            onClick={() => handleSelect(b.name)}
            title={`Ver fragancias de ${b.name}`}
            aria-label={`Filtrar por ${b.name}`}
          >
            <img src={b.logo} alt={b.name} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrandsCarousel;
