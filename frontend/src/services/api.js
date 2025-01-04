import axios from "axios";

const API_URL = "http://localhost:5250/api";

export const fetchProduct = () => axios.get(`${API_URL}/Courses`);
export const fetchProductById = (id) => axios.get(`${API_URL}/Courses/${id}`);