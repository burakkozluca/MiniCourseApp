import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalCart } from '../context/LocalCartContext';
import { cartService } from '../services/cartService';
import './Navbar.css';

const Navbar = () => {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const { localCart } = useLocalCart();
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Backend'den cart sayısını al
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated()) {
        try {
          const response = await cartService.getCart();
          if (response.data.isSuccess) {
            setCartCount(response.data.data.length);
          }
        } catch (error) {
          console.error('Cart count fetch error:', error);
        }
      }
    };

    fetchCartCount();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      navigate(`/?search=${value.trim()}`);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Cart içindeki ürün sayısını hesapla
  const getCartItemCount = () => {
    return isAuthenticated() ? cartCount : localCart?.length || 0;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">MiniUdemy</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            {isAuthenticated() && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-courses" onClick={closeMenu}>
                  My Courses
                </Link>
              </li>
            )}
          </ul>

          <form className="d-flex mx-auto search-form" onSubmit={handleSubmit}>
            <input
              type="search"
              className="form-control search-input"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>

          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/cart" onClick={closeMenu}>
                Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
              </Link>
            </li>

            {isAuthenticated() ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    type="button"
                    className="nav-link btn btn-link" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
                {isAdmin() && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin" onClick={closeMenu}>
                      Admin
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeMenu}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;