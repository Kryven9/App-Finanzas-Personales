import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAutenticacionStore } from '../estados/autenticacion.store';
import LayoutPanel from '../componentes/layout/LayoutPanel';
import Login from '../paginas/IniciarSesion/Login';
import Registro from '../paginas/Registro/Registro';
import Dashboard from '../paginas/Dashboard/Dashboard';
import Cuentas from '../paginas/Cuentas/Cuentas';
import Categorias from '../paginas/Categorias/Categorias';
import Transacciones from '../paginas/Transacciones/Transacciones';
import Perfil from '../paginas/Perfil/Perfil';

function RutaProtegida({ children }) {
  const token = useAutenticacionStore((estado) => estado.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function RutasApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/"
          element={
            <RutaProtegida>
              <LayoutPanel />
            </RutaProtegida>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cuentas" element={<Cuentas />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="transacciones" element={<Transacciones />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
