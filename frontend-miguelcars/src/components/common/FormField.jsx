/**
 * Campo de formulario reutilizable con estilo dark
 */
export default function FormField({ label, type = 'text', value, onChange, required, disabled, options, rows }) {
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--black)',
    border: '1px solid var(--gray-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--silver-bright)',
    fontSize: '14px',
    fontFamily: 'var(--font)',
    outline: 'none',
    transition: 'border-color .15s, box-shadow .15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '11px',
        color: 'var(--gray-mid)',
        fontWeight: '700',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        {label} {required && <span style={{ color: 'var(--red)' }}>*</span>}
      </label>

      {options ? (
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={value ?? ''} onChange={onChange} required={required}>
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o} style={{ background: 'var(--dark)' }}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: `${rows * 36}px` }}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          style={{ ...inputStyle, opacity: disabled ? 0.5 : 1 }}
          type={type}
          value={value ?? ''}
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
    <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
      {children}
    </button>
  );
}
