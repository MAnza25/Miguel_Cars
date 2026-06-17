import axios from 'axios';

// En desarrollo Vite proxea /api → http://localhost:8080/api (definido en vite.config.js)
// En producción (Vercel) se usa la variable de entorno VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
