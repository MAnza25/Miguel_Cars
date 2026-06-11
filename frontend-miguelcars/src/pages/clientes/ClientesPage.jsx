import { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../../api/clientes';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const empty   = { cedula: '', nombre: '', telefono: '', correo: '' };
const columns = [
  { key: 'id',       label: 'ID'       },
  { key: 'cedula',   label: 'Cédula'   },
  { key: 'nombre',   label: 'Nombre'   },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo',   label: 'Correo'   },
  { key: 'activo',   label: 'Estado', render: v => v
      ? <span style={badge.green}>Activo</span>
      : <span style={badge.red}>Inactivo</span> },
];

export default function ClientesPage() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => { setLoading(true); getClientes().then(r => setData(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => { setForm(row); setEditing(row.id); setModal(true); };
  const close    = () => setModal(false);
  const set      = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    editing ? await updateCliente(editing, form) : await createCliente(form);
    close(); load();
  };
  const handleDelete = async row => {
    if (confirm(`¿Eliminar a ${row.nombre}?`)) { await deleteCliente(row.id); load(); }
  };

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <PageHeader title="Clientes" onAdd={openNew} addLabel="Nuevo Cliente" />
      {loading ? <Spinner /> : <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />}

      {modal && (
        <Modal title={editing ? 'Editar Cliente' : 'Nuevo Cliente'} onClose={close}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="Cédula"    value={form.cedula}   onChange={set('cedula')}   required />
            <FormField label="Nombre"    value={form.nombre}   onChange={set('nombre')}   required />
            <FormField label="Teléfono"  value={form.telefono} onChange={set('telefono')} />
            <FormField label="Correo"    type="email" value={form.correo} onChange={set('correo')} required />
            <FormBtn>{editing ? 'Actualizar' : 'Crear Cliente'}</FormBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}

const badge = {
  green: { background:'rgba(34,197,94,0.12)', color:'#22c55e', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  red:   { background:'rgba(204,31,31,0.12)',  color:'#cc1f1f', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
};
