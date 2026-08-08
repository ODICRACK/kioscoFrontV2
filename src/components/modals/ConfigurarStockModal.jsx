import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';

const ConfigurarStockModal = ({ isOpen, onClose, categorias = [], onEliminarCategoria, onEliminarSubcategoria }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'categoria' && onEliminarCategoria) {
      await onEliminarCategoria(itemToDelete.id);
    } else if (itemToDelete.type === 'subcategoria' && onEliminarSubcategoria) {
      await onEliminarSubcategoria(itemToDelete.id);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Configurar Stock">
        <div className="admin-list">
          {(categorias || []).map((cat) => (
            <div key={`cat-${cat.id}`}>
              <div className="admin-list__item">
                <span className="admin-list__text" style={{ fontSize: '1.1rem' }}>{cat.nombre}</span>
                <button 
                  className="btn-edit btn-delete-icon" 
                  onClick={() => handleDeleteClick({ type: 'categoria', ...cat })}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>

              {(cat.subcategorias || []).map((sub) => (
                <div key={`sub-${sub.id}`} className="admin-list__item" style={{ marginLeft: '1.5rem' }}>
                  <span className="admin-list__text">{sub.nombre}</span>
                  <button 
                    className="btn-edit btn-delete-icon" 
                    onClick={() => handleDeleteClick({ type: 'subcategoria', ...sub })}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal Secundario de Confirmación */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Acción">
        <p className="modal__text-center">
          ¿Seguro que desea eliminar esta categoría/subcategoría ("{itemToDelete?.nombre}")?
        </p>
        <div className="modal__actions">
          <Button onClick={() => setShowConfirm(false)}>Rechazar</Button>
          <Button 
            variant="vaciar" 
            onClick={handleConfirmDelete}
          >
            Aceptar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfigurarStockModal;