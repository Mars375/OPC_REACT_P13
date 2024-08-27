import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Create an axios instance with default configuration.
 * The base URL is set to the API endpoint and the content type is set to JSON.
 */
const api = axios.create({
  baseURL: 'https://opc-react-p13.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add a request interceptor to include the token in headers.
 * The token is retrieved from cookies and added to the Authorization header.
 */
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
