import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const baseUrl = 'https://www.regamosfoundation.com.ng'
    const today = new Date().toISOString().split('T')[0]

    // Static pages
    const staticUrls = [
      { loc: baseUrl, lastmod: today, changefreq: 'weekly', priority: '1.0' },
      { loc: `${baseUrl}/about`, lastmod: today, changefreq: 'monthly', priority: '0.9' },
      { loc: `${baseUrl}/programs`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
      { loc: `${baseUrl}/impact`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/blog`, lastmod: today, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/donate`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/volunteer`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
      { loc: `${baseUrl}/membership`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
      { loc: `${baseUrl}/partner`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
      { loc: `${baseUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/privacy-policy`, lastmod: today, changefreq: 'yearly', priority: '0.3' },
      { loc: `${baseUrl}/terms-of-service`, lastmod: today, changefreq: 'yearly', priority: '0.3' },
    ]

    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })

    const blogUrls = (blogPosts || []).map((post) => ({
      loc: `${baseUrl}/blog/${post.id}`,
      lastmod: post.updated_at.split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
    }))

    // Fetch programs — upcoming ones anchor on /programs, past ones have
    // their own full event highlight page at /events/:id
    const { data: programs } = await supabase
      .from('upcoming_programs')
      .select('id, updated_at, status')
      .order('start_date', { ascending: false })

    const programUrls = (programs || []).map((program) => ({
      loc:
        program.status === 'upcoming'
          ? `${baseUrl}/programs#${program.id}`
          : `${baseUrl}/events/${program.id}`,
      lastmod: program.updated_at.split('T')[0],
      changefreq: 'weekly',
      priority: '0.6',
    }))

    const allUrls = [...staticUrls, ...blogUrls, ...programUrls]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error: unknown) {
    console.error('Error generating sitemap:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})