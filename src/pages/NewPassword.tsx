import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import './Register.css';

export default function NewPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const result = await supabase?.auth.updateUser({
        password: password,
      });

      if (result?.error) {
        setError(result.error.message);
      } else {
        setSuccess('¡Contraseña actualizada correctamente!');
        setTimeout(() => navigate('/auth'), 3000);
      }
    } catch {
      setError('Error al actualizar la contraseña. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Nueva contraseña | MadFarma" />
      <div className="register-page">
        <div className="register-header">
          <Link to="/" className="register-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 200 60" fill="none">
              <rect width="200" height="60" rx="8" fill="#5D8A82"/>
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="22">MadFarma</text>
            </svg>
          </Link>
          <div className="register-secure">
            <span>Conexión segura</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" role="img">
              <path fill="#969696" d="M17 7V6c0-2.8-2.2-5-5-5S7 3.2 7 6v1c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4ZM9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v1H9V6Zm10 13c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v8Z"/>
              <path fill="#969696" d="M12 12c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3Zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1Z"/>
            </svg>
          </div>
        </div>

        <div className="register-content">
          <div className="register-form-container">
            <div className="register-back-link">
              <Link to="/auth">
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 8 14" fill="currentColor">
                  <path d="M6.184 13.685c.415.42 1.09.42 1.506 0a1.076 1.076 0 0 0 0-1.512L2.567 7 7.69 1.827a1.076 1.076 0 0 0 0-1.512 1.058 1.058 0 0 0-1.506 0L.308 6.249a1.069 1.069 0 0 0 0 1.502l5.876 5.934Z"/>
                </svg>
                Volver
              </Link>
            </div>

            <h1 className="register-title">Nueva contraseña</h1>

            <div className="register-description">
              Introduce tu nueva contraseña. Debe tener al menos 8 caracteres.
            </div>

            {error && <div className="register-error">{error}</div>}
            {success && <div className="register-success">{success}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-field register-password-field">
                <label className="register-label">Nueva contraseña</label>
                <div className="register-password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div className="register-field">
                <label className="register-label">Confirmar contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="register-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>

              <div className="register-cancel">
                <Link to="/auth">Cancelar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}