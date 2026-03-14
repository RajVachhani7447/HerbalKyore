import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useConfirm } from '../context/ConfirmContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { showConfirm } = useConfirm();

  const handleQuantityChange = async (index, change) => {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
      const confirmed = await showConfirm('Remove this item from cart?');
      if (confirmed) {
        removeFromCart(index);
      }
    } else {
      updateQuantity(index, newQuantity);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <Header />
      <main className="cart-page">
        <h2>Your Cart</h2>
        <div id="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '56px', color: '#d1d8ce', marginBottom: '16px', display: 'block' }}></i>
              <p style={{ fontSize: '18px', color: '#5a6556', fontWeight: '500', marginBottom: '8px' }}>Your cart is empty</p>
              <p style={{ fontSize: '14px', color: '#a8b3a4' }}>Add some products to get started</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(index, -1)}>–</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div id="cart-summary">
          <h3>
            Total: ₹<span id="cart-total">{getCartTotal()}</span>
          </h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Link to="/">
              <button id="checkout-btn" style={{ background: 'transparent', color: '#227845', border: '1.5px solid #227845' }}>Add More Products</button>
            </Link>
            {cart.length > 0 && (
              <Link to="/address">
                <button id="checkout-btn">Proceed to Checkout</button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
