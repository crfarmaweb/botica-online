import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, ChevronRight, ChevronDown, Mail, Lock, ArrowRight, Menu, X } from 'lucide-react';
import { useApp, categories, productsList } from '../context/AppContext';
import { useState, useRef, useEffect, useMemo } from 'react';
import './Header.css';

export default function Header() {
  const { getCartItemsCount, user, login } = useApp();
  const cartCount = getCartItemsCount();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuLevel, setMobileMenuLevel] = useState<'main' | 'category'>('main');
  const [selectedMobileCat, setSelectedMobileCat] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShowMenu(true);
  };

  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setShowMenu(false), 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowMenu(false);
    }
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Introduce tu email y contraseña');
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    try {
      const dummyUser = {
        id: 'user_' + Date.now(),
        name: loginEmail.split('@')[0],
        email: loginEmail,
        phone: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginEmail}`,
        points: 0,
        level: 'Bronce' as const,
        pointsToNextLevel: 200,
        totalPoints: 0,
        totalSpent: 0,
        referrals: 0,
        streak: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        achievements: [],
        addresses: [],
        isLoggedIn: true,
      };
      login(dummyUser);
      setShowAccountMenu(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch {
      setLoginError('Error al iniciar sesión');
    } finally {
      setLoginLoading(false);
    }
  };

  const activeCat = categories.find(c => c.id === hoveredCat) || categories[0];
  
  const categoryProducts = useMemo(() => {
    return productsList
      .filter(p => p.category === hoveredCat)
      .slice(0, 8);
  }, [hoveredCat]);

  return (
    <header className="df-header">
      <div className="df-promo-bar">
        <span>-11% Extra</span> en pedidos de +65€ con código: <strong>SUPER11</strong>
      </div>

      <div className="df-main-header">
        <div className="df-container df-main-header-inner">
          <button className="df-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/" className="df-logo">
            <img src="/logo.png" alt="MadFarma" className="df-logo-img" />
          </Link>

          <form className="df-search-bar" onSubmit={handleSearch}>
            <div className="df-search-input-wrap">
              <Search size={18} className="df-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(e.target.value.length > 1);
                }}
                onFocus={() => setShowSearchSuggestions(searchQuery.length > 1)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="df-search-input"
              />
            </div>
            {showSearchSuggestions && searchQuery.length > 1 && (
              <div className="df-search-suggestions">
                {productsList
                  .filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 6)
                  .map(product => (
                    <div
                      key={product.id}
                      className="df-suggestion-item"
                      onClick={() => {
                        navigate(`/producto/${product.id}`);
                        setShowSearchSuggestions(false);
                        setSearchQuery('');
                      }}
                    >
                      <img src={product.image} alt={product.name} className="df-suggestion-img" />
                      <div className="df-suggestion-info">
                        <span className="df-suggestion-brand">{product.brand}</span>
                        <span className="df-suggestion-name">{product.name}</span>
                        <span className="df-suggestion-price">{product.price.toFixed(2)}€</span>
                      </div>
                    </div>
                  ))}
                <div
                  className="df-suggestion-all"
                  onClick={() => {
                    navigate(`/tienda?search=${encodeURIComponent(searchQuery)}`);
                    setShowSearchSuggestions(false);
                  }}
                >
                  Ver todos los resultados para "{searchQuery}"
                </div>
              </div>
            )}
          </form>

          <div className="df-header-actions">
            {/* Account dropdown with quick login */}
            <div 
              className="df-account-dropdown"
              onMouseEnter={() => setShowAccountMenu(true)}
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              {!user.isLoggedIn ? (
                <Link to="/perfil" className="df-action-item df-account-btn">
                  <User size={22} />
                  <span>Cuenta</span>
                </Link>
              ) : (
                <Link to="/perfil" className="df-action-item">
                  <User size={22} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
              )}
              
              {showAccountMenu && !user.isLoggedIn && (
                <div className="df-account-popup">
                  <div className="df-account-popup-header">
                    <h3>Iniciar sesión</h3>
                  </div>
                  
                  <div className="df-register-cta">
                    <p>¿Nuevo en MadFarma?</p>
                    <Link to="/registro" className="df-create-account-btn">
                      Crea una cuenta en segundos
                    </Link>
                  </div>
                  
                  <div className="df-divider-text">
                    <span>o</span>
                  </div>
                  
                  <form className="df-quick-login-form" onSubmit={handleQuickLogin}>
                    <div className="df-input-group">
                      <Mail size={18} />
                      <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="df-input-group">
                      <Lock size={18} />
                      <input type="password" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    
                    <Link to="/recuperar" className="df-forgot-password">¿Has olvidado tu contraseña?</Link>
                    
                    {loginError && <p className="df-login-error">{loginError}</p>}
                    
                    <button type="submit" className="df-login-btn" disabled={loginLoading}>
                      {loginLoading ? 'Cargando...' : 'Iniciar sesión'} <ArrowRight size={18} />
                    </button>
                    
                    <button type="button" className="df-social-btn google" onClick={() => navigate('/auth')}>
                      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.63l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.3 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.7 2.18 7.07l2.85 2.85C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                      Continuar con Google
                    </button>
                  </form>
                </div>
              )}
            </div>

            <Link to="/favoritos" className="df-action-item">
              <Heart size={22} />
            </Link>
            <Link to="/carrito" className="df-action-item df-cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="df-cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      <nav className="df-nav" ref={menuRef}>
        <div className="df-container df-nav-container">
          {/* Categorías trigger */}
          <div
            className={`df-categories-btn ${showMenu ? 'active' : ''}`}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <span>Categorías</span>
            <ChevronDown size={16} className={`df-chevron ${showMenu ? 'open' : ''}`} />
          </div>

          <ul className="df-nav-links">
            <li><Link to="/marcas">Marcas</Link></li>
            <li><Link to="/tienda?sale=true" className="df-nav-highlight">Promociones</Link></li>
            <li><Link to="/tienda">Packs Ahorro</Link></li>
            <li><Link to="/tienda?badge=new">Novedades</Link></li>
            <li><Link to="/tienda?cat=cosmetica-belleza" className="df-nav-solar">Solares</Link></li>
          </ul>

          <div className="df-nav-right">
            <Link to="/retos" className="df-club-btn">Club MadFarma</Link>
            <Link to="/blog" className="df-blog-link">Blog</Link>
          </div>
        </div>

        {/* DosFarma-style 3-column mega-menu */}
        {showMenu && (
          <div
            className="df-mega-menu"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="df-mega-inner df-container">
              {/* Column 1: Category list */}
              <div className={`df-mega-col df-mega-cats ${hoveredCat === activeCat.id ? 'active' : ''}`} style={{ '--active-color': activeCat.color } as React.CSSProperties}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`df-mega-cat-row ${hoveredCat === cat.id ? 'active' : ''}`}
                    style={{ '--cat-color': cat.color } as React.CSSProperties}
                    onMouseEnter={() => setHoveredCat(cat.id)}
                  >
                    <span className="df-mega-cat-dot" style={{ backgroundColor: cat.color }} />
                    <span className="df-mega-cat-label">{cat.name}</span>
                    <ChevronRight size={14} className="df-mega-cat-arrow" />
                  </div>
                ))}
              </div>

              {/* Column 2: Subcategories */}
              <div className="df-mega-col df-mega-subs" style={{ '--active-color': activeCat.color } as React.CSSProperties}>
                <p className="df-mega-sub-title">{activeCat.name}</p>
                <ul className="df-mega-sub-list">
                  {activeCat.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/tienda?cat=${activeCat.id}&sub=${sub.id}`}
                        className="df-mega-sub-link"
                        onClick={() => setShowMenu(false)}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Products grid */}
              <div className="df-mega-col df-mega-products">
                <p className="df-mega-prod-title">Productos</p>
                <div className="df-mega-prod-grid">
                  {categoryProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/producto/${product.id}`}
                      className="df-mega-prod-card"
                      onClick={() => setShowMenu(false)}
                    >
                      <div className="df-mega-prod-img-wrap">
                        <img src={product.image} alt={product.name} className="df-mega-prod-img" />
                        {product.badge && (
                          <span className={`df-mega-prod-badge ${product.badge}`}>
                            {product.badge === 'sale' ? `-${Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}%` :
                             product.badge === 'new' ? 'Nuevo' :
                             product.badge === 'bestseller' ? 'Top' :
                             product.badge === '2x1' ? '2x1' : product.badge}
                          </span>
                        )}
                      </div>
                      <div className="df-mega-prod-info">
                        <span className="df-mega-prod-brand">{product.brand}</span>
                        <span className="df-mega-prod-name">{product.name}</span>
                        <div className="df-mega-prod-price-row">
                          {product.originalPrice && (
                            <span className="df-mega-prod-orig-price">{product.originalPrice.toFixed(2)}€</span>
                          )}
                          <span className="df-mega-prod-price">{product.price.toFixed(2)}€</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to={`/tienda?cat=${hoveredCat}`} className="df-mega-prod-view-all" onClick={() => setShowMenu(false)}>
                  Ver todos <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="df-mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Panel */}
      <div className={`df-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="df-mobile-menu-header">
          <img src="/logo.png" alt="MadFarma" className="df-mobile-menu-logo" />
          <button className="df-mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {mobileMenuLevel === 'main' ? (
          <div className="df-mobile-menu-content">
            <div className="df-mobile-menu-section">
              {!user.isLoggedIn ? (
                <Link to="/auth?mode=login" className="df-mobile-auth-btn" onClick={() => setMobileMenuOpen(false)}>
                  Iniciar sesión / Registrarse
                </Link>
              ) : (
                <Link to="/perfil" className="df-mobile-profile-btn" onClick={() => setMobileMenuOpen(false)}>
                  <User size={20} />
                  <span>Mi perfil</span>
                </Link>
              )}
            </div>

            <div className="df-mobile-menu-section">
              <h3>Categorías</h3>
              <ul className="df-mobile-cats">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      className="df-mobile-cat-btn"
                      style={{ '--cat-color': cat.color } as React.CSSProperties}
                      onClick={() => {
                        setSelectedMobileCat(cat.id);
                        setMobileMenuLevel('category');
                      }}
                    >
                      <span className="df-mobile-cat-dot" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                      <ChevronRight size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="df-mobile-menu-section">
              <h3>Información</h3>
              <ul className="df-mobile-links">
                <li><Link to="/marcas" onClick={() => setMobileMenuOpen(false)}>Marcas</Link></li>
                <li><Link to="/tienda?sale=true" onClick={() => setMobileMenuOpen(false)}>Promociones</Link></li>
                <li><Link to="/mapa" onClick={() => setMobileMenuOpen(false)}>Localizar farmacia</Link></li>
                <li><Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link></li>
                <li><Link to="/retos" onClick={() => setMobileMenuOpen(false)}>Club MadFarma</Link></li>
              </ul>
            </div>

            <div className="df-mobile-menu-section df-mobile-actions">
              <Link to="/favoritos" className="df-mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={20} /> Mis favoritos
              </Link>
              <Link to="/carrito" className="df-mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} /> Mi carrito {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </div>
        ) : (
          <div className="df-mobile-menu-content">
            <button 
              className="df-mobile-back-btn"
              onClick={() => setMobileMenuLevel('main')}
            >
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
              Volver
            </button>
            
            <div className="df-mobile-menu-section">
              <div className="df-mobile-sub-header" style={{ '--cat-color': categories.find(c => c.id === selectedMobileCat)?.color } as React.CSSProperties}>
                <span className="df-mobile-sub-dot" style={{ backgroundColor: categories.find(c => c.id === selectedMobileCat)?.color }} />
                <h3>{categories.find(c => c.id === selectedMobileCat)?.name}</h3>
              </div>
              <Link 
                to={`/tienda?cat=${selectedMobileCat}`}
                className="df-mobile-view-all-btn"
                style={{ backgroundColor: categories.find(c => c.id === selectedMobileCat)?.color }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Ver todos los productos
              </Link>
              <ul className="df-mobile-subs">
                {categories.find(c => c.id === selectedMobileCat)?.subcategories.map(sub => (
                  <li key={sub.id}>
                    <Link 
                      to={`/tienda?cat=${selectedMobileCat}&sub=${sub.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
