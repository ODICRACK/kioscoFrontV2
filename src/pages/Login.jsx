// src/pages/Login.jsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import Input from '../components/Input';
import { useSnackbar } from '../context/SnackbarContext'; // 1. Importamos el Snackbar
import { login as loginService } from '../services/authService'; // 2. Importamos el servicio

const Login = () => {
  const [, setLocation] = useLocation();
  const { showSnackbar } = useSnackbar(); // Activamos el hook del Snackbar
  
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar el botón mientras carga

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 3. Llamamos al backend real
      const data = await loginService(usuario, password);
      
      // 4. Guardamos las credenciales en el navegador
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_role', data.usuario.rol);
      
      // Si el empleado tiene un turno asignado, lo establecemos como predeterminado
      if (data.usuario.turno) {
        localStorage.setItem('turno_activo', data.usuario.turno);
      }

      // 5. Mostramos notificación de éxito
      showSnackbar(`¡Bienvenido, ${data.usuario.usuario}!`, 'success');

      // 6. Redirigimos según el rol
      if (data.usuario.rol === 'super') {
        setLocation('/super-admin');
      } else if (data.usuario.rol === 'jefe') {
        setLocation('/admin');
      } else {
        setLocation('/'); // Empleados van al Home
      }

    } catch (error) {
      // 7. Si falla (ej. contraseña incorrecta), extraemos el mensaje del backend o ponemos uno genérico
      const mensajeError = error.response?.data?.message || 'Error al conectar con el servidor';
      showSnackbar(mensajeError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card-panel">
        <h2 className="login-card__title">Ingreso al Sistema</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form__group">
            <label>Usuario</label>
            <Input 
              type="text" 
              placeholder="Ej: cajero_mañana" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="login-form__group">
            <label>Contraseña</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn--primary login-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;