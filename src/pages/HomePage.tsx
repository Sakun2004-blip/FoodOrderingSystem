import React from 'react';
import { Link } from 'react-router-dom';
import FoodList from '../components/food/FoodList';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Delicious Food, <span className="text-yellow-300">Delivered Fast</span>
          </h1>
          <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">
            Browse our menu, add items to your cart, and get fresh food delivered right to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl text-lg transition-colors">
              Browse Menu
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="bg-primary-800 hover:bg-primary-900 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors border border-primary-500">
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🚀', title: 'Fast Delivery', desc: 'Get your food delivered in under 30 minutes' },
            { icon: '🍽️', title: 'Fresh Food', desc: 'Prepared fresh with quality ingredients' },
            { icon: '💳', title: 'Easy Payment', desc: 'Pay with card or cash on delivery' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center p-4">
              <span className="text-4xl mb-2">{icon}</span>
              <h3 className="font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Food Listing */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Menu</h2>
        <FoodList />
      </section>
    </div>
  );
};

export default HomePage;
