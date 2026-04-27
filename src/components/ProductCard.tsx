import { Link } from 'react-router-dom';
import { Star, ShoppingBasket, Check, Heart } from 'lucide-react';
import { useApp, type Product } from '../context/AppContext';
import { useState } from 'react';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites, user } = useApp();
  const [added, setAdded] = useState(false);

  const isFavorite = favorites.some(f => f.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user.isLoggedIn) {
      document.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }
    toggleFavorite(product);
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <Link to={`/producto/${product.id}`} className="product-card-dosfarma">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} loading="lazy" />
        
        {discount > 0 && (
          <div className="badge-discount">-{discount}%</div>
        )}
        {product.badge === 'new' && (
          <div className="badge-new">Nuevo</div>
        )}
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#666'} />
        </button>
      </div>

      <div className="product-details">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <Star size={10} fill="#fbbf24" color="#fbbf24" />
          <span>{product.rating}</span>
        </div>

        <div className="product-price-row">
          <div className="price-info">
            {product.originalPrice && (
              <span className="original-price">€{product.originalPrice.toFixed(2)}</span>
            )}
            <span className="current-price">€{product.price.toFixed(2)}</span>
          </div>
          
          <button 
            className={`add-to-cart-btn ${added ? 'added' : ''}`} 
            onClick={handleAddToCart} 
            title="Añadir al carrito"
          >
            {added ? <Check size={20} /> : <ShoppingBasket size={20} />}
          </button>
        </div>
      </div>
    </Link>
  );
}