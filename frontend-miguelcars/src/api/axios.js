import axios from 'axios';

const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) {
    // Si hay URL de Render, nos aseguramos de que termine en /api si no lo tiene
    return envURL.endsWith('/api') ? envURL : `${envURL}/api`;
  }
  // En local usa el proxy de Vite configurado en vite.config.js
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
