import api from './api';

export const metaServicio = {
  listar: async () => {
    const { data } = await api.get('/metas');
    return data;
  },

  obtener: async (id) => {
    const { data } = await api.get(`/metas/${id}`);
    return data;
  },

  crear: async (datos) => {
    const { data } = await api.post('/metas', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await api.put(`/metas/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await api.delete(`/metas/${id}`);
    return data;
  },

  listarAportes: async (idMeta) => {
    const { data } = await api.get(`/metas/${idMeta}/aportes`);
    return data;
  },

  crearAporte: async (idMeta, datos) => {
    const { data } = await api.post(`/metas/${idMeta}/aportes`, datos);
    return data;
  },

  eliminarAporte: async (idMeta, idAporte) => {
    const { data } = await api.delete(`/metas/${idMeta}/aportes/${idAporte}`);
    return data;
  },

  actualizarAporte: async (idMeta, idAporte, datos) => {
    const { data } = await api.put(`/metas/${idMeta}/aportes/${idAporte}`, datos);
    return data;
  },
};
