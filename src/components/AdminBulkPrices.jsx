import React, { useRef, useState } from 'react';
import { Download, Upload, Loader, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { exportXlsx, todayStamp, readWorkbookRows } from '../lib/excel';
import { buildPriceRows, parsePriceRows } from '../lib/priceSheet';
import './AdminBulkPrices.css';

const money = (n) => `$${(Number(n) || 0).toLocaleString('es-AR')}`;

const AdminBulkPrices = () => {
  const { products, updateProduct } = useCatalog();
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null); // { updates, errors, changedCount, unchanged }
  const [reading, setReading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleExport = () => {
    const rows = buildPriceRows(products);
    exportXlsx(`nura-precios-${todayStamp()}.xlsx`, [{ name: 'Precios', rows }]);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite re-seleccionar el mismo archivo
    if (!file) return;
    setError('');
    setResult('');
    setPreview(null);
    setReading(true);
    try {
      const rows = await readWorkbookRows(file);
      const parsed = parsePriceRows(rows, products);
      if (parsed.changedCount === 0 && parsed.errors.length === 0) {
        setError('No se detectaron cambios de precio en el archivo.');
      } else {
        setPreview(parsed);
      }
    } catch (err) {
      setError('No se pudo leer el archivo: ' + (err?.message || 'error desconocido'));
    } finally {
      setReading(false);
    }
  };

  const handleApply = async () => {
    if (!preview?.updates?.length) return;
    setApplying(true);
    setError('');
    setProgress({ done: 0, total: preview.updates.length });
    let ok = 0;
    const failed = [];
    for (const upd of preview.updates) {
      const prod = products.find((p) => p.id === upd.id);
      if (!prod) { failed.push(upd.name); continue; }
      try {
        await updateProduct(upd.id, { ...prod, variants: upd.variants });
        ok++;
      } catch (err) {
        failed.push(upd.name);
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setApplying(false);
    setPreview(null);
    if (failed.length) {
      setError(`Se actualizaron ${ok}, pero fallaron ${failed.length}: ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? '…' : ''}`);
    } else {
      setResult(`✓ ${ok} ${ok === 1 ? 'producto actualizado' : 'productos actualizados'} correctamente.`);
    }
  };

  return (
    <div className="bulk-prices">
      <button className="bulk-prices__toggle" onClick={() => setOpen((o) => !o)}>
        <span>💲 Actualización masiva de precios (Excel)</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="bulk-prices__body">
          <ol className="bulk-prices__steps">
            <li><strong>Exportá</strong> el Excel con los precios actuales.</li>
            <li>Editá <strong>solo las columnas “Precio”</strong> (no toques ID, Producto, Marca ni Tamaño). Usá pesos enteros.</li>
            <li><strong>Importá</strong> el archivo: vas a ver una vista previa antes de aplicar.</li>
          </ol>

          <div className="bulk-prices__actions">
            <button className="bulk-prices__btn" onClick={handleExport}>
              <Download size={16} /> Exportar precios
            </button>
            <button className="bulk-prices__btn bulk-prices__btn--outline" onClick={() => fileRef.current?.click()} disabled={reading || applying}>
              {reading ? <Loader size={16} className="bulk-prices__spin" /> : <Upload size={16} />}
              {reading ? 'Leyendo…' : 'Importar precios'}
            </button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleFile} />
          </div>

          {error && <div className="bulk-prices__error"><AlertTriangle size={15} /> {error}</div>}
          {result && <div className="bulk-prices__success"><Check size={15} /> {result}</div>}

          {applying && (
            <div className="bulk-prices__progress">Aplicando… {progress.done}/{progress.total}</div>
          )}

          {preview && !applying && (
            <div className="bulk-prices__preview">
              <div className="bulk-prices__preview-head">
                Vista previa: <strong>{preview.changedCount}</strong> {preview.changedCount === 1 ? 'producto cambia' : 'productos cambian'} de precio
                {preview.unchanged > 0 && <span className="bulk-prices__muted"> · {preview.unchanged} sin cambios</span>}
              </div>

              {preview.errors.length > 0 && (
                <div className="bulk-prices__warnings">
                  <AlertTriangle size={14} /> {preview.errors.length} advertencia(s):
                  <ul>
                    {preview.errors.slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
                    {preview.errors.length > 6 && <li>… y {preview.errors.length - 6} más</li>}
                  </ul>
                </div>
              )}

              {preview.updates.length > 0 && (
                <div className="bulk-prices__changes">
                  {preview.updates.slice(0, 50).map((u) => (
                    <div key={u.id} className="bulk-prices__change-row">
                      <span className="bulk-prices__change-name">{u.name}</span>
                      <span className="bulk-prices__change-detail">
                        {u.changes.map((c, i) => (
                          <span key={i} className="bulk-prices__change-chip">
                            {c.size}: {money(c.from)} → <strong>{money(c.to)}</strong>
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                  {preview.updates.length > 50 && (
                    <div className="bulk-prices__muted">… y {preview.updates.length - 50} productos más.</div>
                  )}
                </div>
              )}

              {preview.changedCount > 0 && (
                <div className="bulk-prices__confirm">
                  <button className="bulk-prices__btn bulk-prices__btn--outline" onClick={() => setPreview(null)}>Cancelar</button>
                  <button className="bulk-prices__btn bulk-prices__btn--apply" onClick={handleApply}>
                    <Check size={16} /> Aplicar {preview.changedCount} {preview.changedCount === 1 ? 'cambio' : 'cambios'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBulkPrices;
