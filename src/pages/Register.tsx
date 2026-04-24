import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
    street: '',
    postcode: '',
    city: '',
    region: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstname.trim()) { setError('El nombre es obligatorio'); return false; }
    if (!formData.lastname.trim()) { setError('Los apellidos son obligatorios'); return false; }
    if (!formData.email.trim()) { setError('El email es obligatorio'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email inválido'); return false; }
    if (!formData.password) { setError('La contraseña es obligatoria'); return false; }
    if (formData.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return false; }
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-])/.test(formData.password)) {
      setError('La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales');
      return false;
    }
    if (formData.password !== formData.password_confirmation) { setError('Las contraseñas no coinciden'); return false; }
    if (!formData.acceptTerms) { setError('Debes aceptar los términos y condiciones'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.street.trim()) { setError('La dirección es obligatoria'); return false; }
    if (!formData.postcode.trim()) { setError('El código postal es obligatorio'); return false; }
    if (!formData.city.trim()) { setError('La ciudad es obligatoria'); return false; }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await supabase?.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstname} ${formData.lastname}`,
            phone: formData.telephone,
            address: {
              street: formData.street,
              postcode: formData.postcode,
              city: formData.city,
              region: formData.region,
            }
          }
        }
      });

      if (result?.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result?.data?.user) {
        setSuccess('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
        setTimeout(() => navigate('/auth'), 3000);
      }
    } catch {
      setError('Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Crea tu cuenta | MadFarma" />
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
            <div className="register-steps">
              <p className="register-step-label">Paso {currentStep} de 2</p>
              <div className="register-step-bar">
                <div className={`register-step-progress ${currentStep === 2 ? 'full' : ''}`}></div>
              </div>
            </div>

            <h1 className="register-title">
              {currentStep === 1 ? 'Crea tu cuenta MadFarma' : '¿Dónde quieres que enviemos tu pedido?'}
            </h1>

            {error && <div className="register-error">{error}</div>}
            {success && <div className="register-success">{success}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {currentStep === 1 && (
                <>
                  <div className="register-name-fields">
                    <div className="register-field">
                      <label className="register-label">Nombre</label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="register-field">
                      <label className="register-label">Apellidos</label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Apellidos"
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="register-field">
                    <label className="register-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Su dirección de correo electrónico"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="register-field">
                    <label className="register-label">Teléfono</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="register-field register-password-field">
                    <label className="register-label">Contraseña</label>
                    <div className="register-password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Repite la contraseña"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="register-terms">
                    <label>
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                      />
                      <span>Acepto los <Link to="/terminos">Términos y Condiciones</Link> y la <Link to="/privacidad">Política de Privacidad</Link></span>
                    </label>
                  </div>

                  <button type="button" className="register-next-btn" onClick={handleNextStep}>
                    Continuar
                  </button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="register-field">
                    <label className="register-label">Dirección</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Calle, número, piso"
                      required
                      autoComplete="street-address"
                    />
                  </div>

                  <div className="register-field">
                    <label className="register-label">Código postal</label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="28001"
                      required
                      autoComplete="postal-code"
                    />
                  </div>

                  <div className="register-field">
                    <label className="register-label">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Madrid"
                      required
                      autoComplete="address-level2"
                    />
                  </div>

                  <div className="register-field">
                    <label className="register-label">Provincia</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      placeholder="Madrid"
                      autoComplete="address-level1"
                    />
                  </div>

                  <div className="register-form-actions">
                    <button type="submit" className="register-submit" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                    <button type="button" className="register-back-btn" onClick={() => setCurrentStep(1)}>
                      Volver
                    </button>
                  </div>
                </>
              )}
            </form>

            {currentStep === 1 && (
              <div className="register-login-link">
                ¿Ya tienes cuenta? <Link to="/auth">Inicia sesión</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}