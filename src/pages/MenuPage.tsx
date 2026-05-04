import React from 'react';
import FoodList from '../components/food/FoodList';

const MenuPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Menu</h1>
    <p className="text-gray-500 mb-8">Browse and order from our wide selection of dishes</p>
    <FoodList />
  </div>
);

export default MenuPage;
