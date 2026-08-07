import { Route, Switch } from 'wouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import Stock from './pages/Stock';
import ResumenVentas from './pages/ResumenVentas';
import Login from './pages/Login';
import Admin from './pages/Admin';
import SuperAdmin from './pages/SuperAdmin';
import './App.css';

function App() {
  return (
    <div className="app">
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          {/* Rutas preparadas para las siguientes etapas */}
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path="/super-admin" component={SuperAdmin} />
          <Route path="/ventas" component={Ventas} />
          <Route path="/stock" component={Stock} />
          <Route path="/resumen" component={ResumenVentas} />
          <Route path="/login" component={() => <div>Login Placeholder (Sesión cerrada)</div>} />

          <Route>
            <div className="app__not-found">Página no encontrada</div>
          </Route>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;