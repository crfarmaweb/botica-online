import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('type') || 'request';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }

    setLoading(true);

    try {
      const result = await supabase?.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar?type=reset`,
      });

      if (result?.error) {
        setError(result.error.message);
      } else {
        setSuccess('Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.');
        setEmail('');
      }
    } catch {
      setError('Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword) {
      setError('La contraseña es obligatoria');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const result = await supabase?.auth.updateUser({
        password: newPassword,
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
      <SEO title="¿Has olvidado tu contraseña? | MadFarma" />
      <div className="reset-page">
        <div className="reset-header">
          <Link to="/" className="reset-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 200 60" fill="none">
              <rect width="200" height="60" rx="8" fill="#5D8A82"/>
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="22">MadFarma</text>
            </svg>
          </Link>
          <div className="reset-secure">
            <span>Conexión segura</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" role="img">
              <path fill="#969696" d="M17 7V6c0-2.8-2.2-5-5-5S7 3.2 7 6v1c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4ZM9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v1H9V6Zm10 13c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v8Z"/>
              <path fill="#969696" d="M12 12c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3Zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1Z"/>
            </svg>
          </div>
        </div>

        <div className="reset-content">
          {mode === 'reset' ? (
            <div className="reset-form-container">
              <form onSubmit={handleResetPassword} noValidate>
                <div className="reset-back-link">
                  <Link to="/auth">
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 8 14" fill="currentColor">
                      <path d="M6.184 13.685c.415.42 1.09.42 1.506 0a1.076 1.076 0 0 0 0-1.512L2.567 7 7.69 1.827a1.076 1.076 0 0 0 0-1.512 1.058 1.058 0 0 0-1.506 0L.308 6.249a1.069 1.069 0 0 0 0 1.502l5.876 5.934Z"/>
                    </svg>
                    Volver
                  </Link>
                </div>

                <h2 className="reset-title">Nueva contraseña</h2>

                <div className="reset-description">
                  Introduce tu nueva contraseña. Debe tener al menos 8 caracteres e incluir al menos una mayúscula, una minúscula, un número y un carácter especial.
                </div>

                {error && <div className="reset-error">{error}</div>}
                {success && <div className="reset-success">{success}</div>}

                <div className="reset-field">
                  <label htmlFor="new_password" className="reset-label">Nueva contraseña</label>
                  <div className="reset-control reset-password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new_password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                    />
                    <button 
                      type="button" 
                      className="reset-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <div className="reset-field">
                  <label htmlFor="confirm_password" className="reset-label">Confirmar contraseña</label>
                  <div className="reset-control reset-password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirm_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="reset-actions">
                  <button type="submit" className="reset-submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                  </button>

                  <div className="reset-cancel">
                    <Link to="/auth">Cancelar</Link>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="reset-form-container">
              <form onSubmit={handleRequestReset} noValidate>
                <div className="reset-back-link">
                  <Link to="/auth">
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 8 14" fill="currentColor">
                      <path d="M6.184 13.685c.415.42 1.09.42 1.506 0a1.076 1.076 0 0 0 0-1.512L2.567 7 7.69 1.827a1.076 1.076 0 0 0 0-1.512 1.058 1.058 0 0 0-1.506 0L.308 6.249a1.069 1.069 0 0 0 0 1.502l5.876 5.934Z"/>
                    </svg>
                    Volver
                  </Link>
                </div>

                <h2 className="reset-title">¿Has olvidado tu contraseña?</h2>

                <div className="reset-description">
                  Por favor, introduce el email con el que te registraste para recibir un enlace y restablecer tu contraseña
                </div>

                {error && <div className="reset-error">{error}</div>}
                {success && <div className="reset-success">{success}</div>}

                <div className="reset-field email required">
                  <label htmlFor="email_address" className="reset-label">Email</label>
                  <div className="reset-control">
                    <input
                      type="email"
                      name="email"
                      id="email_address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="reset-actions">
                  <button type="submit" className="reset-submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Restablecer mi contraseña'}
                  </button>

                  <div className="reset-cancel">
                    <Link to="/auth">Cancelar</Link>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}