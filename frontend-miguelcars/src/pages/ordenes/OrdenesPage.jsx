import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdenes, createOrden, updateOrden, deleteOrden } from '../../api/ordenes';
import { getClientes }   from '../../api/clientes';
import { getVehiculos }  from '../../api/vehiculos';
import { getUsuarios }   from '../../api/usuarios';
import { getDetallesPorOrden, createDetalle, recalcularTotales } from '../../api/detalleOrden';
import { generarFacturaDesdeOrden } from '../../api/facturas';
import { useAuth } from '../../hooks/useAuth';
import { useAppToast } from '../../components/layout/Layout';
import PageHeader             from '../../components/common/PageHeader';
import Table                  from '../../components/common/Table';
import Modal                  from '../../components/common/Modal';
import Spinner                from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';
import ConfirmModal from '../../components/common/ConfirmModal';

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
    render: v => v ? <span style={{color:'#22c55e',fontWeight:'700'}}>${Number(v).toLocaleString()}</span> : '—' },
  { key:'fechaIngreso', label:'Ingreso',  render: v => v ? v.split('T')[0] : '—' },
];

export default function OrdenesPage() {
  const toast = useAppToast();
  const navigate = useNavigate();
  const { can } = useAuth();

  const [data,      setData]      = useState([]);
  const [clientes,  setClientes]  = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios,  setUsuarios]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form,      setForm]      = useState(emptyOrden);
  const [editing,   setEditing]   = useState(null);
  const [filas,     setFilas]     = useState([]);
  const [filaInput, setFilaInput] = useState(emptyFila);
  
  const [search,    setSearch]    = useState('');
  const [fEstado,   setFEstado]   = useState('');
  const [fFecha,    setFFecha]    = useState('');
  const [confirm, setConfirm] = useState({ open: false, row: null });

  const load = () => {
    setLoading(true);
    Promise.all([getOrdenes(), getClientes(), getVehiculos(), getUsuarios()])
      .then(([o,cl,v,u]) => {
        setData(o.data); setClientes(cl.data);
        setVehiculos(v.data); setUsuarios(u.data);
      })
      .catch(() => toast?.error('Error al cargar los datos'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Filtrado combinado
  const filteredData = data.filter(item => {
    const s = search.toLowerCase();
    const matchSearch = !search || (
      item.numeroOrden?.toLowerCase().includes(s) ||
      item.cliente?.nombre?.toLowerCase().includes(s) ||
      item.vehiculo?.placa?.toLowerCase().includes(s) ||
      item.motivoIngreso?.toLowerCase().includes(s)
    );
    const matchEstado = !fEstado || item.estado === fEstado;
    const matchFecha  = !fFecha  || (item.fechaIngreso && item.fechaIngreso.includes(fFecha));
    return matchSearch && matchEstado && matchFecha;
  });

  const vehiculosFiltrados = useMemo(() => {
    if (!form.clienteId) return vehiculos;
    return vehiculos.filter(v => v.cliente?.id === Number(form.clienteId));
  }, [form.clienteId, vehiculos]);

  const openNew = () => { setForm(emptyOrden); setFilas([]); setFilaInput(emptyFila); setEditing(null); setModalOpen(true); };

  const openEdit = async row => {
    // Si no tiene permiso de edición, solo mostramos el modal en modo lectura (o no dejamos abrirlo)
    if (!can('ORDENES_EDITAR')) {
      toast?.warning('No tienes permiso para editar órdenes');
      return;
    }
    setForm({
      motivoIngreso:       row.motivoIngreso || '',
      diagnostico:         row.diagnostico   || '',
      estado:              row.estado        || 'PENDIENTE',
      clienteId:           row.cliente?.id    || '',
      placaId:             row.vehiculo?.placa || '',
      usuarioId:           row.usuario?.id    || '',
      cl_nivelCombustible: row.checklist?.nivelCombustible   || '1/2',
      cl_kilometraje:      row.checklist?.kilometrajeEntrada || '',
      cl_rayones:          row.checklist?.rayones     || false,
      cl_golpes:           row.checklist?.golpes      || false,
      cl_vidriosRotos:     row.checklist?.vidriosRotos || false,
      cl_lucesDanadas:     row.checklist?.lucesDanadas || false,
      cl_observaciones:    row.checklist?.observaciones || '',
    });
    const res = await getDetallesPorOrden(row.id);
    setFilas(res.data.map(d => ({
      _id: d.id, tipo: d.tipo, descripcion: d.descripcion,
      cantidad: String(d.cantidad), precioUnitario: String(d.precioUnitario), subtotal: d.subtotal,
    })));
    setFilaInput(emptyFila);
    setEditing(row.id);
    setModalOpen(true);
  };

  const set    = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const toggle = k => () => setForm(p => ({...p, [k]: !p[k]}));
  const setFI  = k => e => setFilaInput(p => ({...p, [k]: e.target.value}));

  const handleClienteChange = e => {
    const newClienteId = e.target.value;
    setForm(p => {
      const vehiculoValido = vehiculos.find(
        v => v.placa === p.placaId && v.cliente?.id === Number(newClienteId)
      );
      return { ...p, clienteId: newClienteId, placaId: vehiculoValido ? p.placaId : '' };
    });
  };

  const agregarFila = () => {
    if (!filaInput.descripcion || !filaInput.precioUnitario) return;
    const cant  = Number(filaInput.cantidad) || 1;
    const price = Number(filaInput.precioUnitario) || 0;
    setFilas(p => [...p, { ...filaInput, cantidad: String(cant), precioUnitario: String(price), subtotal: cant * price }]);
    setFilaInput(emptyFila);
  };
  const quitarFila = i => setFilas(p => p.filter((_,idx) => idx !== i));

  const totalServ = filas.filter(f=>f.tipo==='SERVICIO').reduce((a,f)=>a+Number(f.cantidad)*Number(f.precioUnitario),0);
  const totalRep  = filas.filter(f=>f.tipo==='REPUESTO').reduce((a,f)=>a+Number(f.cantidad)*Number(f.precioUnitario),0);
  const totalGen  = totalServ + totalRep;

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        motivoIngreso: form.motivoIngreso,
        diagnostico:   form.diagnostico,
        estado:        form.estado,
        ...(form.clienteId ? { cliente:  { id: Number(form.clienteId)  } } : {}),
        ...(form.placaId   ? { vehiculo: { placa: form.placaId         } } : {}),
        ...(form.usuarioId ? { usuario:  { id: Number(form.usuarioId)  } } : {}),
        checklist: {
          nivelCombustible:   form.cl_nivelCombustible,
          kilometrajeEntrada: Number(form.cl_kilometraje) || 0,
          rayones:      form.cl_rayones, golpes: form.cl_golpes,
          vidriosRotos: form.cl_vidriosRotos, lucesDanadas: form.cl_lucesDanadas,
          observaciones:form.cl_observaciones,
        },
      };

      let ordenId;
      if (editing) {
        await updateOrden(editing, payload);
        ordenId = editing;
        toast?.success('Orden actualizada correctamente');
      } else {
        const r = await createOrden(payload);
        ordenId = r.data.id;
        toast?.success(`Orden ${r.data.numeroOrden} creada correctamente`);
      }

      for (const f of filas.filter(f => !f._id)) {
        await createDetalle({
          ordenId:        ordenId,
          tipo:           f.tipo,
          descripcion:    f.descripcion,
          cantidad:       Number(f.cantidad),
          precioUnitario: Number(f.precioUnitario),
        });
      }
      if (filas.some(f => !f._id)) await recalcularTotales(ordenId);

      setModalOpen(false);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Error al guardar la orden';
      toast?.error(typeof msg === 'string' ? msg : 'Error al guardar la orden');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = row => {
    setConfirm({ open: true, row });
  };

  const executeDelete = async () => {
    const row = confirm.row;
    try { 
      await deleteOrden(row.id); 
      toast?.success(`Orden ${row.numeroOrden} eliminada correctamente`); 
      load(); 
    } catch { 
      toast?.error('No se pudo eliminar la orden'); 
    }
  };

  const handleGenerarFactura = async row => {
    if (!can('FACTURAS_CREAR')) {
      toast?.error('No tienes permiso para facturar órdenes');
      return;
    }
    if (row.estado === 'ENTREGADA') { toast?.warning('Esta orden ya fue entregada y facturada'); return; }
    navigate('/facturas', { state: { ordenId: row.id } });
  };

  const clienteOpts  = [{ value:'', label:'— Cliente —'  }, ...clientes.map(c=>({ value:c.id,    label:`${c.nombre} (${c.cedula})` }))];
  const vehiculoOpts = [
    { value:'', label: form.clienteId ? '— Vehículo del cliente —' : '— Seleccione cliente primero —' },
    ...vehiculosFiltrados.map(v=>({ value:v.placa, label:`${v.placa} — ${v.marca} ${v.modelo}` })),
  ];
  const usuarioOpts  = [{ value:'', label:'— Mecánico —' }, ...usuarios.map(u =>({ value:u.id, label:u.nombre }))];

  const facturaCol = {
    key: '_factura', label: 'Facturar',
    render: (_, row) => {
      const yaEntregada = row.estado === 'ENTREGADA';
      return (
        <button onClick={() => handleGenerarFactura(row)} disabled={yaEntregada}
          style={{ background: yaEntregada?'transparent':'rgba(34,197,94,0.12)', color: yaEntregada?'#333':'#22c55e',
            border:`1px solid ${yaEntregada?'#252525':'rgba(34,197,94,0.3)'}`, padding:'4px 10px',
            borderRadius:'5px', fontSize:'12px', cursor: yaEntregada?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
          {yaEntregada ? '✓ Facturada' : '🧾 Facturar'}
        </button>
      );
    },
  };

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader 
        title="Órdenes de Servicio" 
        onAdd={can('ORDENES_CREAR') ? openNew : null} 
        addLabel="Nueva Orden" 
        onSearch={setSearch}
        searchValue={search}
      />

      <div style={S.filterBar} className="filter-bar">
        <div style={S.filterGroup}>
          <span style={S.filterLabel}>Estado:</span>
          <select style={S.select} value={fEstado} onChange={e => setFEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.keys(estadoColors).map(e => <option key={e} value={e}>{e.replace('_',' ')}</option>)}
          </select>
        </div>
        <div style={S.filterGroup}>
          <span style={S.filterLabel}>Fecha Ingreso:</span>
          <input type="date" style={S.select} value={fFecha} onChange={e => setFFecha(e.target.value)} />
        </div>
        {(fEstado || fFecha) && (
          <button style={S.clearBtn} onClick={() => { setFEstado(''); setFFecha(''); }}>Limpiar Filtros</button>
        )}
      </div>

      {loading ? <Spinner /> : (
        <Table 
          columns={[...columns, facturaCol]} 
          data={filteredData} 
          onEdit={can('ORDENES_EDITAR') ? openEdit : null} 
          onDelete={can('ORDENES_ELIMINAR') ? handleDelete : null} 
        />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Editar Orden' : 'Nueva Orden de Servicio'} onClose={() => setModalOpen(false)} width="560px">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            <SecTitle n="1">Datos de la orden</SecTitle>
            <FormField label="Cliente"  options={clienteOpts}  value={form.clienteId}  onChange={handleClienteChange}  required />
            <FormField label="Vehículo" options={vehiculoOpts} value={form.placaId}    onChange={set('placaId')}
              disabled={!form.clienteId} required />
            {form.clienteId && vehiculosFiltrados.length === 0 && (
              <p style={{ fontSize:'12px', color:'#e30613', marginTop:'-12px' }}>
                ⚠ Este cliente no tiene vehículos registrados
              </p>
            )}
            <FormField label="Mecánico / Técnico" options={usuarioOpts} value={form.usuarioId} onChange={set('usuarioId')} />
            <FormField label="Motivo de ingreso"  value={form.motivoIngreso} onChange={set('motivoIngreso')} required />
            <FormField label="Diagnóstico" rows={2} value={form.diagnostico} onChange={set('diagnostico')} />
            <FormField label="Estado" options={['PENDIENTE','EN_PROCESO','FINALIZADA','ENTREGADA']} value={form.estado} onChange={set('estado')} />
            
            <SecTitle n="2">Servicios y Repuestos</SecTitle>
            <div style={inputRow} className="orden-fila-input-row">
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
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', flex:2 }}>
                <span style={lbl}>Descripción</span>
                <input style={inp} placeholder="Ej: Cambio de aceite..." value={filaInput.descripcion} onChange={setFI('descripcion')} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', width:'70px' }}>
                <span style={lbl}>Cant.</span>
                <input style={inp} type="number" min="0.01" step="any" value={filaInput.cantidad} onChange={setFI('cantidad')} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', width:'110px' }}>
                <span style={lbl}>Precio unit.</span>
                <input style={inp} type="number" min="0" step="0.01" placeholder="0.00" value={filaInput.precioUnitario} onChange={setFI('precioUnitario')} />
              </div>
              <button type="button" onClick={agregarFila}
                disabled={!filaInput.descripcion || !filaInput.precioUnitario}
                style={addBtn(!filaInput.descripcion || !filaInput.precioUnitario)} title="Agregar">+
              </button>
            </div>

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
              </div>
            ) : null}

            <SecTitle n="3">Checklist de entrada</SecTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }} className="checklist-grid">
              <button type="button" style={{ display:'none' }}></button> {/* Evitar click accidental */}
              <FormField label="Nivel combustible" options={['vacío','1/4','1/2','3/4','lleno']} value={form.cl_nivelCombustible} onChange={set('cl_nivelCombustible')} />
              <FormField label="Km de entrada" type="number" value={form.cl_kilometraje} onChange={set('cl_kilometraje')} />
            </div>

            <FormBtn>{saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear Orden')}</FormBtn>
          </form>
        </Modal>
      )}

      {confirm.open && (
        <ConfirmModal
          title="Eliminar Orden"
          message={`¿Estás seguro de eliminar la orden ${confirm.row?.numeroOrden}? Esta acción no se puede deshacer y eliminará también sus detalles asociados.`}
          onConfirm={executeDelete}
          onClose={() => setConfirm({ open: false, row: null })}
          confirmText="Eliminar Orden"
        />
      )}
    </div>
  );
}

