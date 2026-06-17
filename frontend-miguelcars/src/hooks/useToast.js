import { useState, useCallback } from 'react';

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helpers de conveniencia
  const success = useCallback((msg) => toast(msg, 'success'), [toast]);
  const error   = useCallback((msg) => toast(msg, 'error'),   [toast]);
  const info    = useCallback((msg) => toast(msg, 'info'),    [toast]);
  const warning = useCallback((msg) => toast(msg, 'warning'), [toast]);

  return { toasts, remove, toast, success, error, info, warning };
}
