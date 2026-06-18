import { useEffect, useState } from 'react';
import { getVehiculos, createVehiculo, updateVehiculo, deleteVehiculo } from '../../api/vehiculos';
import { getClientes }       from '../../api/clientes';
import { getHistorialPlaca } from '../../api/detalleOrden';
import { useAuth } from '../../hooks/useAuth';
import { useAppToast } from '../../components/layout/Layout';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';
import ConfirmModal from '../../components/common/ConfirmModal';

const empty = { placa:'', marca:'', modelo:'', color:'', anio:'', kilometraje:'', clienteId:'' };

const estadoColors = {
  PENDIENTE:  { background:'rgba(156,163,175,0.15)', color:'#9ca3af' },
  EN_PROCESO: { background:'rgba(234,179,8,0.12)',   color:'#eab308' },
  FINALIZADA: { background:'rgba(59,130,246,0.12)',  color:'#3b82f6' },
  ENTREGADA:  { background:'rgba(34,197,94,0.12)',   color:'#22c55e' },
};

const columns = [
  { key: 'placa',       label: 'Placa'   },
  { key: 'cliente',     label: 'Cliente', render: v => v?.nombre || '—' },
  { key: 'marca',       label: 'Marca'   },
  { key: 'modelo',      label: 'Modelo'  },
  { key: 'color',       label: 'Color'   },
  { key: 'anio',        label: 'Año'     },
  { key: 'kilometraje', label: 'Km'      },
  { key: 'activo', label: 'Estado', render: v => v
      ? <span style={badge.green}>Activo</span>
      : <span style={badge.red}>Inactivo</span> },
];

