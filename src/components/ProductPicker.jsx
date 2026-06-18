import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import './ProductPicker.css';

const normalize = (s) =>
  (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ProductPicker = ({ products, value, onChange, placeholder = 'Buscar producto…' }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef(null);

  const selected = products.find(p => p.id === value);
  const selectedLabel = selected ? `${selected.brand} — ${selected.name}` : '';

  const results = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return products.slice(0, 50);
    const terms = q.split(/\s+/).filter(Boolean);
    return products
      .filter(p => {
        const hay = normalize(`${p.name} ${p.brand}`);
        return terms.every(t => hay.includes(t));
      })
      .slice(0, 50);
  }, [query, products]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const select = (p) => {
    onChange(p.id);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHighlight(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { if (open && results[highlight]) { e.preventDefault(); select(results[highlight]); } }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className="product-picker" ref={ref}>
      <div className="product-picker__input-wrap">
        <Search size={14} className="product-picker__icon" />
        <input
          type="text"
          className="product-picker__input"
          value={open ? query : selectedLabel}
          onChange={e => { setQuery(e.target.value); setOpen(true); setHighlight(0); }}
          onFocus={() => { setQuery(''); setOpen(true); setHighlight(0); }}
          onKeyDown={onKeyDown}
          placeholder={selected && !open ? selectedLabel : placeholder}
        />
      </div>

      {open && (
        <div className="product-picker__dropdown">
          {results.length === 0 ? (
            <div className="product-picker__empty">Sin resultados para "{query}"</div>
          ) : results.map((p, i) => (
            <button
              type="button"
              key={p.id}
              className={`product-picker__option${i === highlight ? ' product-picker__option--active' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => select(p)}
            >
              <span className="product-picker__opt-text">
                <span className="product-picker__opt-name">{p.name}</span>
                <span className="product-picker__opt-brand">{p.brand}</span>
              </span>
              <span className="product-picker__opt-stock">stock {p.stock ?? 0}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
