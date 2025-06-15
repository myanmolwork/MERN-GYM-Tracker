import axios from 'axios';
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
});

// Add a request interceptor to attach the token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
