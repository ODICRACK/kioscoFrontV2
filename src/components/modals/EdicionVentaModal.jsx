import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';

const EdicionVentaModal = ({ isOpen, onClose, venta }) => {
  // Estado mockeado de los productos de esa venta
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Mogul ositos', precio: 2000, cantidad: 2 },
    { id: 2, nombre: 'Tatin simple', precio: 2000, cantidad: 1 }
  ]);

  const handleEliminarProducto = (id) => {
    if (productos.length === 1) {
      // Regla: Siempre deberá quedar al menos un producto dentro de la venta.
      // TODO: Aquí se despacharía un Snackbar de error
      console.log('Error: Debe quedar al menos un producto en la venta.');
      return;
    }
    setProductos(productos.filter(p => p.id !== id));
  };

  const total = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edición de Venta">
      <div className="modal__field-group">
        <span className="modal__label">Método de pago (No modificable)</span>
        <div className="input" style={{ opacity: 0.7 }}>Efectivo</div>
      </div>

      <div className="admin-list">
        {productos.map(p => (
          <div key={p.id} className="admin-list__item">
            <span className="admin-list__text">{p.cantidad}x {p.nombre} - ${p.precio}</span>
            <button 
              className="btn-edit btn-delete-icon" 
              onClick={() => handleEliminarProducto(p.id)}
              type="button"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
      
      <div className="modal__text-right">
        Nuevo Total: ${total}
      </div>
      
      <div className="modal__actions">
        <Button variant="vender" style={{ width: '100%' }}>Confirmar Cambios</Button>
      </div>
    </Modal>
  );
};

export default EdicionVentaModal;