import { create } from 'zustand';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

function leerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO));
  } catch {
    localStorage.removeItem(CLAVE_USUARIO);
    return null;
  }
}

export const useAutenticacionStore = create((set) => ({
  token: localStorage.getItem(CLAVE_TOKEN),
  usuario: leerUsuarioGuardado(),
  iniciarSesion: (token, usuario) => {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    set({ token, usuario });
  },
  actualizarUsuario: (usuario) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    set({ usuario });
  },
  cerrarSesion: () => {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    set({ token: null, usuario: null });
  },
}));
