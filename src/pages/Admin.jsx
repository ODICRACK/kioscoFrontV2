import { useLocation } from 'wouter';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

const Admin = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="admin-panel">
      <Header title="Administración" onBackClick={() => setLocation('/')} />

      {/* Sección Personal */}
      <div className="card-panel">
        <h2 className="card-panel__title">Gestión de Empleados</h2>
        <div className="inline-form" style={{ margin: '0' }}>
          <Input placeholder="Nombre" />
          <Input type="password" placeholder="Clave" />
          <button className="btn-inline btn-inline--accept" type="button">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className="admin-list">
          <div className="admin-list__item">
            <span className="admin-list__text">Turno Mañana</span>
            <button className="btn-edit" style={{ borderColor: 'var(--color-vaciar-carrito)', color: 'var(--color-vaciar-carrito)' }}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
          <div className="admin-list__item">
            <span className="admin-list__text">Turno Tarde</span>
            <button className="btn-edit" style={{ borderColor: 'var(--color-vaciar-carrito)', color: 'var(--color-vaciar-carrito)' }}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sección Promociones */}
      <div className="card-panel">
        <h2 className="card-panel__title">Promociones Activas</h2>
        <div className="inline-form" style={{ margin: '0' }}>
          <Input placeholder="Nueva Promoción" />
          <button className="btn-inline btn-inline--accept" type="button">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className="admin-list">
          <div className="admin-list__item">
            <span className="admin-list__text">Promo Desayuno</span>
            <button className="btn-edit" style={{ borderColor: 'var(--color-vaciar-carrito)', color: 'var(--color-vaciar-carrito)' }}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;