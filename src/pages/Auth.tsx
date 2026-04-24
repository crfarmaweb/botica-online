import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    if (!supabase) {
      setError('Supabase no configurado. Usa login manual.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/perfil?social_login=true`,
          scopes: provider === 'google' ? 'email profile' : undefined,
        },
      });
      
      if (error) throw error;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error en login social';
      setError(errorMessage);
      setLoading(false);
    }
  };

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
    if (!isLogin) {
      if (!formData.name.trim()) { setError('El nombre es obligatorio'); return false; }
      if (formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden'); return false; }
      if (!formData.acceptTerms) { setError('Debes aceptar los términos y condiciones'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: { email: string; password: string }) => u.email === formData.email && u.password === formData.password);
        
        if (!user) {
          setError('Email o contraseña incorrectos');
          setLoading(false);
          return;
        }

        login({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          points: user.points || 0,
          level: user.level || 'Bronce',
          pointsToNextLevel: 500,
          totalPoints: user.points || 0,
          referrals: 0,
          streak: 0,
          achievements: [],
          joinedDate: new Date().toISOString().split('T')[0],
          isLoggedIn: true,
        });
        navigate('/perfil');
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find((u: { email: string }) => u.email === formData.email)) {
          setError('Este email ya está registrado. Inicia sesión.');
          setLoading(false);
          return;
        }

        const newUser = {
          id: `user_${Date.now()}`,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          points: 100,
          level: 'Bronce',
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        login({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.id}`,
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
        navigate('/perfil');
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title={isLogin ? 'Iniciar Sesión | MadFarma' : 'Registrarse | MadFarma'} />
      <div className="auth-page">
        <div className="auth-container">
          <button onClick={() => navigate(-1)} className="auth-back">
            <ArrowLeft size={24} />
          </button>

          <div className="auth-header">
            <h1>{isLogin ? '¡Bienvenido!' : 'Crear cuenta'}</h1>
            <p>{isLogin ? 'Inicia sesión para continuar' : 'Regístrate y acumula puntos'}</p>
          </div>

          {/* Social Login Buttons */}
          <div className="auth-social">
            <button 
              type="button" 
              className="auth-social-btn google"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
            <button 
              type="button" 
              className="auth-social-btn apple"
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuar con Apple
            </button>
            <button 
              type="button" 
              className="auth-social-btn facebook"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuar con Facebook
            </button>
          </div>

          <div className="auth-divider">
            <span>o</span>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="auth-field">
                <label>Nombre completo</label>
                <div className="auth-input-wrap">
                  <User size={18} />
                  <input type="text" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="auth-field">
                <label>Teléfono</label>
                <div className="auth-input-wrap">
                  <Phone size={18} />
                  <input type="tel" name="phone" placeholder="+34 612 345 678" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input type="email" name="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="auth-field">
              <label>Contraseña</label>
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

            {!isLogin && (
              <div className="auth-field">
                <label>Confirmar contraseña</label>
                <div className="auth-input-wrap">
                  <Lock size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="auth-terms">
                <label>
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                  <span>Acepto los <Link to="/terminos">Términos</Link> y <Link to="/privacidad">Política de Privacidad</Link></span>
                </label>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? (
              <>¿No tienes cuenta? <button onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}>Regístrate</button></>
            ) : (
              <>¿Ya tienes cuenta? <button onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}>Inicia sesión</button></>
            )}
          </div>

          {!isLogin && (
            <div className="auth-benefits">
              <h3>Al registrarte conseguirás:</h3>
              <ul>
                <li><Check size={16} /> 100 puntos de bienvenida</li>
                <li><Check size={16} /> Acceso a ofertas exclusivas</li>
                <li><Check size={16} /> Seguimiento de pedidos</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
