import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: '', email: '', password: '', confirmPassword: '', phone: '', address: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (form.phone && !/^\+?[\d\s\-]{7,15}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        address: form.address || undefined,
      });
      showToast('Account created successfully! Welcome!', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const field = (
    name: keyof FormState,
    label: string,
    type: string = 'text',
    placeholder: string = '',
    required: boolean = true
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`input-field ${errors[name] ? 'border-red-500 focus:ring-red-500' : ''}`}
        placeholder={placeholder}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-8">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-5xl">🍔</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us and start ordering!</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {field('name', 'Full Name', 'text', 'John Doe')}
          {field('email', 'Email Address', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', 'Min. 8 characters')}
          {field('confirmPassword', 'Confirm Password', 'password', 'Repeat password')}
          {field('phone', 'Phone Number', 'tel', '+1 234 567 8900', false)}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-field resize-none"
              rows={2}
              placeholder="123 Main St, City, State"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-base" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" /> Creating account...</span>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
