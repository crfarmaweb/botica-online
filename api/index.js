import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const categories = [
  { id: 'bebe-mama', name: 'Bebé y Mama', icon: '👶', subcategories: [
    { id: 'alimentacion', name: 'Alimentación' },
    { id: 'cuidado', name: 'Cuidado' },
    { id: 'higiene', name: 'Higiene' }
  ]},
  { id: 'cosmetica-belleza', name: 'Cosmética y Belleza', icon: '💄', subcategories: [
    { id: 'facial', name: 'Cuidado Facial' },
    { id: 'corporal', name: 'Cuidado Corporal' },
    { id: 'cabello', name: 'Cabello' }
  ]},
  { id: 'higiene', name: 'Higiene', icon: '🧴', subcategories: [
    { id: 'bucal', name: 'Higiene Bucal' },
    { id: 'corporal', name: 'Higiene Corporal' },
    { id: 'intima', name: 'Higiene Íntima' }
  ]},
  { id: 'dietetica-nutricion', name: 'Dietética y Nutrición', icon: '💊', subcategories: [
    { id: 'vitaminas', name: 'Vitaminas' },
    { id: 'suplementos', name: 'Suplementos' },
    { id: 'adelgazar', name: 'Adelgazar' }
  ]},
  { id: 'salud-sexual', name: 'Salud Sexual', icon: '💑', subcategories: [
    { id: 'anticonceptivos', name: 'Anticonceptivos' },
    { id: 'lubricantes', name: 'Lubricantes' }
  ]},
];

