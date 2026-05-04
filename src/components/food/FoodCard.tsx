import React from 'react';
import { Food } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addItem(food.id, 1);
      showToast(`${food.name} added to cart!`, 'success');
    } catch {
      showToast('Failed to add item to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={food.imageUrl || `https://placehold.co/400x240/f97316/white?text=${encodeURIComponent(food.name)}`}
          alt={food.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x240/f97316/white?text=${encodeURIComponent(food.name)}`;
          }}
        />
        {!food.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Unavailable</span>
          </div>
        )}
        <span className="absolute top-2 right-2 badge bg-primary-100 text-primary-800">
          {food.category.name}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{food.name}</h3>
        <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">{food.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary-600">${food.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!food.available || adding}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {adding ? '...' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
