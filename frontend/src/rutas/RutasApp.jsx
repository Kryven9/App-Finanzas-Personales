import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAutenticacionStore } from '../estados/autenticacion.store';
import LayoutPanel from '../componentes/layout/LayoutPanel';
import Cargando from '../componentes/comunes/Cargando';
import Login from '../paginas/IniciarSesion/Login';
import Registro from '../paginas/Registro/Registro';
import Dashboard from '../paginas/Dashboard/Dashboard';
import Cuentas from '../paginas/Cuentas/Cuentas';
import Categorias from '../paginas/Categorias/Categorias';
import Transacciones from '../paginas/Transacciones/Transacciones';
import Recurrencias from '../paginas/Recurrencias/Recurrencias';
import Presupuestos from '../paginas/Presupuestos/Presupuestos';
import Metas from '../paginas/Metas/Metas';
import DetalleMeta from '../paginas/Metas/DetalleMeta';
import Perfil from '../paginas/Perfil/Perfil';

// reportes se carga bajo demanda -> trae Recharts y no debe pesar en el resto de paginas
const Reportes = lazy(() => import('../paginas/Reportes/Reportes'));

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
          <Route path="recurrencias" element={<Recurrencias />} />
          <Route path="presupuestos" element={<Presupuestos />} />
          <Route path="metas" element={<Metas />} />
          <Route path="metas/:id" element={<DetalleMeta />} />
          <Route
            path="reportes"
            element={
              <Suspense fallback={<Cargando />}>
                <Reportes />
              </Suspense>
            }
          />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
