import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood'];

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shop All Products</h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-card-foreground border border-border hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;