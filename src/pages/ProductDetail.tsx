import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useStore();
  const { addItem } = useCart();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-2xl text-foreground mb-4">Product not found</h2>
          <Link to="/shop" className="text-accent hover:underline font-body">Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Shop
          </Link>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-body">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
              <p className="text-3xl font-bold text-accent font-display">${product.price}</p>
              <p className="font-body text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Specs */}
              <div className="border-t border-border pt-6 space-y-3">
                <h3 className="font-display font-semibold text-foreground">Specifications</h3>
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm font-body border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="text-foreground font-medium">{val}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body text-base"
                onClick={() => { addItem(product); toast.success(`${product.name} added to cart`); }}
              >
                <ShoppingCart size={18} className="mr-2" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
