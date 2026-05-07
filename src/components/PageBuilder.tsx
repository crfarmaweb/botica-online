import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, GripVertical, Eye, EyeOff, Layout, Image, Type, Grid, Package, ShoppingCart, Monitor, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PageBuilder.css';

interface PageBlock {
  id: string;
  type: 'hero' | 'banner' | 'products' | 'text' | 'image' | 'cta' | 'categories';
  content: Record<string, any>;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  blocks: PageBlock[];
  is_published: boolean;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
}

const blockTypes = [
  { type: 'hero', label: 'Hero/Banner', icon: Layout, fields: ['title', 'subtitle', 'image', 'ctaText', 'ctaLink', 'bgColor'] },
  { type: 'banner', label: 'Banner', icon: Image, fields: ['title', 'image', 'link', 'bgColor'] },
  { type: 'text', label: 'Texto', icon: Type, fields: ['content', 'alignment'] },
  { type: 'image', label: 'Imagen', icon: Image, fields: ['src', 'alt', 'link'] },
  { type: 'cta', label: 'Call to Action', icon: ShoppingCart, fields: ['title', 'text', 'buttonText', 'link'] },
  { type: 'products', label: 'Productos', icon: Package, fields: ['category', 'limit', 'showBadge'] },
  { type: 'categories', label: 'Categorías', icon: Grid, fields: ['limit'] },
];

