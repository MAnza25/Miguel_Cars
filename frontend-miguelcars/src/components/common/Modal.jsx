/**
 * Drawer lateral — se despliega desde la DERECHA con animación suave
 */
export default function Modal({ title, onClose, children, width = '500px' }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.drawer, width, maxWidth: '96vw' }} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.accent} />
            <h2 style={S.title}>{title}</h2>
          </div>
          <button style={S.close} onClick={onClose} title="Cerrar">✕</button>
        </div>
        <div style={S.body}>{children}</div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  drawer: {
    minHeight: '100vh',
    background: 'var(--dark)',
    borderLeft: '2px solid var(--red)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-8px 0 48px rgba(0,0,0,0.6)',
    animation: 'drawerSlideIn .28s cubic-bezier(0.4,0,0.2,1)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px',
    background: 'var(--black)',
    borderBottom: '1px solid var(--gray-border)',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  accent: {
    width: '3px', height: '22px',
    background: 'linear-gradient(180deg, var(--red-bright), var(--red-dark))',
    borderRadius: '2px',
  },
  title: {
    margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--white)',
    letterSpacing: '0.5px', textTransform: 'uppercase', fontStyle: 'italic',
  },
  close: {
    background: 'transparent', border: '1px solid var(--gray-border)', color: 'var(--gray-mid)',
    width: '30px', height: '30px', borderRadius: 'var(--radius-sm)', fontSize: '13px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, flexShrink: 0,
  },
  body: { flex: 1, padding: '24px', overflowY: 'auto', overflowX: 'hidden' },
};
