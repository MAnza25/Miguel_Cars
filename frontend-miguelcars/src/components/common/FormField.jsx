/**
 * Campo de formulario reutilizable con estilo dark
 * Props: label, type, value, onChange, required, disabled, options (para select), rows (para textarea)
 */
export default function FormField({ label, type = 'text', value, onChange, required, disabled, options, rows }) {
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#0d0d0d',
    border: '1px solid #2a2a2a',
    borderRadius: '7px',
    color: '#ddd',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color .15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', color: '#666', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: '#cc1f1f' }}>*</span>}
      </label>

      {options ? (
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={value} onChange={onChange} required={required}>
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o} style={{ background: '#141414' }}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: `${rows * 36}px` }}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          style={{ ...inputStyle, opacity: disabled ? 0.5 : 1 }}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export function FormBtn({ children = 'Guardar' }) {
  return (
    <button
      type="submit"
      style={{
        width: '100%',
        padding: '12px',
        background: '#cc1f1f',
        color: '#fff',
        border: 'none',
        borderRadius: '7px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        marginTop: '8px',
        boxShadow: '0 4px 16px rgba(204,31,31,0.25)',
      }}
    >
      {children}
    </button>
  );
}
