import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, can } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside style={S.sidebar}>
      {/* Brand */}
      <div style={S.brand}>
        <span style={S.brandIcon}>⚙</span>
        <div>
          <div style={S.brandName}>MIGUEL CARS</div>
          <div style={S.brandSub}>Taller Mecánico</div>
        </div>
      </div>

      <div style={S.divider} />

      <nav style={S.nav}>
        {links.filter(link => can(link.perm)).map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({ ...S.link, ...(isActive ? S.active : {}) })}
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

      <div style={S.userSection}>
        <div style={S.userInfo}>
          <div style={S.userName}>{user.nombre || 'Usuario'}</div>
          <div style={S.userRole}>{user.rol?.nombre || 'Personal'}</div>
        </div>
        <button onClick={handleLogout} style={S.logoutBtn} title="Cerrar Sesión">
          🚪
        </button>
      </div>

      <div style={S.footer}>
        <div style={S.footerDot} />
        <span style={S.footerText}>Sistema activo</span>
      </div>
    </aside>
  );
}

const S = {
  sidebar:     { width:'235px', minHeight:'100vh', background:'#0d0d0d', borderRight:'1px solid #1f1f1f', display:'flex', flexDirection:'column', flexShrink:0 },
  brand:       { display:'flex', alignItems:'center', gap:'12px', padding:'24px 20px 20px' },
  brandIcon:   { fontSize:'28px', color:'#cc1f1f', lineHeight:1 },
  brandName:   { fontSize:'15px', fontWeight:'800', color:'#ffffff', letterSpacing:'1.5px' },
  brandSub:    { fontSize:'10px', color:'#cc1f1f', letterSpacing:'2px', textTransform:'uppercase', marginTop:'1px' },
  divider:     { height:'1px', background:'linear-gradient(90deg, #cc1f1f 0%, #1f1f1f 100%)', margin:'0 20px 12px' },
  nav:         { flex:1, display:'flex', flexDirection:'column', padding:'4px 10px', gap:'2px' },
  link:        { display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', color:'#888', textDecoration:'none', fontSize:'13.5px', borderRadius:'6px', position:'relative', fontWeight:'500' },
  active:      { background:'rgba(204,31,31,0.12)', color:'#ffffff' },
  activeBorder:{ position:'absolute', left:0, top:'20%', height:'60%', width:'3px', background:'#cc1f1f', borderRadius:'0 3px 3px 0' },
  icon:        { fontSize:'15px', width:'20px', textAlign:'center' },
  userSection: { padding:'16px 20px', borderTop:'1px solid #1f1f1f', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px' },
  userInfo:    { display:'flex', flexDirection:'column', gap:'2px', overflow:'hidden' },
  userName:    { fontSize:'13px', fontWeight:'700', color:'#ddd', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  userRole:    { fontSize:'11px', color:'#cc1f1f', fontWeight:'600' },
  logoutBtn:   { background:'transparent', border:'none', color:'#666', cursor:'pointer', fontSize:'16px', padding:'4px', borderRadius:'4px', transition:'background .2s', display:'flex', alignItems:'center', justifyContent:'center' },
  footer:      { display:'flex', alignItems:'center', gap:'8px', padding:'16px 20px', borderTop:'1px solid #1f1f1f' },
  footerDot:   { width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e' },
  footerText:  { fontSize:'11px', color:'#555', letterSpacing:'0.5px' },
};
