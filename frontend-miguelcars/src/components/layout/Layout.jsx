import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);
export const useAppToast = () => useContext(ToastContext);

export default function Layout() {
  const toastApi = useToast();

  return (
    <ToastContext.Provider value={toastApi}>
      <div style={S.container}>
        <Sidebar />
        <div style={S.right}>
          <header style={S.topbar}>
            <div style={S.topbarAccent} />
            <span style={S.topbarTitle}>Panel de Gestión</span>
            <span style={S.topbarBrand}>Miguel Cars © 2026</span>
          </header>
          <main style={S.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer toasts={toastApi.toasts} onClose={toastApi.remove} />
    </ToastContext.Provider>
  );
}

const S = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#141414',
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    height: '52px',
    background: '#0d0d0d',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    padding: '0 28px',
    gap: '12px',
    flexShrink: 0,
  },
  topbarAccent: {
    width: '3px',
    height: '18px',
    background: '#cc1f1f',
    borderRadius: '2px',
  },
  topbarTitle: {
    fontSize: '13px',
    color: '#888',
    letterSpacing: '0.5px',
    flex: 1,
  },
  topbarBrand: {
    fontSize: '11px',
    color: '#333',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  main: {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto',
  },
};
