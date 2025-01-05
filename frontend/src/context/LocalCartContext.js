import React, { createContext, useContext, useState, useEffect } from 'react';
import alertify from 'alertifyjs';

const LocalCartContext = createContext(null);

export const LocalCartProvider = ({ children }) => {
  const [localCart, setLocalCart] = useState([]);

  // Component mount olduğunda local storage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('localCart');
    if (savedCart) {
      setLocalCart(JSON.parse(savedCart));
    }
  }, []);

  // Sepet değiştiğinde local storage'ı güncelle
  useEffect(() => {
    localStorage.setItem('localCart', JSON.stringify(localCart));
  }, [localCart]);

  const addToLocalCart = (course) => {
    if (localCart.some(item => item.id === course.id)) {
      alertify.warning('Course is already in cart');
      return;
    }
    setLocalCart([...localCart, course]);
    alertify.success('Course added to cart');
  };

  const removeFromLocalCart = (courseId) => {
    setLocalCart(localCart.filter(item => item.id !== courseId));
    alertify.success('Course removed from cart');
  };

  const clearLocalCart = () => {
    setLocalCart([]);
    localStorage.removeItem('localCart');
  };

  return (
    <LocalCartContext.Provider value={{
      localCart,
      addToLocalCart,
      removeFromLocalCart,
      clearLocalCart
    }}>
      {children}
    </LocalCartContext.Provider>
  );
};

export const useLocalCart = () => useContext(LocalCartContext); 