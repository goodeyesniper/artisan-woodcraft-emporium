import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            items: items.map(i => ({
              id: i.product.id,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
              image: i.product.image,
            })),
            customer: form,
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        toast.error("Unable to start checkout.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

          {/* Order Summary */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="font-display font-semibold text-foreground mb-4">Order Summary</h2>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm font-body py-2 border-b border-border/50">
                <span className="text-foreground">{product.name} × {quantity}</span>
                <span className="text-foreground font-medium">${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-display font-bold text-lg mt-4 text-foreground">
              <span>Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="font-body text-foreground">Full Name *</Label>
              <Input id="name" value={form.name} onChange={update('name')} className="mt-1" placeholder="Your full name" maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email" className="font-body text-foreground">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={update('email')} className="mt-1" placeholder="your@email.com" maxLength={255} />
            </div>
            <div>
              <Label htmlFor="phone" className="font-body text-foreground">Phone *</Label>
              <Input id="phone" value={form.phone} onChange={update('phone')} className="mt-1" placeholder="+1 (555) 000-0000" maxLength={20} />
            </div>
            <div>
              <Label htmlFor="address" className="font-body text-foreground">Shipping Address *</Label>
              <Textarea id="address" value={form.address} onChange={update('address')} className="mt-1" placeholder="Full shipping address" maxLength={500} />
            </div>
            <div>
              <Label htmlFor="notes" className="font-body text-foreground">Order Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={update('notes')} className="mt-1" placeholder="Any special requests or customizations..." maxLength={500} />
            </div>
            <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body text-base">
              Place Order
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
