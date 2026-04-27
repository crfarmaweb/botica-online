import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Grid, List, ChevronRight, X, Check, SlidersHorizontal } from 'lucide-react';
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const { categories, brands, addToCart } = useApp();
  const urlSearch = searchParams.get('search') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);
  const [addedProducts, setAddedProducts] = useState<string[]>([]);

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
          if (priceRange[0] > 0 || priceRange[1] < 200) {
            filtered = filtered.filter((p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]);
          }
          if (selectedBrands.length > 0) {
            filtered = filtered.filter((p: any) => selectedBrands.includes(p.brand));
          }
          setProducts(filtered);
          if (productsRef.current) {
            productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
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
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(s => s.id === selectedSubcategory);

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

  const toggleFilter = (filterId: string) => {
    setOpenFilters(prev => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts(prev => prev.filter(id => id !== product.id));
    }, 600);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSubcategory !== 'all' || 
                          searchQuery || selectedBrands.length > 0 || 
                          priceRange[0] > 0 || priceRange[1] < 200;

  const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  return (
    <div className="df-tienda">
      <SEO 
        title={selectedSubcategoryData ? `${selectedSubcategoryData.name} - MadFarma` : selectedCategoryData ? `${selectedCategoryData.name} - MadFarma` : "Tienda - MadFarma | Tu Parafarmacia en Madrid"}
        description="Explora nuestro catálogo de parafarmacia online. Envío 24-48h."
      />
      
      <div className="df-category-view" style={{ backgroundColor: selectedCategory !== 'all' && selectedCategoryData ? selectedCategoryData.color : '#5D8A82' }}>
        <div className="df-category-container">
          <div className="df-category-content">
            <nav className="df-breadcrumbs">
              <Link to="/">Inicio</Link>
              <ChevronRight size={14} />
              {isMarcasPage ? (
                <span>Marcas</span>
              ) : selectedCategory !== 'all' ? (
                <>
                  <Link to="/tienda">Productos</Link>
                  <ChevronRight size={14} />
                  <span>{selectedSubcategoryData?.name || selectedCategoryData?.name}</span>
                </>
              ) : (
                <span>Productos</span>
              )}
            </nav>
            <h1>{isMarcasPage ? 'Nuestras Marcas' : selectedSubcategoryData?.name || selectedCategoryData?.name || 'Todos los productos'}</h1>
          </div>
        </div>
      </div>

      {isMarcasPage ? (
        <div className="df-marcas-page">
          <div className="df-container">
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
        </div>
      ) : (
        <div className="df-container">
          <div className="df-columns">
            <button className="df-mobile-filter-btn" onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal size={18} />
              Filtrar por
            </button>

            <aside className={`df-sidebar ${mobileFiltersOpen ? 'df-sidebar-open' : ''}`}>
              <div className="df-sidebar-header">
                <span>Filtrar por</span>
                <button className="df-sidebar-close" onClick={() => setMobileFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="df-sidebar-content">
                <div className="df-filter-block">
                  <div className="df-filter-title" onClick={() => toggleFilter('categorias')}>
                    Categorías
                    <span className={`df-filter-arrow ${openFilters['categorias'] ? 'open' : ''}`}></span>
                  </div>
                  <div className={`df-filter-content ${openFilters['categorias'] || openFilters['categorias'] === undefined ? '' : 'collapsed'}`}>
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
                            <span style={{ backgroundColor: cat.color }}></span> {cat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedCategory !== 'all' && selectedCategoryData && (
                  <div className="df-filter-block">
                    <div className="df-filter-title" onClick={() => toggleFilter('subcategorias')}>
                      {selectedCategoryData.name}
                      <span className={`df-filter-arrow ${openFilters['subcategorias'] ? 'open' : ''}`}></span>
                    </div>
                    <div className={`df-filter-content ${openFilters['subcategorias'] || openFilters['subcategorias'] === undefined ? '' : 'collapsed'}`}>
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
                  </div>
                )}

                <div className="df-filter-block">
                  <div className="df-filter-title" onClick={() => toggleFilter('precio')}>
                    Precio
                    <span className={`df-filter-arrow ${openFilters['precio'] ? 'open' : ''}`}></span>
                  </div>
                  <div className={`df-filter-content ${openFilters['precio'] || openFilters['precio'] === undefined ? '' : 'collapsed'}`}>
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
                </div>

                <div className="df-filter-block">
                  <div className="df-filter-title" onClick={() => toggleFilter('marcas')}>
                    Marca
                    <span className={`df-filter-arrow ${openFilters['marcas'] ? 'open' : ''}`}></span>
                  </div>
                  <div className={`df-filter-content ${openFilters['marcas'] || openFilters['marcas'] === undefined ? '' : 'collapsed'}`}>
                    <div className="df-brand-search">
                      <Search size={16} />
                      <input type="text" placeholder="Buscar marca..." />
                    </div>
                    <div className="df-brand-filters">
                      {availableBrands.length > 0 ? (
                        availableBrands.map(brand => (
                          <label key={brand} className="df-brand-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                            />
                            <span>{brand}</span>
                          </label>
                        ))
                      ) : (
                        <p className="df-no-brands">No hay marcas disponibles</p>
                      )}
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="df-clear-all-filters">
                    Limpiar filtros
                  </button>
                )}
              </div>
            </aside>

            <div className="df-products-section" ref={productsRef}>
              {hasActiveFilters && (
                <div className="df-active-filters">
                  {selectedCategory !== 'all' && (
                    <span className="df-filter-tag">
                      {selectedCategoryData?.name}
                      <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}>×</button>
                    </span>
                  )}
                  {selectedSubcategory !== 'all' && (
                    <span className="df-filter-tag">
                      {selectedCategoryData?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                      <button onClick={() => setSelectedSubcategory('all')}>��</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="df-filter-tag">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}>×</button>
                    </span>
                  )}
                  {selectedBrands.length > 0 && (
                    <span className="df-filter-tag">
                      {selectedBrands.length} marca(s)
                      <button onClick={() => setSelectedBrands([])}>×</button>
                    </span>
                  )}
                  <button onClick={clearFilters} className="df-clear-all">Limpiar todo</button>
                </div>
              )}

              <div className="df-controls-bar">
                <div className="df-search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}><X size={16} /></button>
                  )}
                </div>

                <div className="df-controls-right">
                  <span className="df-products-count">{products.length} productos</span>
                  
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
              </div>

              {loading ? (
                <div className="df-loading">Cargando...</div>
              ) : products.length > 0 ? (
                <div className={`df-products-grid ${viewMode}`}>
                  {products.map((product: any) => (
                    <form key={product.id} className="df-product-item">
                      <Link to={`/producto/${product.id}`} className="df-product-link">
                        <div className="df-product-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                      </Link>
                      <div className="df-product-info">
                        <span className="df-product-brand">{product.brand}</span>
                        <Link to={`/producto/${product.id}`} className="df-product-name">{product.name}</Link>
                        <div className="df-product-price">
                          <span className="df-price-final">{product.price.toFixed(2).replace('.', ',')} €</span>
                          {product.originalPrice && (
                            <span className="df-price-old">{product.originalPrice.toFixed(2).replace('.', ',')} €</span>
                          )}
                        </div>
                        <div className="df-product-actions">
                          <button 
                            type="button"
                            className={`df-add-btn ${addedProducts.includes(product.id) ? 'added' : ''}`}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            {addedProducts.includes(product.id) ? (
                              <><Check size={16} /> Añadido</>
                            ) : (
                              'Añadir'
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
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
        </div>
      )}

      {mobileFiltersOpen && (
        <div className="df-overlay" onClick={() => setMobileFiltersOpen(false)} />
      )}
    </div>
  );
}