import '../css/FoodCard.css';

function FoodCard({ name, price, image, description, stock, onAddToCart }) {
  return (
    <div className='foodcard-grid'>
      <div className="food-card">
        <img src={image} alt={name} className="food-image" />
        <div className="food-info">
          <h3>{name}</h3>
          <p className="food-description">{description}</p>
          <p className="food-stock">{stock > 0 ? `${stock} available` : 'Out of stock'}</p>
          <div className="food-price-row">
            <p className="price">₱{price.toFixed(2)}</p>
            <button className="add-cart-btn" onClick={onAddToCart} disabled={stock < 1}>
              {stock > 0 ? 'Ibutang sa cart' : 'Out of stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
