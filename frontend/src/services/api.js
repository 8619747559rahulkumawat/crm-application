import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://crm-application-1yp6.onrender.com/api'  // Live backend URL
    : 'http://localhost:5000/api',  // In development, connect to local backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
