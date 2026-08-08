import api from './api';

export const ventasService = {
  crearVenta: async (ventaPayload) => {
    /* 
      ventaPayload modela exactamente las tablas relacionadas:
      {
        turno: 'mañana',
        productos: [
          { id_producto: 15, cantidad: 2, monto_individual: 2000 } // Va a VENTA_PRODUCTO
        ],
        pagos: [
          { id_metodo: 1, monto: 1000 }, // Va a VENTA_PAGO (ej: Transferencia)
          { id_metodo: 2, monto: 3000 }  // Va a VENTA_PAGO (ej: Efectivo)
        ]
      }
    */
    const response = await api.post('/ventas', ventaPayload);
    return response.data;
  },

  obtenerResumen: async (fecha, turno) => {
    // Filtros por query params para alimentar la vista de Resumen de Ventas
    const response = await api.get('/resumen', {
      params: { fecha, turno }
    });
    return response.data;
  },

  editarVenta: async (idVenta, productosModificados) => {
    // Endpoint para el Modal de Edición (permite soft-delete de items específicos del ticket)
    const response = await api.put(`/ventas/${idVenta}`, { items: productosModificados });
    return response.data;
  }
};