import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const categories = [
  { id: 'bebe-mama', name: 'Bebé y Mama', icon: '👶' },
  { id: 'cosmetica-belleza', name: 'Cosmética y Belleza', icon: '💄' },
  { id: 'higiene', name: 'Higiene', icon: '🧴' },
  { id: 'dietetica-nutricion', name: 'Dietética y Nutrición', icon: '💊' },
  { id: 'salud-sexual', name: 'Salud Sexual', icon: '💑' },
];

const products = [
  { id: '1', name: 'La Roche-Posay Anthelios SPF50+', description: 'Protector solar facial de alta protección', price: 24.90, originalPrice: 29.90, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', category: 'cosmetica-belleza', brand: 'La Roche-Posay', rating: 4.8, reviews: 2456, badge: 'offer', featured: true },
  { id: '2', name: 'Vichy Mineral 89', description: 'Sérum hidratante con agua termal', price: 19.50, originalPrice: null, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', category: 'cosmetica-belleza', brand: 'Vichy', rating: 4.7, reviews: 1823, badge: null, featured: true },
  { id: '3', name: 'CeraVe Limpiadora Hidratante', description: 'Limpiadora sin espuma con ceramidas', price: 12.95, originalPrice: 15.95, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=400&fit=crop', category: 'cosmetica-belleza', brand: 'CeraVe', rating: 4.9, reviews: 3421, badge: 'offer', featured: true },
  { id: '4', name: 'Bioderma Atoderm Intensive', description: 'Bálsamo emoliente para piel atópica', price: 16.90, originalPrice: null, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop', category: 'cosmetica-belleza', brand: 'Bioderma', rating: 4.6, reviews: 987, badge: null, featured: false },
  { id: '5', name: 'Listerine Colgate Total', description: 'Colutorio dental con flúor', price: 6.95, originalPrice: 8.50, image: 'https://images.unsplash.com/photo-1559650656-5e7e3f496f97?w=400&h=400&fit=crop', category: 'higiene', brand: 'Listerine', rating: 4.5, reviews: 2156, badge: 'offer', featured: true },
  { id: '6', name: 'Colgate Sensitive Plus', description: 'Pasta dental para dientes sensibles', price: 4.50, originalPrice: null, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', category: 'higiene', brand: 'Colgate', rating: 4.4, reviews: 1876, badge: null, featured: false },
  { id: '7', name: 'Aquilea Sueño Gummies', description: 'Complemento con melatonina', price: 14.90, originalPrice: 17.90, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', category: 'dietetica-nutricion', brand: 'Aquilea', rating: 4.3, reviews: 543, badge: 'offer', featured: true },
  { id: '8', name: 'Arkopharma Arkocápsulas', description: 'Complemento a base de plantas', price: 11.50, originalPrice: null, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', category: 'dietetica-nutricion', brand: 'Arkopharma', rating: 4.2, reviews: 321, badge: null, featured: false },
];

const brands = [
  { id: '1', name: 'La Roche-Posay' },
  { id: '2', name: 'Vichy' },
  { id: '3', name: 'CeraVe' },
  { id: '4', name: 'Bioderma' },
  { id: '5', name: 'Neutrogena' },
];

const promotions = [
  { id: '1', title: '-15% EXTRA en pedidos +50€', code: 'BIENVENIDO15', discount: 15, minPurchase: 50, active: true },
  { id: '2', title: 'Envío gratis', code: 'ENVIOFREE', discount: 0, minPurchase: 35, active: true }
];

// Products
app.get('/api/products', (req, res) => {
  const { category, subcategory, brand, search, sort, limit } = req.query;
  let filtered = [...products];
  
  if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (brand) filtered = filtered.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (limit) filtered = filtered.slice(0, parseInt(limit));
  
  res.json({ total: filtered.length, data: filtered });
});

app.get('/api/products/featured', (req, res) => {
  res.json(products.filter(p => p.featured));
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// Categories
app.get('/api/categories', (req, res) => res.json(categories));

// Brands
app.get('/api/brands', (req, res) => res.json(brands));

// Promotions
app.get('/api/promotions', (req, res) => res.json(promotions.filter(p => p.active)));

app.post('/api/promotions/validate', (req, res) => {
  const { code, total } = req.body;
  const promo = promotions.find(p => p.code === code && p.active);
  if (!promo) return res.status(404).json({ valid: false, error: 'Cupón no válido' });
  if (promo.minPurchase > total) return res.status(400).json({ valid: false, error: `Minimum: €${promo.minPurchase}` });
  res.json({ valid: true, discount: promo.discount });
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;
