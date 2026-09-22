import { create } from 'zustand';

const CLAVE_TOKEN = 'token';

export const useAutenticacionStore = create((set) => ({
  token: localStorage.getItem(CLAVE_TOKEN),
  iniciarSesion: (token) => {
    localStorage.setItem(CLAVE_TOKEN, token);
    set({ token });
  },
  cerrarSesion: () => {
    localStorage.removeItem(CLAVE_TOKEN);
    set({ token: null });
  },
}));
