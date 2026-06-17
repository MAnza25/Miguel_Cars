import api from './axios';

export const getUsuarios     = ()        => api.get('/usuarios');
export const login           = (data)    => api.post('/usuarios/login', data);
export const getUsuarioById  = (id)      => api.get(`/usuarios/${id}`);
export const createUsuario   = (data)    => api.post('/usuarios', data);
export const updateUsuario   = (id,data) => api.put(`/usuarios/${id}`, data);
export const deleteUsuario   = (id)      => api.delete(`/usuarios/${id}`);
