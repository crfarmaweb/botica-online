import { useEffect, useRef, useState } from 'react';
import { EditorJS } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import { supabase } from '../lib/supabase';
import { Save, X, Loader2, Layout } from 'lucide-react';

interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  isPublished: boolean;
}

export default function RichTextEditor() {
  const ejInstance = useRef<EditorJS | null>(null);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (viewMode === 'edit' && selectedPage) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [viewMode, selectedPage]);

  const loadPages = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data } = await supabase.from('rich_pages').select('*').order('title');
        if (data) setPages(data);
      }
    } catch (e) {
      console.log('Error loading pages:', e);
    }
    setLoading(false);
  };

  const initEditor = () => {
    if (ejInstance.current) return;

    const editor = new EditorJS({
      holder: 'editorjs',
      data: selectedPage?.content || { time: Date.now(), blocks: [] },
      tools: {
        header: Header,
        list: List,
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: 'https://api.imgbb.com/1/upload',
            },
            field: 'image',
            additionalFields: {
              key: 'demo_key',
            },
          },
        },
        paragraph: Paragraph,
      },
      placeholder: 'Empieza a escribir...',
    });

    ejInstance.current = editor;
  };

  const handleCreate = () => {
    const newPage: CustomPage = {
      id: `page-${Date.now()}`,
      slug: '',
      title: '',
      content: { time: Date.now(), blocks: [] },
      isPublished: false,
    };
    setSelectedPage(newPage);
    setViewMode('edit');
  };

  const handleEdit = (page: CustomPage) => {
    setSelectedPage(page);
    setViewMode('edit');
  };

  const handleSave = async () => {
    if (!selectedPage?.title || !selectedPage?.slug) {
      setMessage('Título y slug son obligatorios');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      let content;
      if (ejInstance.current) {
        content = await ejInstance.current.save();
      }

      const pageData = {
        id: selectedPage.id,
        slug: selectedPage.slug.toLowerCase().replace(/\s+/g, '-'),
        title: selectedPage.title,
        content,
        isPublished: selectedPage.isPublished,
      };

      if (supabase) {
        await supabase.from('rich_pages').upsert([pageData]);
      }

      setMessage('Página guardada');
      await loadPages();
      setViewMode('list');
      setSelectedPage(null);
    } catch (e: any) {
      setMessage('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta página?')) return;
    try {
      if (supabase) await supabase.from('rich_pages').delete().eq('id', id);
      await loadPages();
    } catch {
      setMessage('Error al eliminar');
    }
  };

  if (viewMode === 'edit' && selectedPage) {
    return (
      <div className="richtext-editor">
        <div className="re-header">
          <h3>{selectedPage.title ? 'Editar página' : 'Nueva página'}</h3>
          <div className="re-actions">
            <button className="re-btn-secondary" onClick={() => { setViewMode('list'); setSelectedPage(null); }}>
              <X size={18} />Cancelar
            </button>
            <button className="re-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`re-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
            <button onClick={() => setMessage('')}><X size={16} /></button>
          </div>
        )}

        <div className="re-fields">
          <div className="re-field">
            <label>Título *</label>
            <input
              type="text"
              value={selectedPage.title || ''}
              onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
              placeholder="Título de la página"
            />
          </div>
          <div className="re-field">
            <label>Slug (URL) *</label>
            <input
              type="text"
              value={selectedPage.slug || ''}
              onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
              placeholder="mi-pagina"
            />
            <small>URL: madfarma.es/{selectedPage.slug || 'slug'}</small>
          </div>
          <div className="re-field checkbox">
            <label>
              <input
                type="checkbox"
                checked={selectedPage.isPublished || false}
                onChange={(e) => setSelectedPage({ ...selectedPage, isPublished: e.target.checked })}
              />
              Publicada
            </label>
          </div>
        </div>

        <div className="re-editor">
          <div id="editorjs"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="richtext-editor">
      <div className="re-header">
        <h3>Editor de Contenido</h3>
        <button className="re-btn-primary" onClick={handleCreate}>
          + Nueva Página
        </button>
      </div>

      {loading ? (
        <div className="re-loading">Cargando...</div>
      ) : pages.length === 0 ? (
        <div className="re-empty">
          <Layout size={48} />
          <p>No hay páginas creadas</p>
          <button onClick={handleCreate}>Crear primera página</button>
        </div>
      ) : (
        <div className="re-list">
          {pages.map(page => (
            <div key={page.id} className="re-item">
              <div className="re-item-content">
                <span className="re-item-title">{page.title}</span>
                <code className="re-item-slug">/{page.slug}</code>
                <span className={`re-item-status ${page.isPublished ? 'published' : 'draft'}`}>
                  {page.isPublished ? 'Publicada' : 'Borrador'}
                </span>
              </div>
              <div className="re-item-actions">
                <button onClick={() => handleEdit(page)}>Editar</button>
                <button onClick={() => handleDelete(page.id)} className="delete">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}