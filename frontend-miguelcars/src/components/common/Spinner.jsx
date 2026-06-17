export default function Spinner({ size = 44, inline = false }) {
  const ringSize = inline ? size : 44;

  if (inline) {
    return (
      <span
        style={{
          display: 'inline-block',
          width: ringSize,
          height: ringSize,
          border: '2px solid rgba(255,255,255,0.2)',
          borderTop: '2px solid #fff',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          verticalAlign: 'middle',
        }}
      />
    );
  }

  return (
    <div style={S.wrapper}>
      <div style={{ ...S.spinner, width: ringSize, height: ringSize, borderWidth: '3px' }} />
      <p style={S.text}>Cargando...</p>
    </div>
  );
}

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '16px',
  },
  spinner: {
    border: '3px solid var(--dark-3)',
    borderTop: '3px solid var(--red)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    boxShadow: '0 0 16px var(--red-glow)',
  },
  text: {
    color: 'var(--gray-mid)',
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
};
