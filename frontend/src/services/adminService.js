import axiosInstance from "./axiosInstance";

/**
 * @typedef {Object} UpdateAdminUserRequest
 * @property {string} email
 * @property {string} username
 * @property {string} role
 */

export const adminService = {
  getAllUsers: () => {
    return axiosInstance.get('/Admin/users');
  },

  /**
   * @param {string} id
   * @param {UpdateAdminUserRequest} request
   */
  updateUser: (id, request) => {
    const formData = new FormData();
    Object.entries(request).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return axiosInstance.put(`/Admin/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};