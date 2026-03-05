import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Truck, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { API_URL } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  featured: boolean;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const url = new URL(`${API_URL}/products`);
    url.searchParams.set('featured', 'true');

    fetch(url.toString())
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const categories = [
    { name: 'Fruits', icon: '🍎', color: 'bg-red-100' },
    { name: 'Vegetables', icon: '🥬', color: 'bg-green-100' },
    { name: 'Dairy', icon: '🥛', color: 'bg-blue-100' },
    { name: 'Bakery', icon: '🍞', color: 'bg-yellow-100' },
    { name: 'Meat', icon: '🥩', color: 'bg-orange-100' },
    { name: 'Seafood', icon: '🐟', color: 'bg-cyan-100' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Fresh Groceries
              <span className="text-primary block">Delivered to You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Shop organic produce, quality meats, and everyday essentials. 
              All delivered fresh to your doorstep.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Organic</h3>
              <p className="text-muted-foreground">
                Fresh organic produce from local farms
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-secondary/10 p-4 rounded-full mb-4">
                <Truck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Same-day delivery available in your area
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">
                100% satisfaction guarantee on all orders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-card-foreground">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2024 FreshMart. Fresh groceries delivered daily.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;