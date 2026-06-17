import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import { getClientes }  from '../api/clientes';
import { getVehiculos } from '../api/vehiculos';
import { getCitas }     from '../api/citas';
import { getOrdenes }   from '../api/ordenes';
import { getFacturas }  from '../api/facturas';
import Spinner from '../components/common/Spinner';
import Logo from '../components/common/Logo';

/* ── paleta ─────────────────────────────────────────────── */
const RED    = '#e30613';
const BLUE   = '#3b82f6';
const YELLOW = '#eab308';
const GREEN  = '#22c55e';
const GRAY   = '#9ca3af';

/* ── tooltip personalizado ───────────────────────────────── */
function CustomTooltip({ active, payload, label, prefix='', suffix='' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#1a1a1a', border:'1px solid #252525', borderRadius:'8px', padding:'10px 14px', fontSize:'13px' }}>
      <p style={{ color:'#888', marginBottom:'4px' }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color: p.color, fontWeight:'600', margin:'2px 0' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('es-CO') : p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

/* ── generar reporte PDF ─────────────────────────────────── */
function generarReportePDF(facturas, ordenes) {
  const total = facturas.reduce((a,f) => a + Number(f.total||0), 0);
  const fecha = new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });

  // Agrupar facturas por mes
  const porMes = {};
  facturas.forEach(f => {
    if (!f.fecha) return;
    const mes = f.fecha.substring(0,7);
    porMes[mes] = (porMes[mes]||0) + Number(f.total||0);
  });

  const filas = Object.entries(porMes).sort().map(([mes,val]) =>
    `<tr><td>${mes}</td><td style="text-align:right;color:#22c55e;font-weight:600">$${val.toLocaleString('es-CO',{minimumFractionDigits:2})}</td></tr>`
  ).join('');

  const factFilas = facturas.slice(0,20).map(f =>
    `<tr>
      <td>${f.numeroFactura||'—'}</td>
      <td>${f.fecha ? f.fecha.substring(0,10) : '—'}</td>
      <td>${f.ordenServicio ? `#${f.ordenServicio.id}` : '—'}</td>
      <td style="text-align:right">$${Number(f.subtotal||0).toLocaleString('es-CO',{minimumFractionDigits:2})}</td>
      <td style="text-align:right">-$${Number(f.descuento||0).toLocaleString('es-CO',{minimumFractionDigits:2})}</td>
      <td style="text-align:right;color:#22c55e;font-weight:600">$${Number(f.total||0).toLocaleString('es-CO',{minimumFractionDigits:2})}</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Reporte de Ventas — Miguel Cars</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color:#222; background:#fff; }
    .header { background:'#0a0a0a'; color:#fff; padding:28px 36px; display:flex; justify-content:space-between; align-items:center; }
    .brand { font-size:22px; font-weight:800; letter-spacing:1px; }
    .brand span { color:#e30613; }
    .sub { color:#888; font-size:13px; margin-top:4px; }
    .fecha { color:#555; font-size:13px; }
    .content { padding:28px 36px; }
    h2 { font-size:14px; color:#e30613; letter-spacing:1.5px; text-transform:uppercase; margin:24px 0 12px; border-bottom:2px solid #e30613; padding-bottom:6px; }
    .cards { display:flex; gap:16px; margin-bottom:8px; }
    .card { flex:1; background:#f8f8f8; border-radius:8px; padding:16px 20px; border-left:4px solid #e30613; }
    .card .val { font-size:24px; font-weight:800; color:#e30613; }
    .card .lbl { font-size:12px; color:#888; margin-top:3px; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th { background:#0a0a0a; color:#fff; padding:9px 12px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
    td { padding:8px 12px; border-bottom:1px solid #f0f0f0; }
    tr:nth-child(even) td { background:#fafafa; }
    .footer { margin-top:40px; text-align:center; color:#aaa; font-size:12px; padding:20px; border-top:1px solid #eee; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">⚙ MIGUEL <span>CARS</span></div>
      <div class="sub">Taller Mecánico — Reporte de Ventas</div>
    </div>
    <div class="fecha">Generado: ${fecha}</div>
  </div>
  <div class="content">
    <div class="cards">
      <div class="card"><div class="val">${facturas.length}</div><div class="lbl">Facturas emitidas</div></div>
      <div class="card"><div class="val">${ordenes.length}</div><div class="lbl">Órdenes totales</div></div>
      <div class="card"><div class="val" style="color:#22c55e">$${total.toLocaleString('es-CO',{minimumFractionDigits:2})}</div><div class="lbl">Ingresos totales</div></div>
    </div>

    <h2>Ventas por mes</h2>
    <table>
      <thead><tr><th>Período</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${filas || '<tr><td colspan="2" style="text-align:center;color:#aaa">Sin datos</td></tr>'}</tbody>
    </table>

    <h2>Detalle de facturas</h2>
    <table>
      <thead>
        <tr><th>N° Factura</th><th>Fecha</th><th>Orden</th><th style="text-align:right">Subtotal</th><th style="text-align:right">Descuento</th><th style="text-align:right">Total</th></tr>
      </thead>
      <tbody>${factFilas || '<tr><td colspan="6" style="text-align:center;color:#aaa">Sin facturas</td></tr>'}</tbody>
    </table>
    <div class="footer">Miguel Cars © ${new Date().getFullYear()} — Documento generado automáticamente</div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
}

/* ══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats,   setStats]   = useState({ clientes:0, vehiculos:0, citas:0, ordenes:0 });
  const [ordenes, setOrdenes] = useState([]);
  const [facturas,setFacturas]= useState([]);
  const [citas,   setCitas]   = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    Promise.all([getClientes(), getVehiculos(), getCitas(), getOrdenes(), getFacturas()])
      .then(([cl, veh, ci, or, fa]) => {
        setStats({ clientes: cl.data.length, vehiculos: veh.data.length, citas: ci.data.length, ordenes: or.data.length });
        setOrdenes(or.data);
        setFacturas(fa.data);
        setCitas(ci.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  /* ── datos para gráficas ────────────────────────────── */

  // 1. Órdenes por estado (pie)
  const ordenesEstado = ['PENDIENTE','EN_PROCESO','FINALIZADA','ENTREGADA'].map(e => ({
    name: e.replace('_',' '), value: ordenes.filter(o=>o.estado===e).length,
  })).filter(d=>d.value>0);
  const pieColors = [GRAY, YELLOW, BLUE, GREEN];

  // 2. Ventas mensuales (area)
  const ventasMes = {};
  facturas.forEach(f => {
    if (!f.fecha) return;
    const mes = f.fecha.substring(0,7);
    ventasMes[mes] = (ventasMes[mes]||0) + Number(f.total||0);
  });
  const ventasData = Object.entries(ventasMes).sort().slice(-6).map(([mes,total]) => ({ mes: mes.replace(/(\d{4})-(\d{2})/,'$2/$1'), total }));

  // 3. Citas por estado (bar)
  const citasBar = ['PROGRAMADA','ATENDIDA','CANCELADA'].map(e => ({
    estado: e, cantidad: citas.filter(c=>c.estado===e).length,
  }));

  // 4. Ingresos por orden — últimas 8 órdenes con total
  const ingresosOrden = ordenes.filter(o=>o.totalGeneral).slice(-8).map(o => ({
    orden: o.numeroOrden ? o.numeroOrden.replace('ORD-','') : `#${o.id}`,
    total: Number(o.totalGeneral||0),
  }));

  const totalVentas  = facturas.reduce((a,f)=>a+Number(f.total||0),0);

  return (
    <div style={{ animation:'fadeIn .3s ease', display:'flex', flexDirection:'column', gap:'20px' }}>

      <div style={S.userHeader}>
        <Logo size="sm" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h1 style={S.welcome}>¡Hola de nuevo, {user.nombre}! 👋</h1>
          <p style={S.roleBadge}>{user.rol?.nombre || 'Personal'}</p>
        </div>
      </div>

      {/* ── Acceso rápido (compacto, top) ─────────────── */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
        {[
          ['/clientes',  '👥', 'Clientes'],
          ['/vehiculos', '🚗', 'Vehículos'],
          ['/ordenes',   '📋', 'Órdenes'],
          ['/citas',     '📅', 'Citas'],
          ['/facturas',  '🧾', 'Facturas'],
        ].map(([href,icon,label]) => (
          <a key={href} href={href} style={quickLink}>
            <span>{icon}</span><span>{label}</span>
          </a>
        ))}
        {/* Reporte PDF */}
        <button onClick={() => generarReportePDF(facturas, ordenes)} style={reportBtn}>
          📄 Reporte de Ventas PDF
        </button>
      </div>

      {/* ── Stats cards ───────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px' }}>
        {[
          ['Clientes',    stats.clientes,  RED,    '👥'],
          ['Vehículos',   stats.vehiculos, YELLOW, '🚗'],
          ['Citas',       stats.citas,     BLUE,   '📅'],
          ['Órdenes',     stats.ordenes,   GREEN,  '📋'],
        ].map(([label,val,color,icon]) => (
          <div key={label} style={{ background:'#0a0a0a', border:`1px solid #1a1a1a`, borderTop:`2px solid ${color}`, borderRadius:'10px', padding:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'20px' }}>{icon}</span>
              <span style={{ fontSize:'32px', fontWeight:'800', color, lineHeight:1 }}>{val}</span>
            </div>
            <div style={{ fontSize:'12px', color:'#555' }}>{label} registrados</div>
          </div>
        ))}
      </div>

      {/* ── Gráficas ──────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

        {/* 1. Ventas mensuales */}
        <ChartCard title="📈 Ventas mensuales" subtitle={`Total: $${totalVentas.toLocaleString('es-CO',{minimumFractionDigits:2})}`}>
          {ventasData.length === 0 ? <NoData /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ventasData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={GREEN} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="mes" stroke="#555" tick={{ fontSize:11 }} />
                <YAxis stroke="#555" tick={{ fontSize:11 }} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area type="monotone" dataKey="total" name="Total" stroke={GREEN} fill="url(#colorVentas)" strokeWidth={2} dot={{ fill:GREEN, r:3 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 2. Órdenes por estado */}
        <ChartCard title="🔄 Órdenes por estado" subtitle={`${stats.ordenes} órdenes totales`}>
          {ordenesEstado.length === 0 ? <NoData /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ordenesEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {ordenesEstado.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:'11px', color:'#666' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 3. Citas por estado */}
        <ChartCard title="📅 Citas por estado" subtitle={`${stats.citas} citas registradas`}>
          {citasBar.every(d=>d.cantidad===0) ? <NoData /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={citasBar} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="estado" stroke="#555" tick={{ fontSize:11 }} />
                <YAxis stroke="#555" tick={{ fontSize:11 }} />
                <Tooltip content={<CustomTooltip suffix=" citas" />} />
                <Bar dataKey="cantidad" name="Citas" radius={[4,4,0,0]}>
                  {citasBar.map((_, i) => <Cell key={i} fill={[BLUE, GREEN, RED][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 4. Total por orden */}
        <ChartCard title="💰 Ingresos por orden" subtitle="Últimas órdenes con total">
          {ingresosOrden.length === 0 ? <NoData /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ingresosOrden}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="orden" stroke="#555" tick={{ fontSize:10 }} />
                <YAxis stroke="#555" tick={{ fontSize:11 }} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Line type="monotone" dataKey="total" name="Total" stroke={RED} strokeWidth={2} dot={{ fill:RED, r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

/* ── sub-componentes ────────────────────────────────────── */
function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ background:'#0a0a0a', border:'1px solid #1a1a1a', borderRadius:'12px', padding:'18px' }}>
      <div style={{ marginBottom:'14px' }}>
        <div style={{ fontSize:'14px', fontWeight:'700', color:'#fff' }}>{title}</div>
        <div style={{ fontSize:'11px', color:'#555', marginTop:'2px' }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
function NoData() {
  return <div style={{ height:'200px', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', fontSize:'13px' }}>Sin datos suficientes</div>;
}

/* ── estilos ────────────────────────────────────────────── */
const quickLink = {
  display:'flex', alignItems:'center', gap:'6px',
  background:'#0a0a0a', border:'1px solid #1f1f1f',
  padding:'7px 14px', borderRadius:'6px',
  color:'#888', textDecoration:'none', fontSize:'13px',
  transition:'border-color .15s, color .15s',
  fontWeight:'500',
};
const reportBtn = {
  display:'flex', alignItems:'center', gap:'8px',
  background:'linear-gradient(135deg, var(--red-bright), var(--red-dark))', color:'#fff', border:'none',
  padding:'8px 18px', borderRadius:'var(--radius-sm)',
  fontSize:'13px', fontWeight:'700', cursor:'pointer',
  boxShadow:'var(--shadow-red)',
  marginLeft:'auto',
  textTransform:'uppercase',
  letterSpacing:'0.5px',
};

const S = {
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'linear-gradient(90deg, var(--black) 0%, var(--dark-2) 100%)',
    padding: '24px 30px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-border)',
    borderTop: '2px solid var(--red)',
    marginBottom: '10px',
  },
  welcome: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#fff',
    margin: 0
  },
  roleBadge: {
    fontSize: '11px',
    color: 'var(--red)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginTop: '4px',
    margin: 0,
  },
  logoutQuick: {
    background: 'rgba(204,31,31,0.1)',
    color: '#e30613',
    border: '1px solid rgba(204,31,31,0.2)',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all .2s'
  }
};
