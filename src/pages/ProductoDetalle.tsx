import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Minus, Plus, Star, Truck, Shield, Check } from 'lucide-react';
import { useApp, products } from '../context/AppContext';
import SEO from '../components/SEO';
import './ProductoDetalle.css';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart, favorites, toggleFavorite, reviews, addReview } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="df-product-page">
        <div className="df-container">
          <div className="df-not-found">
            <h1>Producto no encontrado</h1>
            <p>El producto que buscas no existe</p>
            <Link to="/tienda" className="df-primary-btn">Volver a la tienda</Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(f => f.id === product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      addReview(product.id, newReview.rating, newReview.comment);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    }
  };

  return (
    <div className="df-product-page">
      {product && (
        <SEO 
          title={`${product.name} - ${product.brand} | MadFarma`}
          description={product.description}
        />
      )}
      <div className="df-container">
        <div className="df-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/tienda">La Tienda</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="df-product-layout">
          {/* Image */}
          <div className="df-product-gallery">
            <div className="df-main-image">
              {product.badge && (
                <span className="df-badge-offer">{product.badge === 'new' ? 'Nuevo' : 'Oferta'}</span>
              )}
              {discount > 0 && (
                <span className="df-badge-discount">-{discount}%</span>
              )}
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          {/* Info */}
          <div className="df-product-info">
            <span className="df-product-brand">{product.brand}</span>
            <h1 className="df-product-title">{product.name}</h1>

            <div className="df-product-rating">
              <div className="df-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} fill={star <= product.rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                ))}
              </div>
              <span className="df-rating-value">{product.rating}</span>
              <span className="df-reviews-count">({product.reviews} valoraciones)</span>
            </div>

            <div className="df-product-price-section">
              <span className="df-current-price">€{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="df-original-price">€{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {product.stockCount && product.stockCount < 20 && (
              <div className="df-stock-warning">
                ¡Solo quedan {product.stockCount} unidades!
              </div>
            )}

            <div className="df-quantity-section">
              <span className="df-quantity-label">Cantidad:</span>
              <div className="df-quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="df-qty-btn">
                  <Minus size={18} />
                </button>
                <span className="df-qty-value">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="df-qty-btn">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="df-product-actions">
              <button className="df-add-to-cart-btn" onClick={handleAddToCart}>
                Añadir al carrito
              </button>
              <button className="df-favorite-btn" onClick={() => toggleFavorite(product)}>
                <Heart size={22} fill={isFavorite ? '#ff6b6b' : 'none'} color={isFavorite ? '#ff6b6b' : 'currentColor'} />
              </button>
            </div>

            <div className="df-product-benefits">
              <div className="df-benefit-row">
                <Truck size={20} />
                <div>
                  <strong>Envío gratis</strong>
                  <span>En pedidos mayores a €35</span>
                </div>
              </div>
              <div className="df-benefit-row">
                <Shield size={20} />
                <div>
                  <strong>Compra segura</strong>
                  <span>100% garantizado</span>
                </div>
              </div>
              <div className="df-benefit-row">
                <Check size={20} />
                <div>
                  <strong>Devolución</strong>
                  <span>30 días sin preguntas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="df-product-section">
          <h2>Descripción</h2>
          <p>{product.description}</p>
        </div>

        {product.features && product.features.length > 0 && (
          <div className="df-product-section">
            <h2>Características</h2>
            <ul className="df-features-list">
              {product.features.map((feature, idx) => (
                <li key={idx}>
                  <Check size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reviews Section */}
        <div className="df-product-section df-reviews-section">
          <div className="df-reviews-header">
            <h2>Valoraciones y Opiniones</h2>
            <button 
              className="df-write-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Escribir opinión
            </button>
          </div>

          {showReviewForm && (
            <div className="df-review-form">
              <h3>Tu opinión sobre {product.name}</h3>
              <div className="df-rating-select">
                <span>Tu puntuación:</span>
                <div className="df-stars-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="df-star-btn"
                    >
                      <Star 
                        size={24} 
                        fill={star <= newReview.rating ? '#fbbf24' : 'none'} 
                        color={star <= newReview.rating ? '#fbbf24' : '#ccc'} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Comparte tu experiencia con este producto..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
              />
              <button 
                className="df-submit-review-btn"
                onClick={handleSubmitReview}
              >
                Publicar opinión
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div className="df-reviews-list">
            {productReviews.length === 0 ? (
              <p className="df-no-reviews">Aún no hay opiniones. ¡Sé el primero en valorar este producto!</p>
            ) : (
              productReviews.map(review => (
                <div key={review.id} className="df-review-card">
                  <div className="df-review-header">
                    <span className="df-review-author">{review.userName}</span>
                    <span className="df-review-date">{review.date}</span>
                  </div>
                  <div className="df-review-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} fill={star <= review.rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                    ))}
                  </div>
                  <p className="df-review-comment">{review.comment}</p>
                  {review.verified && (
                    <div className="df-review-verified">
                      <Check size={12} />
                      <span>Compra verificada</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
