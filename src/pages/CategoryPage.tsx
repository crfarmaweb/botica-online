import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categories, productsList } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export default function CategoryPage() {
  const { slug } = useParams();
  
  const category = categories.find(c => c.id === slug);
  
  if (!category) {
    return (
      <div className="cat-page">
        <div className="cat-container">
          <div className="cat-not-found">
            <h1>Categoría no encontrada</h1>
            <Link to="/tienda">Ver todos los productos</Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryProducts = productsList.filter((p) => p.category === slug).slice(0, 12);

  return (
    <div className="cat-page">
      <SEO 
        title={`${category.name} | MadFarma`}
        description={`Descubre nuestra selección de productos de ${category.name} en MadFarma. Envío 24-48h.`}
      />

      {/* Breadcrumbs */}
      <div className="cat-breadcrumbs">
        <div className="cat-container">
          <nav className="breadcrumb-list">
            <span className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </span>
            <span className="separator"><ChevronRight size={14} /></span>
            <span className="breadcrumb-item">
              <span>{category.name}</span>
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="cat-hero" style={{ '--cat-color': category.color } as React.CSSProperties}>
        <div className="cat-container">
          <div className="cat-hero-content">
            <div className="cat-hero-dot" style={{ backgroundColor: category.color }} />
            <h1 className="cat-hero-title">{category.name}</h1>
            <p className="cat-hero-subtitle">
              {categoryProducts.length} productos disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="cat-subs-section">
        <div className="cat-container">
          <h2 className="cat-subs-title">Explora nuestras subcategorías</h2>
          <div className="cat-subs-grid">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/tienda?cat=${category.id}&sub=${sub.id}`}
                className="cat-sub-card"
                style={{ '--cat-color': category.color } as React.CSSProperties}
              >
                <span className="cat-sub-name">{sub.name}</span>
                <ChevronRight size={18} className="cat-sub-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="cat-products-section">
        <div className="cat-container">
          <div className="cat-products-header">
            <h2 className="cat-products-title">Productos destacados</h2>
            <Link to={`/tienda?cat=${category.id}`} className="cat-view-all">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="cat-products-grid">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cat-page {
          background: #fff;
          min-height: 100vh;
        }

        .cat-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 40px;
        }

        @media (max-width: 768px) {
          .cat-container {
            padding: 0 16px;
          }
        }

        .cat-breadcrumbs {
          padding: 20px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .breadcrumb-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          font-size: 14px;
          gap: 8px;
        }

        .breadcrumb-item a {
          color: #212429;
          text-decoration: none;
          font-weight: 600;
        }

        .breadcrumb-item a:hover {
          color: #5D8A82;
        }

        .breadcrumb-item span {
          color: #6B7580;
        }

        .separator {
          color: #6B7580;
          display: flex;
          align-items: center;
        }

        .cat-hero {
          background: var(--cat-color, #f8f8f8);
          padding: 48px 0;
          border-bottom: 1px solid #eee;
        }

        .cat-hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .cat-hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-bottom: 8px;
          background-color: var(--cat-color, #5D8A82) !important;
        }

        .cat-hero-title {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          text-shadow: 0 1px 2px rgba(255,255,255,0.3);
        }

        .cat-hero-subtitle {
          font-size: 16px;
          color: #333;
          margin: 0;
          font-weight: 500;
        }

        .cat-subs-section {
          padding: 40px 0;
          background: #fff;
        }

        .cat-subs-title {
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #212429;
          margin: 0 0 24px;
        }

        .cat-subs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        .cat-sub-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cat-sub-card:hover {
          border-color: var(--cat-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .cat-sub-name {
          font-size: 15px;
          font-weight: 500;
          color: #212429;
        }

        .cat-sub-arrow {
          color: #6B7580;
          transition: transform 0.2s;
        }

        .cat-sub-card:hover .cat-sub-arrow {
          transform: translateX(4px);
          color: var(--cat-color);
        }

        .cat-products-section {
          padding: 40px 0 60px;
        }

        .cat-products-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .cat-products-title {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #212429;
          margin: 0;
        }

        .cat-view-all {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #5D8A82;
          text-decoration: none;
        }

        .cat-view-all:hover {
          text-decoration: underline;
        }

        .cat-products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (min-width: 640px) {
          .cat-products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .cat-products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .cat-not-found {
          text-align: center;
          padding: 80px 20px;
        }

        .cat-not-found h1 {
          font-size: 24px;
          color: #212429;
          margin-bottom: 12px;
        }

        .cat-not-found a {
          color: #5D8A82;
        }

        @media (max-width: 768px) {
          .cat-hero {
            padding: 32px 0;
          }

          .cat-hero-title {
            font-size: 28px;
          }

          .cat-subs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}