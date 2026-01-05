import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DonationEmailRequest {
  donorName: string;
  email: string;
  amount: number;
  transactionReference?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donorName, email, amount, transactionReference }: DonationEmailRequest = await req.json();

    console.log("Sending donation confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Regamos Foundation <onboarding@resend.dev>",
      to: [email],
      subject: "Thank You for Your Generous Donation! 💚",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #16a34a; margin: 0; font-size: 28px;">Thank You, ${donorName}! 💚</h1>
              </div>
              
              <!-- Content -->
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Your generous donation of <strong style="color: #16a34a; font-size: 20px;">₦${amount.toLocaleString()}</strong> has been received and is making a real difference in the lives of widows, orphans, and youth across Nigeria.
              </p>
              
              ${transactionReference ? `
              <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                  <strong>Transaction Reference:</strong> ${transactionReference}
                </p>
              </div>
              ` : ''}
              
              <h2 style="color: #374151; font-size: 18px; margin-top: 30px;">Your Impact:</h2>
              <ul style="color: #6b7280; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                <li>Providing educational scholarships for orphans</li>
                <li>Empowering widows through vocational training</li>
                <li>Supporting youth with skills development</li>
                <li>Building stronger communities across Nigeria</li>
              </ul>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 25px;">
                We are deeply grateful for your trust in our mission. You will receive regular updates on how your contribution is creating lasting change.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://regamosfoundation.lovable.app/impact" style="display: inline-block; background-color: #16a34a; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  See Your Impact
                </a>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  With gratitude,<br>
                  <strong style="color: #374151;">The Regamos Foundation Team</strong>
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 15px;">
                  📞 0802 330 0639 | 📧 regamosfoundation@gmail.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-donation-confirmation function:", error);
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
