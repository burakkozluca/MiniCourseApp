import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { useLocalCart } from './LocalCartContext';
import { useNavigate } from 'react-router-dom';
import alertify from 'alertifyjs';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { localCart, clearLocalCart } = useLocalCart();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken);
        } else {
          const response = await authService.refreshToken();
          if (response?.data?.isSuccess) {
            const { accessToken } = response.data.data;
            setUser(jwtDecode(accessToken));
          }
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  };

  const transferLocalCartToBackend = async () => {
    try {
      // Local cart'taki her ürün için backend'e ekleme yap
      for (const item of localCart) {
        await cartService.addToCart(item.id);
      }
      // Local cart'ı temizle
      clearLocalCart();
    } catch (error) {
      console.error('Error transferring local cart:', error);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.data.isSuccess) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(jwtDecode(accessToken));
      
      // Login başarılı olduktan sonra local cart'ı transfer et
      if (localCart.length > 0) {
        await transferLocalCartToBackend();
      }
      
      if (navigate) navigate('/');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    if (navigate) navigate('/login');
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    console.log('isAuthenticated check - token:', token);
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) 
        return true;
    } catch {
      console.log('isAuthenticated check - token is expired');
      return false;
    }
  };

  const isAdmin = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      return decodedToken.Role === 'admin' || decodedToken.role === 'admin' || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "admin";
    } catch (error) {
      console.error('Token decode error:', error);
      return false;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);