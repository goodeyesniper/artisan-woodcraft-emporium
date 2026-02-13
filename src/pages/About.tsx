import Layout from '@/components/Layout';
import heroBanner from '@/assets/hero-banner.jpg';

export default function About() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-accent font-body text-sm uppercase tracking-[0.15em] mb-2">Our Story</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">About Ryan's Handicraft Works</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <img src={heroBanner} alt="Ryan's workshop" className="rounded-lg shadow-lg" />
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Ryan's Handicraft Works was born from a lifelong passion for woodworking. What started as a hobby in a small garage workshop has grown into a craft studio dedicated to creating beautiful, functional pieces from nature's finest materials.
              </p>
              <p>
                Every item that leaves our workshop is made by hand—from selecting the right wood to the final coat of finish. We believe in slow, careful craftsmanship that results in pieces you'll cherish for decades.
              </p>
              <p>
                We take pride in sourcing sustainable hardwoods and using eco-friendly finishes. Our mission is simple: create beautiful things that last.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '10+', label: 'Years of Experience' },
              { value: '500+', label: 'Pieces Crafted' },
              { value: '100%', label: 'Handmade' },
            ].map(({ value, label }) => (
              <div key={label} className="p-6 bg-card rounded-lg border border-border">
                <p className="font-display text-3xl font-bold text-accent mb-1">{value}</p>
                <p className="font-body text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
