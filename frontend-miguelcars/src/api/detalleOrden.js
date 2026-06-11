import api from './axios';

export const getDetallesPorOrden = (ordenId)    => api.get(`/detalle-orden?ordenId=${ordenId}`);
export const createDetalle       = (data)        => api.post('/detalle-orden', data);
export const updateDetalle       = (id, data)    => api.put(`/detalle-orden/${id}`, data);
export const deleteDetalle       = (id)          => api.delete(`/detalle-orden/${id}`);
export const getHistorialPlaca   = (placa)       => api.get(`/ordenes/historial/${placa}`);
export const recalcularTotales   = (ordenId)     => api.put(`/ordenes/${ordenId}/recalcular`);
