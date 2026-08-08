import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import CategoryButton from '../components/CategoryButton';
import { useTurno } from '../context/TurnoContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getCategorias, getProductos } from '../services/catalogoService';
import { ventasService } from '../services/ventasService';
import PagoMixtoModal from '../components/modals/PagoMixtoModal';
import { enqueueSale } from '../utils/salesQueue';

const Ventas = () => {
  const [, setLocation] = useLocation();
  const { turno: turnoActivo, setTurno: setTurnoActivo } = useTurno();
  const { showSnackbar } = useSnackbar();

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [showPagoMixto, setShowPagoMixto] = useState(false);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const cargarCatalogo = async () => {
    try {
      const [catsData, prodsData] = await Promise.all([
        getCategorias(),
        getProductos()
      ]);
      setCategorias(catsData);
      setProductos(prodsData);
      if (catsData.length > 0 && !categoriaSeleccionada) {
        setCategoriaSeleccionada(catsData[0].id);
      }
    } catch (error) {
      showSnackbar('Error al cargar catálogo de ventas', 'error');
    }
  };

  const handleAgregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      showSnackbar('El producto no tiene stock disponible', 'error');
      return;
    }

    setCarrito(prev => {
      const existenteIndex = prev.findIndex(item => item.id_producto === producto.id);
      if (existenteIndex > -1) {
        const copia = [...prev];
        const itemActual = copia[existenteIndex];
        if (itemActual.cantidad >= producto.stock) {
          showSnackbar('Alcanzado el límite de stock en el carrito', 'error');
          return prev;
        }
        copia[existenteIndex] = {
          ...itemActual,
          cantidad: itemActual.cantidad + 1
        };
        return copia;
      } else {
        return [
          ...prev,
          {
            id_producto: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: 1
          }
        ];
      }
    });
  };

  const handleEliminarUltimo = () => {
    setCarrito(prev => {
      if (prev.length === 0) return prev;
      const ultimo = prev[prev.length - 1];
      if (ultimo.cantidad > 1) {
        const copia = [...prev];
        copia[copia.length - 1] = {
          ...ultimo,
          cantidad: ultimo.cantidad - 1
        };
        return copia;
      } else {
        return prev.slice(0, -1);
      }
    });
  };

  const handleVaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCalculado = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const procesarVenta = (pagosPayload) => {
    if (carrito.length === 0) {
      showSnackbar('El carrito está vacío', 'error');
      return;
    }

    const payload = {
      turno: turnoActivo || 'mañana',
      productos: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        monto_individual: item.precio
      })),
      pagos: pagosPayload
    };

    // 0ms instant display: limpiar carrito y avisar exito
    setCarrito([]);
    showSnackbar('Venta procesada con éxito', 'success');

    // Encolar en segundo plano para envío persistente y seguro
    enqueueSale(payload);
  };

  const handleVender = () => {
    if (carrito.length === 0) {
      showSnackbar('Agrega productos al carrito antes de vender', 'error');
      return;
    }

    if (metodoPago === 'ambos') {
      setShowPagoMixto(true);
    } else {
      const pagosPayload = [{ metodo: metodoPago, monto: totalCalculado }];
      procesarVenta(pagosPayload);
    }
  };

  const handleConfirmarPagoMixto = async ({ transferencia, efectivo }) => {
    const pagos = [];
    if (Number(transferencia) > 0) {
      pagos.push({ metodo: 'transferencia', monto: Number(transferencia) });
    }
    if (Number(efectivo) > 0) {
      pagos.push({ metodo: 'efectivo', monto: Number(efectivo) });
    }
    await procesarVenta(pagos);
    setShowPagoMixto(false);
  };

  const catObjSeleccionada = categorias.find(c => String(c.id) === String(categoriaSeleccionada));
  const subCatIdsSeleccionada = catObjSeleccionada?.subcategorias?.map(s => s.id) || [];
  
  const productosFiltrados = productos.filter(p => {
    if (!categoriaSeleccionada) return true;
    if (catObjSeleccionada && p.categoria_nombre === catObjSeleccionada.nombre) return true;
    if (p.id_subcategoria && subCatIdsSeleccionada.includes(p.id_subcategoria)) return true;
    return false;
  });

  const catColorIndex = (catId) => {
    const index = categorias.findIndex(c => c.id === catId);
    return index >= 0 ? (index % 5) + 1 : 1;
  };

  const colorIndexActual = catColorIndex(categoriaSeleccionada);

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
        <Button variant="eliminar" onClick={handleEliminarUltimo}>Eliminar último</Button>
        <Button variant="vaciar" onClick={handleVaciarCarrito}>Vaciar carrito</Button>
      </div>

      {/* Catálogo */}
      <div className="ventas__main">
        <div className="ventas__categories">
          {categorias.map((cat, idx) => (
            <CategoryButton 
              key={cat.id} 
              name={cat.nombre} 
              colorIndex={(idx % 5) + 1} 
              onClick={() => setCategoriaSeleccionada(cat.id)}
            />
          ))}
        </div>

        <div className="ventas__products">
          {productosFiltrados.map((prod) => (
            <button 
              key={prod.id} 
              className={`ventas__product-btn cat-btn--${colorIndexActual}`}
              onClick={() => handleAgregarAlCarrito(prod)}
            >
              {prod.nombre} (${prod.precio})
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
            className={metodoPago === 'ambos' ? 'btn--active-shadow' : ''}
          >
            ambos
          </Button>
          <Button
            variant="efectivo"
            onClick={() => setMetodoPago('efectivo')}
            className={metodoPago === 'efectivo' ? 'btn--active-shadow' : ''}
          >
            Efectivo
          </Button>
        </div>

        <div className="ventas__total-text">
          $ {totalCalculado.toLocaleString('es-AR')}
        </div>

        <Button variant="vender" onClick={handleVender}>
          Vender
        </Button>
      </div>

      <PagoMixtoModal
        isOpen={showPagoMixto}
        onClose={() => setShowPagoMixto(false)}
        totalVenta={totalCalculado}
        onConfirm={handleConfirmarPagoMixto}
      />
    </div>
  );
};

export default Ventas;