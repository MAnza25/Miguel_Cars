import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ permission }) {
  const { can } = useAuth();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !can(permission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
