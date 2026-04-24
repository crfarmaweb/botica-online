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
  color: string;
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
  id: string | number;
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
  categoriesLoading: boolean;
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
  showCartNotification: { show: boolean; productName: string; };
  hideCartNotification: () => void;
}

export const categories: Category[] = [
  {
    id: 'bebe-mama',
    name: 'Bebé y Mamá',
    icon: '👶',
    color: '#E8B4BC',
    subcategories: [
      { id: 'alimentacion-bebe', name: 'Alimentación' },
      { id: 'cuidado-bebe', name: 'Cuidado del Bebé' },
      { id: 'higiene-bebe', name: 'Higiene' },
      { id: 'panales', name: 'Pañales' },
      { id: 'chupetes', name: 'Chupetes y Tetinas' },
      { id: 'biberones', name: 'Biberones' },
      { id: 'lactancia', name: 'Lactancia Materna' },
      { id: 'seguridad-bebe', name: 'Seguridad' },
    ]
  },
  {
    id: 'cosmetica-belleza',
    name: 'Cosmética y Belleza',
    icon: '💄',
    color: '#D4A5A5',
    subcategories: [
      { id: 'cuidado-facial', name: 'Cuidado Facial' },
      { id: 'cuidado-corporal', name: 'Cuidado Corporal' },
      { id: 'cabello', name: 'Cabello' },
      { id: 'manos-unas', name: 'Manos y Uñas' },
      { id: 'perfumes', name: 'Perfumes' },
      { id: 'hombre', name: 'Cuidado del Hombre' },
      { id: 'cosmetica-natural', name: 'Cosmética Natural' },
      { id: 'maquillaje', name: 'Maquillaje' },
    ]
  },
  {
    id: 'higiene',
    name: 'Higiene',
    icon: '🧼',
    color: '#A8D8EA',
    subcategories: [
      { id: 'higiene-bucal', name: 'Higiene Bucal' },
      { id: 'higiene-cabello', name: 'Higiene del Cabello' },
      { id: 'higiene-corporal', name: 'Higiene Corporal' },
      { id: 'higiene-intima', name: 'Higiene Íntima' },
      { id: 'higiene-oidos', name: 'Higiene de Oídos' },
      { id: 'desodorantes', name: 'Desodorantes' },
    ]
  },
  {
    id: 'dietetica-nutricion',
    name: 'Dietética y Nutrición',
    icon: '🥗',
    color: '#B5D89A',
    subcategories: [
      { id: 'vitaminas', name: 'Vitaminas' },
      { id: 'complementos', name: 'Complementos Alimenticios' },
      { id: 'adelgazar', name: 'Adelgazar' },
      { id: 'deportistas', name: 'Deportistas' },
      { id: 'nutricosmetica', name: 'Nutricosmética' },
      { id: 'herbolario', name: 'Herbolario' },
      { id: 'diabetes', name: 'Diabetes' },
      { id: 'deportes', name: 'Nutrición Deportiva' },
    ]
  },
  {
    id: 'medicamentos',
    name: 'Medicamentos',
    icon: '💊',
    color: '#E8A8A8',
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
    color: '#C9B1D9',
    subcategories: [
      { id: 'anticonceptivos', name: 'Anticonceptivos' },
      { id: 'test-embarazo', name: 'Test de Embarazo' },
      { id: 'lubricantes', name: 'Lubricantes' },
      { id: 'viagra', name: 'Disfunción Eréctil' },
    ]
  },
  {
    id: 'optica',
    name: 'Óptica',
    icon: '👓',
    color: '#B8C5D6',
    subcategories: [
      { id: 'gafas-sol', name: 'Gafas de Sol' },
      { id: 'gafas-vista', name: 'Gafas de Ver' },
      { id: 'lentillas', name: 'Lentillas' },
      { id: 'liquidos-lentillas', name: 'Líquidos de Lentillas' },
      { id: 'colirios', name: 'Colirios y Lágrimas' },
      { id: 'accesorios-optica', name: 'Accesorios' },
    ]
  },
  {
    id: 'ortopedia',
    name: 'Ortopedia',
    icon: '🦴',
    color: '#E8D4A8',
    subcategories: [
      { id: 'movilidad', name: 'Movilidad' },
      { id: 'fajas', name: 'Fajas y Bragueros' },
      { id: 'calzado', name: 'Calzado Ortopédico' },
      { id: 'ayudas-tecnicas', name: 'Ayudas Técnicas' },
      { id: 'plantillas', name: 'Plantillas' },
      { id: 'rehabilitacion', name: 'Rehabilitación' },
    ]
  },
  {
    id: 'fitoterapia',
    name: 'Fitoterapia',
    icon: '🌿',
    color: '#B8D4B8',
    subcategories: [
      { id: 'plantas-medicinales', name: 'Plantas Medicinales' },
      { id: 'infusiones', name: 'Infusiones' },
      { id: 'aceites-esenciales', name: 'Aceites Esenciales' },
      { id: 'gemoterapia', name: 'Gemoterapia' },
      { id: 'flores-bach', name: 'Flores de Bach' },
    ]
  },
  {
    id: 'mascotas',
    name: 'Mascotas',
    icon: '🐾',
    color: '#C5D4B8',
    subcategories: [
      { id: 'perros', name: 'Perros' },
      { id: 'gatos', name: 'Gatos' },
      { id: 'alimentacion-mascota', name: 'Alimentación' },
      { id: 'salud-mascota', name: 'Salud y Bienestar' },
      { id: 'higiene-mascota', name: 'Higiene' },
      { id: 'accesorios-mascota', name: 'Accesorios' },
    ]
  },
  {
    id: 'solar',
    name: 'Protección Solar',
    icon: '☀️',
    color: '#F5D6A5',
    subcategories: [
      { id: 'solar-facial', name: 'Solar Facial' },
      { id: 'solar-corporal', name: 'Solar Corporal' },
      { id: 'solar-pediatrico', name: 'Solar Pediátrico' },
      { id: 'solar-capilar', name: 'Solar Capilar' },
      { id: 'after-sun', name: 'After Sun' },
      { id: 'autobronceantes', name: 'Autobronceantes' },
    ]
  },
  {
    id: 'primeros-auxilios',
    name: 'Primeros Auxilios',
    icon: '🩹',
    color: '#EF4444',
    subcategories: [
      { id: 'vendajes', name: 'Vendajes' },
      { id: 'gasas', name: 'Gasas y Algodón' },
      { id: 'antisepticos', name: 'Antisépticos' },
      { id: 'tiritas', name: 'Tiritas y Apósitos' },
      { id: 'termometros', name: 'Termómetros' },
      { id: 'botiquin', name: 'Botiquín' },
    ]
  },
];

