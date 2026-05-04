import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-700 text-white' : 'text-white hover:bg-primary-700'
    }`;

  return (
    <nav className="bg-primary-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍔</span>
            <span className="text-white font-bold text-xl">FoodOrder</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/cart" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="bg-white text-primary-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </span>
                </NavLink>
                <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <NavLink to="/profile" className={navLinkClass}>
                  👤 {user?.name}
                </NavLink>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-700 px-4 pb-4 space-y-1">
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)} end>Home</NavLink>
          <NavLink to="/menu" className={navLinkClass} onClick={() => setMenuOpen(false)}>Menu</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/cart" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                🛒 Cart {cartCount > 0 && `(${cartCount})`}
              </NavLink>
              <NavLink to="/orders" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Orders</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>👤 Profile</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-white text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={navLinkClass} onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
