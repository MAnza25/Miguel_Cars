import { useEffect, useState } from 'react';
import { getOrdenes, createOrden, updateOrden, deleteOrden } from '../../api/ordenes';
import { getClientes }   from '../../api/clientes';
import { getVehiculos }  from '../../api/vehiculos';
import { getUsuarios }   from '../../api/usuarios';
import { getDetallesPorOrden, createDetalle, recalcularTotales } from '../../api/detalleOrden';
import PageHeader             from '../../components/common/PageHeader';
import Table                  from '../../components/common/Table';
import Modal                  from '../../components/common/Modal';
import Spinner                from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const estadoColors = {
  PENDIENTE:  { background:'rgba(156,163,175,0.15)', color:'#9ca3af' },
  EN_PROCESO: { background:'rgba(234,179,8,0.12)',   color:'#eab308' },
  FINALIZADA: { background:'rgba(59,130,246,0.12)',  color:'#3b82f6' },
  ENTREGADA:  { background:'rgba(34,197,94,0.12)',   color:'#22c55e' },
};
const tipoBadge = {
  SERVICIO: { background:'rgba(59,130,246,0.12)', color:'#3b82f6' },
  REPUESTO: { background:'rgba(234,179,8,0.12)',  color:'#eab308' },
};

const emptyOrden = {
  motivoIngreso:'', diagnostico:'', estado:'PENDIENTE',
  clienteId:'', placaId:'', usuarioId:'',
  fechaIngreso:'', fechaEntrega:'',
  cl_nivelCombustible:'1/2', cl_kilometraje:'',
  cl_rayones:false, cl_golpes:false, cl_vidriosRotos:false, cl_lucesDanadas:false,
  cl_observaciones:'',
};
const emptyFila = { tipo:'SERVICIO', descripcion:'', cantidad:'1', precioUnitario:'' };

