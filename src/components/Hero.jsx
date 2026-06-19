import React, { useEffect, useRef } from 'react';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const overlay = heroRef.current.querySelector('.hero__overlay');
        if (overlay) {
          overlay.style.opacity = Math.min(0.85, 0.5 + scrollY / 1000);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__bg"></div>
      <div className="hero__overlay"></div>

      {/* Decorative elements */}
      <div className="hero__particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="hero__particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      <div className="hero__content">
        <div className="hero__badge animate-fade-in-down">
          <span className="hero__badge-dot"></span>
          Exclusividad en cada esencia
        </div>

        <h1 className="hero__title animate-fade-in-up">
          <span className="hero__title-line">Descubrí tu</span>
          <span className="hero__title-accent shimmer-text">Fragancia Ideal</span>
        </h1>

        <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Perfumes de alta gama seleccionados para quienes buscan
          <br className="hero__br" />
          lo extraordinario. Tu esencia, tu identidad.
        </p>

        <div className="hero__actions animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button className="btn-gold hero__cta" onClick={scrollToCatalog}>
            Explorar Colección
          </button>
        </div>
      </div>

      <div className="hero__scroll-indicator animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="hero__scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
