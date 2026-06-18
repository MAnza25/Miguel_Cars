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
import ConfirmModal from '../../components/common/ConfirmModal';

function generarFacturaPDF(factura, orden, detalles) {
  const fechaFactura = factura.fecha ? new Date(factura.fecha).toLocaleString('es-CO', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
  const subtotalVal = Number(factura.subtotal || 0);
  const descuentoVal = Number(factura.descuento || 0);
  const totalVal = Number(factura.total || 0);

  const cliente = orden.cliente || {};
  const vehiculo = orden.vehiculo || {};
  const checklist = orden.checklist || {};
  const cajero = factura.usuario?.nombre || 'Administración';
  const mecanico = orden.usuario?.nombre || 'No asignado';

  const filasHTML = detalles.map(d => `
    <tr>
      <td><span class="badge ${d.tipo}">${d.tipo}</span></td>
      <td style="font-weight: 600; color: #111;">${d.descripcion}</td>
      <td style="text-align: center;">${d.cantidad}</td>
      <td style="text-align: right;">$${Number(d.precioUnitario).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
      <td style="text-align: right; font-weight: 700; color: #111;">$${Number(d.subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
    </tr>
  `).join('');

  const rayonesStr = checklist.rayones ? 'SÍ' : 'NO';
  const golpesStr = checklist.golpes ? 'SÍ' : 'NO';
  const vidriosStr = checklist.vidriosRotos ? 'SÍ' : 'NO';
  const lucesStr = checklist.lucesDanadas ? 'SÍ' : 'NO';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Factura de Venta ${factura.numeroFactura} — Miguel Cars</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Montserrat', 'Segoe UI', sans-serif; color:#333; background:#fff; line-height: 1.4; }
    .invoice-card { width: 100%; max-width: 800px; margin: 0 auto; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #e30613; padding-bottom: 20px; margin-bottom: 24px; }
    .brand-wrap { display: flex; align-items: center; gap: 16px; }
    .logo { height: 65px; filter: drop-shadow(0 2px 8px rgba(227,6,19,0.3)); }
    .brand { font-size: 26px; font-weight: 900; font-style: italic; letter-spacing: 1px; text-transform: uppercase; color: #0a0a0a; }
    .brand span { color: #e30613; }
    .tagline { color: #888; font-size: 9px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
    .invoice-details { text-align: right; }
    .invoice-title { font-size: 16px; font-weight: 800; text-transform: uppercase; color: #e30613; letter-spacing: 1.5px; margin-bottom: 4px; }
    .invoice-num { font-size: 18px; font-weight: 900; color: #0a0a0a; margin-bottom: 6px; }
    .date-info { font-size: 12px; color: #555; }
    
    .info-section { display: flex; gap: 24px; margin-bottom: 24px; }
    .info-block { flex: 1; background: #fcfcfc; border: 1px solid #eee; border-radius: 8px; padding: 16px; border-top: 3px solid #0a0a0a; }
    .info-block.vehicle { border-top-color: #e30613; }
    .block-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #e30613; margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 4px; }
    .info-row { display: flex; font-size: 12.5px; margin-bottom: 5px; }
    .info-label { width: 90px; color: #888; font-weight: 600; flex-shrink: 0; }
    .info-value { color: #111; font-weight: 500; }
    
    .checklist-section { background: #fafafa; border: 1px dashed #ddd; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; }
    .checklist-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 8px; }
    .checklist-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; font-size: 11.5px; }
    .checklist-item { display: flex; gap: 6px; color: #444; }
    .checklist-item strong { color: #111; }
    
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 24px; }
    th { background: #0a0a0a; color: #fff; padding: 10px 12px; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; color: #555; vertical-align: middle; }
    tr:nth-child(even) td { background: #fafafa; }
    .badge { font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 700; display: inline-block; text-transform: uppercase; }
    .badge.SERVICIO { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .badge.REPUESTO { background: rgba(234,179,8,0.12); color: #eab308; }
    
    .summary-area { display: flex; justify-content: space-between; align-items: flex-start; }
    .terms { width: 55%; font-size: 11px; color: #888; line-height: 1.5; }
    .terms-title { font-size: 11px; font-weight: 700; color: #333; margin-bottom: 6px; text-transform: uppercase; }
    .totals { width: 35%; background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 14px; border-top: 3px solid #e30613; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
    .total-row.grand { border-top: 1px solid #ddd; margin-top: 8px; padding-top: 8px; font-size: 16px; font-weight: 800; color: #22c55e; }
    
    .footer { margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="brand-wrap">
        <img src="/logo.png" class="logo" alt="Logo" />
        <div>
          <div class="brand">⚙ MIGUEL <span>CARS</span></div>
          <div class="tagline">service innovation</div>
        </div>
      </div>
      <div class="invoice-details">
        <div class="invoice-title">Factura de Venta</div>
        <div class="invoice-num">${factura.numeroFactura}</div>
        <div class="date-info">Fecha de Emisión: ${fechaFactura}</div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-block client">
        <div class="block-title">Información del Cliente</div>
        <div class="info-row"><span class="info-label">Nombre:</span><span class="info-value">${cliente.nombre || '—'}</span></div>
        <div class="info-row"><span class="info-label">Cédula:</span><span class="info-value">${cliente.cedula || '—'}</span></div>
        <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${cliente.telefono || '—'}</span></div>
        <div class="info-row"><span class="info-label">Correo:</span><span class="info-value">${cliente.correo || '—'}</span></div>
      </div>
      
      <div class="info-block vehicle">
        <div class="block-title">Detalles del Vehículo</div>
        <div class="info-row"><span class="info-label">Placa:</span><span class="info-value" style="font-weight: 700; color: #e30613;">${vehiculo.placa || '—'}</span></div>
        <div class="info-row"><span class="info-label">Marca/Modelo:</span><span class="info-value">${vehiculo.marca || '—'} ${vehiculo.modelo || '—'}</span></div>
        <div class="info-row"><span class="info-label">Año/Color:</span><span class="info-value">${vehiculo.anio || '—'} | ${vehiculo.color || '—'}</span></div>
        <div class="info-row"><span class="info-label">Km Entrada:</span><span class="info-value">${checklist.kilometrajeEntrada ? Number(checklist.kilometrajeEntrada).toLocaleString() + ' KM' : '—'}</span></div>
      </div>
    </div>

    <div class="checklist-section">
      <div class="checklist-title">Condición del Vehículo (Recepción)</div>
      <div class="checklist-grid">
        <div class="checklist-item">Combustible: <strong>${checklist.nivelCombustible || '1/2'}</strong></div>
        <div class="checklist-item">Rayones: <strong>${rayonesStr}</strong></div>
        <div class="checklist-item">Golpes: <strong>${golpesStr}</strong></div>
        <div class="checklist-item">Vidrios Rotos: <strong>${vidriosStr}</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Tipo</th>
          <th style="width: 50%;">Descripción del Servicio / Repuesto</th>
          <th style="text-align: center; width: 10%;">Cant.</th>
          <th style="text-align: right; width: 12.5%;">P. Unitario</th>
          <th style="text-align: right; width: 12.5%;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filasHTML || '<tr><td colspan="5" style="text-align:center;color:#aaa">Sin detalles registrados</td></tr>'}
      </tbody>
    </table>

    <div class="summary-area">
      <div class="terms">
        <div class="terms-title">Condiciones y Garantía</div>
        <p style="margin-bottom: 6px;">1. Todo servicio técnico cuenta con 30 días de garantía en mano de obra.</p>
        <p style="margin-bottom: 6px;">2. Los repuestos eléctricos no tienen garantía una vez instalados.</p>
        <p>3. Favor de retirar su vehículo dentro de las 48 horas posteriores al aviso de entrega para evitar cargos de estacionamiento.</p>
        
        <div style="margin-top: 20px; font-size: 11px; color: #555;">
          <strong>Técnico Responsable:</strong> ${mecanico}<br/>
          <strong>Cajero:</strong> ${cajero}
        </div>
      </div>
      
      <div class="totals">
        <div class="total-row"><span>Subtotal:</span><strong>$${subtotalVal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</strong></div>
        <div class="total-row" style="color: #e30613;"><span>Descuento:</span><strong>-$${descuentoVal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</strong></div>
        <div class="total-row grand"><span>Total:</span><span>$${totalVal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span></div>
      </div>
    </div>

    <div class="footer">
      ¡Gracias por elegir Miguel Cars! — Calidad y Confianza Sobre Ruedas
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
}

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
  const [confirm,     setConfirm]     = useState({ open: false, row: null });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [search,    setSearch]    = useState('');
  const [fFecha,    setFFecha]    = useState('');

  const handleImprimirFactura = async (factura) => {
    if (!factura.ordenServicio?.id) {
      toast?.error('No se pudo encontrar la orden de servicio para esta factura');
      return;
    }
    try {
      toast?.success('Generando vista de impresión...');
      const [ordRes, detRes] = await Promise.all([
        getOrdenById(factura.ordenServicio.id),
        getDetallesPorOrden(factura.ordenServicio.id)
      ]);
      generarFacturaPDF(factura, ordRes.data, detRes.data);
    } catch (err) {
      console.error(err);
      toast?.error('Error al cargar la información de la factura');
    }
  };

  const imprimirCol = {
    key: '_print',
    label: 'Factura',
    render: (_, row) => (
      <button
        onClick={() => handleImprimirFactura(row)}
        style={S.printBtn}
        title="Imprimir Factura PDF"
      >
        📄 PDF
      </button>
    ),
  };

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

  const handleDelete = row => {
    setConfirm({ open: true, row });
  };

  const executeDelete = async () => {
    const row = confirm.row;
    try { 
      await deleteFactura(row.id); 
      toast?.success('Factura eliminada correctamente'); 
      load(); 
    } catch { 
      toast?.error('No se pudo eliminar la factura'); 
    }
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

      <div style={S.filterBar} className="filter-bar">
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
          columns={[...columns, imprimirCol]} 
          data={filteredData} 
          onDelete={isAdmin ? handleDelete : null} 
        />
      )}

      {modal && (
        <Modal title="Emitir Factura de Venta" onClose={close} width="850px">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            
            <div style={S.formGrid} className="factura-form-grid">
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
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '14px' }}>
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

      {confirm.open && (
        <ConfirmModal
          title="Eliminar Factura"
          message={`¿Estás seguro de eliminar la factura ${confirm.row?.numeroFactura}? Esta acción liberará la orden de servicio asociada para ser facturada nuevamente.`}
          onConfirm={executeDelete}
          onClose={() => setConfirm({ open: false, row: null })}
          confirmText="Eliminar Factura"
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
    color: '#e30613',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0
  },
  detailsTable: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
    color: '#888',
    minWidth: '650px'
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
  cancelBtn: { background: '#2a1a1a', color: '#e30613', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' },
  editBtn: { background: 'transparent', color: '#444', border: 'none', cursor: 'pointer', fontSize: '14px' },
  printBtn: {
    background: 'rgba(59, 130, 246, 0.12)',
    color: '#3b82f6',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.15s'
  },
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
    background: '#e30613',
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
