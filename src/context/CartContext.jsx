import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { discountedPrice } from '../lib/price';
import { useSettings } from './SettingsContext';
import { computeCoupon, normalizeCode } from '../lib/coupons';

const CartContext = createContext();

const CART_KEY = 'nura_cart';
const COUPON_KEY = 'nura_coupon';
const WHATSAPP_FALLBACK = '543562447897';

export const CartProvider = ({ children }) => {
  const { getSetting } = useSettings();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [];
  });

  const [couponCode, setCouponCode] = useState(() => {
    try { return localStorage.getItem(COUPON_KEY) || ''; } catch (e) { return ''; }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    try {
      if (couponCode) localStorage.setItem(COUPON_KEY, couponCode);
      else localStorage.removeItem(COUPON_KEY);
    } catch (e) { /* ignore */ }
  }, [couponCode]);

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
        category: product.category,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        size: variant.size,
        price: discountedPrice(variant.price, product),
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
    setCouponCode('');
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cupones activos guardados por el admin en site_settings.
  const coupons = useMemo(() => {
    try {
      const parsed = JSON.parse(getSetting('coupons', '[]'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }, [getSetting]);

  // Evalúa el cupón ingresado contra el carrito actual.
  const couponState = useMemo(() => {
    const code = normalizeCode(couponCode);
    if (!code) return { code: '', coupon: null, valid: false, discount: 0, reason: '' };
    const coupon = coupons.find(c => normalizeCode(c.code) === code && c.active !== false);
    if (!coupon) return { code, coupon: null, valid: false, discount: 0, reason: 'El código no existe o no está activo.' };
    const result = computeCoupon(coupon, cartItems);
    return { code, coupon, ...result };
  }, [couponCode, coupons, cartItems]);

  const couponDiscount = couponState.valid ? couponState.discount : 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount);

  const applyCoupon = (code) => setCouponCode(normalizeCode(code));
  const removeCoupon = () => setCouponCode('');

  const buildWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';

    let msg = '🌙 *Pedido — Nura Fragancias*\n\n';
    cartItems.forEach((item, i) => {
      msg += `${i + 1}. *${item.name}* (${item.brand})\n`;
      msg += `   📦 ${item.size} × ${item.quantity}\n`;
      msg += `   💰 $${(item.price * item.quantity).toLocaleString('es-AR')}\n\n`;
    });
    msg += `━━━━━━━━━━━━━━━\n`;
    if (couponDiscount > 0) {
      msg += `Subtotal: $${cartSubtotal.toLocaleString('es-AR')}\n`;
      msg += `🎟️ Cupón ${couponState.code}: -$${couponDiscount.toLocaleString('es-AR')}\n`;
    }
    msg += `*Total: $${cartTotal.toLocaleString('es-AR')}*\n\n`;
    msg += `¡Gracias por elegir Nura! ✨`;

    return encodeURIComponent(msg);
  };

  const getWhatsAppUrl = () => {
    const number = (getSetting('whatsapp_number', WHATSAPP_FALLBACK) || WHATSAPP_FALLBACK).replace(/\D/g, '');
    return `https://wa.me/${number}?text=${buildWhatsAppMessage()}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      cartTotal,
      couponState,
      couponDiscount,
      applyCoupon,
      removeCoupon,
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
