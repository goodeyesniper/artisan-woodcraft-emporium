import Layout from '@/components/Layout';


export default function Cancel() {
  return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-display font-bold">Payment Canceled</h1>
        <p className="text-muted-foreground mt-4">You can try again anytime.</p>
      </div>
    </Layout>
  );
}