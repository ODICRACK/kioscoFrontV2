import api from './api';

export const authService = {
  login: async (usuario, password) => {
    const response = await api.post('/auth/login', { usuario, password });
    // Guardamos el token al iniciar sesión
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  crearNegocioYJefe: async (datos) => {
    // Acción exclusiva del Super Admin
    const response = await api.post('/negocios', datos);
    return response.data;
  }
};