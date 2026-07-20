import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description: "List Regamos Foundation blog posts, optionally filtered by category.",
  inputSchema: {
    category: z.string().optional().describe("Filter by category (Empowerment, Education, Community, Youth Development, Programs, Mental Health)."),
    limit: z.number().int().min(1).max(50).optional().describe("Max posts to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let query = supabase
      .from("blog_posts")
      .select("id,title,excerpt,category,author,published_at,view_count,image_url")
      .order("published_at", { ascending: false })
      .limit(limit ?? 10);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
