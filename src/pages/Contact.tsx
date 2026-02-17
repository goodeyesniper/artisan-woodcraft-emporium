import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        toast.error("Failed to send message.");
        return;
      }

      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-accent font-body text-sm uppercase tracking-[0.15em] mb-2">Reach Out</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Info */}
            <div className="space-y-8">
              <p className="font-body text-muted-foreground leading-relaxed">
                Have questions about our products, need a custom order, or just want to say hello? We'd love to hear from you.
              </p>
              {[
                { icon: Mail, label: 'Email', value: 'ryanshandicraft@email.com' },
                { icon: Phone, label: 'Phone', value: '+64 027 393 4412' },
                { icon: MapPin, label: 'Workshop', value: '4 Oaks Lane, Motueka New Zealand 7120' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-muted-foreground">{label}</p>
                    <p className="font-body font-medium text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 rounded-lg border border-border">
              <div>
                <Label htmlFor="name" className="font-body text-foreground">Name *</Label>
                <Input id="name" value={form.name} onChange={update('name')} className="mt-1" placeholder="Your name" maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email" className="font-body text-foreground">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={update('email')} className="mt-1" placeholder="your@email.com" maxLength={255} />
              </div>
              <div>
                <Label htmlFor="message" className="font-body text-foreground">Message *</Label>
                <Textarea id="message" value={form.message} onChange={update('message')} className="mt-1" placeholder="Tell us about your project..." rows={5} maxLength={1000} />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
