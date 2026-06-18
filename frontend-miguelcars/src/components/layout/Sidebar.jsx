import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../common/Logo';

const links = [
  { to: '/',          icon: '⊞', label: 'Dashboard',   perm: 'DASHBOARD_VER' },
  { to: '/clientes',  icon: '👥', label: 'Clientes',    perm: 'CLIENTES_VER' },
  { to: '/vehiculos', icon: '🚗', label: 'Vehículos',   perm: 'VEHICULOS_VER' },
  { to: '/citas',     icon: '📅', label: 'Citas',       perm: 'CITAS_VER' },
  { to: '/ordenes',   icon: '📋', label: 'Órdenes',     perm: 'ORDENES_VER' },
  { to: '/facturas',  icon: '🧾', label: 'Facturas',    perm: 'FACTURAS_VER' },
  { to: '/usuarios',  icon: '👤', label: 'Usuarios',    perm: 'USUARIOS_VER' },
  { to: '/roles',     icon: '🛡', label: 'Roles',       perm: 'ROLES_VER' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { can } = useAuth();

  return (
    <aside style={S.sidebar} className={`app-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div style={S.brand}>
        <Logo size="sm" style={{ filter: 'drop-shadow(0 2px 12px rgba(227,6,19,0.3))' }} />
        <span className="brand-tagline" style={S.tagline}>service innovation</span>
      </div>

      <div style={S.divider} />

      <nav style={S.nav}>
        {links.filter(link => can(link.perm)).map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({ ...S.link, ...(isActive ? S.active : {}) })}
            onClick={onClose}
          >
            {({ isActive }) => (
              <>
                {isActive && <span style={S.activeBorder} />}
                <span style={S.icon}>{icon}</span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={S.footer}>
        <div style={S.footerDot} />
        <span style={S.footerText}>Sistema activo</span>
      </div>
    </aside>
  );
}

const S = {
  sidebar: {
    width: '235px',
    minHeight: '100vh',
    background: 'var(--black)',
    borderRight: '1px solid var(--gray-border)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    backgroundImage: 'linear-gradient(180deg, rgba(227,6,19,0.04) 0%, transparent 40%)',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 16px 16px',
    gap: '8px',
  },
  tagline: {
    fontSize: '8px',
    letterSpacing: '2px',
    padding: '3px 8px',
  },
  divider: {
    height: '2px',
    background: 'linear-gradient(90deg, var(--red) 0%, var(--silver-dark) 50%, transparent 100%)',
    margin: '0 16px 12px',
    opacity: 0.6,
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 10px',
    gap: '2px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    color: 'var(--gray-light)',
    textDecoration: 'none',
    fontSize: '13px',
    borderRadius: 'var(--radius-sm)',
    position: 'relative',
    fontWeight: '600',
  },
  active: {
    background: 'var(--red-glow)',
    color: 'var(--white)',
  },
  activeBorder: {
    position: 'absolute',
    left: 0,
    top: '20%',
    height: '60%',
    width: '3px',
    background: 'var(--red)',
    borderRadius: '0 3px 3px 0',
    boxShadow: '0 0 8px var(--red-glow-lg)',
  },
  icon: { fontSize: '15px', width: '20px', textAlign: 'center' },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 20px',
    borderTop: '1px solid var(--gray-border)',
  },
  footerDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
  },
  footerText: {
    fontSize: '10px',
    color: 'var(--gray-mid)',
    letterSpacing: '1px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
};
