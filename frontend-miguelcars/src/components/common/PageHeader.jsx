export default function PageHeader({ title, onAdd, addLabel = '+ Nuevo', onSearch, searchValue = '' }) {
  return (
    <div style={S.wrapper}>
      <div style={S.left}>
        <div style={S.accent} />
        <h1 style={S.title}>{title}</h1>
      </div>

      <div style={S.right}>
        {onSearch && (
          <div style={S.searchWrapper}>
            <span style={S.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              style={S.searchInput}
            />
          </div>
        )}

        {onAdd && (
          <button style={S.btn} onClick={onAdd}>
            <span style={S.btnPlus}>+</span>
            {addLabel.replace('+', '').trim()}
          </button>
        )}
      </div>
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
    borderBottom: '1px solid var(--gray-border)',
  },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '12px', fontSize: '14px', color: 'var(--gray)' },
  searchInput: {
    background: 'var(--black)',
    border: '1px solid var(--gray-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px 8px 36px',
    color: 'var(--silver-bright)',
    fontSize: '13px',
    fontFamily: 'var(--font)',
    width: '240px',
    outline: 'none',
    transition: 'border-color .2s',
  },
  accent: {
    width: '4px',
    height: '28px',
    background: 'linear-gradient(180deg, var(--red-bright), var(--red-dark))',
    borderRadius: '2px',
    boxShadow: '0 0 8px var(--red-glow)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--white)',
    letterSpacing: '0.5px',
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, var(--red-bright), var(--red-dark))',
    color: 'var(--white)',
    border: 'none',
    padding: '9px 20px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    boxShadow: 'var(--shadow-red)',
    fontFamily: 'var(--font)',
  },
  btnPlus: { fontSize: '18px', lineHeight: 1, fontWeight: '300' },
};
