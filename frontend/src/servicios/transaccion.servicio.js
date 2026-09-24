import api from './api';

export const transaccionServicio = {
  listar: async (filtros = {}) => {
    const { data } = await api.get('/transacciones', { params: filtros });
    return data;
  },

  obtener: async (id) => {
    const { data } = await api.get(`/transacciones/${id}`);
    return data;
  },

  crear: async (datos) => {
    const { data } = await api.post('/transacciones', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await api.put(`/transacciones/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await api.delete(`/transacciones/${id}`);
    return data;
  },
};
