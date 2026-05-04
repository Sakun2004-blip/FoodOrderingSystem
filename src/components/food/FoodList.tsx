import React, { useState, useEffect, useCallback } from 'react';
import { Food, Category, PageResponse } from '../../types';
import * as foodApi from '../../api/foodApi';
import * as categoryApi from '../../api/categoryApi';
import FoodCard from './FoodCard';
import LoadingSpinner from '../common/LoadingSpinner';

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await foodApi.getAllFoods({ page, size: 8, categoryId: selectedCategory, search: search || undefined });
      const data = res.data as PageResponse<Food>;
      setFoods(data.content);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load foods');
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategory, search]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  useEffect(() => {
    categoryApi.getAllCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  const handleCategoryFilter = (id?: number) => {
    setSelectedCategory(id);
    setPage(0);
  };

  return (
    <div>
      {/* Search & Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search food items..."
            className="input-field"
          />
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategoryFilter(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchFoods} className="btn-primary mt-4">Retry</button>
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl">🍽️</span>
          <p className="text-gray-500 mt-4 text-lg">No food items found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoodList;
