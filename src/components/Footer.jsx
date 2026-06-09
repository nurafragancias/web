import React from 'react';
import { MessageCircle, Camera, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__glow"></div>
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <img src="/logo.jpg" alt="Nura" className="footer__logo" />
            <div>
              <h3 className="footer__title gold-text">NURA</h3>
              <p className="footer__subtitle">FRAGANCIAS</p>
            </div>
          </div>

          <p className="footer__desc">
            Exclusividad en cada esencia. Perfumes de alta gama
            seleccionados para quienes buscan lo extraordinario.
          </p>

          <div className="footer__social">
            <a
              href="https://wa.me/543562447897"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href="#"
              className="footer__social-link"
              aria-label="Instagram"
            >
              <Camera size={18} />
            </a>
            <a
              href="#"
              className="footer__social-link"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <span>© {year} Nura Fragancias. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