export const brands: Brand[] = [
  { id: '1', name: 'La Roche-Posay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/La_Roche-Posay_2016.svg/200px-La_Roche-Posay_2016.svg.png' },
  { id: '2', name: 'Vichy', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vichy_logo.svg/200px-Vichy_logo.svg.png' },
  { id: '3', name: 'CeraVe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CeraVe_logo.svg/200px-CeraVe_logo.svg.png' },
  { id: '4', name: 'Bioderma', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bioderma_logo.svg/200px-Bioderma_logo.svg.png' },
  { id: '5', name: 'Isdin', logo: 'https://www.isdin.com/img/common/logo-isdin.png' },
  { id: '6', name: 'Avene', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Av%C3%A8ne_logo.svg/200px-Av%C3%A8ne_logo.svg.png' },
  { id: '7', name: 'SVR', logo: 'https://www.svr.com/wp-content/uploads/2020/11/logo-svr.png' },
  { id: '8', name: 'Nivea', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/NIVEA_logo.svg/200px-NIVEA_logo.svg.png' },
  { id: '9', name: 'Eucerin', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Eucerin_logo.svg/200px-Eucerin_logo.svg.png' },
  { id: '10', name: 'Heliocare', logo: 'https://www.heliocare.com/wp-content/uploads/2020/03/logo-heliocare.png' },
  { id: '11', name: 'Martiderm', logo: 'https://martiderm.com/wp-content/uploads/2021/02/logo.png' },
  { id: '12', name: 'Oral-B', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Oral-B_logo.svg/200px-Oral-B_logo.svg.png' },
  { id: '13', name: 'Colgate', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Colgate-Palmolive_Company_logo.svg/200px-Colgate-Palmolive_Company_logo.svg.png' },
  { id: '14', name: 'Listerine', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Listerine_logo.svg/200px-Listerine_logo.svg.png' },
  { id: '15', name: 'Fluocaril', logo: 'https://www.fluocaril.es/sites/default/files/logo-fluocaril.png' },
  { id: '16', name: 'Huggies', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Huggies_logo.svg/200px-Huggies_logo.svg.png' },
  { id: '17', name: 'Chicco', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Chicco_logo.svg/200px-Chicco_logo.svg.png' },
  { id: '18', name: 'Medela', logo: 'https://www.medela.com/static/logos/medela-logo-2022.svg' },
  { id: '19', name: 'Om3ga', logo: 'https://www.om3ga.com/img/logo.png' },
  { id: '20', name: 'Redoxon', logo: 'https://www.redoxon.es/static/img/logo.png' },
  { id: '21', name: 'Arkopharma', logo: 'https://www.arkopharma.com/wp-content/uploads/2020/10/logo-arkopharma.png' },
  { id: '22', name: 'Aquilea', logo: 'https://www.aquilea.com/wp-content/uploads/2021/03/logo-aquilea.png' },
  { id: '23', name: 'Phyto', logo: 'https://www.phyto.fr/wp-content/uploads/2021/01/logo-phyto.png' },
  { id: '24', name: 'Kérastase', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/K%C3%A9rastase_2016.svg/200px-K%C3%A9rastase_2016.svg.png' },
  { id: '25', name: 'Genérico', logo: 'https://via.placeholder.com/100x40?text=Generic' },
  { id: '26', name: 'Alergin', logo: 'https://www.alergin.es/img/logo.png' },
  { id: '27', name: 'Evra', logo: 'https://www.evra.com/img/logo-evra.png' },
  { id: '28', name: 'Clearblue', logo: 'https://www.clearblue.com/img/clearblue-logo.png' },
  { id: '29', name: 'Salus', logo: 'https://www.salus.es/static/img/logo.svg' },
  { id: '30', name: 'Cinfa', logo: 'https://www.cinfa.com/img/cinfa-logo.png' },
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
  id: 'guest',
  name: 'Invitado',
  email: '',
  phone: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  points: 0,
  level: 'Bronce',
  pointsToNextLevel: 500,
  totalPoints: 0,
  referrals: 0,
  streak: 0,
  joinedDate: new Date().toISOString().split('T')[0],
  addresses: [],
  achievements: [],
  isLoggedIn: false,
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
  // Cuidado Facial - La Roche-Posay
  { id: 1, name: 'Effaclar Gel Limpiador Purificante', price: 14.90, originalPrice: 18.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'La Roche-Posay', image: 'https://www.laroche-posay.es/-/media/lrp/shop-products/effaclar/gel-limpiador-purificante-200ml.png', badge: 'sale', description: 'Gel limpiador purificante para piel mixta o grasa', points: 15, inStock: true, stockCount: 45, rating: 4.7, reviews: 234, features: ['Control de grasa', 'No reseca', 'Testado dermatológicamente'], composition: 'Agua, Glicerina, Cocamidopropil betaína', howToUse: 'Aplicar sobre piel húmeda, masajear y enjuagar', skinType: 'Mixta a grasa' },
  { id: 2, name: 'Anthelios UVMUNE 400 SPF 50+', price: 24.90, originalPrice: 29.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'La Roche-Posay', image: 'https://www.laroche-posay.es/-/media/lrp/shop-products/anthelios/uvmune-400-fluid-50ml.png', badge: 'sale', description: 'Protector solar facial FPS 50+ resistente al agua', points: 25, inStock: true, stockCount: 80, rating: 4.9, reviews: 567, features: ['SPF 50+', 'Resistente agua', 'Antiedad'], composition: 'Mexoryl 400, Ácido hialurónico', howToUse: 'Aplicar 15 min antes de la exposición solar' },
  { id: 3, name: 'Lipikar Baume AP+', price: 16.90, originalPrice: 21.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'La Roche-Posay', image: 'https://www.laroche-posay.es/-/media/lrp/shop-products/lipikar/baume-ap-masparat.png', badge: 'sale', description: 'Bálsamo reparador para piel atópica', points: 17, inStock: true, stockCount: 30, rating: 4.9, reviews: 423, features: ['Piel atópica', 'Reparador', 'Anti-picor'], composition: 'Aqua Posae Filiformis, Mantequilla de karité', howToUse: 'Aplicar una vez al día' },

  // Vichy
  { id: 4, name: 'LiftActiv Supreme Serum', price: 24.90, originalPrice: 32.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Vichy', image: 'https://www.vichy.es/-/media/vichy/products/liftactiv-supreme-serum.png', badge: 'sale', description: 'Sérum antiarrugas para pieles maduras', points: 25, inStock: true, stockCount: 25, rating: 4.5, reviews: 89, features: ['Efecto lifting', 'Reduce arrugas', 'Hidratación 24h'], composition: 'Ácido hialurónico, Vitaminas C y E', howToUse: 'Aplicar mañana y noche' },
  { id: 5, name: 'Capital Soleil FPS 50+', price: 19.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Vichy', image: 'https://www.vichy.es/-/media/vichy/products/capital-soleil-fluid.png', badge: 'new', description: 'Protector solar corporal SPF 50+', points: 20, inStock: true, stockCount: 60, rating: 4.7, reviews: 234, features: ['SPF 50+', 'Resistente al agua', 'Sin parabenos'], composition: 'Óxido de zinc, Vitaminas', howToUse: 'Aplicar antes de exponerse al sol' },

  // CeraVe
  { id: 6, name: 'Hidratante Facial PM', price: 11.90, originalPrice: 14.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'CeraVe', image: 'https://www.cerave.es/-/media/cerave/hydrating-facial-moisturizer-pm.png', badge: 'sale', description: 'Hidratante con ácido hialurónico', points: 12, inStock: true, stockCount: 50, rating: 4.9, reviews: 542, features: ['Ácido hialurónico', 'Ceramidas', 'No comedogénico'], composition: 'Ácido hialurónico, Ceramidas 1,3,6-II', howToUse: 'Aplicar sobre piel limpia' },
  { id: 7, name: 'Gel Limpiador Hidratante', price: 9.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'CeraVe', image: 'https://www.cerave.es/-/media/cerave/hydrating-cleanser.png', badge: 'bestseller', description: 'Gel limpiador sin espuma para piel seca', points: 10, inStock: true, stockCount: 40, rating: 4.8, reviews: 389, features: ['Hidratante', 'Sin fragancia', 'pH equilibrado'], composition: 'Glicerina, Ceramidas', howToUse: 'Aplicar sobre piel húmeda' },

  // Bioderma
  { id: 8, name: 'Sensibio H2O Agua Micelar', price: 12.90, originalPrice: 15.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Bioderma', image: 'https://www.bioderma.com/wp-content/uploads/2021/01/sensibio-h2o.png', badge: 'sale', description: 'Agua micelar para piel sensible', points: 13, inStock: true, stockCount: 65, rating: 4.8, reviews: 789, features: ['Piel sensible', 'Sin perfume', 'Hipoalergénico'], composition: 'Agua micelar, Extracto de pepino', howToUse: 'Aplicar con algodón sin aclarar' },
  { id: 9, name: 'Photoderm MAX SPF 50+', price: 22.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Bioderma', image: 'https://www.bioderma.com/wp-content/uploads/2021/01/photoderm-max.png', badge: 'new', description: 'Protector solar SPF 50+ con células madre', points: 23, inStock: true, stockCount: 35, rating: 4.6, reviews: 156, features: ['SPF 50+', 'Cellular Shield', 'Resistente agua'], composition: 'Cellular Biological Shield', howToUse: 'Aplicar均匀mente antes sol' },

  // Isdin
  { id: 10, name: 'Fusion Water SPF 50', price: 19.90, originalPrice: 24.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Isdin', image: 'https://www.isdin.com/img/productos/fusion-water.png', badge: 'sale', description: 'Protector solar facial ultraligero SPF 50', points: 20, inStock: true, stockCount: 60, rating: 4.7, reviews: 278, features: ['SPF 50', 'Absorción inmediata', 'Resistente al agua'], composition: 'Óxido de zinc, Ácido hialurónico', howToUse: 'Aplicar 15 min antes del sol' },
  { id: 11, name: 'Erytast Gel', price: 14.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Isdin', image: 'https://www.isdin.com/img/productos/erytast.png', badge: 'new', description: 'Gel calmante para rojeces', points: 15, inStock: true, stockCount: 25, rating: 4.4, reviews: 89, features: ['Calmante', 'Antirojeces', 'Tolerancia alta'], composition: 'Sulfato de cobre, Zinc', howToUse: 'Aplicar mañana y noche' },

  // Avene
  { id: 12, name: 'Cleanance Gel', price: 9.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Avene', image: 'https://www.avene.es/wp-content/uploads/cleanance-gel.png', badge: 'bestseller', description: 'Gel limpiador para piel con acne', points: 10, inStock: true, stockCount: 40, rating: 4.2, reviews: 145, features: ['Piel acneica', 'Regulador de sebo', 'Calmante'], composition: 'Agua termal de Avene, Gluconato de zinc', howToUse: 'Mañana y noche' },
  { id: 13, name: 'Xeracalm A.D Crema', price: 17.90, originalPrice: 22.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'Avene', image: 'https://www.avene.es/wp-content/uploads/xeracalm-crema.png', badge: 'sale', description: 'Crema emoliente para piel muy seca', points: 18, inStock: true, stockCount: 30, rating: 4.8, reviews: 234, features: ['Emoliente', 'Restauradora', 'Sin perfume'], composition: 'I-modulia, Agua termal', howToUse: 'Aplicar 2 veces al día' },

  // SVR
  { id: 14, name: 'Cicalfate Crema Reparadora', price: 15.90, originalPrice: 19.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'SVR', image: 'https://www.svr.com/wp-content/uploads/cicalfate-cream.png', badge: 'sale', description: 'Crema reparadora para irritaciones', points: 16, inStock: true, stockCount: 35, rating: 4.7, reviews: 189, features: ['Reparadora', 'Antibacteriana', ' Cicatrizante'], composition: 'Cobre, Zinc, Sucralfato', howToUse: 'Aplicar sobre piel limpia' },
  { id: 15, name: 'Sepicontrol Serum', price: 22.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'SVR', image: 'https://www.svr.com/wp-content/uploads/sepicontrol.png', badge: 'new', description: 'Sérum matificante para piel grasa', points: 23, inStock: true, stockCount: 20, rating: 4.5, reviews: 78, features: ['Matificante', 'Anti-brillos', 'Anti-imperfecciones'], composition: 'Ácido salicílico, Zinc', howToUse: 'Aplicar mañana y noche' },

  // Higiene Bucal
  { id: 16, name: 'Colgate Total 12 Pasta Dental', price: 4.90, originalPrice: 5.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Colgate', image: 'https://www.colgate.com/-/media/colgate/2022/total-12/total-12-toothpaste-75ml.png', badge: 'sale', description: 'Pasta dental 12hr protección completa', points: 5, inStock: true, stockCount: 120, rating: 4.6, reviews: 534, features: ['12hr protección', 'Antiplaca', 'Blanqueadora'], composition: 'Fluoruro de sodio, Triclosán', howToUse: 'Cepillar 2 min, 2 veces al día' },
  { id: 17, name: 'Oral-B Pro 2 2000', price: 49.90, originalPrice: 59.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Oral-B', image: 'https://www.oralb.com/es/-/media/oral-b/products/electric-toothbrushes/pro-2-2000.png', badge: 'sale', description: 'Cepillo eléctrico con temporizador', points: 50, inStock: true, stockCount: 18, rating: 4.8, reviews: 289, features: ['Temporizador', '3 modos', 'Batería larga duración'], composition: 'Cabezal round, Batería Li-ion', howToUse: 'Usar con pasta fluorada' },
  { id: 18, name: 'Listerine Cool Mint 500ml', price: 6.90, originalPrice: 8.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Listerine', image: 'https://www.listerine.com/-/media/listerine/products/cool-mint-500ml.png', badge: 'sale', description: 'Colutorio fresh 500ml', points: 7, inStock: true, stockCount: 45, rating: 4.5, reviews: 189, features: ['Limpieza profunda', 'Aliento fresco', 'Antiplaca'], composition: 'Eucaliptol, Mentol, Timol', howToUse: 'Enjuagar 30 seg, no aclarar' },
  { id: 19, name: 'Fluocaril Bifluor 145 Pasta', price: 5.90, category: 'higiene', subcategory: 'higiene-bucal', brand: 'Fluocaril', image: 'https://www.fluocaril.es/media/catalog/product/f/f/fluocaril-bifluor-145.jpg', badge: 'bestseller', description: 'Pasta dental anticaries 145ppm flúor', points: 6, inStock: true, stockCount: 80, rating: 4.4, reviews: 234, features: ['Anticaries', '145ppm flúor', 'Protección duradera'], composition: 'Fluoruro de sodio, Xilitol', howToUse: 'Cepillar dientes después de cada comida' },

  // Bebé y Mamá
  { id: 20, name: 'Pañales Huggies Talle 4', price: 14.90, originalPrice: 18.90, category: 'bebe-mama', subcategory: 'panales', brand: 'Huggies', image: 'https://www.huggies.com/-/media/huggies/diapers/talle-4/huggies-diaper-t4.png', badge: 'sale', description: 'Pañales Supreme talla 4 (8-14kg)', points: 15, inStock: true, stockCount: 45, rating: 4.8, reviews: 189, features: ['Cero fugas', 'Cintura elastizada', 'Core absorbente'], composition: 'Celulosa, Polímeros superabsorbentes', howToUse: 'Cambiar cada 3-4 horas' },
  { id: 21, name: 'Chicco Botella Cristal 330ml', price: 12.90, category: 'bebe-mama', subcategory: 'biberones', brand: 'Chicco', image: 'https://www.chicco.com/-/media/chicco/biberones/botella-cristal-330ml.png', badge: 'new', description: 'Biberón de cristal 330ml con tetina', points: 13, inStock: true, stockCount: 25, rating: 4.6, reviews: 78, features: ['Cristal de borosilicato', 'Tetina fisiológica', 'A prueba de roturas'], composition: 'Vidrio de borosilicato, Silicona', howToUse: 'Lavar antes del primer uso' },
  { id: 22, name: 'Medela Sacaleches Eléctrico', price: 89.90, originalPrice: 119.90, category: 'bebe-mama', subcategory: 'lactancia', brand: 'Medela', image: 'https://www.medela.com/-/media/medela/products/breastpumps/swing.png', badge: 'sale', description: 'Sacaleches eléctrico doble membrana', points: 90, inStock: true, stockCount: 8, rating: 4.9, reviews: 156, features: ['2 fases', 'Doble extracción', 'Cómodo'], composition: 'Polipropileno, Silicona médica', howToUse: 'Seguir instrucciones del fabricante' },

  // Vitaminas y Suplementos
  { id: 23, name: 'Omega 3 Premium 1000mg', price: 12.90, originalPrice: 15.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Om3ga', image: 'https://www.omega-3.com.es/img/omega-3-premium.png', badge: 'sale', description: 'Omega 3 EPA DHA para salud cardiovascular', points: 13, inStock: true, stockCount: 60, rating: 4.8, reviews: 423, features: ['1000mg por cápsula', 'EPA+DHA', 'Sello IFOS'], composition: 'Aceite de pescado rico en omega-3', howToUse: '1 cápsula al día con comida' },
  { id: 24, name: 'Vitamina C 1000mg Redoxon', price: 7.90, originalPrice: 9.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Redoxon', image: 'https://www.redoxon.es/img/productos/reboxon-1000.png', badge: 'sale', description: 'Vitamina C efervescente para inmunidad', points: 8, inStock: true, stockCount: 75, rating: 4.7, reviews: 234, features: ['1000mg', 'Efervescente', 'Naranja'], composition: 'Ácido ascórbico, Zinc', howToUse: '1 comprimido al día' },
  { id: 25, name: 'Arkocaps Magnesio', price: 9.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Arkopharma', image: 'https://www.arkocaps.es/img/magnesio.png', badge: 'bestseller', description: 'Complemento de Magnesio 300mg', points: 10, inStock: true, stockCount: 45, rating: 4.5, reviews: 167, features: ['Magnesio natural', 'Vegetal', 'Alta absorción'], composition: 'Magnesio marino', howToUse: '2 cápsulas al día' },
  { id: 26, name: 'Aquilea Sueño 30 sobres', price: 12.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Aquilea', image: 'https://www.aquilea.com/img/aquilea-sueno.png', badge: 'new', description: 'Ayuda a dormirte rápido y bien', points: 13, inStock: true, stockCount: 30, rating: 4.6, reviews: 123, features: ['Melatonina', 'Valeriana', 'Pasiflora'], composition: 'Melatonina, Extractos de plantas', howToUse: '1 sobre 30 min antes de dormir' },

  // Higiene - Cabello
  { id: 27, name: 'Phyto Phytocycle Champú', price: 18.90, category: 'higiene', subcategory: 'higiene-cabello', brand: 'Phyto', image: 'https://www.phyto.fr/img/champu-phytocycle.png', badge: 'new', description: 'Champú revitalizante fortalecedor', points: 19, inStock: true, stockCount: 20, rating: 4.4, reviews: 67, features: ['Revitalizante', 'Fortalecedor', 'Sin sulfatos'], composition: 'Extracto de bardana, Quinine', howToUse: 'Aplicar sobre cabello húmedo' },
  { id: 28, name: 'Kérastase Genesis Champú', price: 24.90, originalPrice: 29.90, category: 'higiene', subcategory: 'higiene-cabello', brand: 'Kérastase', image: 'https://www.kerastase.com/img/genesis-champu.png', badge: 'sale', description: 'Champú reforzante anticaída', points: 25, inStock: true, stockCount: 25, rating: 4.7, reviews: 189, features: ['Anticaída', 'Fortalecedor', 'Nutritivo'], composition: ' Células madre de bardana', howToUse: 'Masajear scalp y enjuagar' },

  // Medicamentos
  { id: 29, name: 'Paracetamol 500mg', price: 2.90, category: 'medicamentos', subcategory: 'dolores', brand: 'Genérico', image: 'https://www.cinfa.com/img/productos/paracetamol-500mg.png', badge: 'bestseller', description: 'Paracetamol para dolor y fiebre', points: 3, inStock: true, stockCount: 200, rating: 4.8, reviews: 567, features: ['500mg', 'Analgésico', 'Antitérmico'], composition: 'Paracetamol', howToUse: '1-2 comp cada 6 horas' },
  { id: 30, name: 'Ibuprofeno 400mg', price: 3.90, category: 'medicamentos', subcategory: 'dolores', brand: 'Genérico', image: 'https://www.cinfa.com/img/productos/ibuprofeno-400mg.png', badge: 'bestseller', description: 'Ibuprofeno 400mg antiinflamatorio', points: 4, inStock: true, stockCount: 150, rating: 4.7, reviews: 234, features: ['400mg', 'Antiinflamatorio', 'Analgésico'], composition: 'Ibuprofeno', howToUse: '1 comp cada 6-8 horas' },
  { id: 31, name: 'Alergin Polen 10mg', price: 8.90, category: 'medicamentos', subcategory: 'alergia', brand: 'Alergin', image: 'https://www.alergin.es/img/alergin-polen.png', badge: 'new', description: 'Antihistamínico para alergias estacionales', points: 9, inStock: true, stockCount: 35, rating: 4.5, reviews: 123, features: ['Alivio 24h', 'No sueño', '1 diario'], composition: 'Cetirizina', howToUse: '1 comprimido al día' },

  // Salud Sexual
  { id: 32, name: 'Evra Parche Anticonceptivo', price: 39.90, originalPrice: 49.90, category: 'salud-sexual', subcategory: 'anticonceptivos', brand: 'Evra', image: 'https://www.evra.com/img/parche-anticonceptivo.png', badge: 'sale', description: 'Parche anticonceptivo semanal', points: 40, inStock: true, stockCount: 12, rating: 4.5, reviews: 89, features: ['1 parche por semana', 'Eficaz 99%', 'Fácil uso'], composition: 'Norelgestromina, Etinilestradiol', howToUse: 'Cambiar cada semana' },
  { id: 33, name: 'Clearblue Test Embarazo', price: 12.90, category: 'salud-sexual', subcategory: 'test-embarazo', brand: 'Clearblue', image: 'https://www.clearblue.com/img/clearblue-pregnancy-test.png', badge: 'bestseller', description: 'Test de embarazo digital avanzado', points: 13, inStock: true, stockCount: 40, rating: 4.9, reviews: 345, features: ['Resultado digital', 'Semanas desde concepción', 'Precisión 99%'], composition: 'Tira reactiva', howToUse: 'Seguir instrucciones del test' },

  // Fitoterapia
  { id: 34, name: 'Arkocaps Valorón 50 caps', price: 14.90, originalPrice: 18.90, category: 'dietetica-nutricion', subcategory: 'herbolario', brand: 'Arkopharma', image: 'https://www.arkocaps.es/img/valeriana.png', badge: 'sale', description: 'Valeriana para relajación y sueño', points: 15, inStock: true, stockCount: 30, rating: 4.6, reviews: 234, features: ['100% vegetal', 'Relajante', 'Sin efectos secundarios'], composition: 'Valeriana officinalis', howToUse: '2 cápsulas antes de dormir' },
  { id: 35, name: 'Salus Floradix 500ml', price: 24.90, category: 'dietetica-nutricion', subcategory: 'vitaminas', brand: 'Salus', image: 'https://www.salus.es/img/floradix.png', badge: 'bestseller', description: 'Jarabe de hierro y vitaminas', points: 25, inStock: true, stockCount: 20, rating: 4.8, reviews: 189, features: ['Hierro líquido', 'Fácil absorción', 'Sin gluten'], composition: 'Hierro, Vitaminas B, Espino blanco', howToUse: '10ml al día antes del desayuno' },

  // Corporal
  { id: 36, name: 'Nivea Body Intensive Loción', price: 7.90, originalPrice: 9.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'Nivea', image: 'https://www.nivea.com/-/media/nivea/body-lotion-intensive.png', badge: 'sale', description: 'Loción corporal intensiva para piel seca', points: 8, inStock: true, stockCount: 80, rating: 4.4, reviews: 167, features: ['Deep moisture', '48h hidratación', 'Absorción rápida'], composition: 'Glicerina, Almidón de tapioca', howToUse: 'Aplicar tras la ducha' },
  { id: 37, name: 'Eucerin UreaRepair 10%', price: 14.90, originalPrice: 18.90, category: 'cosmetica-belleza', subcategory: 'cuidado-corporal', brand: 'Eucerin', image: 'https://www.eucerin.com/-/media/eucerin/urea-repair-10.png', badge: 'sale', description: 'Crema para pies con urea 10%', points: 15, inStock: true, stockCount: 35, rating: 4.7, reviews: 234, features: ['Urea 10%', 'Hidratante intensiva', 'Suaviza'], composition: 'Urea, Lactato de sodio', howToUse: 'Aplicar 2 veces al día' },

  // Solares
  { id: 38, name: 'Heliocare 360 Fluid SPF 50', price: 26.90, originalPrice: 32.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Heliocare', image: 'https://www.heliocare.com/img/heliocare-360-fluid.png', badge: 'sale', description: 'Protector solar 360º SPF 50', points: 27, inStock: true, stockCount: 45, rating: 4.8, reviews: 345, features: ['360º protección', 'SPF 50', 'Fluid texture'], composition: 'Fernblock®,Filters', howToUse: 'Aplicar 15 min antes sol' },
  { id: 39, name: 'Isdin Fotoprotector Pediátrico', price: 17.90, originalPrice: 22.90, category: 'bebe-mama', subcategory: 'cuidado-bebe', brand: 'Isdin', image: 'https://www.isdin.com/img/fotoprotector-pediatrico.png', badge: 'sale', description: 'Protector solar infantil SPF 50+', points: 18, inStock: true, stockCount: 30, rating: 4.9, reviews: 234, features: ['Pediátrico', 'SPF 50+', 'Resistente agua'], composition: 'SPF 50+, Vitaminas', howToUse: 'Aplicar en niños mayores 6 meses' },
  { id: 40, name: 'Martiderm Fotoage SPF 50', price: 29.90, category: 'cosmetica-belleza', subcategory: 'cuidado-facial', brand: 'Martiderm', image: 'https://www.martiderm.com/img/fotoage-spf50.png', badge: 'new', description: 'Sérum solar antiedad SPF 50', points: 30, inStock: true, stockCount: 20, rating: 4.7, reviews: 123, features: ['Antiedad', 'SPF 50', 'Vitamina C'], composition: 'Vitamina C, SPF 50', howToUse: 'Aplicar como último paso rutina' },

  // Óptica
  { id: 41, name: 'Acuaiss Plus 360ml', price: 12.90, originalPrice: 15.90, category: 'optica', subcategory: 'liquidos-lentillas', brand: 'Acuaiss', image: 'https://www.acuaiss.com/img/liquido.png', badge: 'sale', description: 'Líquido para lentillas todo en uno', points: 13, inStock: true, stockCount: 45, rating: 4.6, reviews: 234, features: ['Todo en uno', 'Hidratante', 'Antiproteínas'], composition: 'Solución salina', howToUse: 'Guardar lentillas 4 horas mínimo' },
  { id: 42, name: 'Optrex Gotas 10ml', price: 8.90, category: 'optica', subcategory: 'colirios', brand: 'Optrex', image: 'https://www.optrex.es/img/gotas.png', badge: 'new', description: 'Gotas para ojos secos', points: 9, inStock: true, stockCount: 30, rating: 4.5, reviews: 123, features: ['Ojos secos', 'Alivio inmediato', 'Sin conservantes'], composition: 'Ácido hialurónico', howToUse: '1-2 gotas por ojo' },

  // Ortopedia
  { id: 43, name: 'Bastón王者 Aluminum', price: 24.90, originalPrice: 29.90, category: 'ortopedia', subcategory: 'movilidad', brand: 'Generic', image: 'https://www.ortopedia.es/img/baston.png', badge: 'sale', description: 'Bastón de aluminio regulable', points: 25, inStock: true, stockCount: 15, rating: 4.4, reviews: 67, features: ['Regulable', 'Aluminio', 'Ergonómico'], composition: 'Aluminio', howToUse: 'Ajustar altura' },
  { id: 44, name: 'Faja Lumbar Elástica', price: 19.90, category: 'ortopedia', subcategory: 'fajas', brand: 'Generic', image: 'https://www.ortopedia.es/img/faja.png', badge: 'bestseller', description: 'Faja lumbar de soporte', points: 20, inStock: true, stockCount: 25, rating: 4.7, reviews: 145, features: ['Soporte lumbar', 'Elástica', 'Transpirable'], composition: 'Elastano', howToUse: 'Ajustar al torso' },

  // Fitoterapia
  { id: 45, name: 'Arkocaps Valeriana 50caps', price: 14.90, originalPrice: 18.90, category: 'fitoterapia', subcategory: 'plantas-medicinales', brand: 'Arkopharma', image: 'https://www.arkocaps.es/img/valeriana.png', badge: 'sale', description: 'Valeriana para relax y sueño', points: 15, inStock: true, stockCount: 40, rating: 4.6, reviews: 234, features: ['100% vegetal', 'Relax', 'Sin efectos secundarios'], composition: 'Valeriana officinalis', howToUse: '2 cápsulas antes de dormir' },
  { id: 46, name: 'Infusión Equilibrio 20 sobres', price: 5.90, category: 'fitoterapia', subcategory: 'infusiones', brand: 'Herbal', image: 'https://www.herbal.es/img/equilibrio.png', badge: 'new', description: 'Infusión relajante equilibrante', points: 6, inStock: true, stockCount: 50, rating: 4.3, reviews: 89, features: ['Natural', 'Relajante', 'Sin teína'], composition: 'Melisa, Lavanda', howToUse: 'Infusión 5 min' },
  { id: 47, name: 'Aceites Esenciales Pack', price: 29.90, originalPrice: 39.90, category: 'fitoterapia', subcategory: 'aceites-esenciales', brand: 'Pranarom', image: 'https://www.pranarom.es/img/aceites.png', badge: 'sale', description: 'Pack 4 aceites esenciales', points: 30, inStock: true, stockCount: 20, rating: 4.8, reviews: 156, features: ['100% puros', '4 aromas', 'Calidad superior'], composition: 'Aceites esenciales puros', howToUse: 'Difusor o topic' },

  // Mascotas
  { id: 48, name: 'Advance Perro Adulto 12kg', price: 42.90, originalPrice: 52.90, category: 'mascotas', subcategory: 'perros', brand: 'Advance', image: 'https://www.advance-pet.es/img/perro-adulto.png', badge: 'sale', description: 'Pienso para perro adulto', points: 43, inStock: true, stockCount: 15, rating: 4.7, reviews: 234, features: ['Premium', 'Sin cereales', 'Alta digestibilidad'], composition: 'Pollo, Arroz', howToUse: 'Seguir dosis recomendada' },
  { id: 49, name: 'Virbac Gato Esterilizado 1.5kg', price: 18.90, originalPrice: 23.90, category: 'mascotas', subcategory: 'gatos', brand: 'Virbac', image: 'https://www.virbac.es/img/gato-esterilizado.png', badge: 'sale', description: 'Pienso gato esterilizado', points: 19, inStock: true, stockCount: 25, rating: 4.6, reviews: 123, features: ['Control peso', 'Urinary health', 'Sin cereales'], composition: 'Pollo, Pescado', howToUse: 'Dosis según peso' },
  { id: 50, name: 'Bayer Pipetas Antiparasitarias', price: 34.90, originalPrice: 42.90, category: 'mascotas', subcategory: 'salud-mascota', brand: 'Bayer', image: 'https://www.bayer.es/img/pipetas.png', badge: 'sale', description: 'Pipetas antiparasitarias 3 meses', points: 35, inStock: true, stockCount: 30, rating: 4.8, reviews: 345, features: ['Anti-pulgas', 'Anti-garrapatas', '3 meses'], composition: 'Fipronil', howToUse: 'Aplicar en cuello' },

  // Solar
  { id: 51, name: 'La Roche-Posay Anthelios SPF 50', price: 26.90, originalPrice: 32.90, category: 'solar', subcategory: 'solar-facial', brand: 'La Roche-Posay', image: 'https://www.laroche-posay.es/img/anthelios-50.png', badge: 'sale', description: 'Protector solar facial SPF 50', points: 27, inStock: true, stockCount: 50, rating: 4.9, reviews: 567, features: ['SPF 50', 'Anti-UVA/UVB', 'Hidratante'], composition: 'Mexoryl 400', howToUse: 'Aplicar 15 min antes sol' },
  { id: 52, name: 'Isdin Fusion Water Color SPF 50', price: 21.90, originalPrice: 26.90, category: 'solar', subcategory: 'solar-facial', brand: 'Isdin', image: 'https://www.isdin.es/img/fusion-water-color.png', badge: 'sale', description: 'Protector solar con color SPF 50', points: 22, inStock: true, stockCount: 40, rating: 4.7, reviews: 234, features: ['Con color', 'SPF 50', 'Skin perfect'], composition: 'SPF 50, Pigmentos', howToUse: 'Aplicar uniformemente' },

  // Primeros Auxilios
  { id: 53, name: 'Tiritas Classic Pack 100u', price: 6.90, originalPrice: 8.90, category: 'primeros-auxilios', subcategory: 'tiritas', brand: 'Hansaplast', image: 'https://www.hansaplast.es/img/tiritas.png', badge: 'sale', description: 'Pack de tiritas clásicas', points: 7, inStock: true, stockCount: 60, rating: 4.5, reviews: 345, features: ['100 unidades', 'Resistentes al agua', 'Transpirables'], composition: 'Algodón, Adhesivo', howToUse: 'Aplicar sobre herida limpia' },
  { id: 54, name: 'Termómetro Digital Flex', price: 12.90, category: 'primeros-auxilios', subcategory: 'termometros', brand: 'Omron', image: 'https://www.omron.es/img/termometro.png', badge: 'new', description: 'Termómetro digital flexible', points: 13, inStock: true, stockCount: 25, rating: 4.8, reviews: 234, features: ['Flexible', 'Rápido', 'Memoria'], composition: 'Plástico médico', howToUse: 'Uso oral/axilar' },
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
  const [showCartNotification, setShowCartNotification] = useState({ show: false, productName: '' });

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
    setShowCartNotification({ show: true, productName: product.name });
    setTimeout(() => setShowCartNotification({ show: false, productName: '' }), 3000);
  };

  const hideCartNotification = () => {
    setShowCartNotification({ show: false, productName: '' });
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
    setUser(defaultUser);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const register = async (data: { email: string; password: string; name: string; phone: string }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: { email: string }) => u.email === data.email)) {
        console.error('User already exists');
        return false;
      }
      users.push({ ...data, id: `user_${Date.now()}`, points: 0, level: 'Bronce' });
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (err) {
      console.error('Registration error:', err);
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
      categoriesLoading: false,
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
      showCartNotification,
      hideCartNotification,
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
