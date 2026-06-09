import React from 'react';
import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getWhatsAppUrl
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    window.open(getWhatsAppUrl(), '_blank');
  };

  return (
    <>
      <div className="cart-overlay animate-fade-in" onClick={() => setIsCartOpen(false)} />

      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <h3 className="cart-drawer__title">Tu Carrito</h3>
            <span className="cart-drawer__count">{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</span>
          </div>
          <button
            className="cart-drawer__close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer__items">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">🌙</div>
              <p>Tu carrito está vacío</p>
              <span>Explorá nuestro catálogo y encontrá tu fragancia ideal</span>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div key={item.key} className="cart-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="cart-item__image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="cart-item__placeholder">🌙</div>
                  )}
                </div>

                <div className="cart-item__info">
                  <div className="cart-item__header">
                    <div>
                      <span className="cart-item__brand">{item.brand}</span>
                      <h4 className="cart-item__name">{item.name}</h4>
                      <span className="cart-item__size">{item.size}</span>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.key)}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="cart-item__bottom">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-item__qty-num">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="cart-item__total">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Total</span>
              <span className="cart-drawer__total-amount">
                ${cartTotal.toLocaleString('es-AR')}
              </span>
            </div>

            <button
              className="cart-drawer__checkout"
              onClick={handleCheckout}
              id="whatsapp-checkout"
            >
              <MessageCircle size={18} />
              Enviar pedido por WhatsApp
            </button>

            <button
              className="cart-drawer__clear"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
