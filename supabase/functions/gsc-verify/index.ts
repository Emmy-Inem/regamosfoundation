// One-off helper to get the Google site verification meta token.
// GET this function and it returns { token } to paste into index.html.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const LOVABLE = Deno.env.get('LOVABLE_API_KEY');
  const GSC = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY');
  if (!LOVABLE || !GSC) {
    return new Response(JSON.stringify({ error: 'Missing keys', hasLovable: !!LOVABLE, hasGsc: !!GSC }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') ?? 'token';
  const site = 'https://regamosfoundation.lovable.app/';

  if (action === 'token') {
    const r = await fetch('https://connector-gateway.lovable.dev/google_search_console/siteVerification/v1/token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE}`,
        'X-Connection-Api-Key': GSC,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ site: { identifier: site, type: 'SITE' }, verificationMethod: 'META' }),
    });
    return new Response(await r.text(), { status: r.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (action === 'verify') {
    const r = await fetch('https://connector-gateway.lovable.dev/google_search_console/siteVerification/v1/webResource?verificationMethod=META', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE}`,
        'X-Connection-Api-Key': GSC,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ site: { identifier: site, type: 'SITE' } }),
    });
    return new Response(await r.text(), { status: r.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (action === 'add-site') {
    const r = await fetch(`https://connector-gateway.lovable.dev/google_search_console/webmasters/v3/sites/${encodeURIComponent(site)}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${LOVABLE}`, 'X-Connection-Api-Key': GSC },
    });
    return new Response(JSON.stringify({ status: r.status, body: await r.text() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (action === 'submit-sitemap') {
    const sitemap = 'https://regamosfoundation.lovable.app/sitemap.xml';
    const r = await fetch(`https://connector-gateway.lovable.dev/google_search_console/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(sitemap)}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${LOVABLE}`, 'X-Connection-Api-Key': GSC },
    });
    return new Response(JSON.stringify({ status: r.status, body: await r.text() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: corsHeaders });
});
