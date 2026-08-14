import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendMail } from "https://deno.land/x/smtp/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  email: string;
  verificationCode: string;
  role: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, verificationCode, role }: EmailRequest = await req.json();

    const emailTemplate = `
      <h2>Welcome to SafeDonate Network!</h2>
      <p>Thank you for registering as a ${role}. Please verify your email using the code below:</p>
      <h1 style="color:#800033;">${verificationCode}</h1>
      <p>This code expires in 10 minutes.</p>
    `;

    // Send email via Gmail SMTP
    await sendMail({
      hostname: "smtp.gmail.com",
      port: 465,
      username: "indusgaming0000@gmail.com", // Your Gmail
      password: "indus0000@gmail.com",    // 16-char App Password
      from: "SafeDonate Network <indusgaming0000@gmail.com>",
      to: email,
      subject: "Verify Your Email - SafeDonate Network",
      content: emailTemplate,
    });

    return new Response(
      JSON.stringify({ message: "Verification email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send verification email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
