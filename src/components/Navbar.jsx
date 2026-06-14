import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCatalog } from '../context/CatalogContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { products } = useCatalog();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const brandsRef = useRef(null);

  // Unique brands, alphabetically sorted — derived from the catalog so it
  // updates automatically whenever new brands are added.
  const brands = useMemo(() => {
    const set = new Set(
      products.map(p => (p.brand || '').trim()).filter(Boolean)
    );
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }, [products]);

  // Keyboard shortcut: Ctrl/Cmd + K to open search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setBrandsOpen(false);
  }, [location]);

  // Close brands dropdown on outside click / Escape
  useEffect(() => {
    if (!brandsOpen) return;
    const onClick = (e) => {
      if (brandsRef.current && !brandsRef.current.contains(e.target)) {
        setBrandsOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') setBrandsOpen(false); };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [brandsOpen]);

  const handleSelectBrand = (brand) => {
    setBrandsOpen(false);
    setMobileOpen(false);
    navigate({
      pathname: '/',
      search: brand ? `?marca=${encodeURIComponent(brand)}` : '',
      hash: '#catalogo'
    });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src="/logo.jpg" alt="Nura Fragancias" className="navbar__logo-img" />
          <div className="navbar__logo-text">
            <span className="navbar__brand">NURA</span>
            <span className="navbar__tagline">FRAGANCIAS</span>
          </div>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className="navbar__link" onClick={() => setMobileOpen(false)}>Inicio</Link>
          <a href="/#catalogo" className="navbar__link" onClick={() => setMobileOpen(false)}>Catálogo</a>

          <div className="navbar__brands" ref={brandsRef}>
            <button
              type="button"
              className={`navbar__link navbar__brands-toggle ${brandsOpen ? 'navbar__brands-toggle--open' : ''}`}
              onClick={() => setBrandsOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={brandsOpen}
            >
              Marcas
              <ChevronDown size={14} className="navbar__brands-chevron" />
            </button>

            {brandsOpen && (
              <div className="navbar__brands-dropdown" role="menu">
                <button
                  type="button"
                  className="navbar__brands-item navbar__brands-item--all"
                  onClick={() => handleSelectBrand(null)}
                  role="menuitem"
                >
                  Todas las marcas
                </button>
                <div className="navbar__brands-list">
                  {brands.map(brand => (
                    <button
                      type="button"
                      key={brand}
                      className="navbar__brands-item"
                      onClick={() => handleSelectBrand(brand)}
                      role="menuitem"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/admin" className="navbar__link" onClick={() => setMobileOpen(false)}>Admin</Link>
        </div>

        <div className="navbar__actions">
          <button
            className="navbar__search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar perfumes"
            title="Buscar (Ctrl+K)"
          >
            <Search size={22} />
          </button>

          <button
            className="navbar__cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito"
            id="cart-button"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="navbar__cart-badge animate-scale-in">{cartCount}</span>
            )}
          </button>

          <button
            className="navbar__menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
