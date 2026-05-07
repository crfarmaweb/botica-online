import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, MessageCircle, Star, Tag, MapPin, Award, Truck, Package, Store, Pill, Shield } from 'lucide-react';
import { useApp, type Product } from '../context/AppContext';
import { api } from '../utils/api';
import SEO from '../components/SEO';
import './AppHome.css';

const brands = [
  { id: 1, name: 'La Roche-Posay', logo: 'LRP' },
  { id: 2, name: 'Vichy', logo: 'V' },
  { id: 3, name: 'CeraVe', logo: 'CV' },
  { id: 4, name: 'Bioderma', logo: 'BD' },
  { id: 5, name: 'Isdin', logo: 'IS' },
  { id: 6, name: 'SVR', logo: 'SVR' },
  { id: 7, name: 'Avene', logo: 'AV' },
  { id: 8, name: 'Neutrogena', logo: 'NG' },
];

const promoBanners = [
  { id: 1, title: '-30% Protección Solar', subtitle: 'Las mejores marcas a precio Special', img: 'https://images.unsplash.com/photo-1556228720-195a672e17a3?w=600&h=400&fit=crop', link: '/tienda?cat=solar', color: '#FF6B6B' },
  { id: 2, title: '2ª Unidad -50%', subtitle: 'En toda la cosmética selected', img: 'https://images.unsplash.com/photo-1596755389378-c31d2a118d75?w=600&h=400&fit=crop', link: '/tienda?cat=cosmetica-belleza', color: '#4BFFA3' },
  { id: 3, title: 'Envío Gratis +35€', subtitle: 'Recogida en farmacia también', img: 'https://images.unsplash.com/photo-1584308666744-24dc5e5f08be?w=600&h=400&fit=crop', link: '/tienda', color: '#5D8A82' },
  { id: 4, title: 'Club MF ELITE', subtitle: 'Accumula puntos en cada compra', img: 'https://images.unsplash.com/photo-1576091160550-21830c395212?w=600&h=400&fit=crop', link: '/retos', color: '#a71e2c' },
];

const heroSlides = [
  {
    title: 'Hasta -50% Solar',
    subtitle: ' proteccion solar para toute la familia',
    image: 'https://images.unsplash.com/photo-1556228852-dd3b6c9405a4?w=1200&h=500&fit=crop',
    link: '/tienda?cat=solar',
    cta: 'Ver sélection'
  },
  {
    title: '2ª Unit -50% Cosmétique',
    subtitle: 'les meilleures offres en beauté et soin',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e258c7f4?w=1200&h=500&fit=crop',
    link: '/tienda?cat=cosmetica-belleza',
    cta: 'Ver offres'
  },
  {
    title: 'MF ELITE - Club Points',
    subtitle: 'Accumule des points et obtient des rewards exclusives',
    image: 'https://images.unsplash.com/photo-1600857062141-33f8c4dac0d4?w=1200&h=500&fit=crop',
    link: '/retos',
    cta: 'Rejoindre le club'
  }
];

