export default function Table({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div style={S.empty}>
        <div style={S.emptyIcon}>⚙</div>
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
              onMouseEnter={e => e.currentTarget.style.background = '#1f1f1f'}
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
                      <button style={S.editBtn} onClick={() => onEdit(row)}>
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button style={S.deleteBtn} onClick={() => onDelete(row)}>
                        Eliminar
                      </button>
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
    background: '#141414',
    border: '1px solid #1f1f1f',
    borderRadius: '10px',
    overflow: 'hidden',
    animation: 'fadeIn .25s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13.5px',
  },
  th: {
    padding: '13px 18px',
    background: '#0d0d0d',
    color: '#888',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    borderBottom: '1px solid #1f1f1f',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #1a1a1a',
    transition: 'background .12s',
    background: 'transparent',
  },
  td: {
    padding: '12px 18px',
    color: '#ccc',
    verticalAlign: 'middle',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  editBtn: {
    background: 'transparent',
    color: '#888',
    border: '1px solid #333',
    padding: '5px 14px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'border-color .15s, color .15s',
  },
  deleteBtn: {
    background: 'rgba(204,31,31,0.12)',
    color: '#cc1f1f',
    border: '1px solid rgba(204,31,31,0.25)',
    padding: '5px 14px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: '500',
  },
  empty: {
    background: '#141414',
    border: '1px solid #1f1f1f',
    borderRadius: '10px',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '36px',
    color: '#333',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#555',
    fontSize: '14px',
  },
};
