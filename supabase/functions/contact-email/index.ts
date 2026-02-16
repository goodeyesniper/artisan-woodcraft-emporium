import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { name, email, message } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const TO_EMAIL = Deno.env.get("TO_EMAIL");

    const payload = {
      from: "Artisan Woodcraft <onboarding@resend.dev>",
      to: [TO_EMAIL!],
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resendRes.ok) {
      const error = await resendRes.text();
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});