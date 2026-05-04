import React, { useState, useEffect, useCallback } from 'react';
import { Category, CategoryRequest } from '../../types';
import * as categoryApi from '../../api/categoryApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminCategoriesPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryRequest>({ name: '', description: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', imageUrl: '' });
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '', imageUrl: cat.imageUrl || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await categoryApi.updateCategory(editing.id, form);
        showToast('Category updated!', 'success');
      } else {
        await categoryApi.createCategory(form);
        showToast('Category created!', 'success');
      }
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Foods in this category may be affected.`)) return;
    try {
      await categoryApi.deleteCategory(id);
      showToast('Category deleted', 'info');
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Categories ({categories.length})</h2>
        <button onClick={openCreate} className="btn-primary">+ Add Category</button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl shrink-0">
                {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-14 h-14 rounded-full object-cover" /> : '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{cat.name}</h3>
                <p className="text-xs text-gray-500 truncate">{cat.description || 'No description'}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => openEdit(cat)} className="btn-secondary text-xs py-1 px-3">Edit</button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="btn-danger text-xs py-1 px-3">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
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

export default AdminCategoriesPage;
