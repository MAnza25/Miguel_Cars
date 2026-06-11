import { useEffect, useState } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../api/usuarios';
import { getRoles } from '../../api/roles';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const empty   = { nombre:'', usuario:'', passwordHash:'', rolId:'' };
const columns = [
  { key: 'id',      label: 'ID'      },
  { key: 'nombre',  label: 'Nombre'  },
  { key: 'usuario', label: 'Usuario' },
  { key: 'rol',     label: 'Rol',    render: v => v?.nombre || '—' },
  { key: 'activo',  label: 'Estado', render: v => v
      ? <span style={badge.green}>Activo</span>
      : <span style={badge.red}>Inactivo</span> },
];

export default function UsuariosPage() {
  const [data,    setData]    = useState([]);
  const [roles,   setRoles]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getUsuarios(), getRoles()])
      .then(([u, r]) => { setData(u.data); setRoles(r.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => {
    setForm({ nombre: row.nombre, usuario: row.usuario, passwordHash:'', rolId: row.rol?.id || '' });
    setEditing(row.id);
    setModal(true);
  };
  const close = () => setModal(false);
  const set   = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const buildPayload = () => ({
    nombre: form.nombre,
    usuario: form.usuario,
    passwordHash: form.passwordHash,
    activo: true,
    ...(form.rolId ? { rol: { id: Number(form.rolId) } } : {}),
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = buildPayload();
    editing ? await updateUsuario(editing, payload) : await createUsuario(payload);
    close(); load();
  };
  const handleDelete = async row => {
    if (confirm(`¿Eliminar usuario "${row.usuario}"?`)) { await deleteUsuario(row.id); load(); }
  };

  const rolOpts = [{ value:'', label:'Sin rol' }, ...roles.map(r => ({ value: r.id, label: r.nombre }))];

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader title="Usuarios" onAdd={openNew} addLabel="Nuevo Usuario" />
      {loading ? <Spinner /> : <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />}
      {modal && (
        <Modal title={editing ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={close}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="Nombre completo"   value={form.nombre}       onChange={set('nombre')}       required />
            <FormField label="Nombre de usuario" value={form.usuario}      onChange={set('usuario')}      required />
            <FormField
              label={editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              type="password"
              value={form.passwordHash}
              onChange={set('passwordHash')}
              required={!editing}
            />
            <FormField label="Rol" options={rolOpts} value={form.rolId} onChange={set('rolId')} />
            <FormBtn>{editing ? 'Actualizar' : 'Crear Usuario'}</FormBtn>
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
