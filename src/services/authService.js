// src/services/authService.js
import api from './api';

// Función para iniciar sesión
export const login = async (usuario, password) => {
  const response = await api.post('/auth/login', { usuario, password });
  return response.data; 
  // Retorna: { message, token, usuario: { id, usuario, rol, turno } }
};

// Función para que el Super Admin cree el Kiosco y al Jefe
export const setupNegocio = async (nombreNegocio, usuarioJefe, passwordJefe) => {
  const response = await api.post('/setup/negocio', { 
    nombreNegocio, 
    usuarioJefe, 
    passwordJefe 
  });
  return response.data;
};