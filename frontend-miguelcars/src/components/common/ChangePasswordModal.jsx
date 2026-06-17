import { useState } from 'react';
import Modal from './Modal';
import FormField, { FormBtn } from './FormField';
import api from '../../api/axios';

export default function ChangePasswordModal({ userId, onClose, onSuccess, onError }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return onError('Las contraseñas no coinciden');
    }
    if (form.newPassword.length < 3) {
      return onError('La nueva contraseña debe tener al menos 3 caracteres');
    }

    setLoading(true);
    try {
      await api.put(`/usuarios/${userId}/password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      onSuccess('Contraseña actualizada correctamente');
      onClose();
    } catch (err) {
      onError(err.response?.data || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Cambiar Contraseña" onClose={onClose} width="400px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField 
          label="Contraseña Actual" 
          type="password" 
          value={form.currentPassword} 
          onChange={handleChange('currentPassword')} 
          required 
        />
        <div style={{ height: '1px', background: '#1f1f1f', margin: '4px 0' }} />
        <FormField 
          label="Nueva Contraseña" 
          type="password" 
          value={form.newPassword} 
          onChange={handleChange('newPassword')} 
          required 
        />
        <FormField 
          label="Confirmar Nueva Contraseña" 
          type="password" 
          value={form.confirmPassword} 
          onChange={handleChange('confirmPassword')} 
          required 
        />
        <div style={{ marginTop: '8px' }}>
          <FormBtn disabled={loading}>
            {loading ? 'Procesando...' : 'Actualizar Contraseña'}
          </FormBtn>
        </div>
      </form>
    </Modal>
  );
}
