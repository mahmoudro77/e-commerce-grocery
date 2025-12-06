import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                / {product.unit}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;