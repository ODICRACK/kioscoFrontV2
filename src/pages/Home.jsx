import { useLocation } from 'wouter';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Button from '../components/Button';

const Home = () => {
  const [, setLocation] = useLocation();

  // TODO: Conectar con el contexto de sesión o store global en el futuro
  const handleLogout = () => {
    // Lógica para limpiar token/sesión iría aquí
    setLocation('/login');
  };

  // Datos mockeados para el gráfico (se reemplazarán con datos del backend)
  const ventasDia = {
    efectivo: 120000,
    transferencia: 300900
  };
  const total = ventasDia.efectivo + ventasDia.transferencia;

  const chartData = [
    { name: 'Efectivo', value: ventasDia.efectivo, color: 'var(--color-efectivo)' },
    { name: 'Transferencia', value: ventasDia.transferencia, color: 'var(--color-transferencia)' }
  ];

  // Función auxiliar para formatear a moneda (se podría mover a src/utils/ después)
  const formatCurrency = (value) => {
    return `$ ${value.toLocaleString('es-AR')}`;
  };

  return (
    <div className="home">
      <Header title="Kiosco 7°1" onBackClick={handleLogout} />

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