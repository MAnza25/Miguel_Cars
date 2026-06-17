import { useEffect, useState } from 'react';
import { getRoles, createRol, updateRol, deleteRol } from '../../api/roles';
import { useAppToast } from '../../components/layout/Layout';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const PERMISSIONS_GROUPS = {
  'Módulos': [
    { id: 'DASHBOARD_VER', label: 'Ver Dashboard' },
    { id: 'CLIENTES_VER',  label: 'Ver Clientes' },
    { id: 'VEHICULOS_VER', label: 'Ver Vehículos' },
    { id: 'CITAS_VER',     label: 'Ver Citas' },
    { id: 'ORDENES_VER',   label: 'Ver Órdenes' },
    { id: 'FACTURAS_VER',  label: 'Ver Facturación' },
    { id: 'USUARIOS_VER',  label: 'Ver Usuarios' },
    { id: 'ROLES_VER',     label: 'Ver Roles' },
  ],
  'Clientes': [
    { id: 'CLIENTES_CREAR',    label: 'Crear Clientes' },
    { id: 'CLIENTES_EDITAR',   label: 'Editar Clientes' },
    { id: 'CLIENTES_ELIMINAR', label: 'Eliminar Clientes' },
  ],
  'Vehículos': [
    { id: 'VEHICULOS_CREAR',    label: 'Crear Vehículos' },
    { id: 'VEHICULOS_EDITAR',   label: 'Editar Vehículos' },
    { id: 'VEHICULOS_ELIMINAR', label: 'Eliminar Vehículos' },
  ],
  'Órdenes de Servicio': [
    { id: 'ORDENES_CREAR',    label: 'Crear Órdenes' },
    { id: 'ORDENES_EDITAR',   label: 'Editar Órdenes' },
    { id: 'ORDENES_ELIMINAR', label: 'Eliminar Órdenes' },
  ],
  'Citas': [
    { id: 'CITAS_CREAR',    label: 'Agendar Citas' },
    { id: 'CITAS_EDITAR',   label: 'Editar Citas' },
    { id: 'CITAS_ELIMINAR', label: 'Eliminar Citas' },
  ],
  'Sistema': [
    { id: 'FACTURAS_CREAR',   label: 'Emitir Facturas' },
    { id: 'USUARIOS_CREAR',   label: 'Gestionar Usuarios' },
    { id: 'ROLES_EDITAR',     label: 'Gestionar Permisos' },
  ]
};

const empty = { nombre: '', descripcion: '', permisos: '' };

export default function RolesPage() {
  const toast = useAppToast();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search,  setSearch]  = useState('');

  const load = () => { 
    setLoading(true); 
    getRoles().then(r => setData(r.data)).finally(() => setLoading(false)); 
  };
  useEffect(load, []);

  const filteredData = data.filter(r => 
    !search || 
    r.nombre.toLowerCase().includes(search.toLowerCase()) || 
    r.descripcion?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => { setForm(row); setEditing(row.id); setModal(true); };
  const close    = () => setModal(false);
  const set      = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const togglePermiso = (permId) => {
    const currentPerms = form.permisos ? form.permisos.split(',') : [];
    let newPerms;
    if (currentPerms.includes(permId)) {
      newPerms = currentPerms.filter(p => p !== permId);
    } else {
      newPerms = [...currentPerms, permId];
    }
    setForm({ ...form, permisos: newPerms.join(',') });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      editing ? await updateRol(editing, form) : await createRol(form);
      toast?.success(editing ? `Rol "${form.nombre}" actualizado` : `Rol "${form.nombre}" creado`);
      close(); load();
    } catch { toast?.error('Error al guardar el rol'); }
  };

  const handleDelete = async row => {
    if (row.nombre === 'Administrador') return toast?.error('No se puede eliminar el rol Administrador');
    if (!confirm(`¿Eliminar rol "${row.nombre}"?`)) return;
    try { await deleteRol(row.id); toast?.success(`Rol "${row.nombre}" eliminado`); load(); }
    catch { toast?.error('No se pudo eliminar el rol'); }
  };

  const columns = [
    { key: 'id',          label: 'ID'          },
    { key: 'nombre',      label: 'Nombre',     render: v => <strong style={{color:'#fff'}}>{v}</strong> },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'permisos',    label: 'Permisos',   render: v => (
      <span style={{ fontSize:'11px', color:'#555' }}>
        {v ? v.split(',').length : 0} asignados
      </span>
    )},
  ];

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <PageHeader 
        title="Roles y Permisos" 
        onAdd={openNew} 
        addLabel="Nuevo Rol" 
        onSearch={setSearch}
        searchValue={search}
      />

      {loading ? <Spinner /> : <Table columns={columns} data={filteredData} onEdit={openEdit} onDelete={handleDelete} />}

      {modal && (
        <Modal title={editing ? `Editar Permisos — ${form.nombre}` : 'Nuevo Rol'} onClose={close} width="800px">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={S.baseInfo}>
              <FormField label="Nombre del Rol" value={form.nombre} onChange={set('nombre')} required disabled={form.nombre === 'Administrador'} />
              <FormField label="Descripción" value={form.descripcion} onChange={set('descripcion')} />
            </div>

            <div style={S.permsContainer}>
              <h3 style={S.permsTitle}>Configuración de Accesos y Permisos</h3>
              
              <div style={S.groupsGrid}>
                {Object.entries(PERMISSIONS_GROUPS).map(([groupName, perms]) => (
                  <div key={groupName} style={S.groupCard}>
                    <div style={S.groupHeader}>{groupName}</div>
                    <div style={S.groupBody}>
                      {perms.map(p => {
                        const active = form.permisos?.split(',').includes(p.id);
                        return (
                          <label key={p.id} style={{...S.permItem, color: active ? '#cc1f1f' : '#666'}}>
                            <input 
                              type="checkbox" 
                              checked={active} 
                              onChange={() => togglePermiso(p.id)}
                              style={S.checkbox}
                            />
                            <span>{p.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <FormBtn>{editing ? 'Guardar Cambios y Permisos' : 'Crear Rol'}</FormBtn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

const S = {
  baseInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '16px',
    background: '#0d0d0d',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #1f1f1f'
  },
  permsContainer: {
    background: '#141414',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #1f1f1f'
  },
  permsTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#cc1f1f',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
    marginTop: 0
  },
  groupsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px'
  },
  groupCard: {
    background: '#0d0d0d',
    borderRadius: '8px',
    border: '1px solid #1f1f1f',
    overflow: 'hidden'
  },
  groupHeader: {
    padding: '10px 15px',
    background: 'rgba(255,255,255,0.02)',
    fontSize: '11px',
    fontWeight: '800',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #1f1f1f'
  },
  groupBody: {
    padding: '12px 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  permItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'color .2s'
  },
  checkbox: {
    accentColor: '#cc1f1f',
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  }
};
