import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const total = getTotalPrice();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to complete your order');
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Mock checkout - in real app, this would process payment
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some fresh groceries to get started!
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-6 flex gap-6"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    ${item.price.toFixed(2)} / {item.unit}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>$5.99</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-xl font-bold text-card-foreground">
                    <span>Total</span>
                    <span>${(total + 5.99).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Proceed to Checkout
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Please login to complete your order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;