import api from './axios';

export const getVehiculos     = ()           => api.get('/vehiculos');
export const getVehiculoByPlaca = (placa)    => api.get(`/vehiculos/${placa}`);
export const createVehiculo   = (data)       => api.post('/vehiculos', data);
export const updateVehiculo   = (placa,data) => api.put(`/vehiculos/${placa}`, data);
export const deleteVehiculo   = (placa)      => api.delete(`/vehiculos/${placa}`);
