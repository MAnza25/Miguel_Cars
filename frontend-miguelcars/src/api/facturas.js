import api from './axios';

export const getFacturas     = ()        => api.get('/facturas');
export const getFacturaById  = (id)      => api.get(`/facturas/${id}`);
export const createFactura   = (data)    => api.post('/facturas', data);
export const updateFactura   = (id,data) => api.put(`/facturas/${id}`, data);
export const deleteFactura   = (id)      => api.delete(`/facturas/${id}`);
