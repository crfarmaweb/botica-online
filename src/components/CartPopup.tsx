import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, type Product, productsList } from '../context/AppContext';
import './CartPopup.css';

export default function CartPopup() {
  const { showCartNotification, hideCartNotification, cart, addToCart, updateQuantity } = useApp();
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (showCartNotification.show && showCartNotification.productName) {
      const cartItem = cart.find(item => item.name === showCartNotification.productName);
      if (cartItem) {
        setCurrentProduct(cartItem);
        
        const related = productsList
          .filter((p: Product) => p.category === cartItem.category && p.id !== cartItem.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [showCartNotification, cart, productsList]);

  const handleClose = () => {
    hideCartNotification();
    setCurrentProduct(null);
    setRelatedProducts([]);
  };

  const handleViewCart = () => {
    handleClose();
    navigate('/carrito');
  };

  const handleAddRelated = (product: Product) => {
    addToCart(product);
  };

  if (!showCartNotification.show || !currentProduct) return null;

  return (
    <div className="cart-popup-overlay" onClick={handleClose}>
      <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
        <div className="cart-popup-header">
          <span>PRODUCTO AÑADIDO AL CARRITO</span>
          <button className="cart-popup-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-popup-content">
          <div className="cart-popup-product">
            <img src={currentProduct.image} alt={currentProduct.name} className="cart-popup-product-image" />
            <div className="cart-popup-product-info">
              <span className="cart-popup-brand">{currentProduct.brand}</span>
              <h3 className="cart-popup-name">{currentProduct.name}</h3>
              <div className="cart-popup-price-qty">
                <span className="cart-popup-price">{currentProduct.price.toFixed(2)}€</span>
                <div className="cart-popup-qty">
                  <button onClick={() => updateQuantity(String(currentProduct.id), Math.max(1, (cart.find(i => i.id === currentProduct.id)?.quantity || 1) - 1))}>
                    <Minus size={14} />
                  </button>
                  <span>{cart.find(i => i.id === currentProduct.id)?.quantity || 1}</span>
                  <button onClick={() => updateQuantity(String(currentProduct.id), (cart.find(i => i.id === currentProduct.id)?.quantity || 1) + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-popup-actions">
            <button className="cart-popup-btn cart-popup-btn-outline" onClick={handleClose}>
              Continuar comprando
            </button>
            <button className="cart-popup-btn cart-popup-btn-filled" onClick={handleViewCart}>
              Ver carrito
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="cart-popup-related">
            <div className="cart-popup-related-header">
              <h4>Quizás también te guste...</h4>
            </div>
            <div className="cart-popup-related-grid">
              {relatedProducts.map(product => (
                <div key={product.id} className="cart-popup-related-item">
                  <Link to={`/producto/${product.id}`} onClick={handleClose}>
                    <img src={product.image} alt={product.name} />
                    <span className="related-name">{product.name}</span>
                    <span className="related-price">{product.price.toFixed(2)}€</span>
                  </Link>
                  <button onClick={() => handleAddRelated(product)}>
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}