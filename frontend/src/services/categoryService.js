import axiosInstance from "./axiosInstance";

export const categoryService = {
  getAll: () => {
    return axiosInstance.get('/Category');
  },

  getById: (id) => {
    return axiosInstance.get(`/Category/${id}`);
  },

  getCategoryWithCourses: (id) => {
    return axiosInstance.get(id ? `/Category/${id}/Courses` : '/Category/Courses');
  },

  create: (request) => {
    return axiosInstance.post('/Category', request);
  },

  update: (request) => {
    return axiosInstance.put('/Category', request);
  },

  delete: (id) => {
    return axiosInstance.delete(`/Category/${id}`);
  },
};