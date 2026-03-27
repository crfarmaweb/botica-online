import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  image: string;
  images?: string[];
  badge?: 'new' | 'sale' | 'bestseller' | 'organic' | '2x1';
  description: string;
  descriptionFull?: string;
  points: number;
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviews: number;
  features?: string[];
  composition?: string;
  howToUse?: string;
  ageGroup?: string;
  skinType?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minPurchase?: number;
  description: string;
  expiresAt?: string;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  points: number;
  level: 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante';
  pointsToNextLevel: number;
  totalPoints: number;
  referrals: number;
  streak: number;
  achievements: Achievement[];
  joinedDate: string;
  addresses?: Address[];
  isLoggedIn: boolean;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  district: string;
  reference?: string;
  isDefault: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'purchase' | 'referral' | 'streak';
  progress: number;
  target: number;
  completed: boolean;
  reward?: string;
  expiresAt?: string;
}

export interface Order {
  id: string;
  date: string;
  deliveryDate?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  pointsEarned: number;
  shippingAddress: Address;
  paymentMethod: string;
}

interface AppContextType {
  user: User;
  cart: CartItem[];
  challenges: Challenge[];
  orders: Order[];
  categories: Category[];
  brands: Brand[];
  coupons: Coupon[];
  reviews: Review[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartDiscount: () => number;
  getCartPoints: () => number;
  getCartItemsCount: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  appliedCoupon: Coupon | null;
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  placeOrder: (address: Address, paymentMethod: string) => void;
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  login: (userData: User) => void;
  logout: () => void;
  register: (userData: { email: string; password: string; name: string; phone: string }) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  addReview: (productId: number, rating: number, comment: string) => void;
}

export const categories: Category[] = [
  {
    id: 'bebe-mama',
    name: 'Bebé y Mamá',
    icon: '👶',
    subcategories: [
      { id: 'alimentacion-bebe', name: 'Alimentación' },
      { id: 'cuidado-bebe', name: 'Cuidado' },
      { id: 'higiene-bebe', name: 'Higiene' },
      { id: 'panales', name: 'Pañales' },
      { id: 'chupetes', name: 'Chupetes' },
      { id: 'biberones', name: 'Biberones' },
    ]
  },
  {
    id: 'cosmetica-belleza',
    name: 'Cosmética y Belleza',
    icon: '💄',
    subcategories: [
      { id: 'cuidado-facial', name: 'Cuidado Facial' },
      { id: 'cuidado-corporal', name: 'Cuidado Corporal' },
      { id: 'cabello', name: 'Cabello' },
      { id: 'manos-unas', name: 'Manos y Uñas' },
      { id: 'perfumes', name: 'Perfumes' },
      { id: 'hombre', name: 'Hombre' },
      { id: 'cosmetica-natural', name: 'Cosmética Natural' },
      { id: 'maquillaje', name: 'Maquillaje' },
    ]
  },
  {
    id: 'higiene',
    name: 'Higiene',
    icon: '🧼',
    subcategories: [
      { id: 'higiene-bucal', name: 'Higiene Bucal' },
      { id: 'higiene-cabello', name: 'Higiene del Cabello' },
      { id: 'higiene-corporal', name: 'Higiene Corporal' },
      { id: 'higiene-intima', name: 'Higiene Íntima' },
      { id: 'higiene-oidos', name: 'Higiene de Oídos' },
    ]
  },
  {
    id: 'dietetica-nutricion',
    name: 'Dietética y Nutrición',
    icon: '🥗',
    subcategories: [
      { id: 'vitaminas', name: 'Vitaminas' },
      { id: 'complementos', name: 'Complementos Alimenticios' },
      { id: 'adelgazar', name: 'Adelgazar' },
      { id: 'deportistas', name: 'Deportistas' },
      { id: 'nutricosmetica', name: 'Nutricosmética' },
      { id: 'herbolario', name: 'Herbolario' },
      { id: 'diabetes', name: 'Diabetes' },
    ]
  },
  {
    id: 'medicamentos',
    name: 'Medicamentos',
    icon: '💊',
    subcategories: [
      { id: 'dolores', name: 'Dolores y Fiebre' },
      { id: 'resfriado', name: 'Resfriado y Gripe' },
      { id: 'alergia', name: 'Alergia' },
      { id: 'digestivo', name: 'Sistema Digestivo' },
      { id: 'dermatologicos', name: 'Productos Dermatológicos' },
      { id: 'oftalmicos', name: 'Productos Oftálmicos' },
    ]
  },
  {
    id: 'salud-sexual',
    name: 'Salud Sexual',
    icon: '💑',
    subcategories: [
      { id: 'anticonceptivos', name: 'Anticonceptivos' },
      { id: 'test-embarazo', name: 'Test de Embarazo' },
      { id: 'lubricantes', name: 'Lubricantes' },
      { id: 'viagra', name: 'Disfunción Eréctil' },
    ]
  },
];

export const brands: Brand[] = [
  { id: '1', name: 'La Roche-Posay', logo: 'https://via.placeholder.com/100x40?text=LRP' },
  { id: '2', name: 'Vichy', logo: 'https://via.placeholder.com/100x40?text=Vichy' },
  { id: '3', name: 'CeraVe', logo: 'https://via.placeholder.com/100x40?text=CeraVe' },
  { id: '4', name: 'Neutrogena', logo: 'https://via.placeholder.com/100x40?text=Neutrogena' },
  { id: '5', name: 'Nivea', logo: 'https://via.placeholder.com/100x40?text=Nivea' },
  { id: '6', name: 'Bioderma', logo: 'https://via.placeholder.com/100x40?text=Bioderma' },
  { id: '7', name: ' Ducray', logo: 'https://via.placeholder.com/100x40?text=Ducray' },
  { id: '8', name: 'Avene', logo: 'https://via.placeholder.com/100x40?text=Avene' },
  { id: '9', name: 'Isdin', logo: 'https://via.placeholder.com/100x40?text=Isdin' },
  { id: '10', name: 'SVR', logo: 'https://via.placeholder.com/100x40?text=SVR' },
];

export const coupons: Coupon[] = [
  { code: 'BIENVENIDO15', discount: 15, type: 'percent', description: '15% de descuento en tu primera compra' },
  { code: 'SALUD20', discount: 20, type: 'percent', minPurchase: 50, description: '20% de descuento en pedidos mayores a 50€' },
  { code: 'ENVIOGRATIS', discount: 5, type: 'fixed', minPurchase: 35, description: '5€ de descuento (envío gratis desde 35€)' },
  { code: 'PUNTOS25', discount: 25, type: 'percent', description: '25% de descuento por tus puntos' },
];

export const sampleReviews: Review[] = [
  { id: 1, productId: 1, userName: 'María G.', rating: 5, comment: 'Excelente crema, mi piel está mucho más hidratada', date: '2024-11-10', verified: true },
  { id: 2, productId: 1, userName: 'Carlos R.', rating: 4, comment: 'Muy buena, pero el precio es un poco alto', date: '2024-11-08', verified: true },
  { id: 3, productId: 2, userName: 'Ana P.', rating: 5, comment: 'El mejor analgésico, funciona muy rápido', date: '2024-11-05', verified: true },
  { id: 4, productId: 3, userName: 'Luis M.', rating: 5, comment: 'Llevo años tomándolo y me va muy bien', date: '2024-11-01', verified: true },
];

const defaultUser: User = {
  id: 1,
  name: 'David',
  email: 'david@crpharma.es',
  phone: '+34 666 123 456',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  points: 1240,
  level: 'Oro',
  pointsToNextLevel: 760,
  totalPoints: 3500,
  referrals: 3,
  streak: 7,
  joinedDate: '2024-06-15',
  addresses: [
    { id: '1', name: 'Casa', street: 'Calle Gran Vía 25', city: 'Madrid', district: 'Centro', reference: 'Bajo farmacia', isDefault: true },
    { id: '2', name: 'Trabajo', street: 'Calle Serrano 50', city: 'Madrid', district: 'Salamanca', reference: 'Oficinas', isDefault: false },
  ],
  achievements: [
    { id: 'first_purchase', title: 'Primera Compra', description: 'Realiza tu primera compra', icon: '🛒', unlocked: true, unlockedDate: '2024-06-16' },
    { id: 'points_100', title: 'Puntos de Oro', description: 'Acumula 1000 puntos', icon: '⭐', unlocked: true, unlockedDate: '2024-08-20' },
    { id: 'referral_1', title: 'Embajador', description: 'Referencia a 1 amigo', icon: '🤝', unlocked: true, unlockedDate: '2024-09-05' },
    { id: 'streak_7', title: 'Racha Semanal', description: '7 días consecutivos', icon: '🔥', unlocked: true, unlockedDate: '2024-11-10' },
    { id: 'points_5000', title: 'Veterano', description: 'Acumula 5000 puntos', icon: '🏆', unlocked: false, progress: 3500, maxProgress: 5000 },
    { id: 'referral_5', title: 'Líder', description: 'Referencia 5 amigos', icon: '👑', unlocked: false, progress: 3, maxProgress: 5 },
  ],
  isLoggedIn: true,
};

const initialChallenges: Challenge[] = [
  { id: 'daily_1', title: 'Camina 5,000 pasos', description: 'Usa tu fitbit o móvil', points: 50, type: 'daily', progress: 3500, target: 5000, completed: false, expiresAt: 'Hoy' },
  { id: 'daily_2', title: 'Bebe 2L de agua', description: 'Mantente hidratado', points: 25, type: 'daily', progress: 1, target: 2, completed: false, expiresAt: 'Hoy' },
  { id: 'weekly_1', title: 'Sin azúcares añadidos', description: 'Toda la semana', points: 200, type: 'weekly', progress: 3, target: 7, completed: false, expiresAt: 'Domingo' },
  { id: 'purchase_1', title: 'Compra skincare', description: '3 productos de cuidado facial', points: 100, type: 'purchase', progress: 1, target: 3, completed: false },
  { id: 'purchase_2', title: 'Primera compra del mes', description: 'Realiza una compra', points: 75, type: 'purchase', progress: 1, target: 1, completed: false },
  { id: 'referral_1', title: 'Invita a un amigo', description: 'Comparte tu código', points: 150, type: 'referral', progress: 0, target: 1, completed: false },
  { id: 'streak_1', title: 'Mantén la racha', description: '7 días comprando', points: 300, type: 'streak', progress: 7, target: 7, completed: true, reward: 'Badge Exclusivo' },
];

export const productsList: Product[] = [
  // Cuidado Facial
  { id: 1, name: 'Effaclar Gel Limpiador', price: 14.90, originalPrice: 18.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'La Roche-Posay', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', badge: 'sale', description: 'Gel limpiador para piel mixta a grasa', points: 15, inStock: true, stockCount: 25, rating: 4.7, reviews: 234, features: ['Control de grasa', 'No reseca', 'Testado dermatológicamente'], composition: 'Agua, Glicerina, Cocamidopropil betaína', howToUse: 'Aplicar sobre piel húmeda, massajear y enjuagar', skinType: 'Mixta a grasa' },
  { id: 2, name: 'LiftActiv Supreme Serum', price: 24.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Vichy', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop', badge: 'new', description: 'Sérum antiarrugas para pieles maduras', points: 25, inStock: true, stockCount: 15, rating: 4.5, reviews: 12, features: ['Efecto lifting', 'Reduce arrugas', 'Hidratación 24h'], composition: 'Ácido hialurónico, Vitaminas C y E', howToUse: 'Aplicar mañana y noche antes de la crema' },
  { id: 3, name: 'Hidratante Facial PM', price: 11.90, originalPrice: 14.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'CeraVe', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Hidratante con ácido hialurónico', points: 12, inStock: true, stockCount: 50, rating: 4.9, reviews: 542, features: ['Ácido hialurónico', 'Ceramidas', 'No comedogénico'], composition: 'Ácido hialurónico, Ceramidas 1,3,6-II', howToUse: 'Aplicar sobre piel limpia' },
  { id: 4, name: 'Sensibio H2O Agua Micelar', price: 12.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Bioderma', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Agua micelar para piel sensible', points: 13, inStock: true, stockCount: 40, rating: 4.8, reviews: 389, features: ['Piel sensible', 'Sin perfume', 'Hipoalergénico'], composition: 'Agua micelar, Extracto de pepino', howToUse: 'Aplicar con algodón sin aclarar' },
  { id: 5, name: 'Fusion Water SPF 50', price: 19.90, originalPrice: 24.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Isdin', image: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=500&h=500&fit=crop', badge: 'sale', description: 'Protector solar facial ultraligero SPF 50', points: 20, inStock: true, stockCount: 60, rating: 4.7, reviews: 278, features: ['SPF 50', 'Absorción inmediata', 'Resistente al agua'], composition: 'Óxido de zinc, Ácido hialurónico', howToUse: 'Aplicar 15 min antes del sol' },
  { id: 6, name: 'Cleanance Gel', price: 9.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Avene', image: 'https://images.unsplash.com/photo-1556228448-59930c2df24a?w=500&h=500&fit=crop', description: 'Gel limpiador para piel con acne', points: 10, inStock: true, stockCount: 20, rating: 4.2, reviews: 45, features: ['Piel acneica', 'Regulador de sebo', 'Calmante'], composition: 'Agua termal de Avene, Gluconato de zinc', howToUse: 'Mañana y noche' },
  { id: 7, name: 'Hydro Boost Water Gel', price: 12.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Neutrogena', image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=500&h=500&fit=crop', description: 'Gel-crema hidratante con ácido hialurónico', points: 13, inStock: true, stockCount: 35, rating: 4.6, reviews: 198, features: ['Ácido hialurónico', 'Ligera textura', 'Sin grasa'], composition: 'Ácido hialurónico de peso molecular', howToUse: 'Aplicar sobre cara y cuello' },
    
  // Cuidado Corporal
  { id: 8, name: 'Lipikar Baume AP+', price: 16.90, originalPrice: 21.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'La Roche-Posay', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&h=500&fit=crop', badge: 'sale', description: 'Bálsamo reparador para piel atópica', points: 17, inStock: true, stockCount: 30, rating: 4.9, reviews: 423, features: ['Piel atópica', 'Reparador', 'Anti-picor'], composition: 'Aqua Posae Filiformis, Mantequilla de karité', howToUse: 'Aplicar una vez al día' },
  { id: 9, name: 'Smooth Sensation Lotion', price: 7.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'Nivea', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&h=500&fit=crop', badge: '2x1', description: 'Loción corporal intensiva para piel seca', points: 8, inStock: true, stockCount: 80, rating: 4.4, reviews: 67, features: ['Deep moisture', '48h hidratación', 'absorción rápida'], composition: 'Glicerina, Almidón de tapioca', howToUse: 'Aplicar tras la ducha' },
    
  // Higiene Bucal
  { id: 11, name: 'Colgate Total 12', price: 4.90, originalPrice: 5.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Colgate', image: 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=500&h=500&fit=crop', badge: 'sale', description: 'Pasta dental 12hr protección completa', points: 5, inStock: true, stockCount: 100, rating: 4.6, reviews: 534, features: ['12hr protección', 'Antiplaca', 'Blanqueadora'], composition: 'Fluoruro de sodio, Triclosán', howToUse: 'Cepillar 2 min, 2 veces al día' },
  { id: 12, name: 'Oral-B Pro 2 2000', price: 49.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Oral-B', image: 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Cepillo eléctrico con temporizador', points: 50, inStock: true, stockCount: 18, rating: 4.8, reviews: 289, features: ['Temporizador', '3 modos', 'Batería larga duración'], composition: 'Cabezal round, Batería Li-ion', howToUse: 'Usar con pasta fluorada' },
  { id: 13, name: 'Listerine Cool Mint 500ml', price: 6.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Listerine', image: 'https://images.unsplash.com/photo-1559594861-c66710ae4c3c?w=500&h=500&fit=crop', description: 'Colutorio fresh 500ml', points: 7, inStock: true, stockCount: 45, rating: 4.5, reviews: 89, features: ['Limpieza profunda', 'Aliento fresco', 'Antiplaca'], composition: 'Eucaliptol, Mentol, Timol', howToUse: 'Enjuagar 30 seg, no aclarar' },

  // Vitaminas y Suplementos
  { id: 14, name: 'Omega 3 Premium 1000mg', price: 12.90, originalPrice: 15.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Om3ga', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=500&fit=crop', badge: 'sale', description: 'Omega 3 EPA DHA para salud cardiovascular', points: 13, inStock: true, stockCount: 60, rating: 4.8, reviews: 423, features: ['1000mg por cápsula', 'EPA+DHA', 'Sello IFOS'], composition: 'Aceite de pescado rico en omega-3', howToUse: '1 cápsula al día con comida' },
  { id: 15, name: 'Vitamina C 1000mg', price: 7.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Redoxon', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Vitamina C efervescente para inmunidad', points: 8, inStock: true, stockCount: 75, rating: 4.7, reviews: 56, features: ['1000mg', 'Efervescente', 'Naranja'], composition: 'Ácido ascórbico, Zinc', howToUse: '1 comprimido al día' },

  // Medicamentos
  { id: 19, name: 'Paracetamol 500mg', price: 2.90, category: 'medicamentos', subcategory: 'dolores', brand: 'Genérico', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Paracetamol para dolor y fiebre', points: 3, inStock: true, stockCount: 200, rating: 4.8, reviews: 567, features: ['500mg', 'Analgésico', 'Antitérmico'], composition: 'Paracetamol', howToUse: '1-2 comp cada 6 horas' },
  { id: 20, name: 'Ibuprofeno 400mg', price: 3.90, category: 'medicamentos', subcategory: 'dolores', brand: 'Genérico', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Ibuprofeno 400mg antiinflamatorio', points: 4, inStock: true, stockCount: 150, rating: 4.7, reviews: 123, features: ['400mg', 'Antiinflamatorio', 'Analgésico'], composition: 'Ibuprofeno', howToUse: '1 comp cada 6-8 horas' },

  // Bebé y Mamá
  { id: 24, name: 'Pañales Talle 4', price: 14.90, originalPrice: 18.90, category: 'bebe-mama', subcategory: 'panales', brand: 'Huggies', image: 'https://images.unsplash.com/photo-1555252333-978fe3c7e824?w=500&h=500&fit=crop', badge: 'sale', description: 'Pañales Supreme talla 4 (8-14kg)', points: 15, inStock: true, stockCount: 45, rating: 4.8, reviews: 89, features: ['Cero fugas', 'Cintura elastizada', 'Core absorbente'], composition: 'Celulosa, Polímeros superabsorbentes', howToUse: 'Cambiar cada 3-4 horas' },
  { id: 25, name: 'Leche de Inicio 1', price: 24.90, category: 'bebe-mama', subcategory: 'alimentacion-bebe', brand: 'Enfamil', image: 'https://images.unsplash.com/photo-1555252333-978fe3c7e824?w=500&h=500&fit=crop', badge: 'bestseller', description: 'Leche de inicio para bebés 0-6 meses', points: 25, inStock: true, stockCount: 30, rating: 4.9, reviews: 142, features: ['DHA', 'Hierro', 'Prebio'], composition: 'Leche descremada, Lactosa, DHA', howToUse: 'Seguir instrucciones del pediatra' },

  // Salud Sexual
  { id: 32, name: 'Parche Anticonceptivo', price: 39.90, category: 'salud-sexual', subcategory: 'anticonceptivos', brand: 'Evra', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', description: 'Parche anticonceptivo semanal', points: 40, inStock: true, stockCount: 12, rating: 4.5, reviews: 34, features: ['1 parche por semana', 'Eficaz 99%', 'Fácil uso'], composition: 'Norelgestromina, Etinilestradiol', howToUse: 'Cambiar cada semana' },
];

export const products = productsList;

const initialOrders: Order[] = [
  { id: 'ORD-001', date: '2024-11-15', deliveryDate: '2024-11-17', items: [], subtotal: 45.49, discount: 0, shipping: 0, total: 45.49, status: 'delivered', pointsEarned: 45, shippingAddress: defaultUser.addresses![0], paymentMethod: 'Tarjeta' },
  { id: 'ORD-002', date: '2024-11-20', deliveryDate: '2024-11-22', items: [], subtotal: 28.99, discount: 0, shipping: 0, total: 28.99, status: 'shipped', pointsEarned: 29, shippingAddress: defaultUser.addresses![0], paymentMethod: 'Yape' },
  { id: 'ORD-003', date: '2024-11-25', items: [], subtotal: 67.50, discount: 5, shipping: 0, total: 62.50, status: 'processing', pointsEarned: 68, shippingAddress: defaultUser.addresses![1], paymentMethod: 'Tarjeta' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = subtotal * (appliedCoupon.discount / 100);
      } else {
        discount = appliedCoupon.discount;
      }
    }
    
    const shipping = subtotal >= 35 ? 0 : 7.90;
    return subtotal - discount + shipping;
  };

  const getCartDiscount = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percent') {
      return subtotal * (appliedCoupon.discount / 100);
    }
    return appliedCoupon.discount;
  };
  
  const getCartPoints = () => cart.reduce((sum, item) => sum + item.points * item.quantity, 0);
  
  const getCartItemsCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return false;
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (coupon.minPurchase && subtotal < coupon.minPurchase) return false;
    
    setAppliedCoupon(coupon);
    return true;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addPoints = (points: number) => {
    setUser(prev => {
      const newTotal = prev.totalPoints + points;
      let newLevel = prev.level;
      let pointsToNext = prev.pointsToNextLevel;

      if (newLevel === 'Bronce' && newTotal >= 500) { newLevel = 'Plata'; pointsToNext = 1000 - (newTotal - 500); }
      else if (newLevel === 'Plata' && newTotal >= 1000) { newLevel = 'Oro'; pointsToNext = 2000 - (newTotal - 1000); }
      else if (newLevel === 'Oro' && newTotal >= 2000) { newLevel = 'Platino'; pointsToNext = 5000 - (newTotal - 2000); }
      else if (newLevel === 'Platino' && newTotal >= 5000) { newLevel = 'Diamante'; pointsToNext = 0; }
      else { pointsToNext = Math.max(0, prev.pointsToNextLevel - points); }

      return {
        ...prev,
        points: prev.points + points,
        totalPoints: newTotal,
        level: newLevel,
        pointsToNextLevel: pointsToNext,
      };
    });
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId ? { ...c, completed: true } : c
    ));
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        const completed = progress >= c.target;
        return { ...c, progress, completed };
      }
      return c;
    }));
  };

