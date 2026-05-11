import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // In production, API will be served from same domain
    : 'http://localhost:5000/api',  // In development, connect to local backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
