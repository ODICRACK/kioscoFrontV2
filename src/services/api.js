import axios from 'axios';

// Toma la URL de Render desde el .env, o usa localhost como respaldo
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// INTERCEPTOR DE PETICIONES (REQUEST)
// ==========================================
// Antes de que cualquier petición salga hacia el backend, esto se ejecuta.
api.interceptors.request.use(
  (config) => {
    // Buscamos el token en el almacenamiento del navegador
    const token = localStorage.getItem('token');
    
    // Si existe, lo adjuntamos como un "Pase VIP" en los headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// INTERCEPTOR DE RESPUESTAS (RESPONSE)
// ==========================================
// Cuando el backend nos responde, evaluamos si el token sigue siendo válido.
api.interceptors.response.use(
  (response) => {
    // Si todo fue bien, simplemente devolvemos la respuesta
    return response;
  },
  (error) => {
    // Si el backend nos rechaza con un 401 (Token inválido o expirado)
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o no autorizada. Redirigiendo al login...');
      
      // Limpiamos los datos locales para no dejar rastro
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      
      // Forzamos la redirección a la pantalla de login
      // Al ser un archivo JS puro (fuera del contexto de React), usamos window.location
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Devolvemos el error para que el componente que hizo la petición pueda mostrar un mensaje (ej. Snackbar)
    return Promise.reject(error);
  }
);

export default api;