import api from './api';

export const reporteServicio = {
  gastosPorCategoria: async (periodo) => {
    const { data } = await api.get('/reportes/gastos-por-categoria', { params: periodo });
    return data;
  },

  evolucion: async (rango) => {
    const { data } = await api.get('/reportes/evolucion', { params: rango });
    return data;
  },
};
