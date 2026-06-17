import { useEffect, useState } from 'react';
import { getCitas, createCita, updateCita, deleteCita } from '../../api/citas';
import { getClientes }  from '../../api/clientes';
import { getVehiculos } from '../../api/vehiculos';
import { getUsuarios }  from '../../api/usuarios';
import { useAuth } from '../../hooks/useAuth';
import { useAppToast } from '../../components/layout/Layout';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';
import ConfirmModal from '../../components/common/ConfirmModal';

const estadoColors = {
  PROGRAMADA: { background:'rgba(59,130,246,0.12)', color:'#3b82f6' },
  ATENDIDA:   { background:'rgba(34,197,94,0.12)',  color:'#22c55e' },
  CANCELADA:  { background:'rgba(204,31,31,0.12)',  color:'#e30613' },
};
const empty = { fecha:'', hora:'', motivo:'', estado:'PROGRAMADA', observaciones:'', clienteId:'', placaId:'', usuarioId:'' };
const columns = [
  { key:'id',       label:'ID'       },
  { key:'cliente',  label:'Cliente',  render: v => v?.nombre || '—' },
  { key:'vehiculo', label:'Vehículo', render: v => v?.placa  || '—' },
  { key:'fecha',    label:'Fecha'    },
  { key:'hora',     label:'Hora'     },
  { key:'motivo',   label:'Motivo'   },
  { key:'estado',   label:'Estado',  render: v => {
    const c = estadoColors[v] || {};
    return <span style={{...c, padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>{v}</span>;
  }},
];

export default function CitasPage() {
  const toast = useAppToast();
  const { can } = useAuth();
  const [data,      setData]      = useState([]);
  const [clientes,  setClientes]  = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios,  setUsuarios]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(empty);
  const [editing,   setEditing]   = useState(null);
  const [search,    setSearch]    = useState('');
  const [fEstado,   setFEstado]   = useState('');
  const [fFecha,    setFFecha]    = useState('');
  const [confirm, setConfirm] = useState({ open: false, row: null });

  const load = () => {
    setLoading(true);
    Promise.all([getCitas(), getClientes(), getVehiculos(), getUsuarios()])
      .then(([ci,cl,v,u]) => { setData(ci.data); setClientes(cl.data); setVehiculos(v.data); setUsuarios(u.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Filtro combinado
  const filteredData = data.filter(item => {
    const s = search.toLowerCase();
    const matchSearch = !search || (
      item.id?.toString().includes(s) ||
      item.cliente?.nombre?.toLowerCase().includes(s) ||
      item.vehiculo?.placa?.toLowerCase().includes(s) ||
      item.motivo?.toLowerCase().includes(s)
    );
    const matchEstado = !fEstado || item.estado === fEstado;
    const matchFecha  = !fFecha  || item.fecha === fFecha;
    return matchSearch && matchEstado && matchFecha;
  });

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => {
    setForm({ fecha: row.fecha||'', hora: row.hora||'', motivo: row.motivo||'', estado: row.estado||'PROGRAMADA',
              observaciones: row.observaciones||'', clienteId: row.cliente?.id||'', placaId: row.vehiculo?.placa||'', usuarioId: row.usuario?.id||'' });
    setEditing(row.id); setModal(true);
  };
  const close = () => setModal(false);
  const set   = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const buildPayload = () => ({
    fecha: form.fecha, hora: form.hora, motivo: form.motivo, estado: form.estado, observaciones: form.observaciones,
    ...(form.clienteId ? { cliente:  { id: Number(form.clienteId)  } } : {}),
    ...(form.placaId   ? { vehiculo: { placa: form.placaId         } } : {}),
    ...(form.usuarioId ? { usuario:  { id: Number(form.usuarioId)  } } : {}),
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      editing ? await updateCita(editing, buildPayload()) : await createCita(buildPayload());
      toast?.success(editing ? 'Cita actualizada correctamente' : 'Cita agendada correctamente');
      close(); load();
    } catch { toast?.error('Error al guardar la cita'); }
  };
  
  const handleDelete = row => {
    setConfirm({ open: true, row });
  };

  const executeDelete = async () => {
    const row = confirm.row;
    try { 
      await deleteCita(row.id); 
      toast?.success(`Cita #${row.id} eliminada correctamente`); 
      load(); 
    } catch { 
      toast?.error('No se pudo eliminar la cita'); 
    }
  };

  const clienteOpts  = [{ value:'', label:'— Cliente —'  }, ...clientes.map(c=>({ value:c.id,    label:`${c.nombre} (${c.cedula})` }))];
  const vehiculoOpts = [{ value:'', label:'— Vehículo —' }, ...vehiculos.map(v=>({ value:v.placa, label:`${v.placa} — ${v.marca} ${v.modelo}` }))];
  const usuarioOpts  = [{ value:'', label:'— Usuario —'  }, ...usuarios.map(u=>({ value:u.id,    label:u.nombre }))];

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader 
        title="Citas" 
        onAdd={can('CITAS_CREAR') ? openNew : null} 
        addLabel="Nueva Cita" 
        onSearch={setSearch}
        searchValue={search}
      />

      <div style={S.filterBar}>
        <div style={S.filterGroup}>
          <span style={S.filterLabel}>Estado:</span>
          <select style={S.select} value={fEstado} onChange={e => setFEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.keys(estadoColors).map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div style={S.filterGroup}>
          <span style={S.filterLabel}>Fecha:</span>
          <input type="date" style={S.select} value={fFecha} onChange={e => setFFecha(e.target.value)} />
        </div>
        {(fEstado || fFecha) && (
          <button style={S.clearBtn} onClick={() => { setFEstado(''); setFFecha(''); }}>Limpiar Filtros</button>
        )}
      </div>

      {loading ? <Spinner /> : (
        <Table 
          columns={columns} 
          data={filteredData} 
          onEdit={can('CITAS_EDITAR') ? openEdit : null} 
          onDelete={can('CITAS_ELIMINAR') ? handleDelete : null} 
        />
      )}

      {modal && (
        <Modal title={editing ? 'Editar Cita' : 'Nueva Cita'} onClose={close}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="Cliente"       options={clienteOpts}  value={form.clienteId}  onChange={set('clienteId')}  required />
            <FormField label="Vehículo"      options={vehiculoOpts} value={form.placaId}    onChange={set('placaId')} />
            <FormField label="Atendido por"  options={usuarioOpts}  value={form.usuarioId}  onChange={set('usuarioId')} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', background:'rgba(255,255,255,0.02)', padding:'12px', borderRadius:'10px', border:'1px solid #1f1f1f' }}>
              <FormField label="Fecha de Cita" type="date" value={form.fecha||''} onChange={set('fecha')} required />
              <FormField label="Hora Sugerida"  type="time" value={form.hora||''}  onChange={set('hora')}  required />
            </div>
            <FormField label="Motivo"        value={form.motivo||''} onChange={set('motivo')} required />
            <FormField label="Estado"        options={['PROGRAMADA','ATENDIDA','CANCELADA']} value={form.estado} onChange={set('estado')} />
            <FormField label="Observaciones" rows={3} value={form.observaciones||''} onChange={set('observaciones')} />
            <FormBtn>{editing ? 'Actualizar' : 'Agendar Cita'}</FormBtn>
          </form>
        </Modal>
      )}

      {confirm.open && (
        <ConfirmModal
          title="Eliminar Cita"
          message={`¿Estás seguro de eliminar la cita #${confirm.row?.id}? Esta acción no se puede deshacer.`}
          onConfirm={executeDelete}
          onClose={() => setConfirm({ open: false, row: null })}
          confirmText="Eliminar Cita"
        />
      )}
    </div>
  );
}

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
