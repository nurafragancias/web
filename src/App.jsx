import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './App.css';

const ToastNotification = () => {
  const { toast } = useCart();
  return <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>;
};

const App = () => {
  return (
    <CatalogProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <CartDrawer />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <ToastNotification />
          </div>
        </Router>
      </CartProvider>
    </CatalogProvider>
  );
};

export default App;
