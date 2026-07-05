import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useSales } from '../context/SalesContext';
import TransactionForm from './TransactionForm';
import './AdminTransactions.css';

const money = (n) => Number(n || 0).toLocaleString('es-AR');
const fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = String(d).slice(0, 10).split('-');
  return `${day}/${m}/${y}`;
};
const methodLabel = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  cuenta_corriente: 'Cuenta corriente'
};

const AdminTransactions = ({ mode }) => {
  const isSale = mode === 'venta';
  const { products, adjustStock } = useCatalog();
  const {
    sales, purchases, loadAll, loaded, loading,
    createSale, createPurchase, updateSale, updatePurchase, deleteSale, deletePurchase
  } = useSales();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // tx en edición
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loaded) loadAll();
  }, [loaded, loadAll]);

  const list = isSale ? sales : purchases;
  const itemsKey = isSale ? 'sale_items' : 'purchase_items';
  const amountKey = isSale ? 'unit_price' : 'unit_cost';

  const handleSubmit = async ({ header, items }) => {
    setSubmitting(true);
    setError('');
    try {
      if (isSale) {
        await createSale({ header, items });
        for (const it of items) {
          if (it.affects_stock) await adjustStock(it.product_id, -it.qty);
        }
      } else {
        await createPurchase({ header, items });
        for (const it of items) {
          if (it.affects_stock) await adjustStock(it.product_id, it.qty);
        }
      }
      setShowForm(false);
    } catch (err) {
      setError('No se pudo guardar: ' + (err?.message || 'error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Guarda la edición de una venta/compra reconciliando el stock: revierte
  // el efecto de los ítems viejos y aplica el de los nuevos.
  const handleUpdate = async ({ header, items }) => {
    if (!editing) return;
    setSubmitting(true);
    setError('');
    try {
      const oldItems = editing[itemsKey] || [];
      for (const it of oldItems) {
        if (it.affects_stock) await adjustStock(it.product_id, isSale ? it.qty : -it.qty); // revertir
      }
      if (isSale) await updateSale(editing.id, { header, items });
      else await updatePurchase(editing.id, { header, items });
      for (const it of items) {
        if (it.affects_stock) await adjustStock(it.product_id, isSale ? -it.qty : it.qty); // aplicar
      }
      setEditing(null);
    } catch (err) {
      setError('No se pudo guardar: ' + (err?.message || 'error'));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (tx) => {
    setShowForm(false);
    setConfirmDelete(null);
    setError('');
    setEditing(tx);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const editInitial = editing ? {
    date: editing.date,
    contact_name: editing.contact_name,
    payment_method: editing.payment_method,
    paid: editing.paid,
    note: editing.note,
    items: editing[itemsKey] || []
  } : null;

  const handleDelete = async (tx) => {
    setError('');
    try {
      const items = tx[itemsKey] || [];
      // Revertir stock antes de borrar
      for (const it of items) {
        if (it.affects_stock) await adjustStock(it.product_id, isSale ? it.qty : -it.qty);
      }
      if (isSale) await deleteSale(tx.id);
      else await deletePurchase(tx.id);
      setConfirmDelete(null);
    } catch (err) {
      setError('No se pudo eliminar: ' + (err?.message || 'error'));
    }
  };

  return (
    <div className="admin-tx">
      {error && <div className="admin-error-banner">{error}</div>}

      {!showForm && !editing && (
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={20} /> {isSale ? 'Registrar venta' : 'Registrar compra'}
        </button>
      )}

      {showForm && !editing && (
        <TransactionForm
          mode={mode}
          products={products}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}

      {editing && (
        <TransactionForm
          mode={mode}
          products={products}
          initial={editInitial}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          submitting={submitting}
        />
      )}

      <h3 className="admin-tx__title">
        {isSale ? 'Ventas' : 'Compras'} ({list.length})
      </h3>

      {loading && !loaded ? (
        <p className="admin-tx__loading">Cargando…</p>
      ) : list.length === 0 ? (
        <div className="admin-tx__empty"><p>Todavía no hay {isSale ? 'ventas' : 'compras'} registradas.</p></div>
      ) : (
        <div className="admin-tx__list">
          {list.map(tx => {
            const items = tx[itemsKey] || [];
            const debe = tx.payment_method === 'cuenta_corriente'
              ? Math.max(0, Number(tx.total) - Number(tx.paid))
              : 0;
            return (
              <div key={tx.id} className="admin-tx__item">
                <div className="admin-tx__item-main">
                  <div className="admin-tx__item-top">
                    <span className="admin-tx__date">{fmtDate(tx.date)}</span>
                    {tx.contact_name && <span className="admin-tx__person">{tx.contact_name}</span>}
                    <span className={`admin-tx__method admin-tx__method--${tx.payment_method}`}>
                      {methodLabel[tx.payment_method] || tx.payment_method}
                    </span>
                  </div>
                  <div className="admin-tx__products">
                    {items.map(it => (
                      <span key={it.id} className="admin-tx__product">
                        {it.product_name}{it.size ? ` (${it.size})` : ''} ×{it.qty} — ${money(it[amountKey])}
                      </span>
                    ))}
                  </div>
                  {tx.note && <div className="admin-tx__note">{tx.note}</div>}
                </div>
                <div className="admin-tx__item-side">
                  <span className="admin-tx__total">${money(tx.total)}</span>
                  {debe > 0 && <span className="admin-tx__debt">Debe ${money(debe)}</span>}
                  {confirmDelete === tx.id ? (
                    <div className="admin-tx__confirm">
                      <button className="admin-tx__confirm-yes" onClick={() => handleDelete(tx)}>Sí</button>
                      <button className="admin-tx__confirm-no" onClick={() => setConfirmDelete(null)}>No</button>
                    </div>
                  ) : (
                    <div className="admin-tx__actions">
                      <button className="admin-tx__edit" onClick={() => startEdit(tx)} title="Editar">
                        <Edit3 size={15} />
                      </button>
                      <button className="admin-tx__delete" onClick={() => setConfirmDelete(tx.id)} title="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
