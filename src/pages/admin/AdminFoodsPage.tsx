import React, { useState, useEffect, useCallback } from 'react';
import { Food, Category, FoodRequest } from '../../types';
import * as foodApi from '../../api/foodApi';
import * as categoryApi from '../../api/categoryApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { PageResponse } from '../../types';

const AdminFoodsPage: React.FC = () => {
  const { showToast } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [form, setForm] = useState<FoodRequest>({
    name: '', description: '', price: 0, imageUrl: '', available: true, categoryId: 0,
  });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [foodsRes, catsRes] = await Promise.all([
        foodApi.getAllFoods({ size: 100 }),
        categoryApi.getAllCategories(),
      ]);
      setFoods((foodsRes.data as PageResponse<Food>).content);
      setCategories(catsRes.data);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditingFood(null);
    setForm({ name: '', description: '', price: 0, imageUrl: '', available: true, categoryId: categories[0]?.id || 0 });
    setShowForm(true);
  };

  const openEdit = (food: Food) => {
    setEditingFood(food);
    setForm({ name: food.name, description: food.description, price: food.price, imageUrl: food.imageUrl || '', available: food.available, categoryId: food.category.id });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingFood) {
        await foodApi.updateFood(editingFood.id, form);
        showToast('Food updated!', 'success');
      } else {
        await foodApi.createFood(form);
        showToast('Food created!', 'success');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save food', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await foodApi.deleteFood(id);
      showToast('Food deleted', 'info');
      fetchData();
    } catch {
      showToast('Failed to delete food', 'error');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await foodApi.toggleFoodAvailability(id);
      fetchData();
    } catch {
      showToast('Failed to toggle availability', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Food Items ({foods.length})</h2>
        <button onClick={openCreate} className="btn-primary">+ Add Food</button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Name', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={food.imageUrl || `https://placehold.co/40x40/f97316/white?text=F`} alt={food.name} className="w-10 h-10 rounded object-cover" />
                      <span className="font-medium text-gray-800">{food.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{food.category.name}</td>
                  <td className="px-4 py-3 font-semibold text-primary-600">${food.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(food.id)}
                      className={`badge px-3 py-1 cursor-pointer ${food.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {food.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(food)} className="btn-secondary text-xs py-1 px-3">Edit</button>
                      <button onClick={() => handleDelete(food.id, food.name)} className="btn-danger text-xs py-1 px-3">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editingFood ? 'Edit Food' : 'Add New Food'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} className="input-field" required>
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                <span className="text-sm text-gray-700">Available</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoodsPage;
