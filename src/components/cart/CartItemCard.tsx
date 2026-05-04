import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    setLoading(true);
    try {
      await updateItem(item.id, newQty);
    } catch {
      showToast('Failed to update quantity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeItem(item.id);
      showToast(`${item.food.name} removed from cart`, 'info');
    } catch {
      showToast('Failed to remove item', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <img
        src={item.food.imageUrl || `https://placehold.co/80x80/f97316/white?text=${encodeURIComponent(item.food.name)}`}
        alt={item.food.name}
        className="w-20 h-20 object-cover rounded-lg"
        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x80/f97316/white?text=${encodeURIComponent(item.food.name)}`; }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.food.name}</h3>
        <p className="text-sm text-gray-500">{item.food.category.name}</p>
        <p className="text-sm text-primary-600 font-medium">${item.unitPrice.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={loading || item.quantity <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={loading}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-gray-800">${item.totalPrice.toFixed(2)}</p>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-red-500 hover:text-red-700 text-sm mt-1 disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
