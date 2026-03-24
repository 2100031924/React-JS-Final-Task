import { useCart } from '../hooks/useCart';
import Icon from './Icon';
import LazyImage from './LazyImage';
import './CartSidebar.css';

export default function CartSidebar() {
  const { items, isOpen, totalPrice, totalItems, removeItem, updateQuantity, toggleCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Your Order</h3>
          <button className="close-cart" onClick={toggleCart}>
            <Icon name="close" />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <Icon name="cart" />
              <p>Your cart is empty</p>
              <span>Add some delicious items!</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <LazyImage src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">${item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeItem(item.id)}>
                  <Icon name="trash" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total ({totalItems} items)</span>
              <span className="total-price">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
              <Icon name="arrowRight" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
