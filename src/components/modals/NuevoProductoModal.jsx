import { useState, useEffect } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { crearSubCategoria } from '../../services/catalogoService';

const NuevoProductoModal = ({ isOpen, onClose, categorias = [], onGuardar }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subCategoria, setSubCategoria] = useState('');
  const [creandoSub, setCreandoSub] = useState(false);
  const [nuevaSubCategoria, setNuevaSubCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setCategoria('');
      setSubCategoria('');
      setCreandoSub(false);
      setNuevaSubCategoria('');
      setPrecio('');
      setStock('');
    }
  }, [isOpen]);

  const handleCategoriaChange = (e) => {
    const val = e.target.value;
    setCategoria(val);
    setSubCategoria('');
    setCreandoSub(false);
  };

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

  const categoriaSeleccionadaObj = (categorias || []).find(
    (c) => String(c.id) === String(categoria)
  );
  const subcategoriasDisponibles = categoriaSeleccionadaObj?.subcategorias || [];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!nombre.trim() || !categoria) return;

    let subCatIdFinal = subCategoria;

    if (creandoSub && nuevaSubCategoria.trim()) {
      try {
        const nuevaSub = await crearSubCategoria(categoria, nuevaSubCategoria.trim());
        subCatIdFinal = nuevaSub.id;
      } catch (err) {
        console.error('Error al crear subcategoría:', err);
        return;
      }
    }

    if (!subCatIdFinal) return;

    if (onGuardar) {
      await onGuardar({
        id_subcategoria: Number(subCatIdFinal),
        nombre: nombre.trim(),
        precio: parseFloat(precio) || 0,
        stock: parseInt(stock, 10) || 0,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Producto">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input 
          placeholder="Nombre del producto" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
        />
        
        <select className="input" value={categoria} onChange={handleCategoriaChange}>
          <option value="">Seleccione Categoría</option>
          {(categorias || []).map((catego) => (
            <option key={catego.id} value={catego.id}>
              {catego.nombre}
            </option>
          ))}
        </select>

        {/* Select de Subcategorías */}
        <select className="input" value={subCategoria} onChange={handleSubCategoriaChange} disabled={!categoria}>
          <option value="">Seleccione Subcategoría</option>
          {subcategoriasDisponibles.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.nombre}
            </option>
          ))}
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
            <button type="button" className="btn-inline btn-inline--accept" onClick={() => setCreandoSub(false)}>
              <span className="material-symbols-outlined">check</span>
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input 
            placeholder="Precio" 
            type="number" 
            value={precio} 
            onChange={e => setPrecio(e.target.value)} 
          />
          <Input 
            placeholder="Stock Inicial" 
            type="number" 
            value={stock} 
            onChange={e => setStock(e.target.value)} 
          />
        </div>

        <Button type="submit" variant="vender">Guardar Producto</Button>
      </form>
    </Modal>
  );
};

export default NuevoProductoModal;