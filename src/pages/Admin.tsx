import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

function ProductForm({ initial, onSave, onCancel }: {
  initial?: Product;
  onSave: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [specsText, setSpecsText] = useState(
    initial ? Object.entries(initial.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !category.trim()) {
      toast.error('Please fill in required fields.');
      return;
    }
    const specs: Record<string, string> = {};
    specsText.split('\n').filter(Boolean).forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    onSave({ name, price: parseFloat(price), category, description, image, specs, featured: initial?.featured ?? false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-body text-foreground">Product Name *</Label>
          <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" maxLength={100} />
        </div>
        <div>
          <Label className="font-body text-foreground">Price ($) *</Label>
          <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-body text-foreground">Category *</Label>
          <Input value={category} onChange={e => setCategory(e.target.value)} className="mt-1" maxLength={50} />
        </div>
        <div>
          <Label className="font-body text-foreground">Image URL</Label>
          <Input value={image} onChange={e => setImage(e.target.value)} className="mt-1" maxLength={500} />
        </div>
      </div>
      <div>
        <Label className="font-body text-foreground">Description</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1" rows={3} maxLength={1000} />
      </div>
      <div>
        <Label className="font-body text-foreground">Specs (one per line, "Key: Value")</Label>
        <Textarea value={specsText} onChange={e => setSpecsText(e.target.value)} className="mt-1" rows={4} placeholder="Material: Oak&#10;Dimensions: 12in × 8in" maxLength={1000} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="font-body">Cancel</Button>
      </div>
    </form>
  );
}

export default function Admin() {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          <Link to="/" className="flex items-center gap-2 text-sm font-body opacity-80 hover:opacity-100">
            <ArrowLeft size={16} /> Back to Site
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="font-body"><Package size={16} className="mr-2" /> Products</TabsTrigger>
            <TabsTrigger value="orders" className="font-body"><ShoppingBag size={16} className="mr-2" /> Orders</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Products ({products.length})</h2>
              {!adding && (
                <Button onClick={() => setAdding(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">
                  <Plus size={16} className="mr-1" /> Add Product
                </Button>
              )}
            </div>

            {adding && (
              <div className="mb-6">
                <ProductForm
                  onSave={data => { addProduct(data); setAdding(false); toast.success('Product added!'); }}
                  onCancel={() => setAdding(false)}
                />
              </div>
            )}

            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id}>
                  {editing === p.id ? (
                    <ProductForm
                      initial={p}
                      onSave={data => { updateProduct(p.id, data); setEditing(null); toast.success('Product updated!'); }}
                      onCancel={() => setEditing(null)}
                    />
                  ) : (
                    <div className="flex items-center gap-4 bg-card rounded-lg border border-border p-4">
                      {p.image && <img src={p.image} alt={p.name} className="w-16 h-16 rounded object-cover" />}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground truncate">{p.name}</h3>
                        <p className="text-sm text-muted-foreground font-body">{p.category} • ${p.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditing(p.id)}>
                          <Edit size={14} />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => { deleteProduct(p.id); toast.success('Product deleted.'); }}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground font-body py-12">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-card rounded-lg border border-border p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">Order #{order.id.slice(-6)}</h3>
                        <p className="text-sm text-muted-foreground font-body">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.customer.name}
                        </p>
                      </div>
                      <Badge variant={order.status === 'fulfilled' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'} className="font-body capitalize">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-body text-muted-foreground space-y-1">
                      <p>📧 {order.customer.email} • 📞 {order.customer.phone}</p>
                      <p>📍 {order.customer.address}</p>
                      {order.customer.notes && <p>📝 {order.customer.notes}</p>}
                    </div>
                    <div className="border-t border-border pt-3 space-y-1">
                      {order.items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between text-sm font-body">
                          <span className="text-foreground">{product.name} × {quantity}</span>
                          <span className="text-foreground">${(product.price * quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-foreground font-display pt-2 border-t border-border/50">
                        <span>Total</span>
                        <span className="text-accent">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    {order.status !== 'fulfilled' && (
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => { updateOrderStatus(order.id, 'processing'); toast.success('Order marked as processing.'); }} className="bg-primary text-primary-foreground font-body">
                            Mark Processing
                          </Button>
                        )}
                        <Button size="sm" onClick={() => { updateOrderStatus(order.id, 'fulfilled'); toast.success('Order fulfilled!'); }} className="bg-accent text-accent-foreground font-body">
                          Mark Fulfilled
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
