import { useState } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

const EdicionProductoModal = ({ isOpen, onClose }) => {
  const [subCategoria, setSubCategoria] = useState('101');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Producto">
      <div className="modal__field-group">
        <span className="modal__label">Nombre</span>
        <Input value="Mogul frutillas" readOnly />
      </div>
      
      <div className="modal__field-group">
        <span className="modal__label">Categoría (No modificable)</span>
        <Input value="Gomitas" readOnly />
      </div>

      <div className="modal__field-group">
        <span className="modal__label">Subcategoría</span>
        <select className="input" value={subCategoria} onChange={e => setSubCategoria(e.target.value)}>
          <option value="">- (Vacía)</option>
          <option value="101">Terrabusi</option>
        </select>
      </div>

      <div className="modal__row">
        <div className="modal__field-group" style={{ flex: 1 }}>
          <span className="modal__label">Precio</span>
          <Input type="number" defaultValue="2000" />
        </div>
        <div className="modal__field-group" style={{ flex: 1 }}>
          <span className="modal__label">Stock</span>
          <Input type="number" defaultValue="20" />
        </div>
      </div>

      <div className="modal__actions">
        <Button variant="vaciar">Eliminar Producto</Button>
        <Button variant="vender">Guardar</Button>
      </div>
    </Modal>
  );
};

export default EdicionProductoModal;