import Layout from '@/components/Layout';

export default function Success() {
  return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-display font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground mt-4">Thank you for your order.</p>
      </div>
    </Layout>
  );
}