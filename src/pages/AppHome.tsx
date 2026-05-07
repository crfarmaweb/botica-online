import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, MessageCircle, Truck, Shield, Store, Package, Check } from 'lucide-react';
import { useApp, type Product } from '../context/AppContext';
import { api } from '../utils/api';
import SEO from '../components/SEO';
import './AppHome.css';

const objetivos = [
  { id: 1, name: 'Energia y rendimiento', icon: '⚡' },
  { id: 2, name: 'Estres y sueño', icon: '🌙' },
  { id: 3, name: 'Dolor e inflamacion', icon: '💪' },
  { id: 4, name: 'Menopausia', icon: '🌸' },
  { id: 5, name: 'Metabolismo', icon: '🔥' },
  { id: 6, name: 'Digestion', icon: '🫀' },
  { id: 7, name: 'Memoria', icon: '🧠' },
  { id: 8, name: 'Fertilidad', icon: '👶' },
];

const favoritos = [
  { id: 1, brand: 'Aptamil', name: 'ProFutura 2', price: 26.90, size: '800g', rating: 4.94, reviews: 299 },
  { id: 2, brand: 'LRP', name: 'Cicaplast Baume B5', price: 14.95, size: '40ml', rating: 4.93, reviews: 187 },
  { id: 3, brand: 'ISDIN', name: 'Fusion Water SPF50', price: 18.90, size: '50ml', rating: 4.95, reviews: 312 },
  { id: 4, brand: 'Vita', name: 'Vitamina D3+K2', price: 21.90, size: '60 cap', rating: 4.92, reviews: 156 },
];

const testimonios = [
  { nombre: 'Leonor M.', texto: 'Productos de muy buena calidad, con ingredientes reales sin añadidos innecesarios. Muy buena atención.', producto: 'Magnesio' },
  { nombre: 'Nerea U.', texto: 'Tomo varios suplementos y me va genial. Antes de empezar, pregunté todas las dudas y me asesoraron de maravilla.', producto: 'Omega 3' },
  { nombre: 'Patricia', texto: 'Llevo tomando Menomaster 2 meses y estoy feliz, se me han reducido muchísimo los sofocos.', producto: 'Menomaster' },
];

