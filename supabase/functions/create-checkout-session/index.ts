import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const stripe = new Stripe(STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

    const { items, customer } = await req.json();

    // Convert cart items to Stripe line items (using flattened items)
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:8080/cancel",
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_notes: customer.notes || "",
        items: JSON.stringify(items), // already flattened
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});