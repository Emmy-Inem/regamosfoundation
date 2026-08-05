// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Includes every public route plus dynamic blog posts and past-event highlight pages.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.regamosfoundation.com.ng";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/programs", changefreq: "weekly", priority: "0.9" },
  { path: "/impact", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/donate", changefreq: "monthly", priority: "0.9" },
  { path: "/membership", changefreq: "monthly", priority: "0.8" },
  { path: "/volunteer", changefreq: "monthly", priority: "0.7" },
  { path: "/partner", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

async function fetchRows(table: string, select: string, filter = ""): Promise<Record<string, unknown>[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}${filter}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as Record<string, unknown>[];
  } catch {
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const posts = await fetchRows("blog_posts", "id", "&published_at=not.is.null");
  const blogEntries: SitemapEntry[] = posts.map((p) => ({
    path: `/blog/${p.id}`,
    changefreq: "weekly",
    priority: "0.7",
  }));

  const events = await fetchRows("upcoming_programs", "id,status", "&status=eq.completed");
  const eventEntries: SitemapEntry[] = events.map((e) => ({
    path: `/events/${e.id}`,
    changefreq: "monthly",
    priority: "0.6",
  }));

  const entries = [...staticEntries, ...blogEntries, ...eventEntries];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();
