import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import heroBanner from '@/assets/hero-banner.jpg';

export default function Index() {
  const { products } = useStore();
  const featured = products.filter(p => p.featured).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <img src={heroBanner} alt="Ryan's workshop" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/30" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-xl animate-fade-in">
            <p className="text-accent font-body text-sm uppercase tracking-[0.2em] mb-4">Handcrafted with Love</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-card mb-6 leading-tight">
              Beautiful Woodwork, Made by Hand
            </h1>
            <p className="text-card/80 font-body text-lg mb-8 leading-relaxed">
              Each piece from Ryan's workshop is crafted with care, precision, and a deep love for the art of woodworking.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body text-base px-8">
                Browse Collection <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Star, title: 'Premium Quality', desc: 'Only the finest hardwoods and materials go into every piece.' },
              { icon: Shield, title: 'Built to Last', desc: 'Durable finishes and timeless designs that endure for generations.' },
              { icon: Heart, title: 'Made with Love', desc: 'Every item is hand-crafted with passion and attention to detail.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-accent font-body text-sm uppercase tracking-[0.15em] mb-2">Our Collection</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Creations</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body">
                View All Products <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Have Something Custom in Mind?</h2>
          <p className="font-body opacity-80 mb-8 text-lg">
            Ryan takes custom orders. Share your idea and let's bring it to life in wood.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body px-8">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
