import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Adjust the base URL according to your backend
});

export const fetchProducts = () => api.get('/product');
export const fetchProductById = (id) => api.get(`/product/${id}`);
export const userLogin = (credentials) => api.post('/user/login', credentials);
export const userRegister = (data) => api.post('/user/register', data);

// Add more API calls as needed
