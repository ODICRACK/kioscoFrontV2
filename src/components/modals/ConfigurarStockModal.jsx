import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';

const ConfigurarStockModal = ({ isOpen, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');

  const handleDeleteClick = (nombre) => {
    setItemToDelete(nombre);
    setShowConfirm(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Configurar Stock">
        <div className="admin-list">
          {/* Categoría principal (Sin subcategorías) */}
          <div className="admin-list__item">
            <span className="admin-list__text" style={{ fontSize: '1.1rem' }}>Gomitas</span>
            <button 
              className="btn-edit btn-delete-icon" 
              onClick={() => handleDeleteClick('Gomitas')}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>

          {/* Categoría principal con subcategorías anidadas */}
          <div className="admin-list__item">
            <span className="admin-list__text" style={{ fontSize: '1.1rem' }}>Alfajores</span>
            <button 
              className="btn-edit btn-delete-icon" 
              onClick={() => handleDeleteClick('Alfajores')}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
          
          {/* Subcategoría visualmente indentada */}
          <div className="admin-list__item" style={{ marginLeft: '1.5rem' }}>
            <span className="admin-list__text">Terrabusi</span>
            <button 
              className="btn-edit btn-delete-icon" 
              onClick={() => handleDeleteClick('Terrabusi')}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Secundario de Confirmación */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Acción">
        <p className="modal__text-center">
          ¿Seguro que desea eliminar esta categoría/subcategoría ("{itemToDelete}")?
        </p>
        <div className="modal__actions">
          <Button onClick={() => setShowConfirm(false)}>Rechazar</Button>
          <Button 
            variant="vaciar" 
            onClick={() => {
              console.log(`Eliminando: ${itemToDelete}`);
              setShowConfirm(false);
            }}
          >
            Aceptar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfigurarStockModal;