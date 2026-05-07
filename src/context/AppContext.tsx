import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { alimentacionInfantilProducts } from '../data/alimentacionInfantil';
import { suavinexProducts } from '../data/suavinexProducts';

export interface Product {
  id: string;
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
  color: string;
  description?: string;
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
    color: '#E8B4BC',
    subcategories: [
      { id: 'panales', name: 'Pañales' },
      { id: 'higiene-bebe', name: 'Higiene' },
      { id: 'alimentacion-bebe', name: 'Alimentación' },
      { id: 'biberones', name: 'Biberones' },
      { id: 'chupetes', name: 'Chupetes' },
      { id: 'cuidado-bebe', name: 'Cuidado del Bebé' },
      { id: 'lactancia', name: 'Lactancia' },
    ]
  },
  {
    id: 'cosmetica-belleza',
    name: 'Cosmética y Belleza',
    color: '#D4A5A5',
    subcategories: [
      { id: 'cuidado-facial', name: 'Cuidado Facial' },
      { id: 'cuidado-corporal', name: 'Cuidado Corporal' },
      { id: 'maquillaje', name: 'Maquillaje' },
      { id: 'perfumes', name: 'Perfumes' },
      { id: 'hombre', name: 'Hombre' },
    ]
  },
  {
    id: 'higiene-bucal',
    name: 'Higiene Bucal',
    color: '#A8D8EA',
    subcategories: [
      { id: 'pasta-dental', name: 'Pasta Dental' },
      { id: 'cepillos', name: 'Cepillos' },
      { id: 'enjuagues', name: 'Enjuagues' },
      { id: 'cepillos-electricos', name: 'Cepillos Eléctricos' },
      { id: 'hilo-dental', name: 'Hilo Dental' },
    ]
  },
  {
    id: 'nutricion-vitaminas',
    name: 'Nutrición y Vitaminas',
    color: '#B5D89A',
    subcategories: [
      { id: 'vitaminas', name: 'Vitaminas' },
      { id: 'complementos', name: 'Complementos' },
      { id: 'omega', name: 'Omega 3' },
      { id: 'mineral', name: 'Minerales' },
      { id: 'herbolario', name: 'Herbolario' },
    ]
  },
  {
    id: 'salud-sexual',
    name: 'Salud Sexual',
    color: '#C9B1D9',
    subcategories: [
      { id: 'preservativos', name: 'Preservativos' },
      { id: 'lubricantes', name: 'Lubricantes' },
      { id: 'test-embarazo', name: 'Test de Embarazo' },
      { id: 'anticonceptivos', name: 'Anticonceptivos' },
    ]
  },
  {
    id: 'primeros-auxilios',
    name: 'Primeros Auxilios',
    color: '#E8A8A8',
    subcategories: [
      { id: 'tiritas', name: 'Tiritas' },
      { id: 'termometros', name: 'Termómetros' },
      { id: 'antisepticos', name: 'Antisépticos' },
      { id: 'vendajes', name: 'Vendajes' },
      { id: 'botiquin', name: 'Botiquín' },
    ]
  },
  {
    id: 'cuidado-cabello',
    name: 'Cuidado del Cabello',
    color: '#D4C4A5',
    subcategories: [
      { id: 'champus', name: 'Champús' },
      { id: 'acondicionadores', name: 'Acondicionadores' },
      { id: 'tratamientos', name: 'Tratamientos' },
      { id: 'anticaida', name: 'Anticaída' },
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
  { id: '7', name: 'Oral-B', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Oral-B_logo.svg/200px-Oral-B_logo.svg.png' },
  { id: '8', name: 'Elmex', logo: 'https://www.elmex.com/static/elmex-logo.svg' },
  { id: '9', name: 'Listerine', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Listerine_logo.svg/200px-Listerine_logo.svg.png' },
  { id: '10', name: 'Huggies', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Huggies_logo.svg/200px-Huggies_logo.svg.png' },
  { id: '11', name: 'Chicco', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Chicco_logo.svg/200px-Chicco_logo.svg.png' },
  { id: '12', name: 'Medela', logo: 'https://www.medela.com/static/logos/medela-logo-2022.svg' },
  { id: '13', name: 'Suavel', logo: 'https://via.placeholder.com/100x40?text=Suavel' },
  { id: '14', name: 'Dodot', logo: 'https://via.placeholder.com/100x40?text=Dodot' },
  { id: '15', name: 'Mustela', logo: 'https://www.mustela.es/media/wysiwyg/logo-mustela.svg' },
  { id: '16', name: 'Arkopharma', logo: 'https://www.arkopharma.com/wp-content/uploads/2020/10/logo-arkopharma.png' },
  { id: '17', name: 'Om Pharma', logo: 'https://via.placeholder.com/100x40?text=Om+Pharma' },
  { id: '18', name: 'Kérastase', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/K%C3%A9rastase_2016.svg/200px-K%C3%A9rastase_2016.svg.png' },
  { id: '19', name: 'Nioxin', logo: 'https://via.placeholder.com/100x40?text=Nioxin' },
  { id: '20', name: 'Durex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Durex_logo.svg/200px-Durex_logo.svg.png' },
  { id: '21', name: 'Canesten', logo: 'https://via.placeholder.com/100x40?text=Canesten' },
  { id: '22', name: 'Hansaplast', logo: 'https://via.placeholder.com/100x40?text=Hansaplast' },
  { id: '23', name: 'Omron', logo: 'https://via.placeholder.com/100x40?text=Omron' },
  { id: '24', name: 'Betadine', logo: 'https://via.placeholder.com/100x40?text=Betadine' },
  { id: '25', name: 'Nicorette', logo: 'https://via.placeholder.com/100x40?text=Nicorette' },
  { id: '26', name: 'PharmaNord', logo: 'https://via.placeholder.com/100x40?text=PharmaNord' },
  { id: '27', name: 'Laif', logo: 'https://via.placeholder.com/100x40?text=Laif' },
  { id: '28', name: 'Viatris', logo: 'https://via.placeholder.com/100x40?text=Viatris' },
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
  ...alimentacionInfantilProducts,
  ...suavinexProducts,
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
  const [products, setProducts] = useState<Product[]>([
    ...alimentacionInfantilProducts,
    ...suavinexProducts,
  ]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) return;
      const { data } = await supabase.from('products').select('*').order('name');
      if (data && data.length > 0) {
        setProducts(data.map((p: any) => ({
          ...p,
          inStock: p.in_stock,
          originalPrice: p.original_price,
          stockCount: p.stock,
        })));
      }
      setProductsLoading(false);
    }
    loadProducts();
  }, []);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [showCartNotification, setShowCartNotification] = useState({ show: false, productName: '' });

export const useProducts = () => {
  const { products, productsLoading } = useContext(AppContext) as AppContextType;
  return { products, productsLoading };
};

export const getProducts = () => {
  return products;
};

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const savedUserData = JSON.parse(savedUser);
        if (savedUserData.isLoggedIn) {
          setUser(savedUserData);
        }
      } catch {}
    }
    
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
    if (userData.id !== 'guest') {
      supabase?.auth.updateUser({
        data: {
          full_name: userData.name,
          phone: userData.phone,
        }
      });
    }
  };

  const logout = async () => {
    await supabase?.auth.signOut();
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
