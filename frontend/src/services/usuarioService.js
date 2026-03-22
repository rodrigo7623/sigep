import api from './api'

export const usuarioService = {
  listar:    ()         => api.get('/usuarios'),
  obtener:   (id)       => api.get(`/usuarios/${id}`),
  crear:     (data)     => api.post('/usuarios', data),
  actualizar:(id, data) => api.put(`/usuarios/${id}`, data),
  baja:      (id)       => api.delete(`/usuarios/${id}`),
  buscar:    (q)        => api.get('/usuarios/buscar', { params: { q } }),
}
