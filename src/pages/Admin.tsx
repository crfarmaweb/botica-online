import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Save, Package, Tag, Loader2, Upload, FileJson, AlertCircle, CheckCircle, Layout } from 'lucide-react';
import { type Product, categories as allCategories } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import PageBanner from '../components/PageBanner';
import PageBuilder from '../components/PageBuilder';
import RichTextEditor from '../components/RichTextEditor';
import './Admin.css';

const allBrands = ['Nutribén', 'Almirón', 'Avent', 'Chicco', 'Suavinex', 'La Roche-Posay', 'Vichy', 'CeraVe', 'Bioderma', 'Isdin', 'SVR', 'Avene', 'Neutrogena'];

const defaultProduct: Partial<Product> = {
  name: '',
  price: 0,
  originalPrice: undefined,
  category: '',
  subcategory: '',
  brand: '',
  image: '',
  badge: undefined,
  description: '',
  points: 0,
  inStock: true,
  stockCount: 10,
  rating: 0,
  reviews: 0,
};

export default function Admin() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'import' | 'pages' | 'content'>('products');
  const [orders, setOrders] = useState<any[]>([]);
  const [importData, setImportData] = useState('');
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  // Admin check - por ahora cualquier usuario logueado puede acceder
  // Luego puedes restrictuir a emails específicos
  useEffect(() => {
    // TEMPORARY: Allow access for testing - remove check
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data } = await supabase.from('products').select('*').order('name');
        if (data) setProductsList(data);
      }
    } catch {
      console.log('Using local products');
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50);
      if (data) setOrders(data);
    } catch {
      console.log('Error loading orders');
    }
  };

  const filteredProducts = productsList.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      setMessage('Nombre y precio son obligatorios');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      if (isCreating && supabase) {
        const { error } = await supabase.from('products').insert([{
          name: editingProduct.name,
          price: editingProduct.price,
          originalPrice: editingProduct.originalPrice || null,
          category: editingProduct.category || 'general',
          subcategory: editingProduct.subcategory || '',
          brand: editingProduct.brand,
          image: editingProduct.image || 'https://via.placeholder.com/300x300/f7f7f7/5D8A82?text=Producto',
          badge: editingProduct.badge || null,
          description: editingProduct.description || editingProduct.name,
          points: editingProduct.points || Math.round(editingProduct.price * 1),
          inStock: editingProduct.inStock !== false,
          stockCount: editingProduct.stockCount || 10,
          rating: editingProduct.rating || 0,
          reviews: editingProduct.reviews || 0,
        }]);
        
        if (error) throw error;
        setMessage('Producto creado correctamente');
      } else if (editingProduct?.id && supabase) {
        const { error } = await supabase.from('products').update({
          name: editingProduct.name,
          price: editingProduct.price,
          originalPrice: editingProduct.originalPrice || null,
          category: editingProduct.category,
          subcategory: editingProduct.subcategory || null,
          brand: editingProduct.brand,
          image: editingProduct.image,
          badge: editingProduct.badge || null,
          description: editingProduct.description,
          points: editingProduct.points,
          inStock: editingProduct.inStock,
          stockCount: editingProduct.stockCount,
          rating: editingProduct.rating,
          reviews: editingProduct.reviews,
        }).eq('id', editingProduct.id);
        
        if (error) throw error;
        setMessage('Producto actualizado correctamente');
      }

      await loadProducts();
      setEditingProduct(null);
      setIsCreating(false);
    } catch (e: any) {
      setMessage('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
      if (supabase) {
        await supabase.from('products').delete().eq('id', id);
      }
      await loadProducts();
      setMessage('Producto eliminado');
    } catch {
      setMessage('Error al eliminar');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
    setMessage('');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingProduct({ ...defaultProduct });
    setIsCreating(true);
  };

  const getCategoryColor = (catId: string) => {
    return allCategories.find((c: any) => c.id === catId)?.color || '#5D8A82';
  };

  return (
    <div className="admin-page">
      <SEO title="Admin - MadFarma" />
      <PageBanner title="Panel de Admin" backgroundColor="#1e293b" breadcrumbs={[{ label: 'Admin' }]} />
      
      <div className="admin-container">
        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            Productos ({productsList.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Tag size={18} />
            Pedidos ({orders.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <Upload size={18} />
            Importar
          </button>
          <button 
            className={`admin-tab ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            <Layout size={18} />
            Páginas
          </button>
          <button 
            className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileJson size={18} />
            Contenido
          </button>
        </div>

        {message && (
          <div className={`admin-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
            <button onClick={() => setMessage('')}><X size={16} /></button>
          </div>
        )}

        {activeTab === 'products' && (
          <>
            {/* Buscador y acciones */}
            <div className="admin-header">
              <div className="admin-search">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="admin-btn-primary" onClick={handleCreate}>
                <Plus size={18} />
                Nuevo Producto
              </button>
            </div>

            {/* Editor */}
            {(editingProduct || isCreating) && (
              <div className="admin-editor">
                <h3>{isCreating ? 'Nuevo Producto' : 'Editar Producto'}</h3>
                
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Nombre *</label>
                    <input 
                      type="text" 
                      value={editingProduct?.name || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, name: e.target.value }))}
                      placeholder="Nombre del producto"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Marca</label>
                    <select 
                      value={editingProduct?.brand || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, brand: e.target.value }))}
                    >
                      <option value="">Seleccionar marca</option>
                      {allBrands.map((b: any) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Precio (€) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editingProduct?.price || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Precio original (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editingProduct?.originalPrice || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Categoría</label>
                    <select 
                      value={editingProduct?.category || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, category: e.target.value, subcategory: '' }))}
                    >
                      <option value="">Seleccionar</option>
                      {allCategories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Subcategoría</label>
                    <select 
                      value={editingProduct?.subcategory || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, subcategory: e.target.value }))}
                    >
                      <option value="">Seleccionar</option>
                      {allCategories.find(c => c.id === editingProduct?.category)?.subcategories.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field full">
                    <label>Imagen (URL)</label>
                    <input 
                      type="text" 
                      value={editingProduct?.image || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, image: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="admin-field full">
                    <label>Descripción</label>
                    <textarea 
                      value={editingProduct?.description || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Badge</label>
                    <select 
                      value={editingProduct?.badge || ''}
                      onChange={(e) => setEditingProduct(p => ({ ...p, badge: e.target.value as any || undefined }))}
                    >
                      <option value="">Sin badge</option>
                      <option value="new">Nuevo</option>
                      <option value="sale">Oferta</option>
                      <option value="bestseller">Más vendido</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Stock</label>
                    <input 
                      type="number" 
                      value={editingProduct?.stockCount ?? 10}
                      onChange={(e) => setEditingProduct(p => ({ ...p, stockCount: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="admin-field checkbox">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={editingProduct?.inStock !== false}
                        onChange={(e) => setEditingProduct(p => ({ ...p, inStock: e.target.checked }))}
                      />
                      En stock
                    </label>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button className="admin-btn-secondary" onClick={handleCancel} disabled={saving}>
                    Cancelar
                  </button>
                  <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}

            {/* Lista de productos */}
            <div className="admin-list">
              {loading ? (
                <div className="admin-loading">Cargando...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="admin-empty">
                  <Package size={48} />
                  <p>No hay productos</p>
                  <button onClick={handleCreate}>Añadir primer producto</button>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Producto</th>
                      <th>Marca</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image} alt={product.name} className="admin-product-img" />
                        </td>
                        <td>
                          <div className="admin-product-name">{product.name}</div>
                          <div className="admin-product-cat" style={{ color: getCategoryColor(product.category) }}>
                            {allCategories.find((c: any) => c.id === product.category)?.name}
                          </div>
                        </td>
                        <td>{product.brand}</td>
                        <td>
                          <span className="admin-price">{product.price.toFixed(2)}€</span>
                          {product.originalPrice && (
                            <span className="admin-price-original">{product.originalPrice.toFixed(2)}€</span>
                          )}
                        </td>
                        <td>
                          <span className={`admin-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? `✓ ${product.stockCount}` : '✗'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-action-btn edit" onClick={() => handleEdit(product)} title="Editar">
                              <Pencil size={16} />
                            </button>
                            <button className="admin-action-btn delete" onClick={() => handleDelete(product.id)} title="Eliminar">
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
          </>
        )}

        {activeTab === 'orders' && (
          <div className="admin-orders">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Pago</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}...</td>
                    <td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td>
                    <td>{order.user_id?.slice(0, 8)}...</td>
                    <td>{order.total?.toFixed(2)}€</td>
                    <td>
                      <span className={`admin-status ${order.status}`}>{order.status}</span>
                    </td>
                    <td>{order.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pages' && <PageBuilder />}
        {activeTab === 'content' && <RichTextEditor />}
      </div>
    </div>
  );
}