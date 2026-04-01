-- =============================================
-- BOTICA ONLINE - COMPLETE DATABASE SCHEMA
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Bronce',
  total_points INTEGER DEFAULT 0,
  referrals INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  postal_code TEXT,
  reference TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  image TEXT,
  subcategories JSONB DEFAULT '[]'::jsonb
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  description_full TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  category TEXT REFERENCES categories(id),
  subcategory TEXT,
  brand TEXT REFERENCES brands(id),
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  badge TEXT,
  points INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  composition TEXT,
  how_to_use TEXT,
  age_group TEXT,
  skin_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount NUMERIC NOT NULL,
  discount_type TEXT DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  min_purchase NUMERIC DEFAULT 0,
  description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  points_earned INTEGER DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_date TIMESTAMP WITH TIME ZONE
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  product_name TEXT,
  product_image TEXT,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items table (for logged users)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('daily', 'weekly', 'purchase', 'referral', 'streak')),
  target INTEGER DEFAULT 1,
  reward TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true
);

-- User Challenges
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES challenges(id),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_required INTEGER DEFAULT 0
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id),
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DATA SEED
-- =============================================

-- Categories
INSERT INTO categories (id, name, icon, subcategories) VALUES
('bebe-mama', 'Bebé y Mama', '👶', '[{"id":"alimentacion","name":"Alimentación"},{"id":"cuidado-bebe","name":"Cuidado"},{"id":"higiene-bebe","name":"Higiene"},{"id":"panales","name":"Pañales"},{"id":"chupetes","name":"Chupetes"},{"id":"biberones","name":"Biberones"}]'),
('cosmetica-belleza', 'Cosmética y Belleza', '💄', '[{"id":"cuidado-facial","name":"Cuidado Facial"},{"id":"cuidado-corporal","name":"Cuidado Corporal"},{"id":"cabello","name":"Cabello"},{"id":"manos-unas","name":"Manos y Uñas"},{"id":"perfumes","name":"Perfumes"},{"id":"hombre","name":"Hombre"},{"id":"cosmetica-natural","name":"Natural"},{"id":"maquillaje","name":"Maquillaje"}]'),
('higiene', 'Higiene', '🧼', '[{"id":"higiene-bucal","name":"Higiene Bucal"},{"id":"higiene-cabello","name":"Cabello"},{"id":"higiene-corporal","name":"Corporal"},{"id":"higiene-intima","name":"Íntima"}]'),
('dietetica-nutricion', 'Dietética y Nutrición', '🥗', '[{"id":"vitaminas","name":"Vitaminas"},{"id":"complementos","name":"Complementos"},{"id":"adelgazar","name":"Adelgazar"},{"id":"deportistas","name":"Deportistas"},{"id":"nutricosmetica","name":"Nutricosmética"},{"id":"herbolario","name":"Herbolario"},{"id":"diabetes","name":"Diabetes"}]'),
('medicamentos', 'Medicamentos', '💊', '[{"id":"dolores","name":"Dolores y Fiebre"},{"id":"resfriado","name":"Resfriado y Gripe"},{"id":"alergia","name":"Alergia"},{"id":"digestivo","name":"Digestivo"},{"id":"dermatologicos","name":"Dermatológicos"},{"id":"oftalmicos","name":"Oftálmicos"}]'),
('salud-sexual', 'Salud Sexual', '💑', '[{"id":"anticonceptivos","name":"Anticonceptivos"},{"id":"test-embarazo","name":"Test de Embarazo"},{"id":"lubricantes","name":"Lubricantes"},{"id":"viagra","name":"Disfunción Eréctil"}]')
ON CONFLICT (id) DO NOTHING;

