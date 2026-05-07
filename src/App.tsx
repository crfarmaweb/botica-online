import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { supabase } from './lib/supabase';
import AppHome from './pages/AppHome';
import Tienda from './pages/Tienda';
import CategoryPage from './pages/CategoryPage';
import ProductoDetalle from './pages/ProductoDetalle';
import Mapa from './pages/Mapa';
import Perfil from './pages/Perfil';
import Retos from './pages/Retos';
import Carrito from './pages/Carrito';
import Blog from './pages/Blog';
import Favoritos from './pages/Favoritos';
import Auth from './pages/Auth';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import Admin from './pages/Admin';
import DynamicPage from './pages/DynamicPage';
import RichPage from './pages/RichPage';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartPopup from './components/CartPopup';
import { MessageCircle } from 'lucide-react';

function AuthListener() {
  const { login, logout } = useApp();
  
  useEffect(() => {
    if (!supabase) return;
    
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        login({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || '',
          avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
          points: 100,
          level: 'Bronce',
          pointsToNextLevel: 400,
          totalPoints: 100,
          referrals: 0,
          streak: 0,
          achievements: [],
          joinedDate: new Date().toISOString().split('T')[0],
          isLoggedIn: true,
        });
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        login({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || '',
          avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
          points: 100,
          level: 'Bronce',
          pointsToNextLevel: 400,
          totalPoints: 100,
          referrals: 0,
          streak: 0,
          achievements: [],
          joinedDate: new Date().toISOString().split('T')[0],
          isLoggedIn: true,
        });
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, [login, logout]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  
  if (!user.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <AppProvider>
      <AuthListener />
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-container">
          <Header />
          <main className="content-area container">
            <Routes>
              <Route path="/" element={<AppHome />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/:slug" element={<CategoryPage />} />
              <Route path="/marcas" element={<Tienda />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/retos" element={<ProtectedRoute><Retos /></ProtectedRoute>} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/recuperar" element={<ForgotPassword />} />
              <Route path="/nueva-contrasena" element={<NewPassword />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/:slug" element={<DynamicPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
          <Footer />
          <CartPopup />
          <a 
            href="https://wa.me/34666123456?text=Hola,%20necesito%20asesoramiento" 
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chatear en WhatsApp"
          >
            <MessageCircle size={28} />
          </a>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;