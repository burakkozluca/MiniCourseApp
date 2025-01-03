import axiosInstance from "./axiosInstance";

/**
 * @typedef {Object} CreateUserRequest
 * @property {string} email
 * @property {string} password
 * @property {string} username
 */

/**
 * @typedef {Object} UpdatePasswordRequest
 * @property {string} oldPassword
 * @property {string} newPassword
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {string} email
 * @property {string} username
 */

export const userService = {
  /**
   * @param {CreateUserRequest} request
   */
  createUser: (request) => {
    return axiosInstance.post('/user/createuser', request);
  },

  getUser: () => {
    return axiosInstance.get('/user/getuser');
  },

  /**
   * @param {UpdatePasswordRequest} request
   * @param {string} userId
   */
  changePassword: (request, userId) => {
    return axiosInstance.post(`/user/changepassword?userId=${userId}`, request);
  },

  /**
   * @param {UpdateUserRequest} request
   */
  updateProfile: (request) => {
    return axiosInstance.post('/user/updateprofile', request);
  },
};