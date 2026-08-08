import { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { useSnackbar } from '../../context/SnackbarContext';

const EdicionVentaModal = ({ isOpen, onClose, venta, onConfirmar }) => {
  const { showSnackbar } = useSnackbar();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (venta && venta.productos) {
      setProductos(venta.productos);
    }
  }, [venta, isOpen]);

  const handleEliminarProducto = (idProducto) => {
    if (productos.length <= 1) {
      showSnackbar('Debe quedar al menos un producto en la venta.', 'error');
      return;
    }
    setProductos(prev => prev.filter(p => (p.id_producto || p.id) !== idProducto));
  };

  const cajeroNombre = venta?.cajero || venta?.usuario || 'Cajero';
  const metodosArr = (venta?.pagos || []).map(p => p.metodo ? p.metodo.charAt(0).toUpperCase() + p.metodo.slice(1) : '');
  const metodoPagoStr = metodosArr.join(' / ') || 'Efectivo';

  const total = productos.reduce((acc, p) => acc + ((Number(p.monto_individual) || Number(p.precio) || 0) * (Number(p.cantidad) || 1)), 0);

  const handleGuardarCambios = async () => {
    if (!venta) return;
    if (onConfirmar) {
      await onConfirmar(venta.id, productos);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edición de Venta">
      <div className="modal__field-group">
        <span className="modal__label">Usuario / Cajero (No modificable)</span>
        <div className="input" style={{ opacity: 0.7 }}>{cajeroNombre}</div>
      </div>

      <div className="modal__field-group">
        <span className="modal__label">Método de pago (No modificable)</span>
        <div className="input" style={{ opacity: 0.7 }}>{metodoPagoStr}</div>
      </div>

      <div className="admin-list">
        {productos.map(p => {
          const pId = p.id_producto || p.id;
          const precioUnit = Number(p.monto_individual) || Number(p.precio) || 0;
          return (
            <div key={pId} className="admin-list__item">
              <span className="admin-list__text">{p.cantidad}x {p.nombre} - ${precioUnit}</span>
              <button 
                className="btn-edit btn-delete-icon" 
                onClick={() => handleEliminarProducto(pId)}
                type="button"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="modal__text-right">
        Nuevo Total: ${total}
      </div>
      
      <div className="modal__actions">
        <Button variant="vender" style={{ width: '100%' }} onClick={handleGuardarCambios}>
          Confirmar Cambios
        </Button>
      </div>
    </Modal>
  );
};

export default EdicionVentaModal;