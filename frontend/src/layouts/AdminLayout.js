import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-brand">
            MiniUdemy Admin
          </Link>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin" className="nav-link">
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/courses" className="nav-link">
                <i className="fas fa-book"></i>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="nav-link">
                <i className="fas fa-users"></i>
                Users
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-link">
                <i className="fas fa-home"></i>
                Go to Site
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <div className="header-profile">
            <span>Welcome, {user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}</span>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 