import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="content-area container">
            <Routes>
              <Route path="/" element={<AppHome />} />
              <Route path="/tienda" element={<Tienda />} />
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
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
