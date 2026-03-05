import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  inStock: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          image: product.image,
        });
      }
      toast.success(`${quantity} ${product.name} added to cart!`);
      setQuantity(1);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xl text-muted-foreground ml-2">
                / {product.unit}
              </span>
            </div>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {product.inStock ? (
              <>
                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-foreground font-medium">Quantity:</span>
                  <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-background rounded transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-4 font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-background rounded transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </>
            ) : (
              <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg font-semibold">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;