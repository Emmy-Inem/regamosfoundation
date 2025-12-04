import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterWelcomeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterWelcomeRequest = await req.json();

    if (!email) {
      console.error("Missing email in request");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending welcome email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Regamos Foundation <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Regamos Foundation Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #228B22 0%, #32CD32 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Welcome to Regamos Foundation
              </h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for subscribing to our newsletter! 🎉
              </p>
              
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                You're now part of a community dedicated to transforming lives through empowerment, education, and community development.
              </p>
              
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                As a subscriber, you'll receive:
              </p>
              
              <ul style="color: #555555; font-size: 15px; line-height: 1.8; margin-bottom: 30px; padding-left: 20px;">
                <li>Updates on our programs and impact stories</li>
                <li>Opportunities to volunteer and make a difference</li>
                <li>News about upcoming events and initiatives</li>
                <li>Ways to support widows, orphans, and youth in need</li>
              </ul>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://regamosfoundation.lovable.app/programs" 
                   style="display: inline-block; background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%); color: #1a1a1a; text-decoration: none; padding: 14px 30px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                  Explore Our Programs
                </a>
              </div>
              
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-top: 30px;">
                Together, we can make a lasting impact in communities across Nigeria.
              </p>
              
              <p style="color: #555555; font-size: 15px; line-height: 1.6;">
                With gratitude,<br>
                <strong>The Regamos Foundation Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #228B22; padding: 30px; text-align: center;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 15px;">
                Follow us on social media
              </p>
              <div style="margin-bottom: 20px;">
                <a href="https://www.facebook.com/share/1ABfZYGXHo/" style="color: #ffffff; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://x.com/Foundation_raf" style="color: #ffffff; text-decoration: none; margin: 0 10px;">Twitter</a>
                <a href="https://www.instagram.com/regamosfoundation" style="color: #ffffff; text-decoration: none; margin: 0 10px;">Instagram</a>
                <a href="https://www.linkedin.com/company/regamosfoundation/" style="color: #ffffff; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </div>
              <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Regamos Foundation. All rights reserved.<br>
                Lagos, Nigeria
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter-welcome function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
