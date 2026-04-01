import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
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
        // LOGIN con Supabase Auth
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          console.error('[Supabase Auth Error]: Login failed:', authError);
          if (authError.message.includes('Invalid login credentials')) {
            setError('Email o contraseña incorrectos');
          } else if (authError.message.includes('Email not confirmed')) {
            setError('Por favor confirma tu email antes de iniciar sesión');
          } else {
            setError(`Error de autenticación: ${authError.message}`);
          }
          return;
        }

        if (data.user) {
          // Buscar perfil del usuario en nuestra tabla
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          login({
            id: 1,
            name: profile?.name || data.user.email?.split('@')[0] || 'Usuario',
            email: data.user.email || '',
            phone: profile?.phone || '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
            points: profile?.points || 0,
            level: 'Bronce',
            pointsToNextLevel: 500,
            totalPoints: profile?.total_points || 0,
            referrals: 0,
            streak: 0,
            achievements: [],
            joinedDate: data.user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            isLoggedIn: true,
          });
          navigate('/perfil');
        }
      } else {
        // REGISTRO con Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone,
            }
          }
        });

        if (authError) {
          console.error('[Supabase Auth Error]: Registration failed:', authError);
          if (authError.message.includes('already registered')) {
            setError('Este email ya está registrado. Inicia sesión.');
          } else {
            setError(`Error al crear cuenta: ${authError.message}`);
          }
          return;
        }

        if (data.user) {
          // Guardar perfil adicional en nuestra tabla users
          const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            points: 100, // puntos de bienvenida
            total_points: 100,
          });

          if (profileError) {
            console.error('[Supabase DB Error]: Profile creation failed:', profileError);
            setError(`Cuenta creada, pero hubo un problema configurando tu perfil: ${profileError.message}`);
            return;
          }

          // Si Supabase está en modo sin confirmación de email, hacer login directo
          if (data.session) {
            login({
              id: 1,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
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
          } else {
            // Con confirmación de email activada
            setSuccess('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.');
            setIsLogin(true);
          }
        }
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title={isLogin ? 'Iniciar Sesión | CR Pharma' : 'Registrarse | CR Pharma'} />
      <div className="auth-page">
        <div className="auth-container">
          <button onClick={() => navigate(-1)} className="auth-back">
            <ArrowLeft size={24} />
          </button>

          <div className="auth-header">
            <h1>{isLogin ? '¡Bienvenido!' : 'Crear cuenta'}</h1>
            <p>{isLogin ? 'Inicia sesión para continuar' : 'Regístrate y acumula puntos'}</p>
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

            {isLogin && (
              <div className="auth-forgot">
                <button type="button" onClick={async () => {
                  if (!formData.email) { setError('Introduce tu email primero'); return; }
                  await supabase.auth.resetPasswordForEmail(formData.email);
                  setSuccess('Email de recuperación enviado. Revisa tu bandeja.');
                }}>
                  ¿Olvidaste tu contraseña?
                </button>
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
