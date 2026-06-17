import api from './axios';

export const getDetallesPorOrden = (ordenId)    => api.get(`/detalle-orden?ordenId=${ordenId}`);
export const updateDetalle       = (id, data)    => api.put(`/detalle-orden/${id}`, data);
export const deleteDetalle       = (id)          => api.delete(`/detalle-orden/${id}`);
export const getHistorialPlaca   = (placa)       => api.get(`/ordenes/historial/${placa}`);
export const recalcularTotales   = (ordenId)     => api.put(`/ordenes/${ordenId}/recalcular`);

/**
 * Crea un detalle usando el DTO con ordenId como número plano.
 * Formato: { ordenId, tipo, descripcion, cantidad, precioUnitario }
 */
export const createDetalle = (data) => api.post('/detalle-orden', {
  ordenId:        data.ordenId        ?? data.ordenServicio?.id,
  tipo:           data.tipo,
  descripcion:    data.descripcion,
  cantidad:       data.cantidad,
  precioUnitario: data.precioUnitario,
});
