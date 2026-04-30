import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const { login: appLogin } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) { setError('El email es obligatorio'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email inválido'); return false; }
    if (!formData.password) { setError('La contraseña es obligatoria'); return false; }
    if (formData.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return false; }
    if (formData.name && formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden'); return false; }
    if (formData.name && !formData.acceptTerms) { setError('Debes aceptar los términos y condiciones'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const isRegister = !!formData.name;
      
      if (isRegister) {
        const result = await supabase?.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              phone: formData.phone,
            }
          }
        });

        if (result?.error) {
          if (result.error.message.includes('already registered')) {
            setError('Este email ya está registrado. Inicia sesión.');
          } else {
            setError(result.error.message);
          }
          setLoading(false);
          return;
        }

        if (result?.data?.user) {
          appLogin({
            id: result.data.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.data.user.id}`,
            points: 100,
            level: 'Bronce',
            pointsToNextLevel: 400,
            totalPoints: 100,
            referrals: 0,
            streak: 0,
            achievements: [],
            joinedDate: new Date().toISOString().split('T')[0],
            isLoggedIn: true,
          });
          navigate('/');
        }
      } else {
        const result = await supabase?.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError('Email o contraseña incorrectos');
          setLoading(false);
          return;
        }

        if (result?.data?.user) {
          const user = result.data.user;
          appLogin({
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
            points: 100,
            level: 'Bronce',
            pointsToNextLevel: 400,
            totalPoints: 100,
            referrals: 0,
            streak: 0,
            achievements: [],
            joinedDate: new Date().toISOString().split('T')[0],
            isLoggedIn: true,
          });
          navigate('/');
        }
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (!supabase) {
      setError('Supabase no está configurado. Usa login con email.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/perfil?social_login=true`,
        },
      });
      
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en login social';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setFormData({ email: '', password: '', name: '', phone: '', confirmPassword: '', acceptTerms: false });
    setError('');
  };

  return (
    <>
      <SEO title="Iniciar Sesión | MadFarma" />
      <div className="auth-page">
        <div className="auth-login-container">
          <div className="auth-login-section">
            <div className="auth-login-inner">
              <h1>¡Hola!</h1>
              <p className="auth-subtitle-desktop">Inicia sesión o crea una cuenta para hacer tu pedido, acumular puntos y acceder a contenido exclusivo.</p>

              <h4 className="auth-section-title">Identifícate</h4>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field email required">
                  <label>Email *</label>
                  <div className="auth-input-wrap">
                    <Mail size={18} />
                    <input type="email" name="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="auth-field password required">
                  <label>Contraseña *</label>
                  <div className="auth-input-wrap">
                    <Lock size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-toggle-pw">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="auth-forgot">
                  <Link to="/recuperar">¿Has olvidado tu contraseña?</Link>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="auth-or-divider">
                <span className="auth-or-line"></span>
                <span className="auth-or-text">O</span>
                <span className="auth-or-line"></span>
              </div>

              <div className="auth-social">
                <button type="button" className="auth-social-btn google" onClick={() => handleSocialLogin('google')}>
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </button>
                <button type="button" className="auth-social-btn apple" onClick={() => handleSocialLogin('apple')}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continuar con Apple
                </button>
              </div>
            </div>
          </div>

          <div className="auth-register-section">
            <div className="auth-register-inner">
              <h4 className="auth-section-title">¿No tienes cuenta? Regístrate</h4>
              <p className="auth-register-desc">Regístrate y disfruta de estas ventajas:</p>

              <ul className="auth-benefits-list">
                <li>
                  <Check size={18} />
                  <span>Recibe 100 puntos de bienvenida</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Accede a ofertas exclusivas</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Sigue el estado de tus pedidos</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Guarda tus datos para próximas compras</span>
                </li>
              </ul>

              <button type="button" className="auth-register-btn" onClick={switchToRegister}>
                Crear cuenta
              </button>

              <div className="auth-register-form">
                <h4 className="auth-section-title">Crea tu cuenta en MadFarma</h4>
                <form onSubmit={handleSubmit}>
                  <div className="auth-field">
                    <label>Nombre completo *</label>
                    <div className="auth-input-wrap">
                      <input type="text" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Teléfono</label>
                    <div className="auth-input-wrap">
                      <input type="tel" name="phone" placeholder="+34 612 345 678" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Email *</label>
                    <div className="auth-input-wrap">
                      <Mail size={18} />
                      <input type="email" name="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Contraseña *</label>
                    <div className="auth-input-wrap">
                      <Lock size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-toggle-pw">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Confirmar contraseña *</label>
                    <div className="auth-input-wrap">
                      <Lock size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Repite la contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="auth-terms">
                    <label>
                      <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                      <span>Acepto los <Link to="/terminos">Términos y Condiciones</Link> y la <Link to="/privacidad">Política de Privacidad</Link></span>
                    </label>
                  </div>

                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Crear cuenta'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}