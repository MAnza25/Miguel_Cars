import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ChangePasswordModal from '../common/ChangePasswordModal';
import Logo from '../common/Logo';

export const ToastContext = createContext(null);
export const useAppToast = () => useContext(ToastContext);

export default function Layout() {
  const toastApi = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <ToastContext.Provider value={toastApi}>
      <div style={S.container} className="layout-container">
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'is-open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={S.right} className="layout-main-content">
          <header style={S.topbar} className="app-topbar">
            <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
              ☰
            </button>
            <Logo size="xs" style={{ filter: 'drop-shadow(0 1px 8px rgba(227,6,19,0.25))' }} />
            <div style={S.topbarAccent} className="topbar-accent" />
            <span style={S.topbarTitle} className="topbar-title">Panel de Gestión</span>

            <div style={S.userMenuContainer} ref={menuRef}>
              <button style={S.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                <div style={S.userAvatar}>
                  {user.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={S.userText}>
                  <div style={S.userName}>{user.nombre}</div>
                  <div style={S.userRole}>{user.rol?.nombre}</div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--gray)', marginLeft: '5px' }}>▼</span>
              </button>

              {menuOpen && (
                <div style={S.dropdown}>
                  <div style={S.dropdownHeader}>Mi Cuenta</div>
                  <button style={S.dropdownItem} onClick={() => { setMenuOpen(false); setPwdModal(true); }}>
                    <span style={S.dropdownIcon}>🔑</span> Cambiar Contraseña
                  </button>
                  <div style={S.dropdownDivider} />
                  <button style={{ ...S.dropdownItem, color: 'var(--red)' }} onClick={handleLogout}>
                    <span style={S.dropdownIcon}>🚪</span> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            <span style={S.topbarBrand} className="topbar-brand">Miguel Cars © 2026</span>
          </header>
          <main style={S.main} className="app-main">
            <Outlet />
          </main>
        </div>
      </div>

      {pwdModal && (
        <ChangePasswordModal
          userId={user.id}
          onClose={() => setPwdModal(false)}
          onSuccess={(m) => toastApi.success(m)}
          onError={(m) => toastApi.error(m)}
        />
      )}

      <ToastContainer toasts={toastApi.toasts} onClose={toastApi.remove} />
    </ToastContext.Provider>
  );
}

const S = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--dark)',
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    height: '60px',
    background: 'var(--black)',
    borderBottom: '1px solid var(--gray-border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 28px',
    gap: '16px',
    flexShrink: 0,
    backgroundImage: 'linear-gradient(90deg, rgba(227,6,19,0.06) 0%, transparent 30%)',
  },
  topbarAccent: {
    width: '2px',
    height: '18px',
    background: 'linear-gradient(180deg, var(--red-bright), var(--red-dark))',
    borderRadius: '2px',
  },
  topbarTitle: {
    fontSize: '12px',
    color: 'var(--gray-light)',
    letterSpacing: '1px',
    flex: 1,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userMenuContainer: { position: 'relative' },
  userBtn: {
    background: 'transparent',
    border: '1px solid var(--gray-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all .2s ease',
    outline: 'none',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, var(--red-bright) 0%, var(--red-dark) 100%)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--white)',
    fontSize: '14px',
    fontWeight: '800',
    boxShadow: 'var(--shadow-red)',
  },
  userText: { textAlign: 'left', display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '12.5px', fontWeight: '700', color: 'var(--silver-bright)', lineHeight: 1.2 },
  userRole: {
    fontSize: '9px',
    color: 'var(--gray-mid)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '200px',
    background: 'var(--black)',
    border: '1px solid var(--gray-border)',
    borderTop: '2px solid var(--red)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card)',
    zIndex: 1000,
    padding: '6px',
    animation: 'fadeIn .2s ease',
  },
  dropdownHeader: {
    padding: '10px 12px',
    fontSize: '9px',
    color: 'var(--gray-mid)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '800',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    color: 'var(--gray-light)',
    fontSize: '13px',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all .2s',
    fontWeight: '500',
  },
  dropdownIcon: { fontSize: '14px', filter: 'grayscale(1)' },
  dropdownDivider: { height: '1px', background: 'var(--gray-border)', margin: '6px' },
  topbarBrand: {
    fontSize: '10px',
    color: 'var(--gray)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  main: {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto',
    backgroundImage: 'radial-gradient(ellipse 60% 40% at 100% 0%, rgba(227,6,19,0.04) 0%, transparent 50%)',
  },
};
