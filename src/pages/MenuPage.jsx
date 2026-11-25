import FoodCard from "../components/FoodCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import '../css/MenuPage.css';
import { getMenuItems } from '../utils/menu';

function MenuPage() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    setFoods(getMenuItems());
  }, []);

  const handleAddToCart = (food) => {
    navigate('/special-instructions', { state: { food } });
  };

  return (
    <div className="menu-page">
      <div className="menu-shell">
        <div className="header1">
          <div className="title-container">
            <span className="menu-badge">Featured Picks</span>
            <h1>Mga Pagkaon</h1>
            <h5>Tan-awa unsa imo ganahan paliton.</h5>
          </div>
          <button className="cart-btn" onClick={() => navigate('/cart')} aria-label="View cart">
            🛒 {cartCount > 0 ? `(${cartCount})` : ''}
          </button>
        </div>

        <div className="food-grid">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              name={food.name}
              image={food.image}
              description={food.description}
              price={food.price}
              stock={food.stock}
              onAddToCart={() => handleAddToCart(food)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;