export default function AppHome() {
  const { categories, addToCart } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const bestsellers = products.slice(0, 12);
  const offers = products.filter(p => p.badge === 'sale' || p.originalPrice).slice(0, 8);

  const scrollCarousel = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = 260;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <SEO 
        title="MadFarma - Tu Farmacia en Madrid | Envío 24-48h"
        description="Tu farmacia online de confianza en Madrid. Encuentra los mejores productos de cuidado personal, belleza, salud, bebé y mamá con envío rápido a toda España."
      />
      <div className="df-home">
      {/* Hero Slider */}
      <section className="df-hero">
        <div className="df-hero-slide">
          <img src={heroSlides[currentSlide].image} alt={heroSlides[currentSlide].title} />
          <div className="df-hero-content">
            <h1>{heroSlides[currentSlide].title}</h1>
            <p>{heroSlides[currentSlide].subtitle}</p>
            <Link to={heroSlides[currentSlide].link} className="df-hero-btn">
              {heroSlides[currentSlide].cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="df-quick-links">
        <div className="df-container">
          <div className="df-quick-links-grid">
            <Link to="/tienda?sale=true" className="df-quick-link">
              <span className="df-quick-link-icon"><Tag size={20} /></span>
              <span>Promociones</span>
            </Link>
            <Link to="/mapa" className="df-quick-link">
              <span className="df-quick-link-icon"><MapPin size={20} /></span>
              <span>Localizador</span>
            </Link>
            <Link to="/retos" className="df-quick-link">
              <span className="df-quick-link-icon"><Award size={20} /></span>
              <span>MF ELITE</span>
            </Link>
            <Link to="/carrito" className="df-quick-link">
              <span className="df-quick-link-icon"><Truck size={20} /></span>
              <span>Mi Pedido</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="df-promo-section">
        <div className="df-container">
          <div className="df-promo-grid">
            {promoBanners.map((banner) => (
              <Link key={banner.id} to={banner.link} className="df-promo-card">
                <img src={banner.img} alt={banner.title} />
                <div className="df-promo-card-content">
                  <span className="df-promo-tag">Oferta</span>
                  <h3>{banner.title}</h3>
                  <p>{banner.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="df-shipping-section">
        <div className="df-container">
          <div className="df-shipping-grid">
            <div className="df-shipping-item">
              <div className="df-shipping-icon"><Package size={24} /></div>
              <div className="df-shipping-content">
                <h4>Envío 24-48h</h4>
                <p>Gratis desde 35€</p>
              </div>
            </div>
            <div className="df-shipping-item">
              <div className="df-shipping-icon"><Store size={24} /></div>
              <div className="df-shipping-content">
                <h4>Recogida en Farmacia</h4>
                <p>Recoge tu pedido en tienda</p>
              </div>
            </div>
            <div className="df-shipping-item">
              <div className="df-shipping-icon"><Pill size={24} /></div>
              <div className="df-shipping-content">
                <h4>Farmacéuticos Expertos</h4>
                <p>Asesoría personalizada</p>
              </div>
            </div>
            <div className="df-shipping-item">
              <div className="df-shipping-icon"><Shield size={24} /></div>
              <div className="df-shipping-content">
                <h4>Pago Seguro</h4>
                <p>Tarjeta, PayPal o Bizum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="df-categories-section">
        <div className="df-container">
          <h2 className="df-section-title">Categorías</h2>
          <div className="df-categories-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/tienda?cat=${cat.id}`} className="df-category-card" style={{ '--cat-color': cat.color } as React.CSSProperties}>
                <span className="df-category-dot" style={{ backgroundColor: cat.color }} />
                <span className="df-category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Carousel */}
      <section className="df-products-section">
        <div className="df-container">
          <div className="df-section-header">
            <h2 className="df-section-title">Los más vendidos</h2>
            <div className="df-carousel-controls">
              <button onClick={() => scrollCarousel('bestsellers', 'left')}><ChevronLeft size={20} /></button>
              <button onClick={() => scrollCarousel('bestsellers', 'right')}><ChevronRight size={20} /></button>
              <Link to="/tienda" className="df-view-all">Ver todos</Link>
            </div>
          </div>
          <div className="df-products-carousel" id="bestsellers">
            {bestsellers.map((product) => (
              <div key={product.id} className="df-product-card">
                <Link to={`/producto/${product.id}`} className="df-product-image">
                  {product.badge === 'sale' && <span className="df-product-badge">Oferta</span>}
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="df-product-info">
                  <span className="df-product-brand">{product.brand}</span>
                  <Link to={`/producto/${product.id}`} className="df-product-name">{product.name}</Link>
                  <div className="df-product-rating">
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.rating}</span>
                    <span className="df-product-reviews">({product.reviews})</span>
                  </div>
                  <div className="df-product-price">
                    <span className="df-price-current">€{product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="df-price-original">€{product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="df-add-cart-btn" onClick={() => addToCart(product, 1)}>
                    Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Carousel */}
      {offers.length > 0 && (
        <section className="df-products-section df-offers-section">
          <div className="df-container">
            <div className="df-section-header">
              <h2 className="df-section-title">Ofertas destacadas</h2>
              <div className="df-carousel-controls">
                <button onClick={() => scrollCarousel('offers', 'left')}><ChevronLeft size={20} /></button>
                <button onClick={() => scrollCarousel('offers', 'right')}><ChevronRight size={20} /></button>
                <Link to="/tienda?sale=true" className="df-view-all">Ver todos</Link>
              </div>
            </div>
            <div className="df-products-carousel" id="offers">
              {offers.map((product) => (
                <div key={product.id} className="df-product-card">
                  <Link to={`/producto/${product.id}`} className="df-product-image">
                    {product.badge === 'sale' && (
                      <span className="df-product-badge df-offer-badge">
                        -{Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}%
                      </span>
                    )}
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="df-product-info">
                    <span className="df-product-brand">{product.brand}</span>
                    <Link to={`/producto/${product.id}`} className="df-product-name">{product.name}</Link>
                    <div className="df-product-price">
                      <span className="df-price-current">€{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="df-price-original">€{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button className="df-add-cart-btn" onClick={() => addToCart(product, 1)}>
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="df-brands-section">
        <div className="df-container">
          <h2 className="df-section-title">Nuestras marcas</h2>
          <div className="df-brands-grid">
            {brands.map((brand) => (
              <Link key={brand.id} to={`/tienda?brand=${brand.name}`} className="df-brand-card">
                <span className="df-brand-logo">{brand.logo}</span>
                <span className="df-brand-name">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="df-benefits-section">
        <div className="df-container">
          <div className="df-benefits-grid">
            <div className="df-benefit">
              <span className="df-benefit-icon"><Truck size={24} /></span>
              <div>
                <h4>Envío rápido</h4>
                <p>Entrega en 24-48 horas</p>
              </div>
            </div>
            <div className="df-benefit">
              <span className="df-benefit-icon"><Shield size={24} /></span>
              <div>
                <h4>Compra segura</h4>
                <p>100% garantizado</p>
              </div>
            </div>
            <div className="df-benefit">
              <span className="df-benefit-icon"><MessageCircle size={24} /></span>
              <div>
                <h4>Asesoría MadFarma</h4>
                <p>Farmacéuticos disponibles</p>
              </div>
            </div>
            <div className="df-benefit">
              <span className="df-benefit-icon"><Award size={24} /></span>
              <div>
                <h4>Puntos</h4>
                <p>En cada compra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="df-cta-section">
        <div className="df-container">
          <div className="cta-banner mf-elite-cta">
            <div className="cta-content">
              <h2>Descubre MF ELITE</h2>
              <p>Beneficios exclusivos, puntos y un nuevo estándar de cuidado.</p>
              <button onClick={() => navigate('/retos')} className="btn-primary">
                Ver beneficios de MadFarma
              </button>
            </div>
          </div>
          <div className="df-cta-content">
            <h2>¿Necesitas asesoramiento?</h2>
            <p>Nuestro equipo de farmacéuticos te ayuda gratis</p>
            <button onClick={() => window.open('https://wa.me/34666123456?text=Hola,%20necesito%20asesoramiento%20farmacéutico', '_blank')} className="df-cta-btn">
              <MessageCircle size={18} />
              Chatear por WhatsApp
            </button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
