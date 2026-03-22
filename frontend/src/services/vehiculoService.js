import api from './api'

export const vehiculoService = {
  listar:          ()              => api.get('/vehiculos'),
  listarPorUsuario:(usuarioId)     => api.get(`/vehiculos/usuario/${usuarioId}`),
  obtener:         (id)            => api.get(`/vehiculos/${id}`),
  registrar:       (data)          => api.post('/vehiculos', data),
  actualizar:      (id, data)      => api.put(`/vehiculos/${id}`, data),
  baja:            (id)            => api.delete(`/vehiculos/${id}`),
}