export default function VehiculosPage() {
  const toast = useAppToast();
  const { can } = useAuth();
  const [data,      setData]      = useState([]);
  const [clientes,  setClientes]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(empty);
  const [editing,   setEditing]   = useState(null);
  const [search,    setSearch]    = useState('');
  const [confirm, setConfirm] = useState({ open: false, row: null });

  // historial
  const [modalHistorial, setModalHistorial] = useState(false);
  const [historial,      setHistorial]      = useState([]);
  const [placaHistorial, setPlacaHistorial] = useState('');
  const [loadingHist,    setLoadingHist]    = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getVehiculos(), getClientes()])
      .then(([v, c]) => { setData(v.data); setClientes(c.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filteredData = data.filter(item => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      item.placa?.toLowerCase().includes(s) ||
      item.cliente?.nombre?.toLowerCase().includes(s) ||
      item.marca?.toLowerCase().includes(s) ||
      item.modelo?.toLowerCase().includes(s) ||
      item.color?.toLowerCase().includes(s) ||
      item.anio?.toString().includes(s)
    );
  });

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => {
    setForm({ placa: row.placa, marca: row.marca, modelo: row.modelo, color: row.color,
              anio: row.anio, kilometraje: row.kilometraje, clienteId: row.cliente?.id || '' });
    setEditing(row.placa); setModal(true);
  };
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const buildPayload = () => ({
    placa: form.placa, marca: form.marca, modelo: form.modelo,
    color: form.color, anio: Number(form.anio), kilometraje: Number(form.kilometraje),
    activo: true,
    ...(form.clienteId ? { cliente: { id: Number(form.clienteId) } } : {}),
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      editing ? await updateVehiculo(editing, buildPayload()) : await createVehiculo(buildPayload());
      toast?.success(editing ? `Vehículo ${form.placa} actualizado` : `Vehículo ${form.placa} registrado`);
      setModal(false); load();
    } catch { toast?.error('Error al guardar el vehículo'); }
  };

  const handleDelete = row => {
    setConfirm({ open: true, row });
  };

  const executeDelete = async () => {
    const row = confirm.row;
    try { 
      await deleteVehiculo(row.placa); 
      toast?.success(`Vehículo ${row.placa} desactivado correctamente`); 
      load(); 
    } catch { 
      toast?.error('No se pudo desactivar el vehículo'); 
    }
  };

  // abrir historial
  const openHistorial = async row => {
    setPlacaHistorial(row.placa);
    setLoadingHist(true);
    setModalHistorial(true);
    const res = await getHistorialPlaca(row.placa);
    setHistorial(res.data);
    setLoadingHist(false);
  };

  const clienteOpts = [
    { value:'', label:'— Seleccionar cliente —' },
    ...clientes.map(c => ({ value: c.id, label: `${c.nombre} (${c.cedula})` })),
  ];

  const historialCol = {
    key: '_hist', label: 'Historial',
    render: (_, row) => (
      <button
        onClick={() => openHistorial(row)}
        style={{ background:'rgba(234,179,8,0.12)', color:'#eab308', border:'1px solid rgba(234,179,8,0.25)', padding:'4px 12px', borderRadius:'5px', fontSize:'12px', cursor:'pointer' }}
      >
        Ver historial
      </button>
    ),
  };

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader 
        title="Vehículos" 
        onAdd={can('VEHICULOS_CREAR') ? openNew : null} 
        addLabel="Nuevo Vehículo" 
        onSearch={setSearch}
        searchValue={search}
      />
      {loading ? <Spinner /> : (
        <Table 
          columns={[...columns, historialCol]} 
          data={filteredData} 
          onEdit={can('VEHICULOS_EDITAR') ? openEdit : null} 
          onDelete={can('VEHICULOS_ELIMINAR') ? handleDelete : null} 
        />
      )}

      {/* Modal crear/editar */}
      {modal && (
        <Modal title={editing ? 'Editar Vehículo' : 'Nuevo Vehículo'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="Placa"       value={form.placa}       onChange={set('placa')}       required disabled={!!editing} />
            <FormField label="Cliente"     options={clienteOpts}    value={form.clienteId}        onChange={set('clienteId')} required />
            <FormField label="Marca"       value={form.marca}       onChange={set('marca')}       required />
            <FormField label="Modelo"      value={form.modelo}      onChange={set('modelo')}      required />
            <FormField label="Color"       value={form.color}       onChange={set('color')}       required />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }} className="form-grid-2col">
              <FormField label="Año"         type="number" value={form.anio}        onChange={set('anio')}        required />
              <FormField label="Kilometraje" type="number" value={form.kilometraje} onChange={set('kilometraje')} required />
            </div>
            <FormBtn>{editing ? 'Actualizar' : 'Registrar Vehículo'}</FormBtn>
          </form>
        </Modal>
      )}

      {/* Modal historial */}
      {modalHistorial && (
        <Modal title={`Historial — ${placaHistorial}`} onClose={() => setModalHistorial(false)}>
          {loadingHist ? <Spinner /> : historial.length === 0 ? (
            <p style={{ color:'#555', textAlign:'center', padding:'30px' }}>Sin órdenes registradas para este vehículo.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {historial.map(o => (
                <div key={o.id} style={{ background:'#0d0d0d', border:'1px solid #1f1f1f', borderRadius:'8px', padding:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ color:'#fff', fontWeight:'700', fontSize:'14px' }}>{o.numeroOrden}</span>
                    <span style={{ ...(estadoColors[o.estado]||{}), padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600' }}>{o.estado?.replace('_',' ')}</span>
                  </div>
                  <p style={{ color:'#888', fontSize:'13px', marginBottom:'6px' }}>
                    <strong style={{ color:'#aaa' }}>Motivo:</strong> {o.motivoIngreso || '—'}
                  </p>
                  <p style={{ color:'#888', fontSize:'13px', marginBottom:'6px' }}>
                    <strong style={{ color:'#aaa' }}>Diagnóstico:</strong> {o.diagnostico || '—'}
                  </p>
                  <div style={{ display:'flex', gap:'20px', marginTop:'8px' }}>
                    <span style={{ color:'#555', fontSize:'12px' }}>Ingreso: {o.fechaIngreso?.split('T')[0] || '—'}</span>
                    <span style={{ color:'#555', fontSize:'12px' }}>Entrega: {o.fechaEntrega?.split('T')[0] || '—'}</span>
                    <span style={{ color:'#22c55e', fontWeight:'700', fontSize:'13px', marginLeft:'auto' }}>Total: ${Number(o.totalGeneral||0).toFixed(2)}</span>
                  </div>
                  {/* Detalles de la orden */}
                  {o.detalles && o.detalles.length > 0 && (
                    <div style={{ marginTop:'10px', borderTop:'1px solid #1a1a1a', paddingTop:'10px' }}>
                      <p style={{ color:'#555', fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'6px' }}>Servicios y repuestos</p>
                      {o.detalles.map(d => (
                        <div key={d.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#888', padding:'3px 0' }}>
                          <span>
                            <span style={{ color: d.tipo==='SERVICIO'?'#3b82f6':'#eab308', fontWeight:'600', marginRight:'6px' }}>{d.tipo}</span>
                            {d.descripcion} x{d.cantidad}
                          </span>
                          <span style={{ color:'#22c55e' }}>${Number(d.subtotal||0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {confirm.open && (
        <ConfirmModal
          title="Desactivar Vehículo"
          message={`¿Estás seguro de desactivar el vehículo ${confirm.row?.placa}? Se mantendrá en el historial pero no podrá ser asignado a nuevas citas u órdenes.`}
          onConfirm={executeDelete}
          onClose={() => setConfirm({ open: false, row: null })}
          confirmText="Desactivar Vehículo"
        />
      )}
    </div>
  );
}

const badge = {
  green: { background:'rgba(34,197,94,0.12)', color:'#22c55e', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  red:   { background:'rgba(204,31,31,0.12)',  color:'#e30613', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
};
