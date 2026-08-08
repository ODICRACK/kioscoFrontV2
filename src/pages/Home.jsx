import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Button from '../components/Button';
import { ventasService } from '../services/ventasService';

const Home = () => {
  const [, setLocation] = useLocation();
  const [ventasDia, setVentasDia] = useState({ efectivo: 0, transferencia: 0 });

  useEffect(() => {
    cargarResumenDelDia();
  }, []);

  const cargarResumenDelDia = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const res = await ventasService.obtenerResumen(hoy);
      
      let totEfectivo = 0;
      let totTransfe = 0;

      (res || []).forEach(venta => {
        (venta.pagos || []).forEach(pago => {
          if (pago.metodo === 'efectivo') {
            totEfectivo += Number(pago.monto) || 0;
          } else if (pago.metodo === 'transferencia') {
            totTransfe += Number(pago.monto) || 0;
          }
        });
      });

      setVentasDia({
        efectivo: totEfectivo,
        transferencia: totTransfe
      });
    } catch (error) {
      console.error('Error al obtener el resumen del día:', error);
    }
  };
    
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setLocation('/login');
  };

  const total = ventasDia.efectivo + ventasDia.transferencia;

  const chartData = [
    { name: 'Efectivo', value: ventasDia.efectivo || (total === 0 ? 1 : 0), color: 'var(--color-efectivo)' },
    { name: 'Transferencia', value: ventasDia.transferencia || (total === 0 ? 1 : 0), color: 'var(--color-transferencia)' }
  ];

  const formatCurrency = (value) => {
    return `$ ${value.toLocaleString('es-AR')}`;
  };

  return (
    <div className="home">
      <Header 
        title="Kiosco 7°1" 
        onBackClick={handleLogout} 
        rightIcon="person_add"
        onRightClick={() => setLocation('/admin')}
      />

      <div className="home__menu">
        <Button onClick={() => setLocation('/resumen')}>Resumen de ventas</Button>
        <Button onClick={() => setLocation('/stock')}>Control de stock</Button>
        <Button onClick={() => setLocation('/ventas')}>Vender</Button>
      </div>

      <div className="home__chart-card">
        <div className="home__chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius="90%"
                dataKey="value"
                stroke="var(--color-fondo)"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="home__legend">
          <div className="home__legend-item">
            <span className="home__legend-color home__legend-color--efectivo"></span>
            Efectivo
          </div>
          <div className="home__legend-item">
            <span className="home__legend-color home__legend-color--transferencia"></span>
            Transferencia
          </div>
        </div>

        <div className="home__totals">
          <div className="home__totals-row">
            <div className="home__total-box home__total-box--efectivo">
              {formatCurrency(ventasDia.efectivo)}
            </div>
            <div className="home__total-box home__total-box--transferencia">
              {formatCurrency(ventasDia.transferencia)}
            </div>
          </div>
          <div className="home__grand-total">
            Total: {formatCurrency(total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;