export default function PageBuilder() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'preview'>('list');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data } = await supabase.from('pages').select('*').order('title');
        if (data) setPages(data);
      }
    } catch (e) {
      console.log('Error loading pages:', e);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      slug: '',
      title: '',
      blocks: [],
      is_published: false,
    };
    setEditingPage(newPage);
    setIsCreating(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage({ ...page, blocks: page.blocks || [] });
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingPage?.title || !editingPage?.slug) {
      setMessage('Título y slug son obligatorios');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const pageData = {
        id: editingPage.id,
        slug: editingPage.slug.toLowerCase().replace(/\s+/g, '-'),
        title: editingPage.title,
        description: editingPage.description || null,
        blocks: editingPage.blocks,
        is_published: editingPage.is_published,
        meta_title: editingPage.meta_title || null,
        meta_description: editingPage.meta_description || null,
        featured_image: editingPage.featured_image || null,
      };

      if (supabase) {
        if (isCreating) {
          await supabase.from('pages').insert([pageData]);
        } else {
          await supabase.from('pages').update(pageData).eq('id', editingPage.id);
        }
      }

      setMessage('Página guardada');
      await loadPages();
      setEditingPage(null);
      setIsCreating(false);
    } catch (e: any) {
      setMessage('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta página?')) return;
    try {
      if (supabase) await supabase.from('pages').delete().eq('id', id);
      await loadPages();
      setMessage('Página eliminada');
    } catch {
      setMessage('Error al eliminar');
    }
  };

  const addBlock = (type: PageBlock['type']) => {
    if (!editingPage) return;
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    setEditingPage({
      ...editingPage,
      blocks: [...editingPage.blocks, newBlock],
    });
  };

  const updateBlock = (blockId: string, content: Record<string, any>) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      blocks: editingPage.blocks.map(b =>
        b.id === blockId ? { ...b, content: { ...b.content, ...content } } : b
      ),
    });
  };

  const deleteBlock = (blockId: string) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      blocks: editingPage.blocks.filter(b => b.id !== blockId),
    });
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!editingPage) return;
    const blocks = [...editingPage.blocks];
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setEditingPage({ ...editingPage, blocks });
  };

  const duplicateBlock = (blockId: string) => {
    if (!editingPage) return;
    const block = editingPage.blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const newBlock: PageBlock = {
      ...block,
      id: `block-${Date.now()}`,
      content: { ...block.content },
    };
    
    const index = editingPage.blocks.findIndex(b => b.id === blockId);
    const blocks = [...editingPage.blocks];
    blocks.splice(index + 1, 0, newBlock);
    setEditingPage({ ...editingPage, blocks });
  };

  if (viewMode === 'preview' && editingPage) {
    return <PagePreview page={editingPage} onClose={() => setViewMode('edit')} />;
  }

  return (
    <div className="page-builder">
      <div className="pb-header">
        <h3>Page Builder</h3>
        <button className="pb-btn-primary" onClick={handleCreate}>
          <Plus size={18} />Nueva Página
        </button>
      </div>

      {message && (
        <div className={`pb-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
          <button onClick={() => setMessage('')}><X size={16} /></button>
        </div>
      )}

      {(editingPage || isCreating) ? (
        <div className="pb-editor">
          <div className="pb-editor-header">
            <h4>{isCreating ? 'Nueva Página' : 'Editar Página'}</h4>
            <div className="pb-editor-actions">
              <button className="pb-btn-secondary" onClick={() => setViewMode('preview')}>
                <Eye size={18} />Vista Previa
              </button>
              <button className="pb-btn-secondary" onClick={() => { setEditingPage(null); setIsCreating(false); }}>
                <X size={18} />Cancelar
              </button>
              <button className="pb-btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={18} />{saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>

          <div className="pb-page-fields">
            <div className="pb-field">
              <label>Título *</label>
              <input
                type="text"
                value={editingPage?.title || ''}
                onChange={(e) => setEditingPage(p => p ? { ...p, title: e.target.value } : null)}
                placeholder="Título de la página"
              />
            </div>
            <div className="pb-field">
              <label>Slug *</label>
              <input
                type="text"
                value={editingPage?.slug || ''}
                onChange={(e) => setEditingPage(p => p ? { ...p, slug: e.target.value } : null)}
                placeholder="/mi-pagina"
              />
              <small>URL: madfarma.es{editingPage?.slug || '/slug'}</small>
            </div>
            <div className="pb-field">
              <label>Descripción</label>
              <textarea
                value={editingPage?.description || ''}
                onChange={(e) => setEditingPage(p => p ? { ...p, description: e.target.value } : null)}
                placeholder="Descripción breve"
                rows={2}
              />
            </div>
            <div className="pb-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={editingPage?.is_published || false}
                  onChange={(e) => setEditingPage(p => p ? { ...p, is_published: e.target.checked } : null)}
                />
                Publicada
              </label>
            </div>
          </div>

          <div className="pb-blocks">
            <div className="pb-blocks-header">
              <h4>Bloques</h4>
              <div className="pb-add-block">
                <Plus size={16} />
                <select onChange={(e) => { if (e.target.value) { addBlock(e.target.value as PageBlock['type']); e.target.value = ''; } }}>
                  <option value="">Añadir bloque...</option>
                  {blockTypes.map(bt => (
                    <option key={bt.type} value={bt.type}>{bt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {editingPage?.blocks.length === 0 ? (
              <div className="pb-blocks-empty">
                <Layout size={48} />
                <p>Añade bloques para construir tu página</p>
              </div>
            ) : (
              <div className="pb-blocks-list">
                {editingPage?.blocks.map((block, index) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    index={index}
                    total={editingPage.blocks.length}
                    onUpdate={(content) => updateBlock(block.id, content)}
                    onDelete={() => deleteBlock(block.id)}
                    onMoveUp={() => moveBlock(block.id, 'up')}
                    onMoveDown={() => moveBlock(block.id, 'down')}
                    onDuplicate={() => duplicateBlock(block.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="pb-pages-list">
          {loading ? (
            <div className="pb-loading">Cargando...</div>
          ) : pages.length === 0 ? (
            <div className="pb-empty">
              <Monitor size={48} />
              <p>No hay páginas creadas</p>
              <button onClick={handleCreate}>Crear primera página</button>
            </div>
          ) : (
            <table className="pb-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Slug</th>
                  <th>Bloques</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => (
                  <tr key={page.id}>
                    <td>{page.title}</td>
                    <td><code>/{page.slug}</code></td>
                    <td>{page.blocks?.length || 0}</td>
                    <td>
                      <span className={`pb-status ${page.is_published ? 'published' : 'draft'}`}>
                        {page.is_published ? <><Eye size={14} />Publicada</> : <><EyeOff size={14} />Borrador</>}
                      </span>
                    </td>
                    <td>
                      <div className="pb-actions">
                        <button className="pb-action-btn edit" onClick={() => handleEdit(page)} title="Editar">
                          <Pencil size={16} />
                        </button>
                        <button className="pb-action-btn delete" onClick={() => handleDelete(page.id)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function BlockEditor({
  block,
  index,
  total,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
}: {
  block: PageBlock;
  index: number;
  total: number;
  onUpdate: (content: Record<string, any>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
}) {
  const blockType = blockTypes.find(b => b.type === block.type);
  const Icon = blockType?.icon || Layout;

  return (
    <div className="pb-block">
      <div className="pb-block-header">
        <div className="pb-block-title">
          <GripVertical size={16} className="drag-handle" />
          <Icon size={16} />
          <span>{blockType?.label}</span>
          <span className="pb-block-number">#{index + 1}</span>
        </div>
        <div className="pb-block-actions">
          <button onClick={onMoveUp} disabled={index === 0} title="Mover arriba"><ArrowUp size={14} /></button>
          <button onClick={onMoveDown} disabled={index === total - 1} title="Mover abajo"><ArrowDown size={14} /></button>
          <button onClick={onDuplicate} title="Duplicar"><Copy size={14} /></button>
          <button onClick={onDelete} className="delete" title="Eliminar"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="pb-block-content">
        {block.type === 'hero' && (
          <>
            <div className="pb-field">
              <label>Título</label>
              <input type="text" value={block.content.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Subtítulo</label>
              <input type="text" value={block.content.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Imagen (URL)</label>
              <input type="text" value={block.content.image || ''} onChange={(e) => onUpdate({ image: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Texto del botón</label>
              <input type="text" value={block.content.ctaText || ''} onChange={(e) => onUpdate({ ctaText: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Enlace del botón</label>
              <input type="text" value={block.content.ctaLink || ''} onChange={(e) => onUpdate({ ctaLink: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Color de fondo</label>
              <input type="color" value={block.content.bgColor || '#5D8A82'} onChange={(e) => onUpdate({ bgColor: e.target.value })} />
            </div>
          </>
        )}
        {block.type === 'banner' && (
          <>
            <div className="pb-field">
              <label>Título</label>
              <input type="text" value={block.content.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Imagen (URL)</label>
              <input type="text" value={block.content.image || ''} onChange={(e) => onUpdate({ image: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Enlace</label>
              <input type="text" value={block.content.link || ''} onChange={(e) => onUpdate({ link: e.target.value })} />
            </div>
          </>
        )}
        {block.type === 'text' && (
          <div className="pb-field full">
            <label>Contenido</label>
            <textarea value={block.content.content || ''} onChange={(e) => onUpdate({ content: e.target.value })} rows={4} />
          </div>
        )}
        {block.type === 'image' && (
          <>
            <div className="pb-field">
              <label>Imagen (URL)</label>
              <input type="text" value={block.content.src || ''} onChange={(e) => onUpdate({ src: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Texto alternativo</label>
              <input type="text" value={block.content.alt || ''} onChange={(e) => onUpdate({ alt: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Enlace</label>
              <input type="text" value={block.content.link || ''} onChange={(e) => onUpdate({ link: e.target.value })} />
            </div>
          </>
        )}
        {block.type === 'cta' && (
          <>
            <div className="pb-field">
              <label>Título</label>
              <input type="text" value={block.content.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Texto</label>
              <input type="text" value={block.content.text || ''} onChange={(e) => onUpdate({ text: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Texto del botón</label>
              <input type="text" value={block.content.buttonText || ''} onChange={(e) => onUpdate({ buttonText: e.target.value })} />
            </div>
            <div className="pb-field">
              <label>Enlace</label>
              <input type="text" value={block.content.link || ''} onChange={(e) => onUpdate({ link: e.target.value })} />
            </div>
          </>
        )}
        {block.type === 'products' && (
          <>
            <div className="pb-field">
              <label>Categoría</label>
              <input type="text" value={block.content.category || ''} onChange={(e) => onUpdate({ category: e.target.value })} placeholder="todas" />
            </div>
            <div className="pb-field">
              <label>Número de productos</label>
              <input type="number" value={block.content.limit || 8} onChange={(e) => onUpdate({ limit: parseInt(e.target.value) })} />
            </div>
          </>
        )}
        {block.type === 'categories' && (
          <div className="pb-field">
            <label>Número de categorías</label>
            <input type="number" value={block.content.limit || 6} onChange={(e) => onUpdate({ limit: parseInt(e.target.value) })} />
          </div>
        )}
      </div>
    </div>
  );
}

function PagePreview({ page, onClose }: { page: Page; onClose: () => void }) {
  return (
    <div className="pb-preview">
      <div className="pb-preview-header">
        <h4>Vista Previa: {page.title}</h4>
        <button onClick={onClose}><X size={18} />Cerrar</button>
      </div>
      <div className="pb-preview-content">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        {page.blocks?.map(block => (
          <div key={block.id} className={`preview-block block-${block.type}`}>
            {block.type === 'hero' && (
              <div className="hero-block" style={{ backgroundColor: block.content.bgColor || '#5D8A82' }}>
                <h2>{block.content.title}</h2>
                <p>{block.content.subtitle}</p>
                {block.content.ctaText && <button>{block.content.ctaText}</button>}
              </div>
            )}
            {block.type === 'banner' && (
              <div className="banner-block">
                <img src={block.content.image} alt={block.content.title} />
                <h3>{block.content.title}</h3>
              </div>
            )}
            {block.type === 'text' && (
              <div className="text-block" style={{ textAlign: block.content.alignment as any || 'left' }}>
                <p>{block.content.content}</p>
              </div>
            )}
            {block.type === 'image' && (
              <div className="image-block">
                <img src={block.content.src} alt={block.content.alt} />
              </div>
            )}
            {block.type === 'cta' && (
              <div className="cta-block">
                <h3>{block.content.title}</h3>
                <p>{block.content.text}</p>
                <button>{block.content.buttonText}</button>
              </div>
            )}
            {block.type === 'products' && (
              <div className="products-block">
                <h3>Productos</h3>
                <p>Mostrando {block.content.limit || 8} productos de {block.content.category || 'todas las categorías'}</p>
              </div>
            )}
            {block.type === 'categories' && (
              <div className="categories-block">
                <h3>Categorías</h3>
                <p>Mostrando {block.content.limit || 6} categorías</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getDefaultContent(type: PageBlock['type']): Record<string, any> {
  switch (type) {
    case 'hero':
      return { title: 'Título Principal', subtitle: ' Subtítulo de la sección', ctaText: 'Ver más', ctaLink: '/tienda', bgColor: '#5D8A82' };
    case 'banner':
      return { title: 'Banner', image: '', link: '' };
    case 'text':
      return { content: 'Escribe tu texto aquí...', alignment: 'left' };
    case 'image':
      return { src: '', alt: '', link: '' };
    case 'cta':
      return { title: 'Título del CTA', text: 'Texto explicativo', buttonText: 'Click aquí', link: '/tienda' };
    case 'products':
      return { category: '', limit: 8, showBadge: true };
    case 'categories':
      return { limit: 6 };
    default:
      return {};
  }
}