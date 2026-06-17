import api from './axios';

export const getFacturas        = ()        => api.get('/facturas');
export const getFacturaById     = (id)      => api.get(`/facturas/${id}`);
export const createFactura      = (data)    => api.post('/facturas', data);
export const generarDesdeOrden  = (ordenId, descuento = 0) => api.post(`/facturas/desde-orden/${ordenId}?descuento=${descuento}`);
export const updateFactura      = (id,data) => api.put(`/facturas/${id}`, data);
export const deleteFactura   = (id)      => api.delete(`/facturas/${id}`);

/** Genera factura automáticamente desde una orden — marca como ENTREGADA */
export const generarFacturaDesdeOrden = (ordenId) => api.post(`/facturas/desde-orden/${ordenId}`);

/**
 * Crea un detalle usando el nuevo formato DTO:
 * { ordenId, tipo, descripcion, cantidad, precioUnitario }
 * en vez de { ordenServicio: { id } }
 */
export const createDetalleDTO = (data) => api.post('/detalle-orden', data);
