import { useEffect, useState } from 'react';
import { getFacturas, createFactura, updateFactura, deleteFactura } from '../../api/facturas';
import { getOrdenes }  from '../../api/ordenes';
import { getUsuarios } from '../../api/usuarios';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const empty = { numeroFactura:'', subtotal:'', descuento:'0', total:'', ordenId:'', usuarioId:'' };

const money = { color:'#22c55e', fontWeight:'700' };

const columns = [
  { key: 'id',             label: 'ID'         },
  { key: 'numeroFactura',  label: 'N° Factura' },
  { key: 'ordenServicio',  label: 'Orden',     render: v => v ? `#${v.id}` : '—' },
  { key: 'fecha',          label: 'Fecha',     render: v => v ? v.split('T')[0] : '—' },
  { key: 'subtotal',       label: 'Subtotal',  render: v => v ? <span style={money}>${Number(v).toFixed(2)}</span> : '—' },
  { key: 'descuento',      label: 'Descuento', render: v => v ? <span style={{ color:'#eab308', fontWeight:'600' }}>-${Number(v).toFixed(2)}</span> : '—' },
  { key: 'total',          label: 'Total',     render: v => v ? <span style={money}>${Number(v).toFixed(2)}</span> : '—' },
];

export default function FacturasPage() {
  const [data,     setData]     = useState([]);
  const [ordenes,  setOrdenes]  = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(empty);
  const [editing,  setEditing]  = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getFacturas(), getOrdenes(), getUsuarios()])
      .then(([f, o, u]) => { setData(f.data); setOrdenes(o.data); setUsuarios(u.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = row => {
    setForm({
      numeroFactura: row.numeroFactura || '',
      subtotal:      row.subtotal  || '',
      descuento:     row.descuento || '0',
      total:         row.total     || '',
      ordenId:       row.ordenServicio?.id || '',
      usuarioId:     row.usuario?.id       || '',
    });
    setEditing(row.id);
    setModal(true);
  };
  const close = () => setModal(false);
  const set   = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const buildPayload = () => ({
    numeroFactura: form.numeroFactura,
    subtotal:  Number(form.subtotal),
    descuento: Number(form.descuento),
    total:     Number(form.total),
    fecha:     new Date().toISOString(),
    ...(form.ordenId   ? { ordenServicio: { id: Number(form.ordenId)   } } : {}),
    ...(form.usuarioId ? { usuario:       { id: Number(form.usuarioId) } } : {}),
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = buildPayload();
    editing ? await updateFactura(editing, payload) : await createFactura(payload);
    close(); load();
  };
  const handleDelete = async row => {
    if (confirm(`¿Eliminar factura #${row.numeroFactura}?`)) { await deleteFactura(row.id); load(); }
  };

  const ordenOpts   = [{ value:'', label:'— Orden de servicio —' }, ...ordenes.map(o  => ({ value: o.id, label: `#${o.id} — ${o.diagnostico?.substring(0,30) || ''}` }))];
  const usuarioOpts = [{ value:'', label:'— Usuario —'           }, ...usuarios.map(u => ({ value: u.id, label: u.nombre }))];

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader title="Facturas" onAdd={openNew} addLabel="Nueva Factura" />
      {loading ? <Spinner /> : <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />}

      {modal && (
        <Modal title={editing ? 'Editar Factura' : 'Nueva Factura'} onClose={close}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <FormField label="N° Factura"     value={form.numeroFactura} onChange={set('numeroFactura')} required />
            <FormField label="Orden de servicio" options={ordenOpts}  value={form.ordenId}   onChange={set('ordenId')}   required />
            <FormField label="Emitido por"    options={usuarioOpts}   value={form.usuarioId} onChange={set('usuarioId')} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
              <FormField label="Subtotal ($)" type="number" value={form.subtotal}  onChange={set('subtotal')}  required />
              <FormField label="Descuento ($)" type="number" value={form.descuento} onChange={set('descuento')} />
              <FormField label="Total ($)"    type="number" value={form.total}     onChange={set('total')}     required />
            </div>
            <FormBtn>{editing ? 'Actualizar' : 'Emitir Factura'}</FormBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}
