import { useState, useEffect } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

const PagoMixtoModal = ({ isOpen, onClose, totalVenta, onConfirm }) => {
  const [transfe, setTransfe] = useState('');
  const [efectivo, setEfectivo] = useState('');

  // Sincronización automática de inputs
  const handleTransfeChange = (e) => {
    const val = Number(e.target.value.replace(/\D/g, ''));
    setTransfe(val);
    setEfectivo(val <= totalVenta ? totalVenta - val : 0);
  };

  const handleEfectivoChange = (e) => {
    const val = Number(e.target.value.replace(/\D/g, ''));
    setEfectivo(val);
    setTransfe(val <= totalVenta ? totalVenta - val : 0);
  };

  // Botones incrementales de 500 en 500
  const montosIncrementales = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pago Mixto (Total: $${totalVenta})`}>
      <div className="mixed-payment__grid">
        {/* Columna Transferencia */}
        <div className="mixed-payment__column">
          <span className="mixed-payment__label" style={{ color: 'var(--color-transferencia)' }}>Transferencia</span>
          <Input 
            className="mixed-payment__input" 
            value={transfe} 
            onChange={handleTransfeChange} 
            placeholder="$ 0"
          />
          <div className="mixed-payment__increments">
            {montosIncrementales.map(monto => (
              <button 
                key={`t-${monto}`} 
                className="btn-increment" 
                onClick={() => handleTransfeChange({ target: { value: String(monto) } })}
              >
                ${monto}
              </button>
            ))}
          </div>
        </div>

        {/* Columna Efectivo */}
        <div className="mixed-payment__column">
          <span className="mixed-payment__label" style={{ color: 'var(--color-efectivo)' }}>Efectivo</span>
          <Input 
            className="mixed-payment__input" 
            value={efectivo} 
            onChange={handleEfectivoChange} 
            placeholder="$ 0"
          />
          <div className="mixed-payment__increments">
            {montosIncrementales.map(monto => (
              <button 
                key={`e-${monto}`} 
                className="btn-increment"
                onClick={() => handleEfectivoChange({ target: { value: String(monto) } })}
              >
                ${monto}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Button 
        variant="vender" 
        onClick={() => onConfirm({ transferencia: transfe, efectivo })}
      >
        Confirmar Pago
      </Button>
    </Modal>
  );
};

export default PagoMixtoModal;