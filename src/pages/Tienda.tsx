import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Grid, List, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import SEO from '../components/SEO';
import './Tienda.css';

export default function Tienda() {
  const location = useLocation();
  const isMarcasPage = location.pathname === '/marcas';
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('cat');
  const urlSubcategory = searchParams.get('sub');
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { categories, brands } = useApp();
  const urlSearch = searchParams.get('search') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedSubcategory && selectedSubcategory !== 'all') params.subcategory = selectedSubcategory;
        if (searchQuery || urlSearch) params.search = searchQuery || urlSearch;
        if (sortBy && sortBy !== 'relevance') params.sort = sortBy;
        
        const data = await api.products.getAll(params);
        if (data.data) {
          let filtered = data.data;
          // Apply price filter
          if (priceRange[0] > 0 || priceRange[1] < 200) {
            filtered = filtered.filter((p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]);
          }
          // Apply brand filter
          if (selectedBrands.length > 0) {
            filtered = filtered.filter((p: any) => selectedBrands.includes(p.brand));
          }
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchQuery, urlSearch, sortBy, priceRange, selectedBrands]);

  useEffect(() => {
    setSelectedCategory(urlCategory || 'all');
    setSelectedSubcategory(urlSubcategory || 'all');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlCategory, urlSubcategory, urlSearch]);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setPriceRange([0, 200]);
    setSelectedBrands([]);
    setSortBy('relevance');
    setSearchQuery('');
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSubcategory !== 'all' || 
                          searchQuery || selectedBrands.length > 0 || 
                          priceRange[0] > 0 || priceRange[1] < 200;

  return (
    <div className="df-tienda">
      <SEO 
        title="Tienda - MadFarma | Tu Parafarmacia en Madrid"
        description="Explora nuestro catálogo de parafarmacia online. Cuidado facial, corporal, vitaminas, bebé y mamá, higiene y más. Envío 24-48h."
      />
      <div className="df-container">
        {/* Breadcrumb */}
        <div className="df-breadcrumb">
          <Link to="/">Inicio</Link>
          <ChevronRight size={14} />
          {isMarcasPage ? (
            <span>Marcas</span>
          ) : (
            <>
              <span>La Tienda</span>
              {selectedCategory !== 'all' && (
                <>
                  <ChevronRight size={14} />
                  <span>{selectedCategoryData?.name || selectedCategory}</span>
                </>
              )}
            </>
          )}
        </div>

        {isMarcasPage ? (
          <div className="df-marcas-page">
            <SEO title="Marcas - MadFarma | Nuestras Marcas" description="Descubre todas las marcas de parafarmacia disponibles en MadFarma." />
            <div className="df-marcas-header">
              <h1>Nuestras Marcas</h1>
              <p>Todas las marcas con las que trabajamos</p>
            </div>
            <div className="df-marcas-grid">
              {brands.map(brand => (
                <Link key={brand.id} to={`/tienda?brand=${encodeURIComponent(brand.name)}`} className="df-marca-card">
                  <div className="df-marca-logo">
                    <img src={brand.logo} alt={brand.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span>{brand.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
        <>
        <div className="df-tienda-layout">
          {/* Sidebar */}
          <aside className="df-sidebar">
            <div className="df-sidebar-section">
              <h3 className="df-sidebar-title">
                Categorías
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="df-clear-btn">Limpiar</button>
                )}
              </h3>
              <ul className="df-cat-list">
                <li>
                  <button 
                    className={`df-cat-item ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                  >
                    Todos los productos
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      className={`df-cat-item ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory('all'); }}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCategory !== 'all' && selectedCategoryData && (
              <div className="df-sidebar-section">
                <h3 className="df-sidebar-title">{selectedCategoryData.name}</h3>
                <ul className="df-subcat-list">
                  <li>
                    <button 
                      className={`df-subcat-item ${selectedSubcategory === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedSubcategory('all')}
                    >
                      Ver todos
                    </button>
                  </li>
                  {selectedCategoryData.subcategories.map(sub => (
                    <li key={sub.id}>
                      <button 
                        className={`df-subcat-item ${selectedSubcategory === sub.id ? 'active' : ''}`}
                        onClick={() => setSelectedSubcategory(sub.id)}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="df-sidebar-section">
              <h3 className="df-sidebar-title">Precio</h3>
              <div className="df-price-slider">
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
                <div className="df-price-values">
                  <span>€{priceRange[0]}</span>
                  <span> - €{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="df-sidebar-section">
              <h3 className="df-sidebar-title">Marcas</h3>
              <div className="df-brand-filters">
                {brands.map(brand => (
                  <label key={brand.id} className="df-brand-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => toggleBrand(brand.name)}
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="df-tienda-main">
            {/* Header */}
            <div className="df-tienda-header">
              <h1>{selectedCategoryData?.name || 'La Tienda'}</h1>
              <span className="df-products-count">{products.length} productos</span>
            </div>

            {/* Controls */}
            <div className="df-tienda-controls">
              <div className="df-search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}><X size={16} /></button>
                )}
              </div>

              <div className="df-sort-select">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Valorados</option>
                  <option value="reviews">Más Vendidos</option>
                </select>
              </div>

              <div className="df-view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                  <Grid size={18} />
                </button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="df-active-filters">
                {selectedCategory !== 'all' && (
                  <span className="df-filter-tag">
                    {selectedCategoryData?.name}
                    <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}>×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="df-filter-tag">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>×</button>
                  </span>
                )}
                <button onClick={clearFilters} className="df-clear-all">Limpiar todo</button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="df-loading">Cargando...</div>
            ) : products.length > 0 ? (
              <div className={`df-products-grid ${viewMode}`}>
                {products.map((product: any) => (
                  <div key={product.id} className="df-product-card">
                    <Link to={`/producto/${product.id}`} className="df-product-img">
                      {product.badge === 'offer' && (
                        <span className="df-product-badge">Oferta</span>
                      )}
                      <img src={product.image} alt={product.name} />
                    </Link>
                    <div className="df-product-details">
                      <span className="df-product-brand">{product.brand}</span>
                      <Link to={`/producto/${product.id}`} className="df-product-title">{product.name}</Link>
                      <div className="df-product-price">
                        <span className="df-price-current">€{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="df-price-original">€{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button className="df-add-btn">Añadir</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="df-empty">
                <h3>No encontramos productos</h3>
                <p>Intenta con otros filtros o categorías</p>
                <button onClick={clearFilters} className="df-view-all-btn">Ver todos los productos</button>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
