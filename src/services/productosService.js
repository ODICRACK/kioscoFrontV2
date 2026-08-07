import api from './api';

export const productosService = {
  // El backend solo devolverá productos con eliminado = false y del id_negocio del usuario
  obtenerCatalogo: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  crearProducto: async (productoData) => {
    /* 
      productoData respeta la tabla: { id_subcategoria, nombre, precio, stock }
      No envía eliminado ni id_negocio, eso lo maneja el backend.
    */
    const response = await api.post('/productos', productoData);
    return response.data;
  },

  actualizarStockOPrecio: async (id, data) => {
    const response = await api.patch(`/productos/${id}`, data);
    return response.data;
  },

  eliminarProducto: async (id) => {
    // La petición es DELETE, pero el backend ejecutará un UPDATE tabla SET eliminado = true
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};