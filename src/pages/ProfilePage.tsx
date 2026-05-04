import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as userApi from '../api/userApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileErrors, setProfileErrors] = useState<Partial<typeof profile>>({});
  const [pwErrors, setPwErrors] = useState<Partial<typeof pwForm>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const validateProfile = () => {
    const errs: Partial<typeof profile> = {};
    if (!profile.name.trim()) errs.name = 'Name is required';
    if (profile.phone && !/^\+?[\d\s\-]{7,15}$/.test(profile.phone)) errs.phone = 'Invalid phone number';
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePassword = () => {
    const errs: Partial<typeof pwForm> = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) errs.newPassword = 'Min. 8 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPwErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      const res = await userApi.updateProfile({
        name: profile.name.trim(),
        phone: profile.phone || undefined,
        address: profile.address || undefined,
      });
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await userApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      showToast('Password changed successfully!', 'success');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const tabClass = (tab: string) =>
    `py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card overflow-visible">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.name}</h1>
              <p className="text-primary-100 text-sm">{user?.email}</p>
              <span className={`badge mt-1 ${user?.role === 'ROLE_ADMIN' ? 'bg-yellow-200 text-yellow-900' : 'bg-primary-200 text-primary-900'}`}>
                {user?.role === 'ROLE_ADMIN' ? '⭐ Admin' : 'Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button className={tabClass('profile')} onClick={() => setActiveTab('profile')}>Profile Info</button>
          <button className={tabClass('password')} onClick={() => setActiveTab('password')}>Change Password</button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} noValidate>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={`input-field ${profileErrors.name ? 'border-red-500' : ''}`}
                />
                {profileErrors.name && <p className="text-xs text-red-600 mt-1">{profileErrors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={user?.email || ''} disabled className="input-field bg-gray-100 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className={`input-field ${profileErrors.phone ? 'border-red-500' : ''}`}
                  placeholder="+1 234 567 8900"
                />
                {profileErrors.phone && <p className="text-xs text-red-600 mt-1">{profileErrors.phone}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Enter your address"
                />
              </div>
              <button type="submit" disabled={savingProfile} className="btn-primary px-8">
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password' },
                { key: 'newPassword', label: 'New Password' },
                { key: 'confirmPassword', label: 'Confirm New Password' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={pwForm[key as keyof typeof pwForm]}
                    onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                    className={`input-field ${pwErrors[key as keyof typeof pwErrors] ? 'border-red-500' : ''}`}
                  />
                  {pwErrors[key as keyof typeof pwErrors] && (
                    <p className="text-xs text-red-600 mt-1">{pwErrors[key as keyof typeof pwErrors]}</p>
                  )}
                </div>
              ))}
              <button type="submit" disabled={savingPassword} className="btn-primary px-8">
                {savingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