export default function AppHome() {
  const { categories, addToCart } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await api.products.getAll({ limit: '20' });
        if (productsData.data) {
          setProducts(productsData.data);
        }
      } catch {
        console.log('Using local data');
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  return (
    <>
      <SEO 
        title="MadFarma - Tu Farmacia en Madrid | Envio 24-48h"
        description="Tu farmacia online de confianza en Madrid."
      />
      
      <main className="ivb-main">
        
        {/* HERO - Estilo IVB */}
        <section className="ivb-hero">
          <div className="ivb-hero-bg" />
          <div className="ivb-hero-container">
            <div className="ivb-hero-content">
              <span className="ivb-hero-label">Asesoramiento Farmaceutico 24h</span>
              <h1 className="ivb-hero-title">
                Tu Farmacia en Madrid<br />
                con Asesoramiento<br />
                <span>Farmaceutico Real</span>
              </h1>
              <p className="ivb-hero-text">
                Productos de parafarmacia de calidad + consejo profesional real.<br />
                Envio rapido 24-48h a toda España.
              </p>
              <div className="ivb-hero-buttons">
                <Link to="/tienda" className="ivb-btn-primary">
                  Ver productos
                </Link>
                <button className="ivb-btn-outline" onClick={() => window.open('https://wa.me/34666123456', '_blank')}>
                  Hablar con farmaceutico
                </button>
              </div>
            </div>
            <div className="ivb-hero-image">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5e9952c318c9?w=800&h=600&fit=crop" 
                alt="Farmaceutica MadFarma" 
              />
            </div>
          </div>
        </section>

        {/* SERVICIOS - Iconos minimalistas */}
        <section className="ivb-services">
          <div className="ivb-services-grid">
            <div className="ivb-service-item">
              <Truck size={24} />
              <span>Envio 24-48h</span>
            </div>
            <div className="ivb-service-item">
              <Shield size={24} />
              <span>Pago seguro</span>
            </div>
            <div className="ivb-service-item">
              <Store size={24} />
              <span>Recogida en farmacia</span>
            </div>
            <div className="ivb-service-item">
              <Package size={24} />
              <span>Productos originales</span>
            </div>
          </div>
        </section>

        {/* OBJETIVOS - Grid 4x2 */}
        <section className="ivb-objetivos">
          <h2 className="ivb-section-title">Elige tu objetivo</h2>
          <div className="ivb-objetivos-grid">
            {objetivos.map((obj) => (
              <Link key={obj.id} to={`/tienda?search=${obj.name}`} className="ivb-objetivo-card">
                <span className="ivb-objetivo-icon">{obj.icon}</span>
                <span className="ivb-objetivo-name">{obj.name}</span>
              </Link>
            ))}
</div>
      </section>

      {/* FAVORITOS - Productos estilo IVB */}
        <section className="ivb-favoritos">
          <div className="ivb-section-header">
            <h2 className="ivb-section-title">Favoritos del mes</h2>
            <Link to="/tienda" className="ivb-section-link">
              Ver todo <ArrowRight size={18} />
            </Link>
          </div>
          <div className="ivb-favoritos-grid">
            {favoritos.map((product) => (
              <div key={product.id} className="ivb-product-card">
                <div className="ivb-product-image">
                  <img 
                    src={`https://via.placeholder.com/400x400/f8f9fa/14B8A6?text=${product.brand}`} 
                    alt={product.name} 
                  />
                </div>
                <div className="ivb-product-info">
                  <span className="ivb-product-brand">{product.brand}</span>
                  <h3 className="ivb-product-name">{product.name}</h3>
                  <span className="ivb-product-size">{product.size}</span>
                  <div className="ivb-product-rating">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="ivb-product-footer">
                    <span className="ivb-product-price">{product.price.toFixed(2)} EUR</span>
                    <button className="ivb-product-btn" onClick={() => handleAddToCart(product)}>
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAS PRODUCTOS */}
        <section className="ivb-mas-productos">
          <div className="ivb-section-header">
            <h2 className="ivb-section-title">Complementos esenciales</h2>
            <Link to="/tienda" className="ivb-section-link">
              Ver todo <ArrowRight size={18} />
            </Link>
          </div>
          <div className="ivb-favoritos-grid">
            {favoritos.map((product) => (
              <div key={product.id + 4} className="ivb-product-card">
                <div className="ivb-product-image">
                  <img 
                    src={`https://via.placeholder.com/400x400/f8f9fa/14B8A6?text=${product.brand}`} 
                    alt={product.name} 
                  />
                </div>
                <div className="ivb-product-info">
                  <span className="ivb-product-brand">{product.brand}</span>
                  <h3 className="ivb-product-name">{product.name}</h3>
                  <span className="ivb-product-size">{product.size}</span>
                  <div className="ivb-product-rating">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="ivb-product-footer">
                    <span className="ivb-product-price">{product.price.toFixed(2)} EUR</span>
                    <button className="ivb-product-btn" onClick={() => handleAddToCart(product)}>
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="ivb-testimonios">
          <h2 className="ivb-section-title">Tu opinion lo es todo</h2>
          <p className="ivb-section-subtitle">Testimonios que son vitamina para el alma</p>
          <div className="ivb-testimonios-grid">
            {testimonios.map((t, i) => (
              <div key={i} className="ivb-testimonio-card">
                <p className="ivb-testimonio-texto">"{t.texto}"</p>
                <div className="ivb-testimonio-author">
                  <span className="ivb-testimonio-nombre">{t.nombre}</span>
                  <span className="ivb-testimonio-producto">{t.producto}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ASESORAMIENTO */}
        <section className="ivb-asesoramiento">
          <div className="ivb-asesoramiento-content">
            <h2>Asesoramiento Personalizado</h2>
            <p>Nuestro equipo de farmaceuticos te ayuda en tiempo real. Pregunta cualquier duda sobre productos, dosis o recomendaciones.</p>
            <button className="ivb-btn-primary" onClick={() => window.open('https://wa.me/34666123456', '_blank')}>
              <MessageCircle size={20} />
              Hablar ahora con un Farmaceutico
            </button>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="ivb-newsletter">
          <div className="ivb-newsletter-content">
            <h2>Unete a MadFarma</h2>
            <p>Suscribete y recibe consejos de salud y ofertas exclusivas.</p>
            <div className="ivb-newsletter-form">
              <input type="email" placeholder="Tu correo electronico" />
              <button>Suscribirse</button>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}