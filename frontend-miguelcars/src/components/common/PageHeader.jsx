export default function PageHeader({ title, onAdd, addLabel = '+ Nuevo' }) {
  return (
    <div style={S.wrapper}>
      <div style={S.left}>
        <div style={S.accent} />
        <h1 style={S.title}>{title}</h1>
      </div>
      {onAdd && (
        <button style={S.btn} onClick={onAdd}>
          <span style={S.btnPlus}>+</span>
          {addLabel.replace('+', '').trim()}
        </button>
      )}
    </div>
  );
}

const S = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid #1f1f1f',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  accent: {
    width: '4px',
    height: '28px',
    background: 'linear-gradient(180deg, #cc1f1f, #a01818)',
    borderRadius: '2px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.3px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#cc1f1f',
    color: '#fff',
    border: 'none',
    padding: '9px 20px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    boxShadow: '0 2px 12px rgba(204,31,31,0.30)',
  },
  btnPlus: {
    fontSize: '18px',
    lineHeight: 1,
    fontWeight: '300',
  },
};
