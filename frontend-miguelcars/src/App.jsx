import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout  from './components/layout/Layout';
import Spinner from './components/common/Spinner';

/**
 * OPTIMIZACIÓN: Lazy Loading (Code Splitting)
 * Cada página se carga solo cuando el usuario la visita.
 * Antes: un bundle único de ~721 KB
 * Después: chunks pequeños por página, carga inicial más rápida.
 */
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const ClientesPage = lazy(() => import('./pages/clientes/ClientesPage'));
const VehiculosPage= lazy(() => import('./pages/vehiculos/VehiculosPage'));
const CitasPage    = lazy(() => import('./pages/citas/CitasPage'));
const OrdenesPage  = lazy(() => import('./pages/ordenes/OrdenesPage'));
const FacturasPage = lazy(() => import('./pages/facturas/FacturasPage'));
const UsuariosPage = lazy(() => import('./pages/usuarios/UsuariosPage'));
const RolesPage    = lazy(() => import('./pages/roles/RolesPage'));

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
          <Route element={<Layout />}>
            <Route index            element={<Dashboard />}     />
            <Route path="clientes"  element={<ClientesPage />}  />
            <Route path="vehiculos" element={<VehiculosPage />} />
            <Route path="citas"     element={<CitasPage />}     />
            <Route path="ordenes"   element={<OrdenesPage />}   />
            <Route path="facturas"  element={<FacturasPage />}  />
            <Route path="usuarios"  element={<UsuariosPage />}  />
            <Route path="roles"     element={<RolesPage />}     />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
