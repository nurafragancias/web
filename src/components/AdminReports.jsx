import React, { useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { useCatalog } from '../context/CatalogContext';
import { exportXlsx, todayStamp } from '../lib/excel';
import './AdminReports.css';

const METHOD_LABEL = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  cuenta_corriente: 'Cuenta corriente'
};

const fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = String(d).slice(0, 10).split('-');
  return `${day}/${m}/${y}`;
};

const monthKey = (d) => String(d || '').slice(0, 7);
const monthLabel = (k) => {
  const [y, m] = k.split('-');
  const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return `${names[Number(m) - 1] || m} ${y}`;
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const firstOfMonth = () => todayStr().slice(0, 8) + '01';
const firstOfYear = () => todayStr().slice(0, 4) + '-01-01';
const lastMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const last = new Date(now.getFullYear(), now.getMonth(), 0);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from: fmt(first), to: fmt(last) };
};

const AdminReports = () => {
  const { sales, purchases, payments, loadAll, loaded, loading } = useSales();
  const { products } = useCatalog();

  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(todayStr());
  const [salesMethod, setSalesMethod] = useState('todos');
  const [stockCategory, setStockCategory] = useState('todas');
  const [stockOnlyLow, setStockOnlyLow] = useState(false);
  const [stockThreshold, setStockThreshold] = useState(3);
  const [topN, setTopN] = useState(10);

  useEffect(() => { if (!loaded) loadAll(); }, [loaded, loadAll]);

  const productMap = useMemo(() => {
    const m = {};
    for (const p of products) m[p.id] = p;
    return m;
  }, [products]);

  const inRange = (d) => {
    const day = String(d || '').slice(0, 10);
    if (from && day < from) return false;
    if (to && day > to) return false;
    return true;
  };

  const applyPreset = (preset) => {
    if (preset === 'hoy') { setFrom(todayStr()); setTo(todayStr()); }
    else if (preset === 'mes') { setFrom(firstOfMonth()); setTo(todayStr()); }
    else if (preset === 'mesPasado') { const r = lastMonthRange(); setFrom(r.from); setTo(r.to); }
    else if (preset === 'anio') { setFrom(firstOfYear()); setTo(todayStr()); }
    else if (preset === 'todo') { setFrom(''); setTo(''); }
  };

  const rangeLabel = () => {
    if (!from && !to) return 'todo el período';
    if (from && to) return `${fmtDate(from)} a ${fmtDate(to)}`;
    if (from) return `desde ${fmtDate(from)}`;
    return `hasta ${fmtDate(to)}`;
  };

  const paymentsBySale = useMemo(() => {
    const map = {};
    for (const p of payments) {
      if (p.kind === 'sale' && p.sale_id) map[p.sale_id] = (map[p.sale_id] || 0) + Number(p.amount || 0);
    }
    return map;
  }, [payments]);

  const computeSaleDebt = (s) => {
    if (s.payment_method !== 'cuenta_corriente') return 0;
    const abonos = paymentsBySale[s.id] || 0;
    return Math.max(0, Number(s.total) - Number(s.paid || 0) - abonos);
  };

  // ----- 1. VENTAS -----
  const exportSales = () => {
    const rows = [];
    for (const s of sales) {
      if (!inRange(s.date)) continue;
      if (salesMethod !== 'todos' && s.payment_method !== salesMethod) continue;
      const debt = computeSaleDebt(s);
      const estado = s.payment_method !== 'cuenta_corriente' ? 'Pagada' : debt === 0 ? 'Pagada' : debt < Number(s.total) ? 'Parcial' : 'Adeuda';
      const items = s.sale_items || [];
      if (items.length === 0) {
        rows.push({
          'Fecha': fmtDate(s.date), 'Cliente': s.contact_name || '', 'Producto': '', 'Marca': '',
          'Variante': '', 'Categoría': '', 'Cantidad': 0, 'Precio unit.': 0, 'Subtotal': 0,
          'Método de pago': METHOD_LABEL[s.payment_method] || s.payment_method,
          'Total venta': Number(s.total || 0), 'Saldo pendiente': debt, 'Estado': estado
        });
        continue;
      }
      for (const it of items) {
        const prod = productMap[it.product_id];
        rows.push({
          'Fecha': fmtDate(s.date),
          'Cliente': s.contact_name || '',
          'Producto': it.product_name || '',
          'Marca': prod?.brand || '',
          'Variante': it.size || '',
          'Categoría': prod?.category || '',
          'Cantidad': Number(it.qty || 0),
          'Precio unit.': Number(it.unit_price || 0),
          'Subtotal': Number(it.qty || 0) * Number(it.unit_price || 0),
          'Método de pago': METHOD_LABEL[s.payment_method] || s.payment_method,
          'Total venta': Number(s.total || 0),
          'Saldo pendiente': debt,
          'Estado': estado
        });
      }
    }
    exportXlsx(`nura-ventas-${todayStamp()}.xlsx`, [{ name: 'Ventas', rows }]);
  };

  // ----- 2. COMPRAS -----
  const exportPurchases = () => {
    const rows = [];
    for (const p of purchases) {
      if (!inRange(p.date)) continue;
      const items = p.purchase_items || [];
      if (items.length === 0) {
        rows.push({
          'Fecha': fmtDate(p.date), 'Proveedor': p.contact_name || '', 'Producto': '', 'Marca': '',
          'Variante': '', 'Categoría': '', 'Cantidad': 0, 'Precio unit.': 0, 'Subtotal': 0,
          'Método de pago': METHOD_LABEL[p.payment_method] || p.payment_method,
          'Total compra': Number(p.total || 0)
        });
        continue;
      }
      for (const it of items) {
        const prod = productMap[it.product_id];
        rows.push({
          'Fecha': fmtDate(p.date),
          'Proveedor': p.contact_name || '',
          'Producto': it.product_name || '',
          'Marca': prod?.brand || '',
          'Variante': it.size || '',
          'Categoría': prod?.category || '',
          'Cantidad': Number(it.qty || 0),
          'Precio unit.': Number(it.unit_cost || 0),
          'Subtotal': Number(it.qty || 0) * Number(it.unit_cost || 0),
          'Método de pago': METHOD_LABEL[p.payment_method] || p.payment_method,
          'Total compra': Number(p.total || 0)
        });
      }
    }
    exportXlsx(`nura-compras-${todayStamp()}.xlsx`, [{ name: 'Compras', rows }]);
  };

  // ----- 3. STOCK -----
  const exportStock = () => {
    const rows = [];
    let totalUnits = 0;
    let totalValue = 0;
    for (const p of products) {
      if (stockCategory !== 'todas' && p.category !== stockCategory) continue;
      const stock = Number(p.stock ?? 0);
      if (stockOnlyLow && stock >= Number(stockThreshold)) continue;
      const v5 = p.variants?.find(v => v.size === '5ml')?.price || 0;
      const v100 = p.variants?.find(v => v.size === '100ml')?.price || 0;
      const valor = stock * Number(v100);
      totalUnits += stock;
      totalValue += valor;
      rows.push({
        'Marca': p.brand || '',
        'Nombre': p.name || '',
        'Categoría': p.category || '',
        'Stock (frascos)': stock,
        'Precio 5ml': Number(v5),
        'Precio 100ml': Number(v100),
        'Valor inventario': valor
      });
    }
    rows.sort((a, b) => {
      const c = String(a['Marca']).localeCompare(String(b['Marca']));
      return c !== 0 ? c : String(a['Nombre']).localeCompare(String(b['Nombre']));
    });
    if (rows.length > 0) {
      rows.push({
        'Marca': '', 'Nombre': 'TOTAL', 'Categoría': '',
        'Stock (frascos)': totalUnits, 'Precio 5ml': '', 'Precio 100ml': '', 'Valor inventario': totalValue
      });
    }
    exportXlsx(`nura-stock-${todayStamp()}.xlsx`, [{ name: 'Stock', rows }]);
  };

  // ----- 4. DEUDORES -----
  const exportDebtors = () => {
    const byContact = {};
    for (const s of sales) {
      const debt = computeSaleDebt(s);
      if (debt <= 0) continue;
      const name = (s.contact_name || '').trim() || '(Sin nombre)';
      if (!byContact[name]) byContact[name] = { count: 0, total: 0, lastDate: '' };
      byContact[name].count += 1;
      byContact[name].total += debt;
      if (!byContact[name].lastDate || s.date > byContact[name].lastDate) byContact[name].lastDate = s.date;
    }
    const today = new Date(todayStr() + 'T00:00:00');
    const rows = Object.entries(byContact).map(([name, d]) => {
      const lastD = new Date(d.lastDate + 'T00:00:00');
      const days = Math.max(0, Math.floor((today - lastD) / 86400000));
      return {
        'Cliente': name,
        'Ventas pendientes': d.count,
        'Saldo total': d.total,
        'Última venta': fmtDate(d.lastDate),
        'Días desde última venta': days
      };
    }).sort((a, b) => b['Saldo total'] - a['Saldo total']);
    if (rows.length > 0) {
      const totalGeneral = rows.reduce((s, r) => s + r['Saldo total'], 0);
      rows.push({ 'Cliente': 'TOTAL', 'Ventas pendientes': '', 'Saldo total': totalGeneral, 'Última venta': '', 'Días desde última venta': '' });
    }
    exportXlsx(`nura-deudores-${todayStamp()}.xlsx`, [{ name: 'Deudores', rows }]);
  };

  // ----- 5. TOP PRODUCTOS -----
  const exportTopProducts = () => {
    const map = {};
    for (const s of sales) {
      if (!inRange(s.date)) continue;
      // Las ventas históricas del Excel tienen productos de texto libre poco
      // confiables; no las contamos en el ranking de productos.
      if (String(s.note || '').startsWith('Histórico (Excel)')) continue;
      for (const it of (s.sale_items || [])) {
        const key = it.product_id || it.product_name;
        if (!map[key]) {
          const prod = productMap[it.product_id];
          map[key] = { name: it.product_name || prod?.name || '', brand: prod?.brand || '', qty: 0, revenue: 0 };
        }
        map[key].qty += Number(it.qty || 0);
        map[key].revenue += Number(it.qty || 0) * Number(it.unit_price || 0);
      }
    }
    let arr = Object.values(map).sort((a, b) => b.qty - a.qty);
    if (topN && topN !== 'todos') arr = arr.slice(0, Number(topN));
    const rows = arr.map((p, i) => ({
      'Ranking': i + 1,
      'Producto': p.name,
      'Marca': p.brand,
      'Unidades vendidas': p.qty,
      'Ingreso generado': p.revenue
    }));
    exportXlsx(`nura-top-productos-${todayStamp()}.xlsx`, [{ name: 'Top productos', rows }]);
  };

  // ----- 6. RESUMEN FINANCIERO -----
  const exportFinancial = () => {
    const months = {};
    for (const s of sales) {
      if (!inRange(s.date)) continue;
      const k = monthKey(s.date);
      if (!months[k]) months[k] = { ingresos: 0, egresos: 0 };
      months[k].ingresos += Number(s.total || 0);
    }
    for (const p of purchases) {
      if (!inRange(p.date)) continue;
      const k = monthKey(p.date);
      if (!months[k]) months[k] = { ingresos: 0, egresos: 0 };
      months[k].egresos += Number(p.total || 0);
    }
    const rows = Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({
        'Mes': monthLabel(k),
        'Ingresos': v.ingresos,
        'Egresos': v.egresos,
        'Ganancia neta': v.ingresos - v.egresos
      }));
    if (rows.length > 0) {
      const totIn = rows.reduce((s, r) => s + r['Ingresos'], 0);
      const totEg = rows.reduce((s, r) => s + r['Egresos'], 0);
      rows.push({ 'Mes': 'TOTAL', 'Ingresos': totIn, 'Egresos': totEg, 'Ganancia neta': totIn - totEg });
    }
    exportXlsx(`nura-resumen-financiero-${todayStamp()}.xlsx`, [{ name: 'Resumen financiero', rows }]);
  };

  if (loading && !loaded) {
    return <div className="reports__loading">Cargando datos…</div>;
  }

  return (
    <div className="reports">
      <div className="reports__intro">
        <FileSpreadsheet size={20} />
        <div>
          <h3 className="reports__title">Informes</h3>
          <p className="reports__subtitle">Exportá la información del negocio en formato Excel. Aplicá los filtros y descargá el archivo.</p>
        </div>
      </div>

      <div className="reports__global">
        <h4 className="reports__section-title">Rango de fechas</h4>
        <div className="reports__presets">
          <button type="button" className="reports__preset" onClick={() => applyPreset('hoy')}>Hoy</button>
          <button type="button" className="reports__preset" onClick={() => applyPreset('mes')}>Mes actual</button>
          <button type="button" className="reports__preset" onClick={() => applyPreset('mesPasado')}>Mes pasado</button>
          <button type="button" className="reports__preset" onClick={() => applyPreset('anio')}>Año</button>
          <button type="button" className="reports__preset" onClick={() => applyPreset('todo')}>Todo</button>
        </div>
        <div className="reports__date-fields">
          <label className="reports__field">
            <span>Desde</span>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </label>
          <label className="reports__field">
            <span>Hasta</span>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          </label>
        </div>
        <p className="reports__range-hint">Período actual: <strong>{rangeLabel()}</strong></p>
      </div>

      <div className="reports__grid">
        <div className="report-card">
          <div className="report-card__head">
            <h4>Ventas</h4>
            <p>Detalle de todas las ventas en el período, con cliente, productos, importes y estado de cobro.</p>
          </div>
          <div className="report-card__filters">
            <label className="reports__field">
              <span>Método de pago</span>
              <select value={salesMethod} onChange={e => setSalesMethod(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="cuenta_corriente">Cuenta corriente</option>
              </select>
            </label>
          </div>
          <button className="report-card__btn" onClick={exportSales}>
            <Download size={16} /> Exportar Excel
          </button>
        </div>

        <div className="report-card">
          <div className="report-card__head">
            <h4>Compras</h4>
            <p>Detalle de compras a proveedores en el período, con productos y montos.</p>
          </div>
          <button className="report-card__btn" onClick={exportPurchases}>
            <Download size={16} /> Exportar Excel
          </button>
        </div>

        <div className="report-card">
          <div className="report-card__head">
            <h4>Stock disponible</h4>
            <p>Estado actual del inventario con valor estimado (en base al precio de 100ml).</p>
          </div>
          <div className="report-card__filters">
            <label className="reports__field">
              <span>Categoría</span>
              <select value={stockCategory} onChange={e => setStockCategory(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="unisex">Unisex</option>
                <option value="combos">Combos</option>
              </select>
            </label>
            <label className="reports__field reports__field--check">
              <input type="checkbox" checked={stockOnlyLow} onChange={e => setStockOnlyLow(e.target.checked)} />
              <span>Solo stock bajo (&lt; <input type="number" min="0" max="999" value={stockThreshold} onChange={e => setStockThreshold(e.target.value)} className="reports__inline-num" />)</span>
            </label>
          </div>
          <button className="report-card__btn" onClick={exportStock}>
            <Download size={16} /> Exportar Excel
          </button>
        </div>

        <div className="report-card">
          <div className="report-card__head">
            <h4>Deudores</h4>
            <p>Clientes con saldo pendiente, monto adeudado, última venta y días desde entonces. No depende del rango.</p>
          </div>
          <button className="report-card__btn" onClick={exportDebtors}>
            <Download size={16} /> Exportar Excel
          </button>
        </div>

        <div className="report-card">
          <div className="report-card__head">
            <h4>Top productos vendidos</h4>
            <p>Ranking de los más vendidos en el período (por cantidad), con ingresos generados.</p>
          </div>
          <div className="report-card__filters">
            <label className="reports__field">
              <span>Mostrar</span>
              <select value={topN} onChange={e => setTopN(e.target.value)}>
                <option value="5">Top 5</option>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="todos">Todos</option>
              </select>
            </label>
          </div>
          <button className="report-card__btn" onClick={exportTopProducts}>
            <Download size={16} /> Exportar Excel
          </button>
        </div>

        <div className="report-card">
          <div className="report-card__head">
            <h4>Resumen financiero</h4>
            <p>Ingresos, egresos y ganancia neta agrupados por mes dentro del rango.</p>
          </div>
          <button className="report-card__btn" onClick={exportFinancial}>
            <Download size={16} /> Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
