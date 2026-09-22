import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAutenticacionStore } from '../estados/autenticacion.store';
import Login from '../paginas/IniciarSesion/Login';
import Registro from '../paginas/Registro/Registro';
import Dashboard from '../paginas/Dashboard/Dashboard';

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
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
