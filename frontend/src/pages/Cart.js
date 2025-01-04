import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { courseService } from '../services/courseService';
import alertify from 'alertifyjs';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current cartItems state:', cartItems);
  }, [cartItems]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      console.log('Fetching cart items...');
      const response = await cartService.getCart();
      console.log('Full Cart Response:', response);
      console.log('Response Data:', response.data);
      console.log('Cart Items:', response.data.data);

      if (response.data.isSuccess) {
        const items = response.data.data;
        console.log('Parsed cart items:', items);
        
        if (Array.isArray(items)) {
          console.log('Setting cart items:', items);
          setCartItems(items);
        } else {
          console.error('Cart items is not an array:', items);
          setError('Invalid cart data format');
        }
      } else {
        console.error('Failed response:', response.data);
        setError(response.data.message || 'Failed to fetch cart items');
      }
    } catch (err) {
      console.error('Cart Error:', err);
      console.error('Error Response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch cart items');
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
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alertify.error('Your cart is empty');
      return;
    }
    navigate('/payment');
  };

  const renderCartItems = () => {
    console.log('Rendering cart items:', cartItems);
    
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return <div className="alert alert-info">Your cart is empty</div>;
    }

    return (
      <div className="cart-items">
        {cartItems.map(item => {
          console.log('Rendering item:', item);
          return (
            <div key={item.id} className="cart-item card mb-3">
              <div className="row g-0">
                <div className="col-md-2">
                  <img
                    src={courseService.getImageUrl(item.imageUrl) || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    onError={(e) => {
                      console.log('Image load error for:', item.name);
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
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
          {cartItems.length > 0 && (
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