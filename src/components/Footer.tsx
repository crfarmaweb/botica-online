import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { categories } from '../context/AppContext';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <div className="footer-logo">
            <div className="mf-monogram mf-footer">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 32V8L16 24L26 8V32" stroke="#a71e2c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M26 12H34M26 20H32" stroke="#a71e2c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="footer-title">MadFarma</h3>
              <p className="footer-tagline">Tu farmacia online de confianza</p>
            </div>
          </div>
          <p className="footer-description">
            Tu farmacia y parafarmacia online de confianza en Madrid. Encuentra los mejores productos de cuidado personal, belleza y salud con envío rápido a toda España.
          </p>
          <div className="footer-contact-info">
            <div className="contact-item">
              <MapPin size={16} />
              <span>Calle Gran Vía 25, Madrid</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>91 234 56 78</span>
            </div>
            <div className="contact-item">
              <a href="https://wa.me/34666123456" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} />
                <span>666 123 456</span>
              </a>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@madfarma.es</span>
            </div>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com/madfarma" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com/madfarma" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 5.02.09 1.461.103 2.473.103 3.728 0 1.255-.035 2.267-.103 3.728-.149 3.329-1.667 4.872-4.919 5.02-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-5.02-.09-1.461-.103-2.473-.103-3.728 0-1.255.035-2.267.103-3.728.149-3.329 1.667-4.872 4.919-5.02 1.266-.057 1.646-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://wa.me/34666123456" className="social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Categorías</h4>
          <ul className="footer-links">
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <Link to={`/tienda?cat=${cat.id}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Más Categorías</h4>
          <ul className="footer-links">
            {categories.slice(8).map((cat) => (
              <li key={cat.id}>
                <Link to={`/tienda?cat=${cat.id}`}>{cat.name}</Link>
              </li>
            ))}
            <li><Link to="/marcas">Marcas</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Información</h4>
          <ul className="footer-links">
            <li><Link to="/perfil">Mi Cuenta</Link></li>
            <li><Link to="/perfil">Mis Pedidos</Link></li>
            <li><a href="#">Política de Envíos</a></li>
            <li><a href="#">Política de Devoluciones</a></li>
            <li><Link to="/privacidad">Política de Privacidad</Link></li>
            <li><Link to="/terminos">Términos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Horario</h4>
          <div className="footer-schedule">
            <div className="schedule-item">
              <Clock size={16} />
              <div>
                <strong>Lunes - Sábado</strong>
                <span>9:00 a 21:00</span>
              </div>
            </div>
            <div className="schedule-item">
              <Clock size={16} />
              <div>
                <strong>Domingo</strong>
                <span>10:00 a 14:00</span>
              </div>
            </div>
          </div>
          <Link to="/mapa" className="btn-secondary btn-sm">
            <MapPin size={14} /> Ver Farmacia
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 MadFarma S.L. Todos los derechos reservados.</p>
        <div className="footer-payments">
          <span>Pagos seguros:</span>
          <span className="payment-methods">Visa · Mastercard · PayPal · Bizum</span>
        </div>
      </div>
    </footer>
  );
}
