import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import { SalesProvider } from './context/SalesContext';
import { CartProvider, useCart } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import WhatsAppFAB from './components/WhatsAppFAB';
import Home from './pages/Home';
import './App.css';

// Cargados bajo demanda: no viajan en el bundle inicial del público.
// El admin (con la librería de Excel) y promociones se descargan sólo al
// entrar a esas rutas.
const Promociones = lazy(() => import('./pages/Promociones'));
const Admin = lazy(() => import('./pages/Admin'));

const ToastNotification = () => {
  const { toast } = useCart();
  return <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>;
};

// El FAB de WhatsApp solo aparece en las rutas públicas; en /admin no tiene
// sentido mostrarle un contacto al dueño.
const FloatingWhatsApp = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <WhatsAppFAB />;
};

// Al cambiar de PÁGINA (pathname) arrancamos desde arriba. Los cambios de
// query dentro del Home (?marca, ?categoria) no pasan por acá, así que el
// scroll al catálogo que maneja Home sigue funcionando igual. Si hay un
// ancla (#catalogo) dejamos que el navegador/Home hagan su scroll.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => {
  return (
    <SettingsProvider>
    <CatalogProvider>
      <SalesProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="app">
            <Navbar />
            <CartDrawer />
            <main>
              <Suspense fallback={<div className="route-loading">Cargando…</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/promociones" element={<Promociones />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <FloatingWhatsApp />
            <ToastNotification />
          </div>
        </Router>
      </CartProvider>
      </SalesProvider>
    </CatalogProvider>
    </SettingsProvider>
  );
};

export default App;
