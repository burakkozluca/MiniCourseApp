import axiosInstance from './axiosInstance';

export const cartService = {
  addToCart: (courseId) => {
    console.log('Adding to cart:', courseId);
    return axiosInstance.post(`/Cart/add/${courseId}`);
  },

  removeFromCart: (courseId) => {
    return axiosInstance.delete(`/Cart/remove/${courseId}`);
  },

  getCart: () => {
    return axiosInstance.get('/Cart');
  },

  clearCart: () => {
    return axiosInstance.delete('/Cart/clear');
  }
}; 