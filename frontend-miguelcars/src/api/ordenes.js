import api from './axios';

export const getOrdenes     = ()        => api.get('/ordenes');
export const getOrdenById   = (id)      => api.get(`/ordenes/${id}`);
export const createOrden    = (data)    => api.post('/ordenes', data);
export const updateOrden    = (id,data) => api.put(`/ordenes/${id}`, data);
export const deleteOrden    = (id)      => api.delete(`/ordenes/${id}`);