function SecTitle({ n, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', borderBottom:'1px solid #1f1f1f', paddingBottom:'8px', marginTop:'2px' }}>
      <span style={{ background:'#e30613', color:'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', flexShrink:0 }}>{n}</span>
      <span style={{ fontSize:'11px', color:'#e30613', fontWeight:'700', letterSpacing:'1.5px', textTransform:'uppercase' }}>{children}</span>
    </div>
  );
}

const lbl      = { fontSize:'11px', color:'#555', fontWeight:'600', letterSpacing:'0.5px', textTransform:'uppercase' };
const inp      = { width:'100%', padding:'9px 11px', background:'#0d0d0d', border:'1px solid #2a2a2a', borderRadius:'6px', color:'#ddd', fontSize:'13px', outline:'none' };
const inputRow = { display:'flex', gap:'8px', alignItems:'flex-end', background:'#0d0d0d', border:'1px solid #252525', borderRadius:'8px', padding:'12px' };
const toggleBtn= { flex:1, padding:'8px 6px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'700', background:'#1a1a1a', color:'#555', transition:'all .15s' };
const activeS  = { background:'#1d3a6b', color:'#3b82f6' };
const activeR  = { background:'#4a3300', color:'#eab308' };
const addBtn   = dis => ({ height:'38px', width:'38px', background: dis?'#1a1a1a':'#e30613', color: dis?'#555':'#fff', border:'none', borderRadius:'6px', cursor: dis?'not-allowed':'pointer', fontSize:'22px', fontWeight:'700', opacity: dis?0.5:1, transition:'all .15s', flexShrink:0 });

const S = {
  filterBar: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    background: '#0d0d0d',
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid #1f1f1f',
    alignItems: 'center'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  filterLabel: {
    fontSize: '11px',
    color: '#555',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  select: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    color: '#ddd',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none'
  },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: '#e30613',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase'
  }
};
