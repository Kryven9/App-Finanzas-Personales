import api from './api';

export const presupuestoServicio = {
  listar: async (periodo) => {
    const { data } = await api.get('/presupuestos', { params: periodo });
    return data;
  },

  crear: async (datos) => {
    const { data } = await api.post('/presupuestos', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await api.put(`/presupuestos/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await api.delete(`/presupuestos/${id}`);
    return data;
  },
};
