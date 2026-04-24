import { Link } from 'react-router-dom';
import { Star, ShoppingBasket } from 'lucide-react';
import { useApp, type Product } from '../context/AppContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
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
          
          <button className="add-to-cart-btn" onClick={handleAddToCart} title="Añadir al carrito">
            <ShoppingBasket size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
}
