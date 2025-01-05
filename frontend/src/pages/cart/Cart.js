import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { useLocalCart } from '../../context/LocalCartContext';
import alertify from 'alertifyjs';
import './Cart.css';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { localCart, removeFromLocalCart } = useLocalCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      setLoading(true);
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      const response = await cartService.getCart();
      if (response.data.isSuccess) {
        setCartItems(response.data.data);
      } else {
        setError('Failed to fetch cart items');
      }
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId) => {
    try {
      await cartService.removeFromCart(courseId);
      alertify.success('Item removed from cart');
      fetchCartItems();
    } catch (err) {
      alertify.error('Failed to remove item from cart');
      console.error('Error:', err);
    }
  };

  const calculateTotal = () => {
    const items = isAuthenticated() ? cartItems : localCart;
    return items.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/payment');
  };

  const renderCartItems = () => {
    const items = isAuthenticated() ? cartItems : localCart;
    
    if (!items || items.length === 0) {
      return <div className="alert alert-info">Your cart is empty</div>;
    }

    return (
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item card mb-3">
            <div className="row g-0">
              <div className="col-md-2">
                <img
                  src={courseService.getImageUrl(item.imageUrl) || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="img-fluid rounded-start"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text"><strong>${item.price}</strong></p>
                </div>
              </div>
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                <button
                  className="btn btn-danger"
                  onClick={() => isAuthenticated() 
                    ? handleRemoveItem(item.id) 
                    : removeFromLocalCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="cart-page container py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {renderCartItems()}
          {(isAuthenticated() ? cartItems : localCart).length > 0 && (
            <div className="cart-summary card mt-4">
              <div className="card-body">
                <h5 className="card-title">Cart Summary</h5>
                <p className="card-text">Total: ${calculateTotal()}</p>
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;