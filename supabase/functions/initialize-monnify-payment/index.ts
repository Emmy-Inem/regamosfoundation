import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, customerName, customerEmail, paymentReference, paymentDescription } = await req.json();

    const apiKey = Deno.env.get('MONNIFY_API_KEY');
    const secretKey = Deno.env.get('MONNIFY_SECRET_KEY');
    const contractCode = Deno.env.get('MONNIFY_CONTRACT_CODE');

    if (!apiKey || !secretKey || !contractCode) {
      console.error('Missing Monnify credentials');
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Get access token
    console.log('Getting Monnify access token...');
    const authString = btoa(`${apiKey}:${secretKey}`);
    
    const authResponse = await fetch('https://api.monnify.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error('Monnify auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with payment service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authData = await authResponse.json();
    const accessToken = authData.responseBody.accessToken;
    console.log('Access token obtained successfully');

    // Step 2: Initialize transaction
    console.log('Initializing payment transaction...');
    const paymentData = {
      amount: parseFloat(amount),
      customerName,
      customerEmail,
      paymentReference,
      paymentDescription: paymentDescription || 'Donation to Regamos Foundation',
      currencyCode: 'NGN',
      contractCode,
      redirectUrl: `${req.headers.get('origin')}/donate?payment=success`,
      paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
    };

    const initResponse = await fetch('https://api.monnify.com/api/v1/merchant/transactions/init-transaction', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!initResponse.ok) {
      const initError = await initResponse.text();
      console.error('Monnify initialization error:', initError);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize payment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const initData = await initResponse.json();
    console.log('Payment initialized successfully');

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: initData.responseBody.checkoutUrl,
        transactionReference: initData.responseBody.transactionReference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in initialize-monnify-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
