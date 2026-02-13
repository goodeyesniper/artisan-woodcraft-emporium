import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';

export default function Shop() {
  const { products } = useStore();
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-body text-sm uppercase tracking-[0.15em] mb-2">Browse</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Collection</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-20">No products found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
