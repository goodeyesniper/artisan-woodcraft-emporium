import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground font-body mb-6">Browse our collection and find something you love.</p>
          <Link to="/shop">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-body">Browse Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Your Cart</h1>
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 bg-card rounded-lg border border-border p-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate">{product.name}</h3>
                  <p className="text-accent font-bold font-display">${product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-7 h-7 rounded bg-muted flex items-center justify-center text-foreground hover:bg-secondary">
                      <Minus size={14} />
                    </button>
                    <span className="font-body text-sm w-8 text-center text-foreground">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-7 h-7 rounded bg-muted flex items-center justify-center text-foreground hover:bg-secondary">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => removeItem(product.id)} className="ml-auto text-destructive hover:text-destructive/80">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="font-display font-bold text-foreground whitespace-nowrap">${(product.price * quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-border pt-6 flex items-center justify-between">
            <span className="font-display text-xl font-bold text-foreground">Total: ${total.toFixed(2)}</span>
            <Link to="/checkout">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
