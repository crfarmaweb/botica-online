import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { allCategories, type Product } from '../context/AppContext';

interface PageBlock {
  id: string;
  type: string;
  content: Record<string, any>;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  blocks: PageBlock[];
  is_published: boolean;
}

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) loadPage(slug);
  }, [slug]);

  const loadPage = async (pageSlug: string) => {
    setLoading(true);
    setError('');
    
    try {
      if (supabase) {
        // Try Page Builder pages first
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', pageSlug)
          .eq('is_published', true)
          .single();
        
        if (pageData) {
          setPage({ ...pageData, type: 'builder' });
          setLoading(false);
          return;
        }

        // Try Rich Text pages
        const { data: richData, error: richError } = await supabase
          .from('rich_pages')
          .select('*')
          .eq('slug', pageSlug)
          .eq('isPublished', true)
          .single();
        
        if (richData) {
          setPage({ ...richData, type: 'rich', blocks: [] });
          setLoading(false);
          return;
        }

        setError('Página no encontrada');
      }
    } catch (e: any) {
      console.log('Error loading page:', e);
      setError('Página no encontrada');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="dynamic-page-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="dynamic-page-error">
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe o ha sido eliminada.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="dynamic-page">
      {page.blocks?.map((block, index) => (
        <BlockRenderer key={block.id} block={block} index={index} />
      ))}
    </div>
  );
}

function BlockRenderer({ block, index }: { block: PageBlock; index: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (block.type === 'products') {
      loadProducts(block.content.category, block.content.limit);
    }
  }, [block.type]);

  const loadProducts = async (category?: string, limit: number = 8) => {
    setLoadingProducts(true);
    try {
      if (supabase) {
        let query = supabase.from('products').select('*').eq('inStock', true);
        if (category && category !== 'todas' && category !== '') {
          query = query.eq('category', category);
        }
        const { data } = await query.limit(limit);
        if (data) setProducts(data);
      }
    } catch (e) {
      console.log('Error loading products:', e);
    }
    setLoadingProducts(false);
  };

  switch (block.type) {
    case 'hero':
      return (
        <section className="block-hero" style={{ backgroundColor: block.content.bgColor || '#5D8A82' }}>
          <div className="hero-content">
            <h1>{block.content.title}</h1>
            {block.content.subtitle && <p>{block.content.subtitle}</p>}
            {block.content.ctaText && block.content.ctaLink && (
              <Link to={block.content.ctaLink} className="hero-cta">
                {block.content.ctaText}
              </Link>
            )}
          </div>
          {block.content.image && (
            <div className="hero-image">
              <img src={block.content.image} alt={block.content.title} />
            </div>
          )}
        </section>
      );

    case 'banner':
      if (!block.content.image) return null;
      const BannerLink = block.content.link ? Link : 'div';
      return (
        <Link to={block.content.link || '#'} className="block-banner">
          <img src={block.content.image} alt={block.content.title} />
          {block.content.title && <h3>{block.content.title}</h3>}
        </Link>
      );

    case 'text':
      return (
        <section 
          className="block-text" 
          style={{ textAlign: (block.content.alignment as any) || 'left' }}
        >
          <div dangerouslySetInnerHTML={{ __html: block.content.content || '' }} />
        </section>
      );

    case 'image':
      if (!block.content.src) return null;
      const ImageWrapper = block.content.link ? Link : 'div';
      return (
        <figure className="block-image">
          <img src={block.content.src} alt={block.content.alt || ''} />
          {block.content.link && (
            <Link to={block.content.link} className="image-link">
              Ver más
            </Link>
          )}
        </figure>
      );

    case 'cta':
      return (
        <section className="block-cta">
          <h3>{block.content.title}</h3>
          <p>{block.content.text}</p>
          {block.content.buttonText && (
            <Link to={block.content.link || '#'} className="cta-button">
              {block.content.buttonText}
            </Link>
          )}
        </section>
      );

    case 'products':
      return (
        <section className="block-products">
          <h3>Productos</h3>
          {loadingProducts ? (
            <div className="products-loading">Cargando...</div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <Link to={`/producto/${product.id}`} key={product.id} className="product-card-mini">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <span className="price">{product.price?.toFixed(2)}€</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </section>
      );

    case 'categories':
      const cats = allCategories.slice(0, block.content.limit || 6);
      return (
        <section className="block-categories">
          <h3>Categorías</h3>
          <div className="categories-grid">
            {cats.map(cat => (
              <Link to={`/${cat.id}`} key={cat.id} className="category-card-mini" style={{ borderColor: cat.color }}>
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      );

    default:
      return null;
  }
}