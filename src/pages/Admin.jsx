import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Lock, LogOut, RotateCcw } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AdminProductForm from '../components/AdminProductForm';
import './Admin.css';

const ADMIN_PASS = 'nura2026';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetCatalog, usingSupabase } = useCatalog();
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [isAuthLegacy, setIsAuthLegacy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionError, setActionError] = useState('');

  // Supabase auth: leer sesión actual y escuchar cambios
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAuth = isSupabaseConfigured ? Boolean(session) : isAuthLegacy;

  const handleLogin = async (e) => {
    e.preventDefault();
    setPassError('');
    if (isSupabaseConfigured) {
      setLoggingIn(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      setLoggingIn(false);
      if (error) setPassError('Email o contraseña incorrectos');
    } else {
      if (password === ADMIN_PASS) setIsAuthLegacy(true);
      else setPassError('Contraseña incorrecta');
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    else setIsAuthLegacy(false);
  };

  const handleSave = async (formData) => {
    setActionError('');
    try {
      if (editingProduct) await updateProduct(editingProduct.id, formData);
      else await addProduct(formData);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      setActionError('No se pudo guardar: ' + (err?.message || 'error desconocido'));
    }
  };

  const handleEdit = (product) => {
    setActionError('');
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setActionError('');
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
    } catch (err) {
      setActionError('No se pudo eliminar: ' + (err?.message || 'error desconocido'));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Mientras Supabase verifica la sesión, evitamos parpadear el login
  if (!authReady) {
    return (
      <div className="admin-page">
        <div className="admin-login"><p>Cargando…</p></div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-login__icon"><Lock size={32} /></div>
          <h2>Panel de Administración</h2>
          <p>{isSupabaseConfigured ? 'Ingresá con tu email y contraseña' : 'Ingresá la contraseña para acceder'}</p>
          <form onSubmit={handleLogin} className="admin-login__form">
            {isSupabaseConfigured && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="admin-login__input"
                autoComplete="username"
                autoFocus
              />
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="admin-login__input"
              autoComplete="current-password"
              autoFocus={!isSupabaseConfigured}
            />
            {passError && <span className="admin-login__error">{passError}</span>}
            <button type="submit" className="btn-gold admin-login__btn" disabled={loggingIn}>
              {loggingIn ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h2 className="admin-header__title">Panel de Administración</h2>
            <p className="admin-header__subtitle">Gestioná tu catálogo de fragancias</p>
          </div>
          <div className="admin-header__actions">
            {!usingSupabase && (
              <button className="btn-outline-gold" onClick={resetCatalog} title="Restaurar ejemplos">
                <RotateCcw size={16} /> Reset
              </button>
            )}
            <button className="btn-outline-gold" onClick={handleLogout}>
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>

        {actionError && (
          <div className="admin-error-banner">{actionError}</div>
        )}

        {!showForm && (
          <button className="admin-add-btn" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
            <Plus size={20} /> Agregar Perfume
          </button>
        )}

        {showForm && (
          <AdminProductForm product={editingProduct} onSave={handleSave} onCancel={handleCancel} />
        )}

        <div className="admin-products">
          <h3 className="admin-products__title">
            Catálogo ({products.length} {products.length === 1 ? 'perfume' : 'perfumes'})
          </h3>

          {products.length === 0 ? (
            <div className="admin-products__empty"><p>No hay perfumes.</p></div>
          ) : (
            <div className="admin-products__list">
              {products.map(product => (
                <div key={product.id} className="admin-product-item">
                  <div className="admin-product-item__image">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="admin-product-item__placeholder">🌙</div>
                    )}
                  </div>
                  <div className="admin-product-item__info">
                    <div className="admin-product-item__top">
                      <span className="admin-product-item__brand">{product.brand}</span>
                      <span className={`admin-product-item__cat admin-product-item__cat--${product.category}`}>
                        {product.category}
                      </span>
                    </div>
                    <h4 className="admin-product-item__name">{product.name}</h4>
                    <div className="admin-product-item__variants">
                      {product.variants.map(v => (
                        <span key={v.size} className="admin-product-item__variant">
                          {v.size}: ${v.price.toLocaleString('es-AR')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="admin-product-item__actions">
                    <button className="admin-product-item__edit" onClick={() => handleEdit(product)} title="Editar">
                      <Edit3 size={16} />
                    </button>
                    {deleteConfirm === product.id ? (
                      <div className="admin-product-item__confirm">
                        <button className="admin-product-item__confirm-yes" onClick={() => handleDelete(product.id)}>
                          Sí
                        </button>
                        <button className="admin-product-item__confirm-no" onClick={() => setDeleteConfirm(null)}>
                          No
                        </button>
                      </div>
                    ) : (
                      <button className="admin-product-item__delete" onClick={() => setDeleteConfirm(product.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
