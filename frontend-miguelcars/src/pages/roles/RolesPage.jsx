import { useEffect, useState } from 'react';
import { getRoles, createRol, updateRol, deleteRol } from '../../api/roles';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const empty   = { nombre:'', descripcion:'' };
const columns = [
  { key: 'id',          label: 'ID'          },
  { key: 'nombre',      label: 'Nombre'      },
  { key: 'descripcion', label: 'Descripción' },
];

export default function RolesPage() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => { setLoading(true); getRoles().then(r => setData(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => { setForm(row); setEditing(row.id); setModal(true); };
  const close    = () => setModal(false);
  const set      = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    editing ? await updateRol(editing, form) : await createRol(form);
    close(); load();
  };
  const handleDelete = async row => {
    if (confirm(`¿Eliminar rol "${row.nombre}"?`)) { await deleteRol(row.id); load(); }
  };

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader title="Roles" onAdd={openNew} addLabel="Nuevo Rol" />
      {loading ? <Spinner /> : <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />}
      {modal && (
        <Modal title={editing ? 'Editar Rol' : 'Nuevo Rol'} onClose={close}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="Nombre"      value={form.nombre}      onChange={set('nombre')}      required />
            <FormField label="Descripción" value={form.descripcion} onChange={set('descripcion')} />
            <FormBtn>{editing ? 'Actualizar' : 'Crear Rol'}</FormBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}
