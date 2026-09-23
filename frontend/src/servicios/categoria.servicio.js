import api from './api';

export const categoriaServicio = {
  listar: async () => {
    const { data } = await api.get('/categorias');
    return data;
  },

  crear: async (datos) => {
    const { data } = await api.post('/categorias', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await api.put(`/categorias/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await api.delete(`/categorias/${id}`);
    return data;
  },
};
