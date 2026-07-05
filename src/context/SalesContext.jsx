import React, { createContext, useState, useContext, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Carga ventas, compras y pagos (datos privados; requiere admin logueado).
  const loadAll = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const [s, p, pay] = await Promise.all([
        supabase.from('sales').select('*, sale_items(*)').order('date', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('purchases').select('*, purchase_items(*)').order('date', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('date', { ascending: false })
      ]);
      if (!s.error && Array.isArray(s.data)) setSales(s.data);
      if (!p.error && Array.isArray(p.data)) setPurchases(p.data);
      if (!pay.error && Array.isArray(pay.data)) setPayments(pay.data);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crea una venta con sus ítems. Devuelve la venta completa.
  const createSale = async ({ header, items }) => {
    const { data: saleRow, error } = await supabase
      .from('sales').insert(header).select().single();
    if (error) throw error;
    let itemRows = [];
    if (items.length) {
      const payload = items.map(it => ({ ...it, sale_id: saleRow.id }));
      const { data, error: e2 } = await supabase.from('sale_items').insert(payload).select();
      if (e2) throw e2;
      itemRows = data || [];
    }
    const full = { ...saleRow, sale_items: itemRows };
    setSales(prev => [full, ...prev]);
    return full;
  };

  const createPurchase = async ({ header, items }) => {
    const { data: purchRow, error } = await supabase
      .from('purchases').insert(header).select().single();
    if (error) throw error;
    let itemRows = [];
    if (items.length) {
      const payload = items.map(it => ({ ...it, purchase_id: purchRow.id }));
      const { data, error: e2 } = await supabase.from('purchase_items').insert(payload).select();
      if (e2) throw e2;
      itemRows = data || [];
    }
    const full = { ...purchRow, purchase_items: itemRows };
    setPurchases(prev => [full, ...prev]);
    return full;
  };

  // Registra un pago parcial (entrega a cuenta) sobre una venta o compra.
  const addPayment = async (payment) => {
    const { data, error } = await supabase.from('payments').insert(payment).select().single();
    if (error) throw error;
    setPayments(prev => [data, ...prev]);
    return data;
  };

  // Edita una venta: actualiza la cabecera y REEMPLAZA todos los ítems
  // (borra los viejos e inserta los nuevos). El ajuste de stock se maneja
  // afuera (en AdminTransactions) revirtiendo lo viejo y aplicando lo nuevo.
  const updateSale = async (id, { header, items }) => {
    const { data: saleRow, error } = await supabase
      .from('sales').update(header).eq('id', id).select().single();
    if (error) throw error;
    const { error: delErr } = await supabase.from('sale_items').delete().eq('sale_id', id);
    if (delErr) throw delErr;
    let itemRows = [];
    if (items.length) {
      const payload = items.map(it => ({ ...it, sale_id: id }));
      const { data, error: e2 } = await supabase.from('sale_items').insert(payload).select();
      if (e2) throw e2;
      itemRows = data || [];
    }
    const full = { ...saleRow, sale_items: itemRows };
    setSales(prev => prev.map(s => s.id === id ? full : s));
    return full;
  };

  const updatePurchase = async (id, { header, items }) => {
    const { data: purchRow, error } = await supabase
      .from('purchases').update(header).eq('id', id).select().single();
    if (error) throw error;
    const { error: delErr } = await supabase.from('purchase_items').delete().eq('purchase_id', id);
    if (delErr) throw delErr;
    let itemRows = [];
    if (items.length) {
      const payload = items.map(it => ({ ...it, purchase_id: id }));
      const { data, error: e2 } = await supabase.from('purchase_items').insert(payload).select();
      if (e2) throw e2;
      itemRows = data || [];
    }
    const full = { ...purchRow, purchase_items: itemRows };
    setPurchases(prev => prev.map(p => p.id === id ? full : p));
    return full;
  };

  // Edita / borra un pago (abono) de un deudor, por si se cargó con error.
  const updatePayment = async (id, patch) => {
    const { data, error } = await supabase.from('payments').update(patch).eq('id', id).select().single();
    if (error) throw error;
    setPayments(prev => prev.map(p => p.id === id ? data : p));
    return data;
  };

  const deletePayment = async (id) => {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) throw error;
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const deleteSale = async (id) => {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) throw error;
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const deletePurchase = async (id) => {
    const { error } = await supabase.from('purchases').delete().eq('id', id);
    if (error) throw error;
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  return (
    <SalesContext.Provider value={{
      sales, purchases, payments, loading, loaded,
      loadAll, createSale, createPurchase, addPayment,
      updateSale, updatePurchase, updatePayment, deletePayment,
      deleteSale, deletePurchase
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error('useSales must be used within SalesProvider');
  return ctx;
};
