import React, { useState } from 'react';
import { MessageCircle, Camera, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import './Footer.css';

const Footer = () => {
  const { getSetting } = useSettings();
  const [nosotrosOpen, setNosotrosOpen] = useState(false);
  const year = new Date().getFullYear();
  const whatsappNumber = (getSetting('whatsapp_number', '543562447897') || '543562447897').replace(/\D/g, '');

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
            AROMAS QUE TRASCIENDEN
          </p>

          <nav className="footer__nav">
            <Link to="/" className="footer__nav-link">Inicio</Link>
            <a href="/#catalogo" className="footer__nav-link">Catálogo</a>
            <Link to="/?categoria=combos#catalogo" className="footer__nav-link">Combos</Link>
            <Link to="/promociones" className="footer__nav-link">Promociones</Link>
            <button
              type="button"
              className={`footer__nav-link footer__nav-nosotros${nosotrosOpen ? ' footer__nav-nosotros--open' : ''}`}
              onClick={() => setNosotrosOpen(o => !o)}
            >
              Nosotros
              <ChevronDown size={14} className="footer__nav-chevron" />
            </button>
          </nav>

          {nosotrosOpen && (
            <div className="footer__nosotros">
              <p>Nacimos de una pasión compartida por el arte de las fragancias. Cada aroma es un viaje, un recuerdo, una conexión que buscamos compartir.</p>
              <p>En nuestro emprendimiento, seleccionamos cuidadosamente cada perfume para que puedas encontrar una esencia que hable de ti, que te inspire y te acompañe en cada paso.</p>
              <p>Gracias por ser parte de esta aventura con nosotros.</p>
              <p><strong>Bienvenidos a nuestro mundo de fragancias.</strong></p>
            </div>
          )}

          <div className="footer__social">
            <a
              href={`https://wa.me/${whatsappNumber}`}
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
