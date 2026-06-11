import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          icon: '⊞', label: 'Dashboard'         },
  { to: '/clientes',  icon: '👥', label: 'Clientes'          },
  { to: '/vehiculos', icon: '🚗', label: 'Vehículos'         },
  { to: '/citas',     icon: '📅', label: 'Citas'             },
  { to: '/ordenes',   icon: '📋', label: 'Órdenes'           },
  { to: '/facturas',  icon: '🧾', label: 'Facturas'          },
  { to: '/usuarios',  icon: '👤', label: 'Usuarios'          },
  { to: '/roles',     icon: '🛡', label: 'Roles'             },
];

export default function Sidebar() {
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
        {links.map(({ to, icon, label }) => (
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
  footer:      { display:'flex', alignItems:'center', gap:'8px', padding:'16px 20px', borderTop:'1px solid #1f1f1f' },
  footerDot:   { width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e' },
  footerText:  { fontSize:'11px', color:'#555', letterSpacing:'0.5px' },
};
