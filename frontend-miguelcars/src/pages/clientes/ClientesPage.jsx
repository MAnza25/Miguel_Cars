import { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../../api/clientes';
import { useAuth } from '../../hooks/useAuth';
import { useAppToast } from '../../components/layout/Layout';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';
import ConfirmModal from '../../components/common/ConfirmModal';

const empty   = { cedula: '', nombre: '', telefono: '', correo: '' };
const columns = [
  { key: 'id',       label: 'ID'       },
  { key: 'cedula',   label: 'Cédula'   },
  { key: 'nombre',   label: 'Nombre'   },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo',   label: 'Correo'   },
  { key: 'activo', label: 'Estado', render: v => v
      ? <span style={badge.green}>Activo</span>
      : <span style={badge.red}>Inactivo</span> },
];

export default function ClientesPage() {
  const toast = useAppToast();
  const { can } = useAuth();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search,  setSearch]  = useState('');
  const [confirm, setConfirm] = useState({ open: false, row: null });

  const load = () => { setLoading(true); getClientes().then(r => setData(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filteredData = data.filter(item => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      item.id?.toString().includes(s) ||
      item.cedula?.toLowerCase().includes(s) ||
      item.nombre?.toLowerCase().includes(s) ||
      item.telefono?.toLowerCase().includes(s) ||
      item.correo?.toLowerCase().includes(s)
    );
  });

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => { setForm(row); setEditing(row.id); setModal(true); };
  const close    = () => setModal(false);
  const set      = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) await updateCliente(editing, form);
      else         await createCliente(form);
      toast?.success(editing ? `Cliente "${form.nombre}" actualizado` : `Cliente "${form.nombre}" registrado`);
      close(); load();
    } catch { toast?.error('Error al guardar el cliente'); }
  };

  const handleDelete = row => {
    setConfirm({ open: true, row });
  };

  const executeDelete = async () => {
    const row = confirm.row;
    try { 
      await deleteCliente(row.id); 
      toast?.success(`Cliente "${row.nombre}" desactivado correctamente`); 
      load(); 
    } catch { 
      toast?.error('No se pudo desactivar el cliente'); 
    }
  };

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <PageHeader 
        title="Clientes" 
        onAdd={can('CLIENTES_CREAR') ? openNew : null} 
        addLabel="Nuevo Cliente" 
        onSearch={setSearch}
        searchValue={search}
      />
      {loading ? <Spinner /> : (
        <Table 
          columns={columns} 
          data={filteredData} 
          onEdit={can('CLIENTES_EDITAR') ? openEdit : null} 
          onDelete={can('CLIENTES_ELIMINAR') ? handleDelete : null} 
        />
      )}

      {modal && (
        <Modal title={editing ? 'Editar Cliente' : 'Nuevo Cliente'} onClose={close}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="Cédula"   value={form.cedula}   onChange={set('cedula')}   required />
            <FormField label="Nombre"   value={form.nombre}   onChange={set('nombre')}   required />
            <FormField label="Teléfono" value={form.telefono} onChange={set('telefono')} />
            <FormField label="Correo"   type="email" value={form.correo} onChange={set('correo')} required />
            <FormBtn>{editing ? 'Actualizar' : 'Crear Cliente'}</FormBtn>
          </form>
        </Modal>
      )}

      {confirm.open && (
        <ConfirmModal
          title="Desactivar Cliente"
          message={`¿Estás seguro de desactivar a ${confirm.row?.nombre}? El registro se mantendrá en el historial legal pero no aparecerá en las listas activas del taller.`}
          onConfirm={executeDelete}
          onClose={() => setConfirm({ open: false, row: null })}
          confirmText="Desactivar Cliente"
        />
      )}
    </div>
  );
}

const badge = {
  green: { background:'rgba(34,197,94,0.12)', color:'#22c55e', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  red:   { background:'rgba(204,31,31,0.12)',  color:'#e30613', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
};
