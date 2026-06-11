/**
 * Drawer lateral — se despliega desde la DERECHA con animación suave
 */
export default function Modal({ title, onClose, children, width = '500px' }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.drawer, width, maxWidth:'96vw' }} onClick={e => e.stopPropagation()}>
        {/* Header fijo */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.accent} />
            <h2 style={S.title}>{title}</h2>
          </div>
          <button style={S.close} onClick={onClose} title="Cerrar">✕</button>
        </div>

        {/* Body con scroll */}
        <div style={S.body}>{children}</div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(3px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',   // ← ancla a la derecha
    alignItems: 'stretch',
  },
  drawer: {
    minHeight: '100vh',
    background: '#141414',
    borderLeft: '1px solid #252525',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-6px 0 40px rgba(0,0,0,0.55)',
    animation: 'drawerSlideIn .28s cubic-bezier(0.4,0,0.2,1)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px',
    background: '#0d0d0d',
    borderBottom: '1px solid #1f1f1f',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  accent: { width: '3px', height: '22px', background: '#cc1f1f', borderRadius: '2px' },
  title:  { margin: 0, fontSize: '16px', fontWeight: '700', color: '#fff', letterSpacing: '0.2px' },
  close: {
    background: 'transparent', border: '1px solid #2a2a2a', color: '#666',
    width: '30px', height: '30px', borderRadius: '6px', fontSize: '13px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, flexShrink: 0,
  },
  body: { flex: 1, padding: '24px', overflowY: 'auto', overflowX: 'hidden' },
};
