import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  subject: string;
  htmlContent: string;
  recipientGroup: "all" | "newsletter" | "members" | "donors" | "custom";
  customEmails?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { subject, htmlContent, recipientGroup, customEmails }: BulkEmailRequest = await req.json();

    console.log(`Starting bulk email send to group: ${recipientGroup}`);

    let emails: string[] = [];

    switch (recipientGroup) {
      case "newsletter":
        const { data: newsletterData, error: newsletterError } = await supabase
          .from("newsletter_subscriptions")
          .select("email");
        if (newsletterError) throw newsletterError;
        emails = newsletterData?.map((n) => n.email) || [];
        break;

      case "members":
        const { data: memberData, error: memberError } = await supabase
          .from("members")
          .select("email")
          .eq("status", "approved");
        if (memberError) throw memberError;
        emails = memberData?.map((m) => m.email) || [];
        break;

      case "donors":
        const { data: donorData, error: donorError } = await supabase
          .from("donations")
          .select("email");
        if (donorError) throw donorError;
        // Remove duplicates
        emails = [...new Set(donorData?.map((d) => d.email) || [])];
        break;

      case "all":
        // Get all unique emails from all tables
        const [newsletters, members, donors] = await Promise.all([
          supabase.from("newsletter_subscriptions").select("email"),
          supabase.from("members").select("email").eq("status", "approved"),
          supabase.from("donations").select("email"),
        ]);
        
        const allEmails = [
          ...(newsletters.data?.map((n) => n.email) || []),
          ...(members.data?.map((m) => m.email) || []),
          ...(donors.data?.map((d) => d.email) || []),
        ];
        emails = [...new Set(allEmails)];
        break;

      case "custom":
        emails = customEmails || [];
        break;

      default:
        throw new Error("Invalid recipient group");
    }

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No recipients found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending email to ${emails.length} recipients`);

    // Send emails in batches of 50 to avoid rate limits
    const batchSize = 50;
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (email) => {
        try {
          await resend.emails.send({
            from: "Regamos Foundation <onboarding@resend.dev>",
            to: [email],
            subject: subject,
            html: htmlContent,
          });
          return { success: true, email };
        } catch (error: any) {
          console.error(`Failed to send to ${email}:`, error.message);
          return { success: false, email, error: error.message };
        }
      });

      const results = await Promise.all(emailPromises);
      
      results.forEach((result) => {
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          errors.push(`${result.email}: ${result.error}`);
        }
      });

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`Email campaign completed. Success: ${successCount}, Failed: ${failCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        totalRecipients: emails.length,
        successCount,
        failCount,
        errors: errors.slice(0, 10), // Return first 10 errors only
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-email function:", error);
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
