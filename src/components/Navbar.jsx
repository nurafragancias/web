import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

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
          <Link to="/admin" className="navbar__link" onClick={() => setMobileOpen(false)}>Admin</Link>
        </div>

        <div className="navbar__actions">
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
    </nav>
  );
};

export default Navbar;
