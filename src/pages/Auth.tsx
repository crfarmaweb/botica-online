import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    if (!formData.password) {
      setError('La contraseña es obligatoria');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (!isLogin) {
      if (!formData.name.trim()) {
        setError('El nombre es obligatorio');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      if (!formData.acceptTerms) {
        setError('Debes aceptar los términos y condiciones');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });
        
        if (res.ok) {
          const userData = await res.json();
          login(userData);
          navigate('/perfil');
        } else {
          const data = await res.json();
          setError(data.error || 'Error al iniciar sesión');
        }
      } else {
        const success = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
        });
        
        if (success) {
          navigate('/perfil');
        } else {
          setError('Error al crear la cuenta. Intenta de nuevo.');
        }
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
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

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="auth-field">
                <label>Nombre completo</label>
                <div className="auth-input-wrap">
                  <User size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="auth-field">
                <label>Teléfono</label>
                <div className="auth-input-wrap">
                  <Phone size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+34 612 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
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
                <Link to="/auth">¿Olvidaste tu contraseña?</Link>
              </div>
            )}

            {!isLogin && (
              <div className="auth-terms">
                <label>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
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
              <>
                ¿No tienes cuenta? <button onClick={() => { setIsLogin(false); setError(''); }}>Regístrate</button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta? <button onClick={() => { setIsLogin(true); setError(''); }}>Inicia sesión</button>
              </>
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
