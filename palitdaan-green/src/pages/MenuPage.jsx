import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { getMenuItems } from '../services/db';
import { categories } from '../data/foods';
import '../css/MenuPage.css';

export default function MenuPage() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodsList, setFoodsList] = useState([]);

  const syncCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
    } catch {
      setCartCount(0);
    }
  };

  const loadMenu = () => {
    setFoodsList(getMenuItems());
  };

  useEffect(() => {
    syncCartCount();
    loadMenu();
    window.addEventListener('storage', syncCartCount);
    window.addEventListener('cart-updated', syncCartCount);
    window.addEventListener('menu-updated', loadMenu);
    return () => {
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('cart-updated', syncCartCount);
      window.removeEventListener('menu-updated', loadMenu);
    };
  }, []);

  const handleAddToCart = (food) => {
    if (food.isSoldOut) return;
    navigate('/special-instructions', { state: { food } });
  };

  // Filter foods by category and search term
  const filteredFoods = foodsList.filter((food) => {
    const matchesCategory =
      selectedCategory === 'All Items' || food.category === selectedCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">
      <div className="menu-shell">
        {/* Header Section */}
        <div className="header1">
          <div className="title-container">
            <span className="menu-badge">Featured Picks 🍃</span>
            <h1>Mga Pagkaon</h1>
            <h5>Tan-awa unsa imo ganahan paliton. Fresh and locally sourced.</h5>
          </div>

          <div className="header-actions">
            <button
              className="cart-btn"
              onClick={() => navigate('/cart')}
              aria-label="View shopping cart"
            >
              <span>🛒</span>
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-pill-count">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="menu-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes, drinks, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Dishes */}
        {filteredFoods.length === 0 ? (
          <div className="no-results">
            <p>No dishes found matching "{searchQuery}". Try another keyword or category!</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                name={food.name}
                image={food.image}
                description={food.description}
                price={food.price}
                category={food.category}
                rating={food.rating}
                calories={food.calories}
                isSoldOut={food.isSoldOut}
                stock={food.stock}
                onAddToCart={() => handleAddToCart(food)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
