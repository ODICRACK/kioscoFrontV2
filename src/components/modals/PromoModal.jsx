import Modal from '../Modal';
import Button from '../Button';

const PromoModal = ({ isOpen, onClose, promoPasoActual }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Promoción" variant="promo">
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Paso 1: Elija 1 producto de la categoría {promoPasoActual}
      </p>
      
      <div className="ventas__products" style={{ flex: 1, marginTop: '1rem' }}>
        {/* Renderizado de productos de la subcategoría específica */}
        <button className="ventas__product-btn cat-btn--1">Mogul ositos</button>
        <button className="ventas__product-btn cat-btn--1">Mogul frutillas</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
        <Button variant="vaciar" onClick={onClose}>Cancelar Promo</Button>
        <Button variant="vender">Confirmar Selección</Button>
      </div>
    </Modal>
  );
};

export default PromoModal;