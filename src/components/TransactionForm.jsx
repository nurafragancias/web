import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { variantAffectsStock } from '../lib/stock';
import ProductPicker from './ProductPicker';
import './TransactionForm.css';

const today = () => new Date().toISOString().slice(0, 10);
const money = (n) => Number(n || 0).toLocaleString('es-AR');

const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'cuenta_corriente', label: 'Cuenta corriente (fiado)' }
];

const emptyLine = () => ({ kind: 'product', productId: '', size: '', qty: 1, price: 0, otherName: '' });
const emptyOtherLine = () => ({ kind: 'other', productId: '', size: '', qty: 1, price: 0, otherName: '' });

// Reconstruye las "líneas" del formulario a partir de los ítems guardados
// (para editar una venta/compra ya registrada).
const linesFromInitial = (initial, isSale) => {
  const items = initial?.items || [];
  if (!items.length) return [emptyLine()];
  const priceKey = isSale ? 'unit_price' : 'unit_cost';
  return items.map(it => ({
    kind: it.product_id ? 'product' : 'other',
    productId: it.product_id || '',
    size: it.size || '',
    qty: Number(it.qty) || 1,
    price: Number(it[priceKey]) || 0,
    otherName: it.product_id ? '' : (it.product_name || '')
  }));
};

