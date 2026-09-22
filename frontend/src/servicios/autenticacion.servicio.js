import api from './api';

export const autenticacionServicio = {
  registrar: async (datos) => {
    const { data } = await api.post('/autenticacion/registro', datos);
    return data;
  },

  iniciarSesion: async (datos) => {
    const { data } = await api.post('/autenticacion/iniciar-sesion', datos);
    return data;
  },

  obtenerPerfil: async () => {
    const { data } = await api.get('/autenticacion/perfil');
    return data;
  },

  actualizarPerfil: async (datos) => {
    const { data } = await api.put('/autenticacion/perfil', datos);
    return data;
  },

  cambiarContrasena: async (datos) => {
    const { data } = await api.put('/autenticacion/perfil/contrasena', datos);
    return data;
  },
};
