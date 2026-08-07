import { useState } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

const NuevoProductoModal = ({ isOpen, onClose, categorias }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subCategoria, setSubCategoria] = useState('');
  const [creandoSub, setCreandoSub] = useState(false);
  const [nuevaSubCategoria, setNuevaSubCategoria] = useState('');

  const handleSubCategoriaChange = (e) => {
    const val = e.target.value;
    if (val === 'crear_nueva') {
      setCreandoSub(true);
      setSubCategoria('');
    } else {
      setSubCategoria(val);
      setCreandoSub(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Producto">
      <Input placeholder="Nombre del producto" value={nombre} onChange={e => setNombre(e.target.value)} />
      
      <select className="input" value={categoria} onChange={e => setCategoria(e.target.value)}>
        <option value="">Seleccione Categoría</option>
        {categorias.map((catego, index)=>{
          <option value={catego.id}>{catego.nombre}</option>
        })}
      </select>

      {/* Select de Subcategorías */}
      <select className="input" value={subCategoria} onChange={handleSubCategoriaChange} disabled={!categoria}>
        <option value="">Seleccione Subcategoría</option>
        <option value="-">- (Sin subcategoría)</option>
        <option value="101">Terrabusi</option>
        <option value="crear_nueva">+ Crear nueva subcategoría</option>
      </select>

      {/* Input Inline para crear nueva subcategoría */}
      {creandoSub && (
        <div className="inline-form">
          <Input 
            placeholder="Nombre de subcategoría..." 
            value={nuevaSubCategoria} 
            onChange={e => setNuevaSubCategoria(e.target.value)}
          />
          <button className="btn-inline btn-inline--accept" onClick={() => setCreandoSub(false)}>
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Input placeholder="Precio" type="number" />
        <Input placeholder="Stock Inicial" type="number" />
      </div>

      <Button variant="vender">Guardar Producto</Button>
    </Modal>
  );
};

export default NuevoProductoModal;