import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { useCatalog } from '../context/CatalogContext';
import './AdminStats.css';

const money = (n) => Number(n || 0).toLocaleString('es-AR');
const monthKey = (d) => String(d || '').slice(0, 7);
const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return `${m}/${y}`;
};

const METHODS = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  cuenta_corriente: 'Cuenta corriente'
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const firstOfMonth = () => todayStr().slice(0, 8) + '01';
const firstOfYear = () => todayStr().slice(0, 4) + '-01-01';

const AdminStats = () => {
  const { sales, purchases, payments, loadAll, loaded, loading } = useSales();
  const { products } = useCatalog();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [method, setMethod] = useState('todos');

  useEffect(() => { if (!loaded) loadAll(); }, [loaded, loadAll]);

  const catById = useMemo(() => {
    const m = {};
    for (const p of products) m[p.id] = p.category || 'otros';
    return m;
  }, [products]);

  const inRange = (d) => {
    const day = String(d || '').slice(0, 10);
    if (from && day < from) return false;
    if (to && day > to) return false;
    return true;
  };
  const matchMethod = (pm) => method === 'todos' || pm === method;

  const fSales = useMemo(
    () => sales.filter(s => inRange(s.date) && matchMethod(s.payment_method)),
    [sales, from, to, method]
  );
  const fPurchases = useMemo(
    () => purchases.filter(p => inRange(p.date) && matchMethod(p.payment_method)),
    [purchases, from, to, method]
  );

  const paymentsBySale = useMemo(() => {
    const map = {};
    for (const p of payments) {
      if (p.kind === 'sale' && p.sale_id) map[p.sale_id] = (map[p.sale_id] || 0) + Number(p.amount || 0);
    }
    return map;
  }, [payments]);

  const stats = useMemo(() => {
    const ingresos = fSales.reduce((s, v) => s + Number(v.total || 0), 0);
    const egresos = fPurchases.reduce((s, v) => s + Number(v.total || 0), 0);
    let cobrado = 0, porCobrar = 0;
    for (const v of fSales) {
      const abonos = paymentsBySale[v.id] || 0;
      const pagado = Math.min(Number(v.total), Number(v.paid) + abonos);
      cobrado += pagado;
      porCobrar += Math.max(0, Number(v.total) - pagado);
    }

    // Por mes
    const months = {};
    for (const v of fSales) {
      const k = monthKey(v.date);
      (months[k] = months[k] || { ingresos: 0, egresos: 0 }).ingresos += Number(v.total || 0);
    }
    for (const v of fPurchases) {
      const k = monthKey(v.date);
      (months[k] = months[k] || { ingresos: 0, egresos: 0 }).egresos += Number(v.total || 0);
    }
    const byMonth = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ key: k, ...v }));

    // Ingresos por método
    const byMethod = {};
    for (const v of fSales) byMethod[v.payment_method] = (byMethod[v.payment_method] || 0) + Number(v.total || 0);

    // Por categoría y top productos (a nivel ítem)
    const byCategory = {};
    const byProduct = {};
    for (const v of fSales) {
      for (const it of (v.sale_items || [])) {
        const imp = Number(it.qty || 0) * Number(it.unit_price || 0);
        const cat = catById[it.product_id] || 'otros';
        byCategory[cat] = (byCategory[cat] || 0) + imp;
        const key = it.product_name || it.product_id;
        if (!byProduct[key]) byProduct[key] = { name: key, qty: 0, importe: 0 };
        byProduct[key].qty += Number(it.qty || 0);
        byProduct[key].importe += imp;
      }
    }
    const topProducts = Object.values(byProduct).sort((a, b) => b.importe - a.importe).slice(0, 5);

    return {
      ingresos, egresos, resultado: ingresos - egresos, cobrado, porCobrar,
      nVentas: fSales.length, nCompras: fPurchases.length,
      ticket: fSales.length ? ingresos / fSales.length : 0,
      byMonth, byMethod, byCategory, topProducts
    };
  }, [fSales, fPurchases, paymentsBySale, catById]);

  const maxMonth = Math.max(1, ...stats.byMonth.map(m => Math.max(m.ingresos, m.egresos)));
  const maxCat = Math.max(1, ...Object.values(stats.byCategory));

  const setPreset = (preset) => {
    if (preset === 'mes') { setFrom(firstOfMonth()); setTo(todayStr()); }
    else if (preset === 'anio') { setFrom(firstOfYear()); setTo(todayStr()); }
    else if (preset === 'todo') { setFrom(''); setTo(''); }
  };

  return (
    <div className="admin-stats">
      {/* Filtros */}
      <div className="admin-stats__filters">
        <div className="admin-stats__filter">
          <label>Desde</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="admin-stats__filter">
          <label>Hasta</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div className="admin-stats__filter">
          <label>Método de pago</label>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="cuenta_corriente">Cuenta corriente</option>
          </select>
        </div>
        <div className="admin-stats__presets">
          <button onClick={() => setPreset('mes')}>Este mes</button>
          <button onClick={() => setPreset('anio')}>Este año</button>
          <button onClick={() => setPreset('todo')}>Todo</button>
        </div>
      </div>

      {loading && !loaded ? (
        <p className="admin-stats__loading">Cargando…</p>
      ) : (
        <>
          {/* Tarjetas */}
          <div className="admin-stats__cards">
            <div className="stat-card stat-card--in">
              <TrendingUp size={18} />
              <span className="stat-card__label">Ingresos (ventas)</span>
              <strong>${money(stats.ingresos)}</strong>
              <small>{stats.nVentas} venta{stats.nVentas !== 1 ? 's' : ''}</small>
            </div>
            <div className="stat-card stat-card--out">
              <TrendingDown size={18} />
              <span className="stat-card__label">Egresos (compras)</span>
              <strong>${money(stats.egresos)}</strong>
              <small>{stats.nCompras} compra{stats.nCompras !== 1 ? 's' : ''}</small>
            </div>
            <div className={`stat-card ${stats.resultado >= 0 ? 'stat-card--in' : 'stat-card--out'}`}>
              <Wallet size={18} />
              <span className="stat-card__label">Resultado</span>
              <strong>${money(stats.resultado)}</strong>
              <small>Ticket prom. ${money(Math.round(stats.ticket))}</small>
            </div>
            <div className="stat-card stat-card--debt">
              <Clock size={18} />
              <span className="stat-card__label">Por cobrar</span>
              <strong>${money(stats.porCobrar)}</strong>
              <small>Cobrado ${money(stats.cobrado)}</small>
            </div>
          </div>

          {/* Gráfico por mes */}
          <div className="admin-stats__section">
            <h4>Ingresos vs egresos por mes</h4>
            {stats.byMonth.length === 0 ? (
              <p className="admin-stats__empty">Sin datos en el período.</p>
            ) : (
              <div className="admin-stats__months">
                {stats.byMonth.map(m => (
                  <div key={m.key} className="admin-stats__month">
                    <span className="admin-stats__month-label">{monthLabel(m.key)}</span>
                    <div className="admin-stats__month-bars">
                      <div className="admin-stats__bar-row">
                        <div className="admin-stats__bar admin-stats__bar--in" style={{ width: `${(m.ingresos / maxMonth) * 100}%` }} />
                        <span>${money(m.ingresos)}</span>
                      </div>
                      <div className="admin-stats__bar-row">
                        <div className="admin-stats__bar admin-stats__bar--out" style={{ width: `${(m.egresos / maxMonth) * 100}%` }} />
                        <span>${money(m.egresos)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-stats__grid2">
            {/* Por método */}
            <div className="admin-stats__section">
              <h4>Ingresos por método de pago</h4>
              {Object.keys(stats.byMethod).length === 0 ? (
                <p className="admin-stats__empty">Sin datos.</p>
              ) : (
                <ul className="admin-stats__breakdown">
                  {Object.entries(stats.byMethod).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <li key={k}>
                      <span>{METHODS[k] || k}</span>
                      <strong>${money(v)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Por categoría */}
            <div className="admin-stats__section">
              <h4>Ventas por categoría</h4>
              {Object.keys(stats.byCategory).length === 0 ? (
                <p className="admin-stats__empty">Sin datos.</p>
              ) : (
                <div className="admin-stats__cats">
                  {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k} className="admin-stats__cat">
                      <span className="admin-stats__cat-label">{k}</span>
                      <div className="admin-stats__cat-bar-wrap">
                        <div className="admin-stats__cat-bar" style={{ width: `${(v / maxCat) * 100}%` }} />
                      </div>
                      <span className="admin-stats__cat-val">${money(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top productos */}
          <div className="admin-stats__section">
            <h4>Top 5 productos vendidos</h4>
            {stats.topProducts.length === 0 ? (
              <p className="admin-stats__empty">Sin ventas en el período.</p>
            ) : (
              <ol className="admin-stats__top">
                {stats.topProducts.map((p, i) => (
                  <li key={p.name}>
                    <span className="admin-stats__top-rank">{i + 1}</span>
                    <span className="admin-stats__top-name">{p.name}</span>
                    <span className="admin-stats__top-qty">{p.qty} u.</span>
                    <strong>${money(p.importe)}</strong>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStats;
