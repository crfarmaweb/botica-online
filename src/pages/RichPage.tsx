import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface RichPage {
  id: string;
  slug: string;
  title: string;
  content: any;
}

export default function RichPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<RichPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) loadPage(slug);
  }, [slug]);

  const loadPage = async (pageSlug: string) => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('rich_pages')
          .select('*')
          .eq('slug', pageSlug)
          .eq('isPublished', true)
          .single();
        
        if (error) throw error;
        if (data) setPage(data);
        else setError('Página no encontrada');
      }
    } catch (e) {
      setError('Página no encontrada');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="rich-page-loading" style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="rich-page-error" style={{ textAlign: 'center', padding: '60px' }}>
        <h2 style={{ color: '#1e293b' }}>Página no encontrada</h2>
        <p style={{ color: '#64748b' }}>La página que buscas no existe o ha sido eliminada.</p>
        <Link to="/" style={{ color: '#5D8A82', textDecoration: 'underline' }}>Volver al inicio</Link>
      </div>
    );
  }

  const renderContent = (content: any) => {
    if (!content?.blocks) return null;
    
    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case 'header':
          const Tag = `h${block.data.level || 2}` as keyof React.JSX.IntrinsicElements;
          return <Tag key={index}>{block.data.text}</Tag>;
        case 'paragraph':
          return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index}>
              {block.data.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ListTag>
          );
        case 'image':
          return (
            <figure key={index} style={{ margin: '20px 0' }}>
              <img 
                src={block.data.file?.url || block.data.url} 
                alt={block.data.caption || ''} 
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
              {block.data.caption && (
                <figcaption style={{ textAlign: 'center', color: '#64748b', marginTop: '8px' }}>
                  {block.data.caption}
                </figcaption>
              )}
            </figure>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="rich-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '24px', color: '#1e293b' }}>{page.title}</h1>
      <div className="rich-page-content" style={{ lineHeight: '1.7' }}>
        {renderContent(page.content)}
      </div>
    </div>
  );
}