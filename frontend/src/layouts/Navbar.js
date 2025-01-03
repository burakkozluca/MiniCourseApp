import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Dropdown } from 'bootstrap';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  useEffect(() => {
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    dropdownElementList.forEach(dropdownToggle => {
      new Dropdown(dropdownToggle);
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="MiniUdemy" height="34" />
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav align-items-center flex-grow-1">
            <div className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle" 
                data-bs-toggle="dropdown"
              >
                Categories
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/category/development">Development</Link></li>
                <li><Link className="dropdown-item" to="/category/business">Business</Link></li>
                <li><Link className="dropdown-item" to="/category/design">Design</Link></li>
              </ul>
            </div>

            <div className="search-container flex-grow-1 mx-4">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control search-input" 
                  placeholder="Search for anything"
                  aria-label="Search"
                />
                <button className="btn btn-outline-dark" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            <div className="d-none d-lg-block">
              <Link className="nav-link" to="/teach">Teach on MiniUdemy</Link>
            </div>
          </div>

          <div className="navbar-nav align-items-center ms-auto">
            {user ? (
              <>
                <Link className="nav-link d-none d-lg-block" to="/my-learning">
                  My Learning
                </Link>
                <Link className="nav-link" to="/cart">
                  <i className="fas fa-shopping-cart"></i>
                </Link>
                <div className="nav-item dropdown">
                  <button 
                    className="nav-link dropdown-toggle d-flex align-items-center" 
                    data-bs-toggle="dropdown"
                  >
                    <img 
                      src={user.avatar || "/default-avatar.png"} 
                      alt="Profile" 
                      className="profile-pic me-1"
                    />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/my-learning">My Learning</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={logout}>Log out</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Log in</Link>
                <Link className="btn btn-dark signup-btn" to="/signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}