import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

const SuperAdmin = () => {
  const [, setLocation] = useLocation();
  
  // Estado mockeado para saber si ya existe el negocio
  const [negocioExiste, setNegocioExiste] = useState(false);

  return (
    <div className="admin-panel">
      <Header title="Super Admin" onBackClick={() => setLocation('/login')} />

      {negocioExiste ? (
        <div className="card-panel">
          <h2 className="card-panel__title">Negocio Actual</h2>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Kiosco 7°1</p>
          <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Dueño asignado</p>
          <Button variant="vaciar" onClick={() => setNegocioExiste(false)}>Eliminar Negocio</Button>
        </div>
      ) : (
        <div className="card-panel">
          <h2 className="card-panel__title">Crear Nuevo Negocio</h2>
          <label style={{ fontSize: '0.85rem' }}>Nombre del Negocio</label>
          <Input placeholder="Ej. Kiosco Central" />
          
          <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Cuenta del Jefe</h3>
          <Input placeholder="Usuario del Jefe" />
          <Input type="password" placeholder="Contraseña" />
          
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => setNegocioExiste(true)}>Crear y Vincular</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;