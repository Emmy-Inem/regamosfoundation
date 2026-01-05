import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, monnify-signature",
};

interface MonnifyWebhookPayload {
  transactionReference: string;
  paymentReference: string;
  amountPaid: string;
  totalPayable: string;
  settlementAmount: string;
  paidOn: string;
  paymentStatus: string;
  paymentDescription: string;
  currency: string;
  paymentMethod: string;
  product: {
    type: string;
    reference: string;
  };
  cardDetails: any;
  accountDetails: any;
  accountPayments: any[];
  customer: {
    email: string;
    name: string;
  };
  metaData: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const payload: MonnifyWebhookPayload = await req.json();
    
    console.log("Received Monnify webhook:", JSON.stringify(payload, null, 2));

    const { transactionReference, paymentStatus, amountPaid, paymentMethod, customer } = payload;

    if (!transactionReference) {
      console.error("No transaction reference provided");
      return new Response(
        JSON.stringify({ error: "Transaction reference required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Find the donation by transaction reference
    const { data: donation, error: findError } = await supabaseClient
      .from("donations")
      .select("*")
      .eq("transaction_reference", transactionReference)
      .single();

    if (findError || !donation) {
      // Try to find by email if transaction reference not found
      console.log("Donation not found by transaction reference, trying email:", customer?.email);
      
      if (customer?.email) {
        const { data: donationByEmail, error: emailError } = await supabaseClient
          .from("donations")
          .select("*")
          .eq("email", customer.email)
          .eq("payment_status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (emailError || !donationByEmail) {
          console.error("Donation not found:", findError || emailError);
          return new Response(
            JSON.stringify({ error: "Donation not found" }),
            { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Update donation found by email
        const newStatus = paymentStatus === "PAID" ? "completed" : paymentStatus.toLowerCase();
        
        const { error: updateError } = await supabaseClient
          .from("donations")
          .update({
            payment_status: newStatus,
            payment_method: paymentMethod || "card",
            transaction_reference: transactionReference,
          })
          .eq("id", donationByEmail.id);

        if (updateError) {
          console.error("Error updating donation:", updateError);
          throw updateError;
        }

        console.log("Updated donation by email:", donationByEmail.id, "to status:", newStatus);

        // Send confirmation email if payment was successful
        if (paymentStatus === "PAID") {
          try {
            const emailResponse = await fetch(
              `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-donation-confirmation`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
                },
                body: JSON.stringify({
                  donorName: donationByEmail.donor_name,
                  email: donationByEmail.email,
                  amount: parseFloat(amountPaid),
                  transactionReference: transactionReference,
                }),
              }
            );
            console.log("Confirmation email sent:", await emailResponse.json());
          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: "Donation updated successfully" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Donation not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update donation status
    const newStatus = paymentStatus === "PAID" ? "completed" : paymentStatus.toLowerCase();
    
    const { error: updateError } = await supabaseClient
      .from("donations")
      .update({
        payment_status: newStatus,
        payment_method: paymentMethod || "card",
      })
      .eq("id", donation.id);

    if (updateError) {
      console.error("Error updating donation:", updateError);
      throw updateError;
    }

    console.log("Updated donation:", donation.id, "to status:", newStatus);

    // Send confirmation email if payment was successful
    if (paymentStatus === "PAID") {
      try {
        const emailResponse = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-donation-confirmation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({
              donorName: donation.donor_name,
              email: donation.email,
              amount: parseFloat(amountPaid),
              transactionReference: transactionReference,
            }),
          }
        );
        console.log("Confirmation email sent:", await emailResponse.json());
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
