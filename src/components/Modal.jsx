import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, variant = '' }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Bloquea el scroll del fondo
    document.body.style.overflow = 'hidden';

    // Cierra con la tecla ESC
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Restaura el scroll al desmontar
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Detiene la propagación para que el clic dentro del modal no lo cierre */}
      <div 
        className={`modal-content ${variant ? `modal-content--${variant}` : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn-edit" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;