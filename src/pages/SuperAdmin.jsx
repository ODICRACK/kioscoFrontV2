// src/pages/SuperAdmin.jsx
import { useState } from 'react';
import Input from '../components/Input';
import { useSnackbar } from '../context/SnackbarContext';
import { setupNegocio } from '../services/authService';

const SuperAdmin = () => {
  const { showSnackbar } = useSnackbar();
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [usuarioJefe, setUsuarioJefe] = useState('');
  const [passwordJefe, setPasswordJefe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCrearNegocio = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Llamada al backend
      await setupNegocio(nombreNegocio, usuarioJefe, passwordJefe);
      
      showSnackbar('Negocio y Jefe creados exitosamente', 'success');
      
      // Limpiamos los campos
      setNombreNegocio('');
      setUsuarioJefe('');
      setPasswordJefe('');

    } catch (error) {
      // Mostramos el error (ej. "El nombre de usuario ya está en uso")
      const mensajeError = error.response?.data?.message || 'Error al configurar el negocio';
      showSnackbar(mensajeError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="super-admin">
      <h2 className="super-admin__title">Panel de Super Administrador</h2>
      
      <div className="super-admin__card card-panel">
        <h3>Alta de Nuevo Negocio</h3>
        <p>Complete los datos para inicializar un nuevo sistema y crear su administrador (Jefe).</p>
        
        <form className="super-admin__form" onSubmit={handleCrearNegocio}>
          <div className="form-group">
            <label>Nombre del Negocio</label>
            <Input 
              placeholder="Ej: Kiosco 7°1" 
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Usuario del Jefe</label>
            <Input 
              placeholder="Ej: jefe_juan" 
              value={usuarioJefe}
              onChange={(e) => setUsuarioJefe(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña del Jefe</label>
            <Input 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              value={passwordJefe}
              onChange={(e) => setPasswordJefe(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn--primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Registrar Negocio'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdmin;