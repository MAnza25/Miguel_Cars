import axios from 'axios';

// En desarrollo Vite proxea /api → http://localhost:8080/api
// En producción apuntar a la URL del backend real
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
