import api from './axios';

export const getRoles     = ()        => api.get('/roles');
export const getRolById   = (id)      => api.get(`/roles/${id}`);
export const createRol    = (data)    => api.post('/roles', data);
export const updateRol    = (id,data) => api.put(`/roles/${id}`, data);
export const deleteRol    = (id)      => api.delete(`/roles/${id}`);
