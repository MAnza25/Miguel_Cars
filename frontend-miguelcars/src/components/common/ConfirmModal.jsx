import Modal from './Modal';

/**
 * ConfirmModal: Un diálogo de confirmación elegante y personalizado.
 * Props:
 * - title: Título del modal
 * - message: Mensaje descriptivo
 * - onConfirm: Función a ejecutar al confirmar
 * - onClose: Función para cerrar el modal (cancelar)
 * - confirmText: Texto del botón de acción (default: 'Confirmar')
 * - type: 'danger' (rojo) o 'primary' (azul)
 */
export default function ConfirmModal({ 
  title = '¿Estás seguro?', 
  message, 
  onConfirm, 
  onClose, 
  confirmText = 'Confirmar', 
  type = 'danger' 
}) {
  const btnStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all .2s',
    border: 'none',
    outline: 'none'
  };

  const confirmBtnStyle = {
    ...btnStyle,
    background: type === 'danger' ? 'var(--red)' : '#3b82f6',
    color: '#fff',
    boxShadow: type === 'danger' ? 'var(--shadow-red)' : '0 4px 15px rgba(59,130,246,0.2)'
  };

  const cancelBtnStyle = {
    ...btnStyle,
    background: '#1f1f1f',
    color: '#888',
    border: '1px solid #333'
  };

  return (
    <Modal title={title} onClose={onClose} width="400px">
      <div style={{ padding: '10px 0' }}>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={cancelBtnStyle} 
            onClick={onClose}
            onMouseEnter={e => e.target.style.borderColor = '#444'}
            onMouseLeave={e => e.target.style.borderColor = '#333'}
          >
            Cancelar
          </button>
          <button 
            style={confirmBtnStyle} 
            onClick={() => { onConfirm(); onClose(); }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
