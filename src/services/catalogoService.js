// src/services/catalogoService.js
import api from './api';

// ==========================================
// CATEGORÍAS Y SUBCATEGORÍAS
// ==========================================
export const getCategorias = async () => {
  const response = await api.get('/catalogo/categorias');
  return response.data; // Retorna un array con categorías y sus subcategorías anidadas
};

export const crearCategoria = async (nombre) => {
  const response = await api.post('/catalogo/categorias', { nombre });
  return response.data;
};

export const eliminarCategoria = async (id) => {
  const response = await api.delete(`/catalogo/categorias/${id}`);
  return response.data;
};

export const crearSubCategoria = async (id_categoria, nombre) => {
  const response = await api.post('/catalogo/subcategorias', { id_categoria, nombre });
  return response.data;
};

export const eliminarSubCategoria = async (id) => {
  const response = await api.delete(`/catalogo/subcategorias/${id}`);
  return response.data;
};

// ==========================================
// PRODUCTOS
// ==========================================
export const getProductos = async () => {
  const response = await api.get('/catalogo/productos');
  return response.data;
};

export const crearProducto = async (productoData) => {
  // productoData debe ser: { id_subcategoria, nombre, precio, stock }
  const response = await api.post('/catalogo/productos', productoData);
  return response.data;
};

export const editarProducto = async (id, productoData) => {
  const response = await api.put(`/catalogo/productos/${id}`, productoData);
  return response.data;
};

export const eliminarProducto = async (id) => {
  const response = await api.delete(`/catalogo/productos/${id}`);
  return response.data;
};