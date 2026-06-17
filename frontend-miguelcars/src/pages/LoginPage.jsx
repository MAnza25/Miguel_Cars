import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/common/FormField';
import Spinner from '../components/common/Spinner';
import Logo from '../components/common/Logo';
import { login } from '../api/usuarios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-honeycomb" style={S.container}>
      <div className="brand-card" style={S.card}>
        <div style={S.header}>
          <div className="logo-glow" style={S.logoWrap}>
            <Logo size="xl" />
          </div>
          <span className="brand-tagline" style={{ marginTop: '12px' }}>
            service innovation
          </span>
          <p style={S.subtitle}>Panel de gestión del taller</p>
        </div>

        <form onSubmit={handleSubmit} style={S.form}>
          <FormField
            label="Usuario"
            value={formData.usuario}
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            required
          />
          <FormField
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <div style={S.error}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
            {loading ? <Spinner size={20} inline /> : 'Iniciar Sesión'}
          </button>
        </form>

        <footer style={S.footer}>
          © 2026 Miguel Cars — Sistema de Gestión
        </footer>
      </div>
    </div>
  );
}

const S = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 36px',
    animation: 'fadeIn 0.4s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--gray-mid)',
    margin: '14px 0 0',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  error: {
    fontSize: '12px',
    color: 'var(--red)',
    textAlign: 'center',
    background: 'var(--red-glow)',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(227, 6, 19, 0.25)',
  },
  footer: {
    marginTop: '36px',
    textAlign: 'center',
    fontSize: '10px',
    color: 'var(--gray)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '600',
  },
};
