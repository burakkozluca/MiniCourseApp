import axiosInstance from './axiosInstance';

/**
 * @typedef {Object} CreateCourseRequest
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {number} categoryId
 * @property {File} image
 */

/**
 * @typedef {Object} UpdateCourseRequest
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {number} categoryId
 * @property {File} [image]
 */

/**
 * @typedef {Object} UpdateStockRequest
 * @property {number} id
 * @property {number} stock
 */

export const courseService = {
  getAll: () => {
    return axiosInstance.get('/Courses');
  },

  /**
   * @param {number} id
   */
  getById: (id) => {
    return axiosInstance.get(`/Courses/${id}`);
  },

  /**
   * @param {number} pageNumber
   * @param {number} pageSize
   */
  getPaged: (pageNumber, pageSize) => {
    return axiosInstance.get(`/Courses/${pageNumber}/${pageSize}`);
  },

  /**
   * @param {CreateCourseRequest} request
   */
  create: (request) => {
    console.log('Request Headers:', {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    });

    return axiosInstance.post('/Courses', request, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
    });
  },

  /**
   * @param {UpdateCourseRequest} request
   */
  update: (request) => {
    console.log('Update Request FormData entries:');
    for (let pair of request.entries()) {
      console.log(pair[0], pair[1]);
    }

    return axiosInstance.put('/Courses', request, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
    });
  },

  /**
   * @param {UpdateStockRequest} request
   */
  updateStock: (request) => {
    return axiosInstance.patch('/Courses/Stock', request);
  },

  /**
   * @param {number} id
   */
  delete: (id) => {
    return axiosInstance.delete(`/Courses/${id}`);
  },

  getImageUrl: (imageUrl) => {
    if (!imageUrl) return null;
    return `http://localhost:5250/Resources/${imageUrl}`;
  },
};