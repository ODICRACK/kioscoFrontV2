import { Route, Switch } from 'wouter';
import { TurnoProvider } from './context/TurnoContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import Stock from './pages/Stock';
import ResumenVentas from './pages/ResumenVentas';
import Login from './pages/Login';
import Admin from './pages/Admin';
import SuperAdmin from './pages/SuperAdmin';
import { SnackbarProvider } from './context/SnackbarContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <SnackbarProvider>
      <TurnoProvider>
        <div className="app">
          <Layout>
            <Switch>
              {/* Ruta pública */}
              <Route path="/login" component={Login} />

              {/* Rutas Privadas (Cualquier empleado puede acceder) */}
              <Route path="/" component={() => <ProtectedRoute component={Home} />} />
              <Route path="/ventas" component={() => <ProtectedRoute component={Ventas} />} />
              <Route path="/stock" component={() => <ProtectedRoute component={Stock} />} />
              <Route path="/resumen" component={() => <ProtectedRoute component={ResumenVentas} />} />

              {/* Rutas Restringidas (Solo roles específicos) */}
              <Route path="/admin" component={() => (
                <ProtectedRoute component={Admin} allowedRoles={['jefe', 'super']} />
              )} />
              
              <Route path="/super-admin" component={() => (
                <ProtectedRoute component={SuperAdmin} allowedRoles={['super']} />
              )} />
              
              {/* 404 */}
              <Route>
                <div className="app__not-found">Página no encontrada</div>
              </Route>
            </Switch>
          </Layout>
        </div>
      </TurnoProvider>
    </SnackbarProvider>
  );
}

export default App;