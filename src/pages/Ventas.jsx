import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import CategoryButton from '../components/CategoryButton';

const Ventas = () => {
  const [, setLocation] = useLocation();
  
  // Estados locales para la UI
  const [turnoActivo, setTurnoActivo] = useState('mañana');
  const [metodoPago, setMetodoPago] = useState('efectivo');

  // Efecto para cambiar el tema global al cambiar el turno
  useEffect(() => {
    document.body.setAttribute('data-theme', turnoActivo);
  }, [turnoActivo]);

  const handleVender = () => {
    if (metodoPago === 'ambos') {
      // TODO: Decisión pendiente - Implementar modal de pago mixto en Etapa 10
      console.log('Abrir modal de pago mixto');
    } else {
      console.log(`Venta procesada con: ${metodoPago}`);
      // TODO: Implementar lógica de venta directa y Snackbar de éxito
    }
  };

  return (
    <div className="ventas">
      {/* Cabecera con Turnos */}
      <div className="ventas__header-row">
        <BackButton onClick={() => setLocation('/')} />
        <div className="ventas__shifts">
          <button 
            className={`shift-btn ${turnoActivo === 'mañana' ? 'shift-btn--active' : ''}`}
            onClick={() => setTurnoActivo('mañana')}
          >
            Mañana
          </button>
          <button 
            className={`shift-btn ${turnoActivo === 'tarde' ? 'shift-btn--active' : ''}`}
            onClick={() => setTurnoActivo('tarde')}
          >
            Tarde
          </button>
          <button 
            className={`shift-btn ${turnoActivo === 'noche' ? 'shift-btn--active' : ''}`}
            onClick={() => setTurnoActivo('noche')}
          >
            Noche
          </button>
        </div>
      </div>

      {/* Acciones del carrito */}
      <div className="ventas__cart-actions">
        <Button variant="eliminar">Eliminar último</Button>
        <Button variant="vaciar">Vaciar carrito</Button>
      </div>

      {/* Catálogo */}
      <div className="ventas__main">
        <div className="ventas__categories">
          <CategoryButton name="Gomitas" colorIndex={1} />
          <CategoryButton name="Alfajores" colorIndex={2} />
          <CategoryButton name="Jugos" colorIndex={3} />
          <CategoryButton name="Snacks" colorIndex={4} />
          <CategoryButton name="Galletas" colorIndex={5} />
          <CategoryButton name="Galletas" colorIndex={5} />
          <CategoryButton name="Galletas" colorIndex={5} />

          <CategoryButton name="Galletas" colorIndex={5} />

          <CategoryButton name="Galletas" colorIndex={5} />


        </div>

        <div className="ventas__products">
          {/* Mock de productos usando la clase de color de la categoría activa (Gomitas = 1) */}
          {[...Array(10)].map((_, i) => (
            <button key={i} className="ventas__product-btn cat-btn--1">
              Mogul ositos
            </button>
          ))}
        </div>
      </div>

      {/* Footer (Pagos y Total) */}
      <div className="ventas__footer">
        <div className="ventas__methods">
          <Button 
            variant="transferencia" 
            onClick={() => setMetodoPago('transferencia')}
            className={metodoPago === 'transferencia' ? 'btn--active-shadow' : ''}
          >
            Transfe
          </Button>
          <Button 
            variant="ambos" 
            onClick={() => setMetodoPago('ambos')}
          >
            ambos
          </Button>
          <Button 
            variant="efectivo" 
            onClick={() => setMetodoPago('efectivo')}
          >
            Efectivo
          </Button>
        </div>

        <div className="ventas__total-text">
          $7000
        </div>

        <Button variant="vender" onClick={handleVender}>
          Vender
        </Button>
      </div>
    </div>
  );
};

export default Ventas;