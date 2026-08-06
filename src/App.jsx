import { Route, Switch } from 'wouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import './App.css';

function App() {
  return (
    <div className="app">
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          {/* Rutas preparadas para las siguientes etapas */}
          <Route path="/ventas" component={Ventas} />
          <Route path="/stock" component={() => <div>Stock Placeholder</div>} />
          <Route path="/resumen" component={() => <div>Resumen Placeholder</div>} />
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