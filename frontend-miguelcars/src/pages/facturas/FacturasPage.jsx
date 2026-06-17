import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFacturas, generarDesdeOrden, deleteFactura } from '../../api/facturas';
import { getOrdenesSinFactura, getOrdenById } from '../../api/ordenes';
import { getDetallesPorOrden, updateDetalle, recalcularTotales } from '../../api/detalleOrden';
import { getUsuarios } from '../../api/usuarios';
import { useAuth } from '../../hooks/useAuth';
import { useAppToast } from '../../components/layout/Layout';
import PageHeader        from '../../components/common/PageHeader';
import Table             from '../../components/common/Table';
import Modal             from '../../components/common/Modal';
import Spinner           from '../../components/common/Spinner';
import FormField, { FormBtn } from '../../components/common/FormField';

const empty  = { ordenId:'', usuarioId:'', total:0, subtotal:0, descuento:0 };
const money  = { color:'#22c55e', fontWeight:'700' };

const columns = [
  { key:'id',            label:'ID'         },
  { key:'numeroFactura', label:'N° Factura' },
  { key:'ordenServicio', label:'Orden',     render: v => v ? `#${v.numeroOrden || v.id}` : '—' },
  { key:'fecha',         label:'Fecha',     render: v => v ? v.split('T')[0] : '—' },
  { key:'total',         label:'Total',     render: v => v ? <span style={money}>${Number(v).toLocaleString()}</span> : '—' },
];

