import axios from 'axios';
import { useAutenticacionStore } from '../estados/autenticacion.store';

const rutasPublicas = ['/autenticacion/iniciar-sesion', '/autenticacion/registro'];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAutenticacionStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// si el token expiro en cualquier peticion protegida, se cierra la sesion y se va al login
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const ruta = error.config?.url ?? '';
    const esRutaPublica = rutasPublicas.some((rutaPublica) => ruta.includes(rutaPublica));

    if (error.response?.status === 401 && !esRutaPublica) {
      useAutenticacionStore.getState().cerrarSesion();

      // evita reasignar /login si ya se esta en el login
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
