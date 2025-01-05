import axiosInstance from "./axiosInstance";

export const authService = {
  login: (credentials) => {
    return axiosInstance.post('/Auth/CreateToken', credentials);
  },

  getCurrentUser: () => {
    return axiosInstance.get('/User');
  },

  refreshToken: (refreshToken) => {
    return axiosInstance.post('/Auth/CreateTokenByRefreshToken', { token: refreshToken });
  },

  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      return axiosInstance.post('/Auth/RevokeRefreshToken', { token: refreshToken });
    }
    return Promise.resolve();
  },

  forgotPassword: (request) => {
    return axiosInstance.post('/Auth/ForgotPassword', request);
  },

  verifyPasswordReset: (request) => {
    return axiosInstance.post('/Auth/VerifyUserToken', request);
  }
};