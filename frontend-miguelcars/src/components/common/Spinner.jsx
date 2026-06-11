export default function Spinner() {
  return (
    <div style={S.wrapper}>
      <div style={S.ring}>
        <div style={S.spinner} />
      </div>
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
  ring: {
    position: 'relative',
    width: '44px',
    height: '44px',
  },
  spinner: {
    width: '44px',
    height: '44px',
    border: '3px solid #1f1f1f',
    borderTop: '3px solid #cc1f1f',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    boxShadow: '0 0 12px rgba(204,31,31,0.2)',
  },
  text: {
    color: '#555',
    fontSize: '13px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
};
