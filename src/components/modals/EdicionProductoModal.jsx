import { useState, useEffect } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

const EdicionProductoModal = ({ isOpen, onClose, producto, subcategorias = [], onGuardar, onEliminar }) => {
  const [subCategoria, setSubCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (producto) {
      setSubCategoria(producto.id_subcategoria || '');
      setPrecio(producto.precio ?? '');
      setStock(producto.stock ?? '');
    }
  }, [producto, isOpen]);

  const handleGuardar = async () => {
    if (!producto) return;
    if (onGuardar) {
      await onGuardar(producto.id, {
        id_subcategoria: subCategoria ? Number(subCategoria) : producto.id_subcategoria,
        precio: parseFloat(precio) || 0,
        stock: parseInt(stock, 10) || 0,
      });
    }
    onClose();
  };

  const handleEliminar = async () => {
    if (!producto) return;
    if (onEliminar) {
      await onEliminar(producto.id);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Producto">
      <div className="modal__field-group">
        <span className="modal__label">Nombre</span>
        <Input value={producto?.nombre || ''} readOnly />
      </div>
      
      <div className="modal__field-group">
        <span className="modal__label">Categoría (No modificable)</span>
        <Input value={producto?.categoria_nombre || ''} readOnly />
      </div>

      <div className="modal__field-group">
        <span className="modal__label">Subcategoría</span>
        <select className="input" value={subCategoria} onChange={e => setSubCategoria(e.target.value)}>
          <option value="">- (Vacía)</option>
          {(subcategorias || []).map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="modal__row">
        <div className="modal__field-group" style={{ flex: 1 }}>
          <span className="modal__label">Precio</span>
          <Input 
            type="number" 
            value={precio} 
            onChange={e => setPrecio(e.target.value)} 
          />
        </div>
        <div className="modal__field-group" style={{ flex: 1 }}>
          <span className="modal__label">Stock</span>
          <Input 
            type="number" 
            value={stock} 
            onChange={e => setStock(e.target.value)} 
          />
        </div>
      </div>

      <div className="modal__actions">
        <Button variant="vaciar" onClick={handleEliminar}>Eliminar Producto</Button>
        <Button variant="vender" onClick={handleGuardar}>Guardar</Button>
      </div>
    </Modal>
  );
};

export default EdicionProductoModal;