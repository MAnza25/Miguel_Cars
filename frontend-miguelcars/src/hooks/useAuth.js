import { useMemo } from 'react';

export function useAuth() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const permissions = useMemo(() => {
    return user.rol?.permisos ? user.rol.permisos.split(',') : [];
  }, [user]);

  const isAdmin = user.rol?.nombre === 'Administrador';

  /**
   * Verifica si el usuario tiene un permiso específico.
   * Si es Administrador, siempre tiene permiso.
   */
  const can = (permissionId) => {
    if (isAdmin) return true;
    return permissions.includes(permissionId);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos.
   */
  const canAny = (permissionIds = []) => {
    if (isAdmin) return true;
    return permissionIds.some(p => permissions.includes(p));
  };

  return { user, isAdmin, permissions, can, canAny };
}
