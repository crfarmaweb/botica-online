import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="#00897b"/>
              <path d="M9 18h4.5v9H9v-9zm5.25-4.5h4.5v13.5h-4.5V13.5zm5.25 2.25h4.5v11.25h-4.5V15.75z" fill="white"/>
              <rect x="11.25" y="9" width="13.5" height="4.5" rx="1.125" fill="white" opacity="0.85"/>
            </svg>
            <div>
              <h3 className="footer-title">CR Pharma</h3>
              <p className="footer-subtitle">Tu parafarmacia de confianza en Madrid</p>
            </div>
          </div>
          <p className="footer-description">
            Tu farmacia y parafarmacia online de confianza en Madrid. Encuentra los mejores productos de cuidado personal, belleza y salud con envío rápido a toda España.
          </p>
          <Link to="/mapa" className="btn-secondary btn-sm">
            <MapPin size={14} /> Ver Farmacia
          </Link>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">FB</a>
            <a href="#" className="social-link" aria-label="Instagram">IG</a>
            <a href="#" className="social-link" aria-label="WhatsApp">
              <MessageCircle size={14} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Categorías</h4>
          <ul className="footer-links">
            <li><Link to="/tienda?cat=Cuidado Facial">Cuidado Facial</Link></li>
            <li><Link to="/tienda?cat=Cuidado Corporal">Cuidado Corporal</Link></li>
            <li><Link to="/tienda?cat=Higiene Bucal">Higiene Bucal</Link></li>
            <li><Link to="/tienda?cat=Vitaminas">Vitaminas y Suplementos</Link></li>
            <li><Link to="/tienda?cat=Medicamentos">Medicamentos</Link></li>
            <li><Link to="/tienda?cat=Bebé y Mamá">Bebé y Mamá</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Información</h4>
          <ul className="footer-links">
            <li><Link to="/perfil">Mi Cuenta</Link></li>
            <li><Link to="/perfil">Mis Pedidos</Link></li>
            <li><Link to="/privacidad">Política de Privacidad</Link></li>
            <li><Link to="/terminos">Términos y Condiciones</Link></li>
            <li><a href="#">Política de Envíos</a></li>
            <li><a href="#">Política de Devoluciones</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contacto</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <Phone size={16} />
              <span>91 234 56 78</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>666 123 456 (WhatsApp)</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@crpharma.es</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Calle Gran Vía 25, Madrid</span>
            </div>
            <div className="contact-item">
              <Clock size={16} />
              <span>Lun - Sáb: 9:00 a 21:00</span>
            </div>
            <div className="contact-item">
              <Clock size={16} />
              <span>Dom: 10:00 a 14:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 CR Pharma. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