const products = [
  // Cosmética y Belleza
  { id: '1', name: 'La Roche-Posay Anthelios SPF50+', description: 'Protector solar facial de alta protección FPS 50+ para piel sensible.', price: 24.90, originalPrice: 29.90, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'facial', brand: 'La Roche-Posay', rating: 4.8, reviews: 2456, badge: 'offer', featured: true },
  { id: '2', name: 'Vichy Mineral 89', description: 'Sérum hidratante con agua termal de Vichy y ácido hialurónico.', price: 19.50, originalPrice: null, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'facial', brand: 'Vichy', rating: 4.7, reviews: 1823, badge: null, featured: true },
  { id: '3', name: 'CeraVe Limpiadora Hidratante', description: 'Limpiadora facial sin espuma con ceramidas y ácido hialurónico.', price: 12.95, originalPrice: 15.95, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'facial', brand: 'CeraVe', rating: 4.9, reviews: 3421, badge: 'offer', featured: true },
  { id: '4', name: 'Bioderma Atoderm Intensive', description: 'Bálsamo emoliente para piel atópica. Nutre y repara la barrera cutánea.', price: 16.90, originalPrice: null, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'corporal', brand: 'Bioderma', rating: 4.6, reviews: 987, badge: null, featured: false },
  { id: '5', name: 'Isdin Fusion Water SPF 50', description: 'Protector solar ultraligero con textura agua.', price: 19.90, originalPrice: 24.90, image: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'facial', brand: 'Isdin', rating: 4.7, reviews: 1876, badge: 'offer', featured: true },
  { id: '6', name: 'Nivea Body Lotion', description: 'Loción corporal hidratante con tecnología de cuidado de la piel.', price: 8.90, originalPrice: null, image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'corporal', brand: 'Nivea', rating: 4.5, reviews: 2341, badge: null, featured: false },
  { id: '7', name: 'La Roche-Posay Cicaplast', description: 'Bálsamo reparador para irritaciones y rojeces.', price: 9.90, originalPrice: 12.50, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop', category: 'cosmetica-belleza', subcategory: 'facial', brand: 'La Roche-Posay', rating: 4.7, reviews: 1567, badge: 'offer', featured: true },
  
  // Higiene
  { id: '8', name: 'Listerine Colgate Total', description: 'Colutorio dental con flúor para protección completa.', price: 6.95, originalPrice: 8.50, image: 'https://images.unsplash.com/photo-1559650656-5e7e3f496f97?w=400&h=400&fit=crop', category: 'higiene', subcategory: 'bucal', brand: 'Listerine', rating: 4.5, reviews: 2156, badge: 'offer', featured: true },
  { id: '9', name: 'Colgate Sensitive Plus', description: 'Pasta dental para dientes sensibles con tecnología Pro-Argin.', price: 4.50, originalPrice: null, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', category: 'higiene', subcategory: 'bucal', brand: 'Colgate', rating: 4.4, reviews: 1876, badge: null, featured: false },
  { id: '10', name: 'Gel Íntimo Isdin', description: 'Gel de higiene íntima con pH neutro y activos hidratantes.', price: 8.90, originalPrice: null, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', category: 'higiene', subcategory: 'intima', brand: 'Isdin', rating: 4.6, reviews: 876, badge: null, featured: false },
  
  // Dietética y Nutrición
  { id: '11', name: 'Aquilea Sueño Gummies', description: 'Complemento alimenticio con melatonina y valeriana.', price: 14.90, originalPrice: 17.90, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Aquilea', rating: 4.3, reviews: 543, badge: 'offer', featured: true },
  { id: '12', name: 'Arkopharma Arkocápsulas', description: 'Complemento alimenticio a base de plantas medicinales.', price: 11.50, originalPrice: null, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', category: 'dietetica-nutricion', subcategory: 'suplementos', brand: 'Arkopharma', rating: 4.2, reviews: 321, badge: null, featured: false },
  { id: '13', name: 'Omega 3 Premium 1000mg', description: 'Omega 3 EPA DHA para salud cardiovascular.', price: 12.90, originalPrice: 15.90, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', category: 'dietetica-nutricion', subcategory: 'suplementos', brand: 'Om3ga', rating: 4.8, reviews: 423, badge: 'offer', featured: true },
  
  // Bebé y Mamá
  { id: '14', name: 'Leche Infantil奶粉', description: 'Leche de continuación para bebés de 6-12 meses.', price: 18.90, originalPrice: null, image: 'https://images.unsplash.com/photo-1555252333-978fe3c7e824?w=400&h=400&fit=crop', category: 'bebe-mama', subcategory: 'alimentacion', brand: 'Nutribén', rating: 4.6, reviews: 234, badge: null, featured: false },
  { id: '15', name: 'Chupete Ortodóncico', description: 'Chupete ortodóncico de silicona para bebés.', price: 5.90, originalPrice: 7.90, image: 'https://images.unsplash.com/photo-1555252333-978fe3c7e824?w=400&h=400&fit=crop', category: 'bebe-mama', subcategory: 'cuidado', brand: 'Suavinex', rating: 4.4, reviews: 567, badge: 'offer', featured: false },
  
  // Salud Sexual
  { id: '16', name: 'Preservativos Durex', description: 'Caja de 12 preservativos lubricados.', price: 9.50, originalPrice: 12.90, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', category: 'salud-sexual', subcategory: 'anticonceptivos', brand: 'Durex', rating: 4.5, reviews: 3456, badge: 'offer', featured: true },
  { id: '17', name: 'Test de Embarazo Clearblue', description: 'Test de embarazo digital con indicador de semanas.', price: 14.90, originalPrice: null, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', category: 'salud-sexual', subcategory: 'anticonceptivos', brand: 'Clearblue', rating: 4.7, reviews: 2134, badge: null, featured: true },
];

const brands = [
  { id: '1', name: 'La Roche-Posay' },
  { id: '2', name: 'Vichy' },
  { id: '3', name: 'CeraVe' },
  { id: '4', name: 'Bioderma' },
  { id: '5', name: 'Isdin' },
  { id: '6', name: 'Nivea' },
  { id: '7', name: 'Colgate' },
  { id: '8', name: 'Listerine' },
  { id: '9', name: 'Aquilea' },
  { id: '10', name: 'Arkopharma' },
];

const promotions = [
  { id: '1', title: '-15% EXTRA en pedidos +50€', code: 'BIENVENIDO15', discount: 15, minPurchase: 50, active: true },
  { id: '2', title: 'Envío gratis', code: 'ENVIOFREE', discount: 0, minPurchase: 35, active: true }
];

// Users (demo data)
const users = [
  { id: '1', email: 'demo@crpharma.es', password: 'demo123', name: 'Usuario Demo', phone: '612345678', points: 150, level: 'Bronce' }
];

// Products
app.get('/api/products', (req, res) => {
  const { category, subcategory, brand, search, sort, limit } = req.query;
  let filtered = [...products];
  
  if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (subcategory && subcategory !== 'all') filtered = filtered.filter(p => p.subcategory === subcategory);
  if (brand) filtered = filtered.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.description.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s)
    );
  }
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  if (sort === 'reviews') filtered.sort((a, b) => b.reviews - a.reviews);
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

// Users - Login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Users - Register
app.post('/api/users/register', (req, res) => {
  const { email, password, name, phone } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  
  const newUser = {
    id: String(users.length + 1),
    email,
    password,
    name: name || '',
    phone: phone || '',
    points: 100,
    level: 'Bronce'
  };
  
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

export default app;
