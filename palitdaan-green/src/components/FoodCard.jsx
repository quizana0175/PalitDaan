import React from 'react';
import '../css/FoodCard.css';

const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23dcfce7"><rect width="100%" height="100%" fill="%23e7f5ec"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍽️</text><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23166534" font-weight="bold">PalitDaan Green Choice</text></svg>`;

export default function FoodCard({
  name,
  price,
  image,
  description,
  category,
  rating = '4.8',
  calories,
  isSoldOut = false,
  stock,
  onAddToCart
}) {
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackSvg;
  };

  return (
    <div className="foodcard-grid">
      <div className={`food-card ${isSoldOut ? 'sold-out-card' : ''}`}>
        <div className="food-image-wrapper">
          <img
            src={image || fallbackSvg}
            alt={name}
            className={`food-image ${isSoldOut ? 'grayscale-img' : ''}`}
            onError={handleImgError}
            loading="lazy"
          />
          {category && <span className="food-badge">{category}</span>}
          {rating && <span className="food-rating-badge">★ {rating}</span>}

          {isSoldOut && (
            <div className="sold-out-banner-overlay">
              <span>SOLD OUT</span>
            </div>
          )}
        </div>

        <div className="food-info">
          <h3>{name}</h3>
          <p className="food-description">{description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            {calories && <span className="food-calorie-tag">⚡ {calories}</span>}
            {typeof stock === 'number' && !isSoldOut && (
              <span style={{ fontSize: '11px', color: stock <= 5 ? '#b45309' : '#15803d', fontWeight: 700 }}>
                {stock <= 5 ? `🔥 Only ${stock} left!` : `In Stock (${stock})`}
              </span>
            )}
          </div>

          <div className="food-price-row">
            <p className="price">₱{typeof price === 'number' ? price.toFixed(2) : price}</p>
            
            {isSoldOut ? (
              <button
                className="add-cart-btn disabled-btn"
                disabled
                aria-label={`${name} is sold out`}
              >
                ✕ Sold Out
              </button>
            ) : (
              <button
                className="add-cart-btn"
                onClick={onAddToCart}
                aria-label={`Add ${name} to cart`}
              >
                <span>🛒</span> Ibutang sa Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
