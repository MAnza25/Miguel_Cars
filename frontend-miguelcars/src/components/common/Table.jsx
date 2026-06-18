export default function Table({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div style={S.empty}>
        <img src="/logo.png" alt="" style={{ height: 48, opacity: 0.25, marginBottom: 12 }} />
        <p style={S.emptyText}>No hay registros para mostrar</p>
      </div>
    );
  }

  return (
    <div style={S.wrapper}>
      <table style={S.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={S.th}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th style={{ ...S.th, textAlign: 'right' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={S.tr}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--dark-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} style={S.td}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ ...S.td, textAlign: 'right' }}>
                  <div style={S.actions}>
                    {onEdit && (
                      <button style={S.editBtn} onClick={() => onEdit(row)}>Editar</button>
                    )}
                    {onDelete && (
                      <button style={S.deleteBtn} onClick={() => onDelete(row)}>Eliminar</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const S = {
  wrapper: {
    background: 'var(--dark-2)',
    border: '1px solid var(--gray-border)',
    borderTop: '2px solid var(--red)',
    borderRadius: 'var(--radius-md)',
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    animation: 'fadeIn .25s ease',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' },
  th: {
    padding: '13px 18px',
    background: 'var(--black)',
    color: 'var(--gray-light)',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: '10px',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--gray-border)',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid var(--dark-3)', transition: 'background .12s', background: 'transparent' },
  td: { padding: '12px 18px', color: 'var(--silver)', verticalAlign: 'middle' },
  actions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  editBtn: {
    background: 'transparent',
    color: 'var(--gray-light)',
    border: '1px solid var(--gray-border)',
    padding: '5px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '12px',
    fontWeight: '600',
  },
  deleteBtn: {
    background: 'var(--red-glow)',
    color: 'var(--red)',
    border: '1px solid rgba(227, 6, 19, 0.3)',
    padding: '5px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '12px',
    fontWeight: '600',
  },
  empty: {
    background: 'var(--dark-2)',
    border: '1px solid var(--gray-border)',
    borderRadius: 'var(--radius-md)',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyText: { color: 'var(--gray-mid)', fontSize: '14px', fontWeight: '500' },
};
