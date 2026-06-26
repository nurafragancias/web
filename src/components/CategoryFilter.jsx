import React, { useEffect, useRef } from 'react';
import './CategoryFilter.css';

const categories = [
  { key: 'todos', label: 'Todos' },
  { key: 'masculino', label: 'Masculino' },
  { key: 'femenino', label: 'Femenino' },
  { key: 'unisex', label: 'Unisex' },
  { key: 'combos', label: 'Combos' }
];

const CategoryFilter = ({ active, onChange }) => {
  const wrapRef = useRef(null);

  // En mobile el filtro tiene scroll horizontal. Cuando cambia la pestaña
  // activa (por ejemplo, deep-link "?categoria=combos"), la traemos a la
  // vista — pero solo dentro del propio contenedor, sin tocar el scroll de
  // la página (scrollIntoView arrastraba la página hacia el filtro al cargar).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const btn = wrap.querySelector(`#filter-${active}`);
    if (!btn) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const currentOffset = (btnRect.left - wrapRect.left) + wrap.scrollLeft;
    const target = currentOffset - (wrap.clientWidth / 2) + (btn.offsetWidth / 2);
    wrap.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [active]);

  return (
    <div className="category-filter" ref={wrapRef}>
      <div className="category-filter__track">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`category-filter__tab ${active === cat.key ? 'category-filter__tab--active' : ''}`}
            onClick={() => onChange(cat.key)}
            id={`filter-${cat.key}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
