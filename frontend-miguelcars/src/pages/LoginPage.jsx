import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField, { FormBtn } from '../components/common/FormField';
import Spinner from '../components/common/Spinner';
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
      // Si llegamos aquí, el login fue exitoso
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
    <div style={S.container}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.logoContainer}>
            <div style={S.logoAccent} />
            <h1 style={S.logoText}>Miguel Cars</h1>
          </div>
          <p style={S.subtitle}>Gestión de Taller Automotriz</p>
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

          <div style={{ marginTop: '12px' }}>
            <FormBtn>
              {loading ? <Spinner size={20} /> : 'Iniciar Sesión'}
            </FormBtn>
          </div>
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
    background: '#0d0d0d',
  },
  card: {
    width: '100%',
    maxSize: '400px',
    maxWidth: '400px',
    padding: '40px',
    background: '#141414',
    border: '1px solid #1f1f1f',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  logoAccent: {
    width: '6px',
    height: '24px',
    background: '#cc1f1f',
    borderRadius: '3px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
    letterSpacing: '0.5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  error: {
    fontSize: '12px',
    color: '#cc1f1f',
    textAlign: 'center',
    background: 'rgba(204,31,31,0.1)',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(204,31,31,0.2)',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
};
