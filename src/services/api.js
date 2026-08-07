import axios from 'axios';

// Utiliza variables de entorno para la URL de la API (facilita el paso a producción)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones (Request)
api.interceptors.request.use(
  (config) => {
    // Recupera el token de sesión. 
    // Este token es vital porque contiene el ROL del usuario y su ID_NEGOCIO.
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas (Response)
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la devolvemos tal cual
    return response;
  },
  (error) => {
    // MANEJO GLOBAL DE ERRORES (Reemplazo del alert)
    // TODO: Aquí se despachará el evento para mostrar el Snackbar global rojo
    const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor';
    console.error('[Snackbar Error]:', errorMessage);

    // Si el error es 401 (No autorizado / Sesión expirada)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirección limpia
    }

    return Promise.reject(error);
  }
);

export default api;