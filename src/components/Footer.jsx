import React from 'react';
import { MessageCircle, Camera, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './Footer.css';

const Footer = () => {
  const { getSetting } = useSettings();
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
