import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";


serve(async (req) => {
  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const stripe = new Stripe(STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  const ADMIN_EMAIL = Deno.env.get("TO_EMAIL");



  const event = await req.json();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // SAFELY read metadata
    const metadata = session.metadata || {};

    // SAFELY parse items
    let rawItems = [];
    try {
      rawItems = JSON.parse(metadata.items || "[]");
    } catch (_) {
      rawItems = [];
    }

    // Flatten items so Supabase stores them correctly
    const items = rawItems.map((i: any) => ({
      id: i.id ?? "",
      name: i.name ?? "",
      price: i.price ?? 0,
      quantity: i.quantity ?? 1,
      image: i.image,
    }));


    const customer = {
      name: metadata.customer_name ?? "",
      email: metadata.customer_email ?? "",
      phone: metadata.customer_phone ?? "",
      address: metadata.customer_address ?? "",
      notes: metadata.customer_notes ?? "",
    };

    const total = (session.amount_total ?? 0) / 100;

    await supabase.from("orders").insert({
      items,
      customer,
      total,
      status: "pending",
    });

    // 2️⃣ Send admin notification email
    try {
      await resend.emails.send({
        from: "Artisan Woodcraft <onboarding@resend.dev>",
        to: ADMIN_EMAIL!,
        subject: `New Order Received`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="margin-bottom: 10px;">New Order Received</h2>

            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <p><strong>Notes:</strong> ${customer.notes || "None"}</p>

            <h3 style="margin-top: 25px;">Items</h3>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Details</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td style="padding: 8px; vertical-align: top;">
                      <img src="${item.image || "https://via.placeholder.com/80"}"
                          alt="${item.name}"
                          style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
                    </td>
                    <td style="padding: 8px; vertical-align: top;">
                      <strong>${item.name}</strong><br/>
                      Price: $${item.price}<br/>
                      Quantity: ${item.quantity}
                    </td>
                    <td style="padding: 8px; text-align: right; vertical-align: top;">
                      $${item.price * item.quantity}
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <h3 style="margin-top: 20px;">Total: $${total}</h3>
          </div>
        `,
      });
    } catch (e) {
      console.error("Admin email failed:", e);
    }

    // 3️⃣ Send customer confirmation email
    try {
      await resend.emails.send({
        from: "Artisan Woodcraft <onboarding@resend.dev>",
        to: customer.email,
        subject: "Thank you for your order!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #f7f5f2; color: #333;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">

              <!-- Header -->
              <h2 style="text-align: center; margin-bottom: 10px; color: #4a3f35;">
                Thank you for your order, ${customer.name}!
              </h2>
              <p style="text-align: center; margin-top: 0; color: #6b5e54;">
                We’re excited to start crafting your piece.
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e0dcd7; margin: 20px 0;" />

              <!-- Order Summary Title -->
              <h3 style="color: #4a3f35; margin-bottom: 12px;">Order Summary</h3>

              <!-- Items Table -->
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Details</th>
                    <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td style="padding: 10px; vertical-align: top;">
                        <img src="${item.image || "https://via.placeholder.com/80"}"
                            alt="${item.name}"
                            style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
                      </td>
                      <td style="padding: 10px; vertical-align: top;">
                        <strong style="font-size: 15px;">${item.name}</strong><br/>
                        <span style="color: #6b5e54;">Price:</span> $${item.price}<br/>
                        <span style="color: #6b5e54;">Quantity:</span> ${item.quantity}
                      </td>
                      <td style="padding: 10px; text-align: right; vertical-align: top;">
                        $${item.price * item.quantity}
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>

              <!-- Total -->
              <h3 style="text-align: right; margin-top: 20px; color: #4a3f35;">
                Total: $${total}
              </h3>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e0dcd7; margin: 20px 0;" />

              <!-- Footer Message -->
              <p style="font-size: 14px; color: #6b5e54;">
                We’ll reach out soon with updates about your order.  
                If you have any questions, simply reply to this email — we’re here to help.
              </p>

              <p style="font-size: 14px; color: #4a3f35; margin-top: 20px;">
                Warm regards,<br/>
                <strong>Artisan Woodcraft</strong>
              </p>

            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error("Customer email failed:", e);
    }
  }

  return new Response("ok", { status: 200 });
});