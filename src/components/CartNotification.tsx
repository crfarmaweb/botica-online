import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export default function CartNotification() {
  const { showCartNotification, hideCartNotification } = useApp();

  if (!showCartNotification.show) return null;

  return (
    <div className="cart-notification" onClick={hideCartNotification}>
      <div className="cart-notification-inner">
        <div className="cart-notification-icon">
          <Check size={16} />
        </div>
        <div className="cart-notification-text">
          <span className="cart-notification-title">Añadido al carrito</span>
          <span className="cart-notification-product">{showCartNotification.productName}</span>
        </div>
      </div>
    </div>
  );
}