import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function userClient(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "register_for_event",
  title: "Register for event",
  description: "Register the signed-in user for a Regamos Foundation upcoming event.",
  inputSchema: {
    program_id: z.string().uuid().describe("Upcoming program id to register for."),
    full_name: z.string().trim().min(1).describe("Registrant full name."),
    phone: z.string().trim().min(5).describe("Registrant phone number."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ program_id, full_name, phone }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const email = ctx.getUserEmail();
    if (!email) {
      return { content: [{ type: "text", text: "Signed-in user has no email claim" }], isError: true };
    }
    const { data, error } = await userClient(ctx)
      .from("event_registrations")
      .insert({ program_id, full_name, phone, email })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Registered for event. Registration id: ${data.id}` }],
      structuredContent: { registration: data },
    };
  },
});
