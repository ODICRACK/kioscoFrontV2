import { useState } from 'react';
import { useLocation } from 'wouter';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [, setLocation] = useLocation();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Conectar con backend en el futuro. 
    // Mocking de roles para demostración visual:
    if (usuario === 'super') {
      setLocation('/super-admin');
    } else {
      setLocation('/'); // Dirige al Home (Jefe o Empleado)
    }
  };

  return (
    <div className="auth-container">
      <div className="card-panel">
        <h1 className="card-panel__title">Iniciar Sesión</h1>
        
        <Input 
          placeholder="Usuario" 
          value={usuario} 
          onChange={(e) => setUsuario(e.target.value)} 
        />
        
        <Input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <Button onClick={handleLogin}>Ingresar</Button>
      </div>
    </div>
  );
};

export default Login;