const TransactionForm = ({ mode, products, onSubmit, onCancel, submitting, initial }) => {
  const isSale = mode === 'venta';
  const isEdit = Boolean(initial);
  const [date, setDate] = useState(initial?.date ? String(initial.date).slice(0, 10) : today());
  const [person, setPerson] = useState(initial?.contact_name || '');
  const [lines, setLines] = useState(() => linesFromInitial(initial, isSale));
  const [paymentMethod, setPaymentMethod] = useState(initial?.payment_method || 'efectivo');
  const [paidInput, setPaidInput] = useState(initial?.paid ?? 0);
  const [note, setNote] = useState(initial?.note || '');
  const [error, setError] = useState('');

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es')),
    [products]
  );

  const productById = (id) => products.find(p => p.id === id);

  const updateLine = (index, patch) => {
    setLines(prev => prev.map((l, i) => i === index ? { ...l, ...patch } : l));
  };

  const handleProductChange = (index, productId) => {
    const prod = productById(productId);
    const firstVariant = prod?.variants?.[0];
    updateLine(index, {
      productId,
      size: firstVariant?.size || '',
      price: isSale ? (firstVariant?.price || 0) : 0
    });
  };

  const handleSizeChange = (index, size) => {
    const prod = productById(lines[index].productId);
    const variant = prod?.variants?.find(v => v.size === size);
    updateLine(index, { size, price: isSale ? (variant?.price || 0) : lines[index].price });
  };

  const addLine = () => setLines(prev => [...prev, emptyLine()]);
  const addOtherLine = () => setLines(prev => [...prev, emptyOtherLine()]);
  const removeLine = (index) => setLines(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.price) || 0), 0),
    [lines]
  );

  const isCC = paymentMethod === 'cuenta_corriente';
  const paid = isCC ? (Number(paidInput) || 0) : total;
  const debe = Math.max(0, total - paid);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const validLines = lines.filter(l => {
      if ((Number(l.qty) || 0) <= 0) return false;
      if (l.kind === 'other') return Boolean((l.otherName || '').trim());
      return Boolean(l.productId);
    });
    if (validLines.length === 0) {
      setError('Agregá al menos un producto u otro ítem.');
      return;
    }
    const itemKey = isSale ? 'unit_price' : 'unit_cost';
    const items = validLines.map(l => {
      if (l.kind === 'other') {
        return {
          product_id: null,
          product_name: l.otherName.trim(),
          size: null,
          qty: Number(l.qty) || 0,
          [itemKey]: Number(l.price) || 0,
          affects_stock: false
        };
      }
      const prod = productById(l.productId);
      const variant = prod?.variants?.find(v => v.size === l.size);
      return {
        product_id: l.productId,
        product_name: prod?.name ?? '',
        size: l.size || null,
        qty: Number(l.qty) || 0,
        [itemKey]: Number(l.price) || 0,
        affects_stock: variant ? variantAffectsStock(variant) : false
      };
    });
    const header = {
      date,
      contact_name: person.trim() || null,
      total,
      payment_method: paymentMethod,
      paid,
      note: note.trim() || null
    };
    onSubmit({ header, items });
  };

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="tx-form__header">
        <h3>{isEdit ? (isSale ? 'Editar Venta' : 'Editar Compra') : (isSale ? 'Nueva Venta' : 'Nueva Compra')}</h3>
        <button type="button" className="tx-form__close" onClick={onCancel}><X size={18} /></button>
      </div>

      <div className="tx-form__row">
        <div className="tx-form__field">
          <label>Fecha</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="tx-form__field">
          <label>{isSale ? 'Cliente' : 'Proveedor'}</label>
          <input
            type="text"
            value={person}
            onChange={e => setPerson(e.target.value)}
            placeholder={isSale ? 'Nombre del cliente' : 'Nombre del proveedor'}
          />
        </div>
      </div>

      {/* Productos */}
      <div className="tx-form__items">
        <div className="tx-form__items-header">
          <label>Productos</label>
          <div className="tx-form__items-actions">
            <button type="button" className="tx-form__add-line" onClick={addLine}>
              <Plus size={14} /> Agregar producto
            </button>
            {!isSale && (
              <button type="button" className="tx-form__add-line tx-form__add-line--other" onClick={addOtherLine} title="Envíos, materiales, frascos, etc.">
                <Plus size={14} /> Agregar otro
              </button>
            )}
          </div>
        </div>

        {lines.map((line, i) => {
          const isOther = line.kind === 'other';
          const prod = isOther ? null : productById(line.productId);
          const variants = prod?.variants || [];
          const subtotal = (Number(line.qty) || 0) * (Number(line.price) || 0);
          return (
            <div key={i} className={`tx-form__line${isOther ? ' tx-form__line--other' : ''}`}>
              {isOther ? (
                <input
                  type="text"
                  className="tx-form__line-other"
                  value={line.otherName}
                  onChange={e => updateLine(i, { otherName: e.target.value })}
                  placeholder="Ej: Envío, frascos vacíos, etiquetas…"
                />
              ) : (
                <>
                  <ProductPicker
                    products={sortedProducts}
                    value={line.productId}
                    onChange={(id) => handleProductChange(i, id)}
                  />

                  <select
                    className="tx-form__line-size"
                    value={line.size}
                    onChange={e => handleSizeChange(i, e.target.value)}
                    disabled={!variants.length}
                  >
                    {variants.map(v => (
                      <option key={v.size} value={v.size}>{v.size}</option>
                    ))}
                  </select>
                </>
              )}

              <input
                type="number" min="1"
                className="tx-form__line-qty"
                value={line.qty}
                onChange={e => updateLine(i, { qty: Math.max(1, Number(e.target.value) || 1) })}
                title="Cantidad"
              />

              <div className="tx-form__line-price-wrap">
                <span>$</span>
                <input
                  type="number" min="0"
                  className="tx-form__line-price"
                  value={line.price || ''}
                  onChange={e => updateLine(i, { price: Number(e.target.value) || 0 })}
                  placeholder={isSale ? 'Precio' : 'Costo'}
                />
              </div>

              <span className="tx-form__line-subtotal">${money(subtotal)}</span>

              <button
                type="button"
                className="tx-form__line-remove"
                onClick={() => removeLine(i)}
                disabled={lines.length <= 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Pago */}
      <div className="tx-form__row">
        <div className="tx-form__field">
          <label>Método de pago</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        {isCC && (
          <div className="tx-form__field">
            <label>Entrega ahora (a cuenta)</label>
            <input
              type="number" min="0"
              value={paidInput || ''}
              onChange={e => setPaidInput(Number(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        )}
      </div>

      <div className="tx-form__field">
        <label>Nota (opcional)</label>
        <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Observaciones" />
      </div>

      {/* Totales */}
      <div className="tx-form__totals">
        <div className="tx-form__total-line">
          <span>Total</span>
          <strong>${money(total)}</strong>
        </div>
        {isCC && (
          <>
            <div className="tx-form__total-line">
              <span>Paga ahora</span>
              <span>${money(paid)}</span>
            </div>
            <div className="tx-form__total-line tx-form__total-line--debt">
              <span>Queda debiendo</span>
              <strong>${money(debe)}</strong>
            </div>
          </>
        )}
      </div>

      {error && <div className="tx-form__error">{error}</div>}

      <div className="tx-form__actions">
        <button type="button" className="btn-outline-gold" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-gold" disabled={submitting}>
          <Save size={16} />
          {submitting ? 'Guardando…' : (isEdit ? 'Guardar cambios' : (isSale ? 'Registrar venta' : 'Registrar compra'))}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
