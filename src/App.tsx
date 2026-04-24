import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { supabase } from './lib/supabase';
import AppHome from './pages/AppHome';
import Tienda from './pages/Tienda';
import ProductoDetalle from './pages/ProductoDetalle';
import Mapa from './pages/Mapa';
import Perfil from './pages/Perfil';
import Retos from './pages/Retos';
import Carrito from './pages/Carrito';
import Blog from './pages/Blog';
import Favoritos from './pages/Favoritos';
import Auth from './pages/Auth';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartNotification from './components/CartNotification';
import { MessageCircle } from 'lucide-react';

function AuthListener() {
  const { login } = useApp();
  
  useEffect(() => {
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { user } = session;
        login({
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
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
    });

    return () => subscription.unsubscribe();
  }, [login]);

  return null;
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
              <Route path="/marcas" element={<Tienda />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/retos" element={<Retos />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
          <Footer />
          <CartNotification />
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
