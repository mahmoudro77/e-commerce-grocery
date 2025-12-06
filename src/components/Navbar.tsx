import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = getTotalItems();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            🛒 FreshMart
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </Link>
            <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/products"
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;