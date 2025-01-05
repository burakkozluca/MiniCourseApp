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
 * @property {string} reNewPassword
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} dateOfBirth
 * @property {string} phoneNumber
 */

export const userService = {
  /**
   * @param {CreateUserRequest} request
   */
  createUser: (request) => {
    return axiosInstance.post('/User', request);
  },

  getUser: () => {
    return axiosInstance.get('/User');
  },

  /**
   * @param {UpdatePasswordRequest} request
   */
  changePassword: (request) => {
    return axiosInstance.post(`/User/ChangePassword?userId=${request.userId}`, {
      oldPassword: request.oldPassword,
      newPassword: request.newPassword,
      reNewPassword: request.reNewPassword
    });
  },

  /**
   * @param {UpdateUserRequest} request
   */
  updateProfile: (request) => {
    return axiosInstance.post('/User/UpdateProfile', {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      dateOfBirth: request.dateOfBirth,
      phoneNumber: request.phoneNumber
    });
  },

  resetPassword: (data) => {
    return axiosInstance.post('/User/ResetPassword', {
      email: data.email,
      resetCode: data.token,
      newPassword: data.newPassword
    });
  }
};