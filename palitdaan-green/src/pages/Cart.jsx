import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/db';
import '../css/Cart.css';

const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="%23dcfce7"><rect width="100%" height="100%" fill="%23e7f5ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">🍽️</text></svg>`;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(items);
    } catch {
      setCartItems([]);
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = (item.quantity || 1) + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.food?.price || 0) * (item.quantity || 1),
      0
    );
  };

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    // Sequential counter
    const currentCounter = parseInt(localStorage.getItem('order_counter') || '100', 10);
    const nextCounter = currentCounter + 1;
    localStorage.setItem('order_counter', nextCounter.toString());

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const currentUser = getCurrentUser();
    const newOrder = {
      id: `#PDG-${nextCounter}`,
      date: `${formattedDate} ${formattedTime}`,
      items: cartItems,
      total: calculateTotal(),
      status: 'Pending Payment',
      customer: currentUser?.name || 'Student Customer'
    };

    try {
      const pendingOrders = JSON.parse(localStorage.getItem('pending_orders') || '[]');
      pendingOrders.unshift(newOrder);
      localStorage.setItem('pending_orders', JSON.stringify(pendingOrders));

      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);

      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('orders-updated'));
    } catch (err) {
      console.error('Error creating pending order:', err);
    }

    navigate('/pendingorders');
  };

  return (
    <div className="cart-page-container">
      <h1 className="cart-title">
        <span>Your Shopping Cart</span>
        <span>🛒</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart-state">
          <p>Your cart is empty. Let's find some delicious campus food!</p>
          <button className="back-menu-btn" onClick={() => navigate('/menu')}>
            Browse Menu 🍔
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Item Cards List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={item.food?.image || fallbackSvg}
                  alt={item.food?.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackSvg;
                  }}
                />

                <div className="cart-item-details">
                  <h3>{item.food?.name}</h3>
                  <p className="cart-item-desc">{item.food?.description}</p>

                  {item.allergens && item.allergens.length > 0 && (
                    <div className="cart-item-allergens">
                      <strong>⚠️ Allergens:</strong> {item.allergens.join(', ')}
                    </div>
                  )}

                  {item.comment && (
                    <div className="cart-item-comment">
                      <strong>Notes:</strong> "{item.comment}"
                    </div>
                  )}

                  <div className="cart-item-controls">
                    <span className="cart-item-price">
                      ₱{((item.food?.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="quantity-controller">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Sidebar */}
          <div className="cart-summary-sidebar">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Total Items:</span>
                <span>{totalItemCount} items</span>
              </div>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₱{calculateTotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Eco Canteen Fee:</span>
                <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>FREE (₱0.00)</span>
              </div>

              <div className="summary-row total-row">
                <span>Total Due:</span>
                <span className="price-large">₱{calculateTotal().toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="checkout-btn"
                onClick={handlePlaceOrder}
              >
                Place Order (Proceed to Payment) →
              </button>

              <p className="summary-note">
                Pay Over-The-Counter (OTC) at Canteen Counter 1 or 2.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
