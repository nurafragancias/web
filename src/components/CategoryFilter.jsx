import React from 'react';
import './CategoryFilter.css';

const categories = [
  { key: 'todos', label: 'Todos' },
  { key: 'masculino', label: 'Masculino' },
  { key: 'femenino', label: 'Femenino' },
  { key: 'unisex', label: 'Unisex' }
];

const CategoryFilter = ({ active, onChange }) => {
  return (
    <div className="category-filter">
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
