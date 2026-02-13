import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-body">{product.category}</p>
        <h3 className="font-display font-semibold text-foreground leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-accent font-display">${product.price}</span>
          <Button size="sm" onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <ShoppingCart size={16} className="mr-1" /> Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
