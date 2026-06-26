import React, { useMemo, useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, Loader, CheckCircle2 } from 'lucide-react';
import { useCatalog, uploadProductImage } from '../context/CatalogContext';
import { useSettings } from '../context/SettingsContext';
import './AdminBrandLogos.css';

// Mismo diccionario hardcoded que usa BrandsCarousel para sus defaults.
// Lo replicamos acá para que el admin pueda mostrar qué marcas ya vienen con
// logo por defecto y cuáles requieren subir uno.
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

const AdminBrandLogos = () => {
  const { products } = useCatalog();
  const { getJsonSetting, setSetting } = useSettings();
  const [uploadingBrand, setUploadingBrand] = useState(null);
  const [error, setError] = useState('');
  const [savedFor, setSavedFor] = useState('');
  const fileInputs = useRef({});

  const customLogos = getJsonSetting('brand_logos', {});

  // Marcas únicas del catálogo, ordenadas. Mostramos todas (no sólo las
  // visibles al público) para que el admin pueda gestionar logos aunque la
  // marca esté desactivada temporalmente.
  const brands = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      const b = (p.brand || '').trim().toUpperCase();
      if (b) set.add(b);
    });
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }, [products]);

  const handleUpload = async (brand, file) => {
    if (!file) return;
    setError('');
    setUploadingBrand(brand);
    try {
      const url = await uploadProductImage(file);
      const next = { ...customLogos, [brand]: url };
      await setSetting('brand_logos', next);
      setSavedFor(brand);
      setTimeout(() => setSavedFor(''), 2500);
    } catch (err) {
      setError(`No se pudo subir el logo de ${brand}: ${err?.message || 'error desconocido'}`);
    } finally {
      setUploadingBrand(null);
      // Reset input para poder volver a elegir el mismo archivo
      if (fileInputs.current[brand]) fileInputs.current[brand].value = '';
    }
  };

  const handleRemoveCustom = async (brand) => {
    setError('');
    try {
      const next = { ...customLogos };
      delete next[brand];
      await setSetting('brand_logos', next);
    } catch (err) {
      setError(`No se pudo quitar el logo de ${brand}: ${err?.message || 'error desconocido'}`);
    }
  };

  const getLogoFor = (brand) => customLogos[brand] || DEFAULT_BRAND_LOGOS[brand] || null;
  const hasCustom = (brand) => Boolean(customLogos[brand]);

  return (
    <div className="admin-brand-logos">
      <div className="admin-brand-logos__head">
        <ImageIcon size={20} />
        <div>
          <h4>Logos de marcas</h4>
          <p>
            Subí el logo de cada marca para que aparezca en el carrusel del Home.
            Las marcas sin logo no aparecen en el carrusel. Los logos custom que
            subas pisan al logo por defecto (si la marca tenía uno).
          </p>
        </div>
      </div>

      {error && <div className="admin-brand-logos__error">{error}</div>}

      <div className="admin-brand-logos__grid">
        {brands.map(brand => {
          const logo = getLogoFor(brand);
          const isUploading = uploadingBrand === brand;
          const justSaved = savedFor === brand;
          return (
            <div
              key={brand}
              className={`admin-brand-logos__card${!logo ? ' admin-brand-logos__card--empty' : ''}`}
            >
              <div className="admin-brand-logos__preview">
                {logo ? (
                  <img src={logo} alt={brand} loading="lazy" />
                ) : (
                  <span className="admin-brand-logos__no-logo">Sin logo</span>
                )}
              </div>
              <div className="admin-brand-logos__info">
                <span className="admin-brand-logos__brand">{brand}</span>
                <div className="admin-brand-logos__actions">
                  <label className="admin-brand-logos__upload">
                    {isUploading ? (
                      <>
                        <Loader size={14} className="admin-brand-logos__spin" />
                        <span>Subiendo…</span>
                      </>
                    ) : justSaved ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Guardado</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>{logo ? 'Cambiar' : 'Subir logo'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      hidden
                      ref={el => { fileInputs.current[brand] = el; }}
                      onChange={e => handleUpload(brand, e.target.files?.[0])}
                      disabled={isUploading}
                    />
                  </label>
                  {hasCustom(brand) && (
                    <button
                      type="button"
                      className="admin-brand-logos__remove"
                      onClick={() => handleRemoveCustom(brand)}
                      title="Quitar logo custom (vuelve al logo por defecto si tiene)"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBrandLogos;
