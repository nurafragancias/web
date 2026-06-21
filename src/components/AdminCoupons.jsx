import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Edit3, Ticket, Save, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCatalog } from '../context/CatalogContext';
import { COUPON_TYPES, SCOPE_KINDS, describeCoupon, normalizeCode } from '../lib/coupons';
import './AdminCoupons.css';

const SCOPE_TYPES = ['scope_percent', 'second_unit', 'nxm'];
const PERCENT_TYPES = ['percent_total', 'percent_min', 'scope_percent', 'second_unit'];
const MIN_TYPES = ['percent_min', 'fixed_min'];

const emptyCoupon = () => ({
  id: '',
  code: '',
  description: '',
  type: 'percent_total',
  active: true,
  percent: 10,
  amount: 0,
  minTotal: 0,
  scopeKind: 'all',
  scopeValue: '',
  buyQty: 4,
  payQty: 3
});

const AdminCoupons = () => {
  const { getSetting, setSetting, loaded } = useSettings();
  const { products } = useCatalog();

  const [coupons, setCoupons] = useState([]);
  const [editing, setEditing] = useState(null); // coupon being added/edited
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loaded) return;
    try {
      const parsed = JSON.parse(getSetting('coupons', '[]'));
      setCoupons(Array.isArray(parsed) ? parsed : []);
    } catch (e) { setCoupons([]); }
  }, [loaded, getSetting]);

  const brands = useMemo(() => {
    const set = new Set(products.map(p => (p.brand || '').trim()).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [products]);

  const sizes = useMemo(() => {
    const set = new Set();
    for (const p of products) for (const v of (p.variants || [])) if (v.size) set.add(v.size);
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const persist = async (next) => {
    setSaving(true);
    setError('');
    try {
      await setSetting('coupons', JSON.stringify(next));
      setCoupons(next);
      return true;
    } catch (err) {
      setError('No se pudo guardar: ' + (err?.message || 'error desconocido'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const startAdd = () => { setError(''); setEditing(emptyCoupon()); };
  const startEdit = (c) => { setError(''); setEditing({ ...emptyCoupon(), ...c }); };
  const cancelEdit = () => { setEditing(null); setError(''); };

  const handleField = (field, value) => setEditing(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const c = editing;
    const code = normalizeCode(c.code);
    if (!code) { setError('Poné un código para el cupón (ej: VERANO20).'); return; }
    if (!c.description.trim()) { setError('Poné una descripción para identificarlo.'); return; }

    // Código único (salvo que sea el mismo que estás editando)
    const dup = coupons.find(x => normalizeCode(x.code) === code && x.id !== c.id);
    if (dup) { setError('Ya existe un cupón con ese código.'); return; }

    if (PERCENT_TYPES.includes(c.type) && (Number(c.percent) <= 0 || Number(c.percent) > 100)) {
      setError('El porcentaje debe estar entre 1 y 100.'); return;
    }
    if (c.type === 'fixed_min' && Number(c.amount) <= 0) {
      setError('Poné el monto fijo de descuento.'); return;
    }
    if (MIN_TYPES.includes(c.type) && Number(c.minTotal) <= 0) {
      setError('Poné el monto mínimo de compra.'); return;
    }
    if (SCOPE_TYPES.includes(c.type) && c.scopeKind !== 'all' && !String(c.scopeValue).trim()) {
      setError('Elegí el valor del alcance (categoría, marca o tamaño).'); return;
    }
    if (c.type === 'nxm') {
      const n = Number(c.buyQty), m = Number(c.payQty);
      if (!(n > m && m >= 1)) { setError('En NxM, N debe ser mayor que M (ej: 4x3).'); return; }
    }

    const clean = { ...c, code, id: c.id || Date.now().toString() };
    const next = c.id
      ? coupons.map(x => x.id === c.id ? clean : x)
      : [...coupons, clean];
    const ok = await persist(next);
    if (ok) setEditing(null);
  };

  const toggleActive = async (c) => {
    await persist(coupons.map(x => x.id === c.id ? { ...x, active: !(x.active !== false) } : x));
  };

  const handleDelete = async (id) => {
    const ok = await persist(coupons.filter(x => x.id !== id));
    if (ok) setConfirmDelete(null);
  };

  const t = editing?.type;
  const showPercent = t && PERCENT_TYPES.includes(t);
  const showAmount = t === 'fixed_min';
  const showMin = t && MIN_TYPES.includes(t);
  const showScope = t && SCOPE_TYPES.includes(t);
  const showNxm = t === 'nxm';

  return (
    <div className="admin-coupons">
      <div className="admin-coupons__head">
        <div className="admin-coupons__title">
          <Ticket size={18} />
          <h4>Cupones de descuento</h4>
        </div>
        {!editing && (
          <button className="admin-coupons__add" onClick={startAdd}>
            <Plus size={16} /> Nuevo cupón
          </button>
        )}
      </div>
      <p className="admin-coupons__intro">
        Los clientes escriben el código en el carrito y ven el descuento aplicado.
      </p>

      {error && <div className="admin-coupons__error">{error}</div>}

      {editing && (
        <div className="admin-coupons__form">
          <div className="admin-coupons__form-head">
            <h5>{editing.id ? 'Editar cupón' : 'Nuevo cupón'}</h5>
            <button type="button" className="admin-coupons__form-close" onClick={cancelEdit}><X size={16} /></button>
          </div>

          <div className="admin-coupons__row">
            <label className="admin-coupons__field">
              <span>Código (lo escribe el cliente)</span>
              <input
                type="text"
                value={editing.code}
                onChange={e => handleField('code', e.target.value.toUpperCase())}
                placeholder="VERANO20"
              />
            </label>
            <label className="admin-coupons__field">
              <span>Descripción (la ve el cliente)</span>
              <input
                type="text"
                value={editing.description}
                onChange={e => handleField('description', e.target.value)}
                placeholder="20% de descuento de verano"
              />
            </label>
          </div>

          <label className="admin-coupons__field">
            <span>Tipo de cupón</span>
            <select value={editing.type} onChange={e => handleField('type', e.target.value)}>
              {Object.entries(COUPON_TYPES).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
            <small className="admin-coupons__help">{COUPON_TYPES[editing.type]?.help}</small>
          </label>

          <div className="admin-coupons__row">
            {showPercent && (
              <label className="admin-coupons__field">
                <span>Porcentaje de descuento</span>
                <div className="admin-coupons__suffix">
                  <input type="number" min="1" max="100" value={editing.percent}
                    onChange={e => handleField('percent', Number(e.target.value) || 0)} />
                  <span>%</span>
                </div>
              </label>
            )}
            {showAmount && (
              <label className="admin-coupons__field">
                <span>Monto fijo de descuento</span>
                <div className="admin-coupons__prefix">
                  <span>$</span>
                  <input type="number" min="0" value={editing.amount}
                    onChange={e => handleField('amount', Number(e.target.value) || 0)} />
                </div>
              </label>
            )}
            {showMin && (
              <label className="admin-coupons__field">
                <span>Compra mínima</span>
                <div className="admin-coupons__prefix">
                  <span>$</span>
                  <input type="number" min="0" value={editing.minTotal}
                    onChange={e => handleField('minTotal', Number(e.target.value) || 0)} />
                </div>
              </label>
            )}
          </div>

          {showNxm && (
            <div className="admin-coupons__row">
              <label className="admin-coupons__field">
                <span>Lleva (N)</span>
                <input type="number" min="2" value={editing.buyQty}
                  onChange={e => handleField('buyQty', Number(e.target.value) || 0)} />
              </label>
              <label className="admin-coupons__field">
                <span>Paga (M)</span>
                <input type="number" min="1" value={editing.payQty}
                  onChange={e => handleField('payQty', Number(e.target.value) || 0)} />
              </label>
            </div>
          )}

          {showScope && (
            <div className="admin-coupons__row">
              <label className="admin-coupons__field">
                <span>Aplicar a</span>
                <select value={editing.scopeKind} onChange={e => { handleField('scopeKind', e.target.value); handleField('scopeValue', ''); }}>
                  {Object.entries(SCOPE_KINDS).map(([k, lbl]) => (
                    <option key={k} value={k}>{lbl}</option>
                  ))}
                </select>
              </label>
              {editing.scopeKind === 'category' && (
                <label className="admin-coupons__field">
                  <span>Categoría</span>
                  <select value={editing.scopeValue} onChange={e => handleField('scopeValue', e.target.value)}>
                    <option value="">Elegí…</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </label>
              )}
              {editing.scopeKind === 'brand' && (
                <label className="admin-coupons__field">
                  <span>Marca</span>
                  <select value={editing.scopeValue} onChange={e => handleField('scopeValue', e.target.value)}>
                    <option value="">Elegí…</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </label>
              )}
              {editing.scopeKind === 'size' && (
                <label className="admin-coupons__field">
                  <span>Tamaño / variante</span>
                  <select value={editing.scopeValue} onChange={e => handleField('scopeValue', e.target.value)}>
                    <option value="">Elegí…</option>
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              )}
            </div>
          )}

          <label className="admin-coupons__check">
            <input type="checkbox" checked={editing.active !== false}
              onChange={e => handleField('active', e.target.checked)} />
            <span>Activo (disponible para los clientes)</span>
          </label>

          <div className="admin-coupons__form-actions">
            <button type="button" className="btn-outline-gold" onClick={cancelEdit}>Cancelar</button>
            <button type="button" className="btn-gold" onClick={handleSave} disabled={saving}>
              <Save size={15} /> {saving ? 'Guardando…' : 'Guardar cupón'}
            </button>
          </div>
        </div>
      )}

      {coupons.length === 0 && !editing ? (
        <div className="admin-coupons__empty">Todavía no hay cupones. Creá el primero con "Nuevo cupón".</div>
      ) : (
        <div className="admin-coupons__list">
          {coupons.map(c => (
            <div key={c.id} className={`admin-coupons__item${c.active === false ? ' admin-coupons__item--off' : ''}`}>
              <div className="admin-coupons__item-main">
                <div className="admin-coupons__item-top">
                  <span className="admin-coupons__item-code">{c.code}</span>
                  {c.active === false && <span className="admin-coupons__item-badge">Inactivo</span>}
                </div>
                <span className="admin-coupons__item-desc">{c.description}</span>
                <span className="admin-coupons__item-rule">{describeCoupon(c)}</span>
              </div>
              <div className="admin-coupons__item-actions">
                <label className="admin-coupons__switch" title="Activar / desactivar">
                  <input type="checkbox" checked={c.active !== false} onChange={() => toggleActive(c)} />
                  <span />
                </label>
                <button className="admin-coupons__icon-btn" onClick={() => startEdit(c)} title="Editar"><Edit3 size={15} /></button>
                {confirmDelete === c.id ? (
                  <div className="admin-coupons__confirm">
                    <button className="admin-coupons__confirm-yes" onClick={() => handleDelete(c.id)}>Sí</button>
                    <button className="admin-coupons__confirm-no" onClick={() => setConfirmDelete(null)}>No</button>
                  </div>
                ) : (
                  <button className="admin-coupons__icon-btn admin-coupons__icon-btn--del" onClick={() => setConfirmDelete(c.id)} title="Eliminar"><Trash2 size={15} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
