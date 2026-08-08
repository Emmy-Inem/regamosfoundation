# Global Site Scan — Findings and Fix Plan

I scanned routes, pages, admin, forms, SEO assets and the console log. Here is what is broken, what is missing, and what I propose to do.

## Confirmed issues

1. **Accessibility error in the console (every admin page load)**
   The mobile sidebar renders a dialog panel with no title, which triggers the `DialogContent requires a DialogTitle` error and the missing-description warning currently in the console.

2. **Pages with no page title / meta description**
   Admin, Auth, Blog Editor and the OAuth consent page have no metadata component, so browser tabs and any shared link fall back to generic text. Admin-type pages should also be marked no-index.

3. **No code splitting**
   Every page (including the entire admin console, editor and charts library) is loaded eagerly in one bundle. This is the main reason first load feels heavy, especially on mobile.

4. **Volunteer and Partner forms reuse the wrong tables**
   Volunteer applications are written into the members table and partnership enquiries into the general contact table. There is no way in admin to tell a volunteer from a member, or a partner enquiry from a normal contact message.

5. **Unused site-wide search**
   Blog search exists, but there is no global search entry point in the header, and the command palette component is unused.

## Missing features worth adding

- **Reader engagement on blog posts** — comments and likes/reactions with admin moderation. Currently there is no way for readers to respond.
- **Newsletter/announcement trigger from the blog** — a published post cannot be pushed to subscribers, even though bulk email already exists.
- **Volunteer + partner pipelines in admin** — dedicated sections with status tracking, rather than mixing them into members/contacts.
- **Donation receipts on the donor side** — the confirmation email runs from the payment webhook, but there is no downloadable/printable receipt.
- **Event registration confirmation email** — registering for an event stores a record but sends nothing back to the registrant.
- **Site-wide search dialog** — one shortcut to search posts, programs, events and pages.

## Suggested order

**Phase 1 — Fix (small, no schema change)**
- Add the hidden title/description to the sidebar panel to clear the console error.
- Add metadata to Admin, Auth, Blog Editor, OAuth consent; no-index the private ones.
- Convert routes to lazy-loaded chunks with the existing loading skeleton as fallback.

**Phase 2 — Correct the data model**
- New tables for volunteer applications and partnership enquiries, with role-based access matching the existing permission areas, plus admin sections for both.

**Phase 3 — Engagement**
- Comments and reactions on posts, with moderation in admin.
- "Notify subscribers" action when publishing a post.
- Event registration confirmation email.

**Phase 4 — Polish**
- Global search dialog in the header.
- Printable donation receipt.

## Technical notes

- Sidebar fix: wrap a visually hidden title and description inside the mobile `SheetContent` in `src/components/ui/sidebar.tsx`.
- Lazy loading: `React.lazy` + `Suspense` in `src/App.tsx`, keeping `Index` eager for LCP.
- New tables follow the existing pattern: create, grant, enable RLS, then policies using `can_manage` / `is_staff`; anonymous insert allowed for public-facing forms only.
- Comments require moderation state (pending/approved) and anonymous read of approved rows only.
- Emails go through the existing edge-function + Resend setup.

Tell me which phases to build and I will start with Phase 1.