-- Brands
INSERT INTO brands (id, name, logo) VALUES
('1', 'La Roche-Posay', 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=200'),
('2', 'Vichy', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200'),
('3', 'CeraVe', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200'),
('4', 'Bioderma', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=200'),
('5', 'Neutrogena', 'https://images.unsplash.com/photo-1556228448-59930c2df24a?w=200'),
('6', 'Nivea', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=200'),
('7', 'Listerine', 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=200'),
('8', 'Colgate', 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=200'),
('9', 'Aquilea', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200'),
('10', 'Arkopharma', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, description, description_full, price, original_price, image, images, category, subcategory, brand, rating, reviews, stock, in_stock, badge, points, featured, composition, how_to_use) VALUES
('1', 'La Roche-Posay Effaclar Gel Limpiador', 'Gel limpiador para piel mixta a grasa', 'Gel limpiador purificante sin jabón para piel mixta a grasa. Controla el exceso de sebo mientras respeta la barrera cutánea.', 14.90, 18.90, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', '[]', 'cosmetica-belleza', 'cuidado-facial', 'La Roche-Posay', 4.7, 234, 25, true, 'sale', 15, true, 'Agua, Glicerina, Cocamidopropil betaína', 'Aplicar sobre piel húmeda, massajear y enjuagar'),
('2', 'Vichy LiftActiv Supreme Serum', 'Sérum antiarrugas para pieles maduras', 'Sérum intensivo con vitamina C y ácido hialurónico para reducir arrugas y mejorar luminosidad.', 24.90, NULL, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', '[]', 'cosmetica-belleza', 'cuidado-facial', 'Vichy', 4.5, 12, 15, true, 'new', 25, true, 'Ácido hialurónico, Vitaminas C y E', 'Aplicar mañana y noche antes de la crema'),
('3', 'CeraVe Hidratante Facial PM', 'Hidratante con ácido hialurónico', 'Crema hidratante ligera con ceramidas y ácido hialurónico para piel normal a seca.', 11.90, 14.90, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500', '[]', 'cosmetica-belleza', 'cuidado-facial', 'CeraVe', 4.9, 542, 50, true, 'bestseller', 12, true, 'Ácido hialurónico, Ceramidas', 'Aplicar sobre piel limpia'),
('4', 'Bioderma Sensibio H2O Agua Micelar', 'Agua micelar para piel sensible', 'Agua micelar biphasica que elimina maquillaje e impurezas sin irritar.', 12.90, NULL, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500', '[]', 'cosmetica-belleza', 'cuidado-facial', 'Bioderma', 4.8, 389, 40, true, 'bestseller', 13, true, 'Agua micelar, Extracto de pepino', 'Aplicar con algodón sin aclarar'),
('5', 'Isdin Fusion Water SPF 50', 'Protector solar facial ultraligero SPF 50', 'Fotoprotector transparente invisible con textura agua seca.', 19.90, 24.90, 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=500', '[]', 'cosmetica-belleza', 'cuidado-facial', 'Isdin', 4.7, 278, 60, true, 'sale', 20, true, 'Óxido de zinc, Ácido hialurónico', 'Aplicar 15 min antes del sol'),
('6', 'La Roche-Posay Lipikar Baume AP+', 'Bálsamo reparador para piel atópica', 'Bálsamo intensivo para piel seca y atópica con propiedades reparadoras.', 16.90, 21.90, 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500', '[]', 'cosmetica-belleza', 'cuidado-corporal', 'La Roche-Posay', 4.9, 423, 30, true, 'sale', 17, true, 'Aqua Posae Filiformis, Mantequilla de karité', 'Aplicar una vez al día'),
('7', 'Nivea Smooth Sensation Lotion', 'Loción corporal intensiva', 'Loción corporal de rápida absorción para piel seca.', 7.90, NULL, 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500', '[]', 'cosmetica-belleza', 'cuidado-corporal', 'Nivea', 4.4, 67, 80, true, '2x1', 8, false, 'Glicerina, Almidón de tapioca', 'Aplicar tras la ducha'),
('8', 'Colgate Total 12', 'Pasta dental 12hr protección completa', 'Pasta dental con protección 12 horas contra caries, placa y sarro.', 4.90, 5.90, 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=500', '[]', 'higiene', 'higiene-bucal', 'Colgate', 4.6, 534, 100, true, 'sale', 5, true, 'Fluoruro de sodio, Triclosán', 'Cepillar 2 min, 2 veces al día'),
('9', 'Oral-B Pro 2 2000', 'Cepillo eléctrico con temporizador', 'Cepillo eléctrico con tecnología oscilante-rotativa y temporizador.', 49.90, NULL, 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=500', '[]', 'higiene', 'higiene-bucal', 'Oral-B', 4.8, 289, 18, true, 'bestseller', 50, true, 'Cabezal round, Batería Li-ion', 'Usar con pasta fluorada'),
('10', 'Listerine Cool Mint', 'Colutorio fresh 500ml', 'Colutorio antibacterial para higiene bucal completa.', 6.90, NULL, 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=500', '[]', 'higiene', 'higiene-bucal', 'Listerine', 4.5, 89, 45, true, NULL, 7, false, 'Eucaliptol, Mentol, Timol', 'Enjuagar 30 seg, no aclarar'),
('11', 'Omega 3 Premium 1000mg', 'Omega 3 EPA DHA para salud cardiovascular', 'Suplemento de omega 3 de alta pureza para salud cardiovascular y cerebral.', 12.90, 15.90, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', '[]', 'dietetica-nutricion', 'vitaminas', 'Om3ga', 4.8, 423, 60, true, 'sale', 13, true, 'Aceite de pescado rico en omega-3', '1 cápsula al día con comida'),
('12', 'Vitamina C 1000mg Redoxon', 'Vitamina C efervescente para inmunidad', 'Comprimidos efervescentes de vitamina C con zinc para fortalecer el sistema inmune.', 7.90, NULL, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', '[]', 'dietetica-nutricion', 'vitaminas', 'Redoxon', 4.7, 56, 75, true, 'bestseller', 8, true, 'Ácido ascórbico, Zinc', '1 comprimido al día'),
('13', 'Paracetamol 500mg', 'Paracetamol para dolor y fiebre', 'Analgésico y antipirético para alivio de dolor y fiebre.', 2.90, NULL, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', '[]', 'medicamentos', 'dolores', 'Genérico', 4.8, 567, 200, true, 'bestseller', 3, true, 'Paracetamol', '1-2 comp cada 6 horas'),
('14', 'Ibuprofeno 400mg', 'Ibuprofeno 400mg antiinflamatorio', 'Antiinflamatorio no esteroideo para dolor e inflamación.', 3.90, NULL, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', '[]', 'medicamentos', 'dolores', 'Genérico', 4.7, 123, 150, true, 'bestseller', 4, true, 'Ibuprofeno', '1 comp cada 6-8 horas'),
('15', 'Huggies Pañales Talle 4', 'Pañales Supreme talla 4 (8-14kg)', 'Pañales con tecnología de absorción rápida y ajuste cómodo.', 14.90, 18.90, 'https://images.unsplash.com/photo-1555252333-978fe3c7e824?w=500', '[]', 'bebe-mama', 'panales', 'Huggies', 4.8, 89, 45, true, 'sale', 15, true, 'Celulosa, Polímeros superabsorbentes', 'Cambiar cada 3-4 horas'),
('16', 'Enfamil Leche de Inicio 1', 'Leche de inicio para bebés 0-6 meses', 'Fórmula infantil para lactantes desde el nacimiento hasta 6 meses.', 24.90, NULL, 'https://images.unsplash.com/photo-1555252333-978fe3c7e824?w=500', '[]', 'bebe-mama', 'alimentacion', 'Enfamil', 4.9, 142, 30, true, 'bestseller', 25, true, 'Leche descremada, Lactosa, DHA', 'Seguir instrucciones del pediatra'),
('17', 'Evra Parche Anticonceptivo', 'Parche anticonceptivo semanal', 'Parche transdérmico anticonceptivo con eficacia del 99%.', 39.90, NULL, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', '[]', 'salud-sexual', 'anticonceptivos', 'Evra', 4.5, 34, 12, true, NULL, 40, true, 'Norelgestromina, Etinilestradiol', 'Cambiar cada semana'),
('18', 'Durex Preservativos Classic', 'Caja de 12 preservativos', 'Preservativos lubricados de látex natural.', 9.50, 12.90, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', '[]', 'salud-sexual', 'anticonceptivos', 'Durex', 4.5, 3456, 150, true, 'sale', 10, true, 'Látex de caucho natural', 'Usar antes de la relación'),
('19', 'Clearblue Test de Embarazo', 'Test de embarazo digital', 'Test de embarazo digital con indicador de semanas.', 14.90, NULL, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', '[]', 'salud-sexual', 'test-embarazo', 'Clearblue', 4.7, 2134, 40, true, NULL, 15, true, 'Detección de hormona hCG', 'Seguir instrucciones del paquete')
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO coupons (code, discount, discount_type, min_purchase, description, expires_at, active) VALUES
('BIENVENIDO15', 15, 'percent', 50, '15% de descuento en tu primera compra', NULL, true),
('SALUD20', 20, 'percent', 50, '20% de descuento en pedidos mayores a 50€', NULL, true),
('ENVIOGRATIS', 5, 'fixed', 35, '5€ de descuento (envío gratis desde 35€)', NULL, true),
('PUNTOS25', 25, 'percent', 0, '25% de descuento por tus puntos', NULL, true)
ON CONFLICT (code) DO NOTHING;

-- Challenges
INSERT INTO challenges (id, title, description, points, type, target, reward, active) VALUES
('daily_1', 'Camina 5,000 pasos', 'Usa tu fitbit o móvil', 50, 'daily', 5000, NULL, true),
('daily_2', 'Bebe 2L de agua', 'Mantente hidratado', 25, 'daily', 2, NULL, true),
('weekly_1', 'Sin azúcares añadidos', 'Toda la semana', 200, 'weekly', 7, NULL, true),
('purchase_1', 'Compra skincare', '3 productos de cuidado facial', 100, 'purchase', 3, NULL, true),
('purchase_2', 'Primera compra del mes', 'Realiza una compra', 75, 'purchase', 1, NULL, true),
('referral_1', 'Invita a un amigo', 'Comparte tu código', 150, 'referral', 1, NULL, true),
('streak_1', 'Mantén la racha', '7 días comprando', 300, 'streak', 7, 'Badge Exclusivo', true)
ON CONFLICT (id) DO NOTHING;

-- Achievements
INSERT INTO achievements (id, title, description, icon, points_required) VALUES
('first_purchase', 'Primera Compra', 'Realiza tu primera compra', '🛒', 0),
('points_100', 'Puntos de Oro', 'Acumula 1000 puntos', '⭐', 1000),
('points_5000', 'Veterano', 'Acumula 5000 puntos', '🏆', 5000),
('referral_1', 'Embajador', 'Referencia a 1 amigo', '🤝', 1),
('referral_5', 'Líder', 'Referencia 5 amigos', '👑', 5),
('streak_7', 'Racha Semanal', '7 días consecutivos', '🔥', 7)
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for simplicity (configure later for security)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;

SELECT 'Database setup complete!' as result;