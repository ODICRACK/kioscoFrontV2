import { useLocation } from 'wouter';
import { useEffect } from 'react';

// Este componente envuelve las rutas privadas
const ProtectedRoute = ({ component: Component, allowedRoles = [], ...rest }) => {
  const [location, setLocation] = useLocation();
  
  // Simulamos la obtención del token y rol (esto luego vendrá de tu AuthContext o LocalStorage)
  const isAuthenticated = !!localStorage.getItem('token'); 
  const userRole = localStorage.getItem('user_role') || 'empleado'; // empleado, jefe, super

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    // Si la ruta requiere un rol específico y el usuario no lo tiene
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      setLocation('/'); // Lo devolvemos al Home
    }
  }, [isAuthenticated, userRole, location, setLocation, allowedRoles]);

  // Si no está autenticado, no renderizamos nada mientras redirige
  if (!isAuthenticated) return null;

  return <Component {...rest} />;
};

export default ProtectedRoute;