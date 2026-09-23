import api from './api';

export const cuentaServicio = {
  listar: async () => {
    const { data } = await api.get('/cuentas');
    return data;
  },

  obtener: async (id) => {
    const { data } = await api.get(`/cuentas/${id}`);
    return data;
  },

  crear: async (datos) => {
    const { data } = await api.post('/cuentas', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await api.put(`/cuentas/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await api.delete(`/cuentas/${id}`);
    return data;
  },
};