export default function FacturasPage() {
  const toast = useAppToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { can, isAdmin } = useAuth();
  const [data,        setData]        = useState([]);
  const [ordenes,     setOrdenes]     = useState([]);
  const [usuarios,    setUsuarios]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(false);
  const [form,        setForm]        = useState(empty);
  const [detalles,    setDetalles]    = useState([]);
  const [loadingDet,  setLoadingDet]  = useState(false);
  const [editingDet,  setEditingDet]  = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [search,    setSearch]    = useState('');
  const [fFecha,    setFFecha]    = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getFacturas(), getOrdenesSinFactura(), getUsuarios()])
      .then(([f,o,u]) => { 
        setData(f.data); 
        setOrdenes(o.data); 
        setUsuarios(u.data); 
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filteredData = data.filter(item => {
    const s = search.toLowerCase();
    const matchSearch = !search || (
      item.numeroFactura?.toLowerCase().includes(s) ||
      item.ordenServicio?.numeroOrden?.toLowerCase().includes(s) ||
      item.ordenServicio?.cliente?.nombre?.toLowerCase().includes(s)
    );
    const matchFecha = !fFecha || (item.fecha && item.fecha.includes(fFecha));
    return matchSearch && matchFecha;
  });

  useEffect(() => {
    if (location.state?.ordenId && ordenes.length > 0) {
      if (!can('FACTURAS_CREAR')) {
        toast?.error('No tienes permiso para facturar');
        return;
      }
      setForm({ ...empty, ordenId: location.state.ordenId, usuarioId: user.id || '' });
      setModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, ordenes]);

  const loadOrderInfo = async (id) => {
    setLoadingDet(true);
    try {
      const [ord, det] = await Promise.all([getOrdenById(id), getDetallesPorOrden(id)]);
      const o = ord.data;
      setForm(prev => ({
        ...prev,
        subtotal: o.totalGeneral || 0,
        total: o.totalGeneral || 0
      }));
      setDetalles(det.data);
    } finally {
      setLoadingDet(false);
    }
  };

  useEffect(() => {
    if (form.ordenId) loadOrderInfo(form.ordenId);
    else setDetalles([]);
  }, [form.ordenId]);

  const openNew = () => { 
    setForm({ ...empty, usuarioId: user.id || '' }); 
    setModal(true); 
  };

  const close = () => { setModal(false); setDetalles([]); setEditingDet(null); };
  const set   = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const handleEditDetail = (d) => {
    setEditingDet({ ...d });
  };

  const saveDetailChanges = async () => {
    try {
      await updateDetalle(editingDet.id, {
        cantidad: Number(editingDet.cantidad),
        precioUnitario: Number(editingDet.precioUnitario),
        descripcion: editingDet.descripcion,
        tipo: editingDet.tipo
      });
      await recalcularTotales(form.ordenId);
      toast?.success('Detalle actualizado');
      setEditingDet(null);
      loadOrderInfo(form.ordenId);
    } catch {
      toast?.error('Error al actualizar el detalle');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.ordenId) return toast?.error('Selecciona una orden');
    
    try {
      await generarDesdeOrden(form.ordenId, form.descuento);
      toast?.success(`Factura emitida correctamente`);
      close(); load();
    } catch (err) { 
      toast?.error(err.response?.data || 'Error al emitir factura'); 
    }
  };

  const handleDelete = async row => {
    if (!confirm(`¿Eliminar factura ${row.numeroFactura}?`)) return;
    try { await deleteFactura(row.id); toast?.success('Factura eliminada'); load(); }
    catch { toast?.error('No se pudo eliminar la factura'); }
  };

  const ordenOpts = [{ value:'', label:'— Seleccionar Orden Pendiente —' }, ...ordenes.map(o => ({
    value: o.id,
    label: `${o.numeroOrden} | ${o.vehiculo?.placa} | ${o.cliente?.nombre}`
  }))];

  const usuarioOpts = [{ value:'', label:'— Usuario —' }, ...usuarios.map(u => ({ value:u.id, label:u.nombre }))];

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <PageHeader 
        title="Facturación" 
        onAdd={can('FACTURAS_CREAR') ? openNew : null} 
        addLabel="Emitir Factura" 
        onSearch={setSearch}
        searchValue={search}
      />

      <div style={S.filterBar}>
        <div style={S.filterGroup}>
          <span style={S.filterLabel}>Filtrar por Fecha:</span>
          <input type="date" style={S.select} value={fFecha} onChange={e => setFFecha(e.target.value)} />
        </div>
        {fFecha && (
          <button style={S.clearBtn} onClick={() => setFFecha('')}>Limpiar Filtro</button>
        )}
      </div>
      
      {loading ? <Spinner /> : (
        <Table 
          columns={columns} 
          data={filteredData} 
          onDelete={isAdmin ? handleDelete : null} 
        />
      )}

      {modal && (
        <Modal title="Emitir Factura de Venta" onClose={close} width="850px">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            
            <div style={S.formGrid}>
              <FormField 
                label="Orden de Servicio" 
                options={ordenOpts} 
                value={form.ordenId} 
                onChange={set('ordenId')} 
                required 
              />
              <FormField 
                label="N° Factura" 
                value="AUTOGENERADO" 
                disabled 
              />
              <FormField 
                label="Cajero/Responsable" 
                options={usuarioOpts} 
                value={form.usuarioId} 
                onChange={set('usuarioId')} 
                disabled
              />
            </div>

            {form.ordenId && (
              <div style={S.detailsSection}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h3 style={S.sectionTitle}>Detalles del Servicio / Repuestos</h3>
                  <span style={{fontSize:'11px', color:'#555'}}>Puedes editar cantidades o precios antes de facturar</span>
                </div>
                
                {loadingDet ? <Spinner size={24} /> : (
                  <>
                    <div style={S.detailsTable}>
                      <header style={S.detailsHeader}>
                        <span>Descripción</span>
                        <span>Tipo</span>
                        <span>Cant.</span>
                        <span>Precio</span>
                        <span>Subtotal</span>
                        <span></span>
                      </header>
                      {detalles.map(d => (
                        <div key={d.id} style={S.detailsRow}>
                          {editingDet?.id === d.id ? (
                            <>
                              <input style={{...S.miniInp, flex:2}} value={editingDet.descripcion} onChange={e=>setEditingDet({...editingDet, descripcion:e.target.value})} />
                              <select style={S.miniInp} value={editingDet.tipo} onChange={e=>setEditingDet({...editingDet, tipo:e.target.value})}>
                                <option value="SERVICIO">SERVICIO</option>
                                <option value="REPUESTO">REPUESTO</option>
                              </select>
                              <input style={{...S.miniInp, width:'50px'}} type="number" value={editingDet.cantidad} onChange={e=>setEditingDet({...editingDet, cantidad:e.target.value})} />
                              <input style={{...S.miniInp, width:'100px'}} type="number" value={editingDet.precioUnitario} onChange={e=>setEditingDet({...editingDet, precioUnitario:e.target.value})} />
                              <span style={{fontWeight:'700'}}>${(editingDet.cantidad * editingDet.precioUnitario).toLocaleString()}</span>
                              <div style={{display:'flex', gap:'5px'}}>
                                <button type="button" onClick={saveDetailChanges} style={S.saveBtn}>✓</button>
                                <button type="button" onClick={()=>setEditingDet(null)} style={S.cancelBtn}>✕</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span style={{flex:2, color:'#ddd'}}>{d.descripcion}</span>
                              <span style={S.badge}>{d.tipo}</span>
                              <span>{d.cantidad}</span>
                              <span>${Number(d.precioUnitario).toLocaleString()}</span>
                              <span style={{fontWeight:'700', color:'#fff'}}>${Number(d.subtotal).toLocaleString()}</span>
                              {can('ORDENES_EDITAR') && (
                                <button type="button" onClick={()=>handleEditDetail(d)} style={S.editBtn} title="Editar ítem">✎</button>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={S.totalsArea}>
                      <div style={S.totalRow}>
                        <span>Subtotal:</span>
                        <span>${Number(form.subtotal).toLocaleString()}</span>
                      </div>
                      <div style={S.totalRow}>
                        <span>Descuento aplicado:</span>
                        <input 
                           type="number" 
                           style={{...S.miniInp, width:'80px', textAlign:'right', padding:'2px 5px'}} 
                           value={form.descuento} 
                           onChange={e => {
                             const desc = Number(e.target.value);
                             setForm({...form, descuento: desc, total: form.subtotal - desc});
                           }}
                        />
                      </div>
                      <div style={{...S.totalRow, borderTop:'1px solid #333', marginTop:'8px', paddingTop:'8px'}}>
                        <span style={{fontSize:'14px', fontWeight:'800', color:'#fff'}}>TOTAL A COBRAR:</span>
                        <span style={{fontSize:'18px', fontWeight:'800', color:'#22c55e'}}>${Number(form.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div style={{ marginTop:'10px', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <button 
                type="submit" 
                disabled={!form.ordenId || editingDet} 
                style={{...S.submitBtn, opacity: (!form.ordenId || editingDet) ? 0.5 : 1}}
              >
                Confirmar Pago y Generar Factura
              </button>
              <p style={S.disclaimer}>Esta acción es irreversible y enviará la factura al cliente.</p>
            </div>
          </form>
        </Modal>
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
    color: '#cc1f1f',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '16px',
    background: '#0d0d0d',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #1f1f1f'
  },
  detailsSection: {
    background: '#141414',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#cc1f1f',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0
  },
  detailsTable: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
    color: '#888'
  },
  detailsHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 0.5fr 1fr 1fr 40px',
    padding: '10px',
    background: '#0d0d0d',
    borderRadius: '6px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  detailsRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 0.5fr 1fr 1fr 40px',
    padding: '8px 10px',
    borderBottom: '1px solid #1a1a1a',
    alignItems: 'center',
    gap: '10px'
  },
  badge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: '#1a1a1a',
    color: '#666',
    width: 'fit-content',
    fontWeight: '700'
  },
  miniInp: {
    background: '#000',
    border: '1px solid #333',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    outline: 'none'
  },
  saveBtn: { background: '#1d3a6b', color: '#3b82f6', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' },
  cancelBtn: { background: '#2a1a1a', color: '#cc1f1f', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' },
  editBtn: { background: 'transparent', color: '#444', border: 'none', cursor: 'pointer', fontSize: '14px' },
  totalsArea: {
    alignSelf: 'flex-end',
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '15px',
    background: '#0d0d0d',
    borderRadius: '10px',
    border: '1px solid #1f1f1f'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    alignItems: 'center'
  },
  submitBtn: {
    width: '100%',
    maxWidth: '400px',
    padding: '14px',
    background: '#cc1f1f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(204,31,31,0.3)'
  },
  disclaimer: {
    fontSize: '11px',
    color: '#444',
    textAlign: 'center',
    marginTop: '10px'
  }
};
