import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout  from './components/layout/Layout';
import Spinner from './components/common/Spinner';
import ProtectedRoute from './components/common/ProtectedRoute';

/**
 * OPTIMIZACIÓN: Lazy Loading (Code Splitting)
 * Cada página se carga solo cuando el usuario la visita.
 */
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const ClientesPage = lazy(() => import('./pages/clientes/ClientesPage'));
const VehiculosPage= lazy(() => import('./pages/vehiculos/VehiculosPage'));
const CitasPage    = lazy(() => import('./pages/citas/CitasPage'));
const OrdenesPage  = lazy(() => import('./pages/ordenes/OrdenesPage'));
const FacturasPage = lazy(() => import('./pages/facturas/FacturasPage'));
const UsuariosPage = lazy(() => import('./pages/usuarios/UsuariosPage'));
const RolesPage    = lazy(() => import('./pages/roles/RolesPage'));
const LoginPage    = lazy(() => import('./pages/LoginPage'));

export default function App() {
  return (
    <BrowserRouter>
      {/* Suspense muestra el Spinner mientras se descarga el chunk */}
      <Suspense fallback={
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#141414' }}>
          <Spinner />
        </div>
      }>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index            element={<Dashboard />}     />
              
              <Route element={<ProtectedRoute permission="CLIENTES_VER" />}>
                <Route path="clientes"  element={<ClientesPage />}  />
              </Route>
              
              <Route element={<ProtectedRoute permission="VEHICULOS_VER" />}>
                <Route path="vehiculos" element={<VehiculosPage />} />
              </Route>

              <Route element={<ProtectedRoute permission="CITAS_VER" />}>
                <Route path="citas"     element={<CitasPage />}     />
              </Route>

              <Route element={<ProtectedRoute permission="ORDENES_VER" />}>
                <Route path="ordenes"   element={<OrdenesPage />}   />
              </Route>

              <Route element={<ProtectedRoute permission="FACTURAS_VER" />}>
                <Route path="facturas"  element={<FacturasPage />}  />
              </Route>

              <Route element={<ProtectedRoute permission="USUARIOS_VER" />}>
                <Route path="usuarios"  element={<UsuariosPage />}  />
              </Route>

              <Route element={<ProtectedRoute permission="ROLES_VER" />}>
                <Route path="roles"     element={<RolesPage />}     />
              </Route>
            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
