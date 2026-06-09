import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_KEY = 'nura_cart';
const WHATSAPP_NUMBER = '543562447897';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  }, []);

  const addToCart = (product, variant) => {
    const itemKey = `${product.id}_${variant.size}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.key === itemKey);
      if (existing) {
        return prev.map(item =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        key: itemKey,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        size: variant.size,
        price: variant.price,
        quantity: 1
      }];
    });

    showToast(`${product.name} (${variant.size}) agregado al carrito`);
  };

  const updateQuantity = (key, newQty) => {
    if (newQty < 1) {
      removeFromCart(key);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.key === key ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (key) => {
    setCartItems(prev => prev.filter(item => item.key !== key));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const buildWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';

    let msg = '🌙 *Pedido — Nura Fragancias*\n\n';
    cartItems.forEach((item, i) => {
      msg += `${i + 1}. *${item.name}* (${item.brand})\n`;
      msg += `   📦 ${item.size} × ${item.quantity}\n`;
      msg += `   💰 $${(item.price * item.quantity).toLocaleString('es-AR')}\n\n`;
    });
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `*Total: $${cartTotal.toLocaleString('es-AR')}*\n\n`;
    msg += `¡Gracias por elegir Nura! ✨`;

    return encodeURIComponent(msg);
  };

  const getWhatsAppUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      toast,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getWhatsAppUrl
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