const columns = [
  { key:'numeroOrden',   label:'N° Orden' },
  { key:'cliente',       label:'Cliente',  render: v => v?.nombre || '—' },
  { key:'vehiculo',      label:'Vehículo', render: v => v?.placa  || '—' },
  { key:'motivoIngreso', label:'Motivo'   },
  { key:'estado', label:'Estado', render: v => {
    const c = estadoColors[v] || {};
    return <span style={{...c, padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>{v?.replace('_',' ')}</span>;
  }},
  { key:'totalGeneral', label:'Total',
    render: v => v ? <span style={{color:'#22c55e',fontWeight:'700'}}>${Number(v).toFixed(2)}</span> : '—' },
  { key:'fechaIngreso', label:'Ingreso', render: v => v ? v.split('T')[0] : '—' },
];

export default function OrdenesPage() {
  const [data,     setData]     = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos,setVehiculos]= useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modalOpen,setModalOpen]= useState(false);
  const [form,     setForm]     = useState(emptyOrden);
  const [editing,  setEditing]  = useState(null);
  const [filas,    setFilas]    = useState([]);
  const [filaInput,setFilaInput]= useState(emptyFila);

  const load = () => {
    setLoading(true);
    Promise.all([getOrdenes(), getClientes(), getVehiculos(), getUsuarios()])
      .then(([o,cl,v,u]) => { setData(o.data); setClientes(cl.data); setVehiculos(v.data); setUsuarios(u.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(emptyOrden); setFilas([]); setFilaInput(emptyFila); setEditing(null); setModalOpen(true); };

  const openEdit = async row => {
    setForm({
      motivoIngreso: row.motivoIngreso||'', diagnostico: row.diagnostico||'',
      estado: row.estado||'PENDIENTE',
      clienteId: row.cliente?.id||'', placaId: row.vehiculo?.placa||'', usuarioId: row.usuario?.id||'',
      fechaIngreso: row.fechaIngreso ? row.fechaIngreso.split('T')[0] : '',
      fechaEntrega: row.fechaEntrega ? row.fechaEntrega.split('T')[0] : '',
      cl_nivelCombustible: row.checklist?.nivelCombustible||'1/2',
      cl_kilometraje: row.checklist?.kilometrajeEntrada||'',
      cl_rayones: row.checklist?.rayones||false, cl_golpes: row.checklist?.golpes||false,
      cl_vidriosRotos: row.checklist?.vidriosRotos||false, cl_lucesDanadas: row.checklist?.lucesDanadas||false,
      cl_observaciones: row.checklist?.observaciones||'',
    });
    const res = await getDetallesPorOrden(row.id);
    setFilas(res.data.map(d => ({ _id: d.id, tipo: d.tipo, descripcion: d.descripcion, cantidad: String(d.cantidad), precioUnitario: String(d.precioUnitario), subtotal: d.subtotal })));
    setFilaInput(emptyFila);
    setEditing(row.id);
    setModalOpen(true);
  };

  const set    = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const toggle = k => () => setForm(p => ({...p, [k]: !p[k]}));
  const setFI  = k => e => setFilaInput(p => ({...p, [k]: e.target.value}));

  const agregarFila = () => {
    if (!filaInput.descripcion || !filaInput.precioUnitario) return;
    const cant = Number(filaInput.cantidad)||1;
    const price= Number(filaInput.precioUnitario)||0;
    setFilas(p => [...p, { ...filaInput, cantidad: String(cant), precioUnitario: String(price), subtotal: cant*price }]);
    setFilaInput(emptyFila);
  };
  const quitarFila = i => setFilas(p => p.filter((_,idx) => idx !== i));

  const totalServ = filas.filter(f=>f.tipo==='SERVICIO').reduce((a,f)=>a+Number(f.cantidad)*Number(f.precioUnitario),0);
  const totalRep  = filas.filter(f=>f.tipo==='REPUESTO').reduce((a,f)=>a+Number(f.cantidad)*Number(f.precioUnitario),0);
  const totalGen  = totalServ + totalRep;

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      motivoIngreso: form.motivoIngreso, diagnostico: form.diagnostico, estado: form.estado,
      fechaIngreso: form.fechaIngreso ? `${form.fechaIngreso}T00:00:00Z` : null,
      fechaEntrega: form.fechaEntrega ? `${form.fechaEntrega}T00:00:00Z` : null,
      ...(form.clienteId ? { cliente:  { id: Number(form.clienteId) } } : {}),
      ...(form.placaId   ? { vehiculo: { placa: form.placaId }       } : {}),
      ...(form.usuarioId ? { usuario:  { id: Number(form.usuarioId) } } : {}),
      checklist: {
        nivelCombustible: form.cl_nivelCombustible,
        kilometrajeEntrada: Number(form.cl_kilometraje)||0,
        rayones: form.cl_rayones, golpes: form.cl_golpes,
        vidriosRotos: form.cl_vidriosRotos, lucesDanadas: form.cl_lucesDanadas,
        observaciones: form.cl_observaciones,
      },
    };
    let ordenId;
    if (editing) { await updateOrden(editing, payload); ordenId = editing; }
    else { const r = await createOrden(payload); ordenId = r.data.id; }

    for (const f of filas.filter(f=>!f._id)) {
      await createDetalle({ tipo: f.tipo, descripcion: f.descripcion, cantidad: Number(f.cantidad), precioUnitario: Number(f.precioUnitario), ordenServicio: { id: ordenId } });
    }
    if (filas.length > 0) await recalcularTotales(ordenId);
    setModalOpen(false); load();
  };

  const handleDelete = async row => {
    if (confirm(`¿Eliminar orden ${row.numeroOrden}?`)) { await deleteOrden(row.id); load(); }
  };

  const clienteOpts  = [{ value:'', label:'— Cliente —'  }, ...clientes.map(c=>({ value:c.id,    label:`${c.nombre} (${c.cedula})` }))];
  const vehiculoOpts = [{ value:'', label:'— Vehículo —' }, ...vehiculos.map(v=>({ value:v.placa, label:`${v.placa} — ${v.marca} ${v.modelo}` }))];
  const usuarioOpts  = [{ value:'', label:'— Mecánico —' }, ...usuarios.map(u=>({ value:u.id,     label:u.nombre }))];

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader title="Órdenes de Servicio" onAdd={openNew} addLabel="Nueva Orden" />
      {loading ? <Spinner /> : <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />}

      {modalOpen && (
        <Modal title={editing ? 'Editar Orden' : 'Nueva Orden de Servicio'} onClose={() => setModalOpen(false)} width="560px">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

            {/* ══ SECCIÓN 1: Datos generales ══════════════════ */}
            <SecTitle n="1">Datos de la orden</SecTitle>
            <div style={g2}>
              <FormField label="Cliente"  options={clienteOpts}  value={form.clienteId}  onChange={set('clienteId')}  required />
              <FormField label="Vehículo" options={vehiculoOpts} value={form.placaId}    onChange={set('placaId')}    required />
            </div>
            <FormField label="Mecánico / Técnico" options={usuarioOpts} value={form.usuarioId} onChange={set('usuarioId')} />
            <FormField label="Motivo de ingreso"  value={form.motivoIngreso} onChange={set('motivoIngreso')} required />
            <FormField label="Diagnóstico" rows={2} value={form.diagnostico} onChange={set('diagnostico')} />
            <div style={g2}>
              <FormField label="Estado" options={['PENDIENTE','EN_PROCESO','FINALIZADA','ENTREGADA']} value={form.estado} onChange={set('estado')} />
              <div style={g2}>
                <FormField label="Fecha ingreso" type="date" value={form.fechaIngreso} onChange={set('fechaIngreso')} />
                <FormField label="Fecha entrega" type="date" value={form.fechaEntrega} onChange={set('fechaEntrega')} />
              </div>
            </div>

            {/* ══ SECCIÓN 2: Servicios y Repuestos ═══════════ */}
            <SecTitle n="2">Servicios y Repuestos</SecTitle>

            {/* Fila de entrada */}
            <div style={inputRow}>
              {/* Tipo toggle */}
              <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                <span style={lbl}>Tipo</span>
                <div style={{ display:'flex', gap:'5px' }}>
                  {['SERVICIO','REPUESTO'].map(t => (
                    <button key={t} type="button" onClick={() => setFilaInput(p=>({...p,tipo:t}))}
                      style={{ ...toggleBtn, ...(filaInput.tipo===t ? (t==='SERVICIO' ? activeS : activeR) : {}) }}>
                      {t==='SERVICIO' ? '⚙ Srv' : '🔧 Rep'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Descripción */}
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', flex:2 }}>
                <span style={lbl}>Descripción</span>
                <input style={inp} placeholder="Ej: Cambio de aceite..." value={filaInput.descripcion} onChange={setFI('descripcion')} />
              </div>
              {/* Cantidad */}
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', width:'70px' }}>
                <span style={lbl}>Cant.</span>
                <input style={inp} type="number" min="0.01" step="any" value={filaInput.cantidad} onChange={setFI('cantidad')} />
              </div>
              {/* Precio */}
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', width:'110px' }}>
                <span style={lbl}>Precio unit.</span>
                <input style={inp} type="number" min="0" step="0.01" placeholder="0.00" value={filaInput.precioUnitario} onChange={setFI('precioUnitario')} />
              </div>
              {/* Botón + */}
              <button type="button" onClick={agregarFila}
                disabled={!filaInput.descripcion || !filaInput.precioUnitario}
                style={addBtn(!filaInput.descripcion || !filaInput.precioUnitario)}
                title="Agregar">+
              </button>
            </div>

            {/* Preview subtotal */}
            {filaInput.descripcion && filaInput.precioUnitario && (
              <div style={{ fontSize:'12px', color:'#555', marginTop:'-10px' }}>
                Subtotal: <strong style={{ color:'#22c55e' }}>${(Number(filaInput.cantidad||1) * Number(filaInput.precioUnitario||0)).toFixed(2)}</strong>
              </div>
            )}

            {/* Tabla de filas */}
            {filas.length > 0 ? (
              <div style={{ border:'1px solid #1f1f1f', borderRadius:'8px', overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                  <thead>
                    <tr style={{ background:'#0d0d0d' }}>
                      {['Tipo','Descripción','Cant.','P.Unit.','Subtotal',''].map(h=>(
                        <th key={h} style={{ padding:'7px 10px', color:'#555', textAlign:'left', fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', fontWeight:'600' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((f,i) => (
                      <tr key={i} style={{ borderBottom:'1px solid #1a1a1a' }}>
                        <td style={{ padding:'8px 10px' }}>
                          <span style={{ ...tipoBadge[f.tipo], padding:'2px 7px', borderRadius:'12px', fontSize:'10px', fontWeight:'700' }}>
                            {f.tipo==='SERVICIO'?'⚙':'🔧'} {f.tipo}
                          </span>
                        </td>
                        <td style={{ padding:'8px 10px', color:'#ccc' }}>{f.descripcion}</td>
                        <td style={{ padding:'8px 10px', color:'#888' }}>{f.cantidad}</td>
                        <td style={{ padding:'8px 10px', color:'#888' }}>${Number(f.precioUnitario).toFixed(2)}</td>
                        <td style={{ padding:'8px 10px', color:'#22c55e', fontWeight:'600' }}>${Number(f.subtotal||Number(f.cantidad)*Number(f.precioUnitario)).toFixed(2)}</td>
                        <td style={{ padding:'8px 10px' }}>
                          <button type="button" onClick={()=>quitarFila(i)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:'14px' }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Totales */}
                <div style={{ background:'#0d0d0d', padding:'9px 14px', display:'flex', gap:'20px', justifyContent:'flex-end', borderTop:'1px solid #1a1a1a' }}>
                  <span style={{ fontSize:'12px', color:'#555' }}>Servicios: <strong style={{ color:'#3b82f6' }}>${totalServ.toFixed(2)}</strong></span>
                  <span style={{ fontSize:'12px', color:'#555' }}>Repuestos: <strong style={{ color:'#eab308' }}>${totalRep.toFixed(2)}</strong></span>
                  <span style={{ fontSize:'12px', color:'#555' }}>Total: <strong style={{ color:'#22c55e', fontSize:'14px' }}>${totalGen.toFixed(2)}</strong></span>
                </div>
              </div>
            ) : (
              <p style={{ color:'#444', fontSize:'13px', textAlign:'center', padding:'8px', border:'1px dashed #1f1f1f', borderRadius:'8px' }}>
                Sin ítems — use el formulario de arriba para agregar servicios o repuestos
              </p>
            )}

            {/* ══ SECCIÓN 3: Checklist ════════════════════════ */}
            <SecTitle n="3">Checklist de entrada</SecTitle>
            <div style={g2}>
              <FormField label="Nivel combustible" options={['vacío','1/4','1/2','3/4','lleno']} value={form.cl_nivelCombustible} onChange={set('cl_nivelCombustible')} />
              <FormField label="Km de entrada" type="number" value={form.cl_kilometraje} onChange={set('cl_kilometraje')} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {[['cl_rayones','Rayones'],['cl_golpes','Golpes'],['cl_vidriosRotos','Vidrios rotos'],['cl_lucesDanadas','Luces dañadas']].map(([k,lb])=>(
                <CheckItem key={k} label={lb} checked={form[k]} onClick={toggle(k)} />
              ))}
            </div>
            <FormField label="Observaciones checklist" rows={2} value={form.cl_observaciones} onChange={set('cl_observaciones')} />

            <FormBtn>{editing ? 'Guardar cambios' : 'Crear Orden'}</FormBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ── sub-componentes ────────────────────────────────────── */
function SecTitle({ n, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', borderBottom:'1px solid #1f1f1f', paddingBottom:'8px', marginTop:'2px' }}>
      <span style={{ background:'#cc1f1f', color:'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', flexShrink:0 }}>{n}</span>
      <span style={{ fontSize:'11px', color:'#cc1f1f', fontWeight:'700', letterSpacing:'1.5px', textTransform:'uppercase' }}>{children}</span>
    </div>
  );
}
function CheckItem({ label, checked, onClick }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', userSelect:'none' }}>
      <div onClick={onClick} style={{ width:'16px', height:'16px', flexShrink:0, borderRadius:'3px', background: checked?'#cc1f1f':'#0d0d0d', border:`2px solid ${checked?'#cc1f1f':'#2a2a2a'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'background .15s' }}>
        {checked && <span style={{ color:'#fff', fontSize:'10px', lineHeight:1 }}>✓</span>}
      </div>
      <span style={{ fontSize:'13px', color: checked?'#eab308':'#666' }}>{label}</span>
    </label>
  );
}

/* ── estilos ────────────────────────────────────────────── */
const g2  = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' };
const lbl = { fontSize:'11px', color:'#555', fontWeight:'600', letterSpacing:'0.5px', textTransform:'uppercase' };
const inp = { width:'100%', padding:'9px 11px', background:'#0d0d0d', border:'1px solid #2a2a2a', borderRadius:'6px', color:'#ddd', fontSize:'13px', outline:'none' };
const inputRow = { display:'flex', gap:'8px', alignItems:'flex-end', background:'#0d0d0d', border:'1px solid #252525', borderRadius:'8px', padding:'12px' };
const toggleBtn = { flex:1, padding:'8px 6px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'700', background:'#1a1a1a', color:'#555', transition:'all .15s' };
const activeS = { background:'#1d3a6b', color:'#3b82f6' };
const activeR = { background:'#4a3300', color:'#eab308' };
const addBtn  = dis => ({ height:'38px', width:'38px', background: dis?'#1a1a1a':'#cc1f1f', color: dis?'#555':'#fff', border:'none', borderRadius:'6px', cursor: dis?'not-allowed':'pointer', fontSize:'22px', fontWeight:'700', opacity: dis?0.5:1, transition:'all .15s', flexShrink:0 });
