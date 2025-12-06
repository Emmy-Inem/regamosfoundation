import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const DynamicSitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    const baseUrl = 'https://regamosfoundation.lovable.app';
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticUrls: SitemapUrl[] = [
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
    ];

    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });

    const blogUrls: SitemapUrl[] = (blogPosts || []).map((post) => ({
      loc: `${baseUrl}/blog/${post.id}`,
      lastmod: post.updated_at.split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
    }));

    const allUrls = [...staticUrls, ...blogUrls];

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
</urlset>`;

    setSitemapContent(sitemap);
  };

  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
      {sitemapContent}
    </pre>
  );
};

export default DynamicSitemap;
