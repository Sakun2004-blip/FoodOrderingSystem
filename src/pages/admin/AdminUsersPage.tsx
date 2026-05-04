import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import * as userApi from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userApi.getAllUsers();
      setUsers(res.data);
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id: number, name: string) => {
    if (id === currentUser?.id) { showToast('Cannot delete your own account', 'warning'); return; }
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    try {
      await userApi.deleteUser(id);
      showToast('User deleted', 'info');
      fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Users ({users.length})</h2>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={`border-b hover:bg-gray-50 ${u.id === currentUser?.id ? 'bg-primary-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.name} {u.id === currentUser?.id && <span className="text-xs text-primary-600">(You)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge px-2 py-1 ${u.role === 'ROLE_ADMIN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      disabled={u.id === currentUser?.id}
                      className="btn-danger text-xs py-1 px-3 disabled:opacity-30"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
