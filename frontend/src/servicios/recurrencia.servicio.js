import api from './api';

export const recurrenciaServicio = {
  listar: async () => {
    const { data } = await api.get('/recurrencias');
    return data;
  },

  obtener: async (id) => {
    const { data } = await api.get(`/recurrencias/${id}`);
    return data;
  },

  crear: async (datos) => {
    const { data } = await api.post('/recurrencias', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await api.put(`/recurrencias/${id}`, datos);
    return data;
  },

  cambiarEstado: async (id, activa) => {
    const { data } = await api.put(`/recurrencias/${id}/estado`, { activa });
    return data;
  },

  // sin eliminarGeneradas el backend conserva las transacciones ya generadas
  eliminar: async (id, eliminarGeneradas = false) => {
    const { data } = await api.delete(`/recurrencias/${id}`, {
      params: { eliminarGeneradas },
    });
    return data;
  },
};