  const placeOrder = (address: Address, paymentMethod: string) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = getCartDiscount();
    const shipping = subtotal >= 35 ? 0 : 7.90;
    
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      status: 'pending',
      pointsEarned: getCartPoints(),
      shippingAddress: address,
      paymentMethod,
    };
    
    addPoints(getCartPoints());
    clearCart();
    setOrders(prev => [newOrder, ...prev]);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const login = (userData: User) => {
    setUser({ ...userData, isLoggedIn: true });
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    const defaultUserData = {
      ...defaultUser,
      isLoggedIn: false,
    };
    setUser(defaultUserData);
    localStorage.removeItem('user');
  };

  const register = async (data: { email: string; password: string; name: string; phone: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const userData = await res.json();
        login(userData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
    const currentUser = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(currentUser));
  };

  const addReview = (productId: number, rating: number, comment: string) => {
    const newReview: Review = {
      id: reviews.length + 1,
      productId,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setReviews(prev => [...prev, newReview]);
  };

  return (
    <AppContext.Provider value={{
      user,
      cart,
      challenges,
      orders,
      categories,
      brands,
      coupons,
      reviews,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartDiscount,
      getCartPoints,
      getCartItemsCount,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      addPoints,
      completeChallenge,
      updateChallengeProgress,
      placeOrder,
      favorites,
      toggleFavorite,
      login,
      logout,
      register,
      updateProfile,
      addReview,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
