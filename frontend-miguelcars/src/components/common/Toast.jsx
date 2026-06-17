import { useEffect } from 'react';

const icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
const colors = {
  success: { bg:'#0d2e1a', border:'#22c55e', icon:'#22c55e' },
  error:   { bg:'#2e0d0d', border:'#cc1f1f', icon:'#cc1f1f' },
  info:    { bg:'#0d1a2e', border:'#3b82f6', icon:'#3b82f6' },
  warning: { bg:'#2e1f0d', border:'#eab308', icon:'#eab308' },
};

/** Toast individual */
export function Toast({ id, type = 'success', message, onClose }) {
  const c = colors[type] || colors.info;

  useEffect(() => {
    const t = setTimeout(() => onClose(id), 3500);
    return () => clearTimeout(t);
  }, [id, onClose]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: '8px', padding: '12px 16px',
      boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
      animation: 'toastIn .25s ease',
      minWidth: '280px', maxWidth: '380px',
    }}>
      <span style={{
        background: c.border, color: '#fff',
        width: '22px', height: '22px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: '700', flexShrink: 0,
      }}>{icons[type]}</span>
      <span style={{ color: '#ddd', fontSize: '13px', flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button onClick={() => onClose(id)} style={{
        background: 'none', border: 'none', color: '#555',
        cursor: 'pointer', fontSize: '14px', padding: '0 2px', flexShrink: 0,
      }}>✕</button>
    </div>
  );
}

/** Contenedor de toasts — va en el layout */
export function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 9999,
    }}>
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={onClose} />
      ))}
    </div>
  );
}
