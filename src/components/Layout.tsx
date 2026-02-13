import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
            🪵 Ryan's <span className="text-accent">Handicraft</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-sm tracking-wide uppercase transition-colors hover:text-accent ${
                  location.pathname === l.to ? 'text-accent font-semibold' : 'text-muted-foreground'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/cart" className="relative text-foreground hover:text-accent transition-colors">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative text-foreground">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-foreground">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={`block font-body text-sm uppercase tracking-wide ${
                  location.pathname === l.to ? 'text-accent font-semibold' : 'text-muted-foreground'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-lg font-bold mb-3">Ryan's Handicraft Works</h3>
              <p className="text-sm opacity-80 font-body leading-relaxed">
                Handcrafted with love and dedication. Every piece tells a story of artisan craftsmanship.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm opacity-80 font-body">
                <Link to="/shop" className="block hover:opacity-100">Shop</Link>
                <Link to="/about" className="block hover:opacity-100">About Us</Link>
                <Link to="/contact" className="block hover:opacity-100">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3">Contact</h4>
              <div className="space-y-2 text-sm opacity-80 font-body">
                <p>ryanshandicraft@email.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60 font-body">
            © 2026 Ryan's Handicraft Works. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
