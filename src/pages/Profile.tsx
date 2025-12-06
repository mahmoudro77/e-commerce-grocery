import { Navigate } from 'react-router-dom';
import { Package, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Mock order history
  const mockOrders = [
    {
      id: '1',
      date: '2024-01-15',
      items: [
        { name: 'Organic Bananas', quantity: 2, price: 2.99 },
        { name: 'Fresh Strawberries', quantity: 1, price: 4.99 },
      ],
      total: 10.97,
      status: 'Delivered',
    },
    {
      id: '2',
      date: '2024-01-10',
      items: [
        { name: 'Greek Yogurt', quantity: 1, price: 4.99 },
        { name: 'Whole Wheat Bread', quantity: 1, price: 3.99 },
      ],
      total: 8.98,
      status: 'Delivered',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary/10 p-6 rounded-full">
              <UserIcon className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-1">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Order History
          </h2>

          {mockOrders.length > 0 ? (
            <div className="space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-card-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold">
                      <span className="text-card-foreground">Total</span>
                      <span className="text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;