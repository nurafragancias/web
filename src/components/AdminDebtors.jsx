import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight, HandCoins } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import './AdminDebtors.css';

const money = (n) => Number(n || 0).toLocaleString('es-AR');
const fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = String(d).slice(0, 10).split('-');
  return `${day}/${m}/${y}`;
};
const today = () => new Date().toISOString().slice(0, 10);

// Saldo pendiente de una venta = total - pagado al inicio - abonos posteriores.
const saleBalance = (sale, paymentsBySale) =>
  Number(sale.total) - Number(sale.paid) - (paymentsBySale[sale.id] || 0);

const AdminDebtors = () => {
  const { sales, payments, loadAll, loaded, loading, addPayment } = useSales();
  const [expanded, setExpanded] = useState({});
  const [payFor, setPayFor] = useState(null); // sale_id en pago
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('efectivo');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loaded) loadAll();
  }, [loaded, loadAll]);

  const paymentsBySale = useMemo(() => {
    const map = {};
    for (const p of payments) {
      if (p.kind === 'sale' && p.sale_id) {
        map[p.sale_id] = (map[p.sale_id] || 0) + Number(p.amount || 0);
      }
    }
    return map;
  }, [payments]);

  const debtors = useMemo(() => {
    const byPerson = {};
    for (const s of sales) {
      if (s.payment_method !== 'cuenta_corriente') continue;
      const saldo = saleBalance(s, paymentsBySale);
      if (saldo <= 0.009) continue;
      const key = (s.contact_name || 'Sin nombre').trim() || 'Sin nombre';
      if (!byPerson[key]) byPerson[key] = { name: key, total: 0, sales: [] };
      byPerson[key].total += saldo;
      byPerson[key].sales.push({ ...s, saldo });
    }
    return Object.values(byPerson).sort((a, b) => b.total - a.total);
  }, [sales, paymentsBySale]);

  const totalGeneral = debtors.reduce((s, d) => s + d.total, 0);

  const startPay = (sale) => {
    setPayFor(sale.id);
    setAmount(Math.round(sale.saldo));
    setMethod('efectivo');
    setError('');
  };

  const confirmPay = async (sale) => {
    setError('');
    const amt = Number(amount) || 0;
    if (amt <= 0) { setError('El importe debe ser mayor a 0.'); return; }
    if (amt > sale.saldo + 0.009) { setError(`El importe no puede superar el saldo ($${money(sale.saldo)}).`); return; }
    setSaving(true);
    try {
      await addPayment({
        kind: 'sale',
        sale_id: sale.id,
        amount: amt,
        method,
        date: today()
      });
      setPayFor(null);
    } catch (err) {
      setError('No se pudo registrar el pago: ' + (err?.message || 'error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-debtors">
      {error && <div className="admin-error-banner">{error}</div>}

      <div className="admin-debtors__summary">
        <span>Total por cobrar</span>
        <strong>${money(totalGeneral)}</strong>
      </div>

      {loading && !loaded ? (
        <p className="admin-debtors__loading">Cargando…</p>
      ) : debtors.length === 0 ? (
        <div className="admin-debtors__empty">
          <HandCoins size={28} />
          <p>No hay deudores. ¡Todo cobrado! 🎉</p>
        </div>
      ) : (
        <div className="admin-debtors__list">
          {debtors.map(d => {
            const open = !!expanded[d.name];
            return (
              <div key={d.name} className="admin-debtor">
                <button
                  className="admin-debtor__head"
                  onClick={() => setExpanded(e => ({ ...e, [d.name]: !e[d.name] }))}
                >
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="admin-debtor__name">{d.name}</span>
                  <span className="admin-debtor__count">{d.sales.length} venta{d.sales.length !== 1 ? 's' : ''}</span>
                  <span className="admin-debtor__total">${money(d.total)}</span>
                </button>

                {open && (
                  <div className="admin-debtor__sales">
                    {d.sales.map(sale => (
                      <div key={sale.id} className="admin-debtor__sale">
                        <div className="admin-debtor__sale-info">
                          <span className="admin-debtor__sale-date">{fmtDate(sale.date)}</span>
                          <span className="admin-debtor__sale-detail">
                            Total ${money(sale.total)} · Pagó ${money(Number(sale.total) - sale.saldo)}
                          </span>
                        </div>
                        <div className="admin-debtor__sale-right">
                          <span className="admin-debtor__sale-saldo">Debe ${money(sale.saldo)}</span>
                          {payFor === sale.id ? (
                            <div className="admin-debtor__payform">
                              <input
                                type="number" min="1"
                                value={amount || ''}
                                onChange={e => setAmount(Number(e.target.value) || 0)}
                                placeholder="Importe"
                              />
                              <select value={method} onChange={e => setMethod(e.target.value)}>
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia</option>
                              </select>
                              <button className="btn-gold admin-debtor__pay-confirm" onClick={() => confirmPay(sale)} disabled={saving}>
                                {saving ? '…' : 'Confirmar'}
                              </button>
                              <button className="admin-debtor__pay-cancel" onClick={() => setPayFor(null)}>Cancelar</button>
                            </div>
                          ) : (
                            <button className="admin-debtor__pay-btn" onClick={() => startPay(sale)}>
                              Registrar pago
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDebtors;
