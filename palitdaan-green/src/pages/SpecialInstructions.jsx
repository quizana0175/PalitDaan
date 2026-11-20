import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/SpecialInstructions.css';

const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23dcfce7"><rect width="100%" height="100%" fill="%23e7f5ec"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍽️</text><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23166534" font-weight="bold">PalitDaan Green</text></svg>`;

export default function SpecialInstructions() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultFood = {
    id: 99,
    name: 'Classic Cheeseburger',
    price: 85,
    description: 'Juicy beef patty with melted cheese, fresh crisp lettuce, and ripe tomatoes.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  };

  const food = location.state && location.state.food ? location.state.food : defaultFood;

  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [allergens, setAllergens] = useState({
    nuts: false,
    dairy: false,
    eggs: false,
    seafood: false,
    gluten: false,
    others: false,
  });

  const toggleAllergen = (key) => {
    setAllergens((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmOrder = () => {
    const selectedAllergens = [];
    if (allergens.nuts) selectedAllergens.push('Nuts');
    if (allergens.dairy) selectedAllergens.push('Dairy');
    if (allergens.eggs) selectedAllergens.push('Eggs');
    if (allergens.seafood) selectedAllergens.push('Seafood');
    if (allergens.gluten) selectedAllergens.push('Gluten');
    if (allergens.others) selectedAllergens.push('Other Allergies');

    const cartItem = {
      id: Date.now(),
      food: food,
      comment: comment.trim(),
      allergens: selectedAllergens,
      quantity: quantity
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      existingCart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Error saving cart:', err);
    }

    navigate('/cart');
  };

  const unitPrice = typeof food.price === 'number' ? food.price : 85;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="si-container">
      {/* Left Column: Customization Form */}
      <div className="si-left">
        <h1 className="si-title">Special Instructions</h1>
        <p className="si-subtitle">
          Customize your dish, add preparation notes, and notify canteen staff of dietary allergies.
        </p>

        <h3 className="si-section-title">Comments / Special Requests</h3>
        <textarea
          rows="5"
          className="si-textarea"
          placeholder="e.g. Less rice, sauce on the side, extra spicy, no onions..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <h3 className="si-section-title-spaced">Allergen Concerns</h3>
        <p className="si-hint">Select any allergens you are sensitive to:</p>

        <div className="si-allergens-grid">
          <button
            type="button"
            className={`si-allergen-btn ${allergens.nuts ? 'selected' : ''}`}
            onClick={() => toggleAllergen('nuts')}
          >
            <span>🥜</span> Nuts {allergens.nuts && '✓'}
          </button>
          <button
            type="button"
            className={`si-allergen-btn ${allergens.dairy ? 'selected' : ''}`}
            onClick={() => toggleAllergen('dairy')}
          >
            <span>🧀</span> Dairy {allergens.dairy && '✓'}
          </button>
          <button
            type="button"
            className={`si-allergen-btn ${allergens.eggs ? 'selected' : ''}`}
            onClick={() => toggleAllergen('eggs')}
          >
            <span>🥚</span> Eggs {allergens.eggs && '✓'}
          </button>
          <button
            type="button"
            className={`si-allergen-btn ${allergens.seafood ? 'selected' : ''}`}
            onClick={() => toggleAllergen('seafood')}
          >
            <span>🦐</span> Seafood {allergens.seafood && '✓'}
          </button>
          <button
            type="button"
            className={`si-allergen-btn ${allergens.gluten ? 'selected' : ''}`}
            onClick={() => toggleAllergen('gluten')}
          >
            <span>🌾</span> Gluten {allergens.gluten && '✓'}
          </button>
          <button
            type="button"
            className={`si-allergen-btn ${allergens.others ? 'selected' : ''}`}
            onClick={() => toggleAllergen('others')}
          >
            <span>⚠️</span> Others {allergens.others && '✓'}
          </button>
        </div>
      </div>

      {/* Right Column: Order Preview Card */}
      <div className="si-right">
        <div className="si-summary-card">
          <img
            src={food.image || fallbackSvg}
            alt={food.name}
            className="si-food-preview-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackSvg;
            }}
          />

          <div className="si-summary-info">
            <h3>{food.name}</h3>
            <p>{food.description}</p>
          </div>

          <div className="si-qty-selector">
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Quantity:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                className="si-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="si-qty-value">{quantity}</span>
              <button
                type="button"
                className="si-qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="si-total-row">
            <span>Subtotal:</span>
            <span className="si-total-price">₱{totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="si-confirm-btn"
            onClick={handleConfirmOrder}
          >
            <span>✓ Add to Cart & Proceed</span>
          </button>

          <button
            type="button"
            className="si-cancel-btn"
            onClick={() => navigate('/menu')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
