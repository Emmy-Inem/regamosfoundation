import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listUpcomingEvents from "./tools/list-upcoming-events";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import registerForEvent from "./tools/register-for-event";
import listMyNotifications from "./tools/list-my-notifications";
import markNotificationRead from "./tools/mark-notification-read";
import getMyProfile from "./tools/get-my-profile";

// The OAuth issuer MUST be the direct Supabase host, built from the project
// ref (not from SUPABASE_URL, which may be the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "regamos-foundation-mcp",
  title: "Regamos Foundation",
  version: "0.1.0",
  instructions:
    "Tools for the Regamos Foundation website. Read upcoming events and blog posts, register the signed-in user for an event, and manage their in-app notifications and profile.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listUpcomingEvents,
    listBlogPosts,
    getBlogPost,
    registerForEvent,
    listMyNotifications,
    markNotificationRead,
    getMyProfile,
  ],
});
