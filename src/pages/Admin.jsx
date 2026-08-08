import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Input from '../components/Input';
import { useSnackbar } from '../context/SnackbarContext';
import { getUsuarios, crearUsuarioEmpleado, eliminarUsuario } from '../services/authService';

const Admin = () => {
  const [, setLocation] = useLocation();
  const { showSnackbar } = useSnackbar();

  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await getUsuarios();
      setEmpleados(data || []);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleCrearEmpleado = async () => {
    if (!nombre.trim() || !clave.trim()) {
      showSnackbar('Ingresa un nombre y una clave para el empleado', 'error');
      return;
    }
    try {
      await crearUsuarioEmpleado(nombre.trim(), clave.trim());
      showSnackbar('Empleado creado con éxito', 'success');
      setNombre('');
      setClave('');
      cargarEmpleados();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al crear empleado';
      showSnackbar(msg, 'error');
    }
  };

  const handleEliminarEmpleado = async (id, usuarioNombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al empleado ${usuarioNombre}?`)) return;
    try {
      await eliminarUsuario(id);
      showSnackbar('Empleado eliminado correctamente', 'success');
      cargarEmpleados();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al eliminar empleado';
      showSnackbar(msg, 'error');
    }
  };

  return (
    <div className="admin-panel">
      <Header title="Administración" onBackClick={() => setLocation('/')} />

      {/* Sección Personal */}
      <div className="card-panel">
        <h2 className="card-panel__title">Gestión de Empleados</h2>
        <div className="inline-form" style={{ margin: '0' }}>
          <Input 
            placeholder="Nombre" 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Clave" 
            value={clave} 
            onChange={e => setClave(e.target.value)} 
          />
          <button className="btn-inline btn-inline--accept" type="button" onClick={handleCrearEmpleado}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className="admin-list">
          {empleados.map(emp => (
            <div key={emp.id} className="admin-list__item">
              <span className="admin-list__text">{emp.usuario} ({emp.rol || 'cajero'})</span>
              <button 
                className="btn-edit" 
                style={{ borderColor: 'var(--color-vaciar-carrito)', color: 'var(--color-vaciar-carrito)' }}
                onClick={() => handleEliminarEmpleado(emp.id, emp.usuario)}
                type="button"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
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