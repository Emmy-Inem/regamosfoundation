# Role-Based Management System (RBMS)

A proper staff permission system so the foundation can give each team member access to only the parts of the admin they are responsible for — instead of the current all-or-nothing "admin" access.

## New roles

Alongside the existing Super Admin, Admin, Member and User:

| Role | What they can do |
| --- | --- |
| **Content Editor** | Blog posts, Site Content, Media Library, Impact Stories, Impact Stats, Achievements, Testimonials |
| **Program Manager** | All Programs, Upcoming/Past Events, Event Registrations, Achievements, Media Library |
| **Communications Officer** | Newsletter Subscribers, Email Campaigns, Contact Messages, Blog Posts (read + write), Media Library |

- **Super Admin** keeps everything, including managing roles and viewing the Activity Log.
- **Admin** keeps everything except assigning Super Admin.
- Members/users keep their current, non-admin experience.

A user can hold more than one role (e.g. Content Editor + Program Manager), and permissions add up.

## Permission model

Each admin section maps to a named permission (for example `content.blog`, `programs.events`, `community.newsletter`, `system.users`). A single shared permission matrix defines which roles hold which permissions, and it drives three things at once:

1. **Sidebar** — only the groups and items a user is allowed to see are rendered; empty groups disappear.
2. **Page access** — if someone types a section they don't have, they see a clear "You don't have access to this section" panel instead of the data.
3. **Database rules** — access policies on each table are updated so a Content Editor genuinely cannot write to donations, a Program Manager cannot edit the newsletter list, etc. Enforcement is not just visual.

Anyone holding at least one staff role can reach `/admin` and lands on the first section they're allowed to see (Analytics for admins, otherwise their first permitted section).

## Roles & Permissions admin screen

The existing "Users & Roles" screen is upgraded to:

- List every user with all their role badges, searchable by name/email.
- Assign or remove any staff role (Super Admin assignment stays restricted to Super Admins).
- A **Permissions Reference** tab showing the full role-to-permission matrix as a readable grid, with a written description of each role's remit so the team knows who does what.
- Every role change continues to be written to the Activity Log and to notify the affected user.

## Technical notes

- Database migration: extend the `app_role` enum with `content_editor`, `program_manager`, `communications_officer`; add a `has_any_role(_user_id, _roles app_role[])` security-definer function; add a `can_manage(_user_id, _area text)` helper used by table policies.
- Rewrite write-policies on `blog_posts`, `site_content`, `impact_stories`, `impact_stats`, `achievements`, `testimonials`, `team_members`, `programs`, `upcoming_programs`, `event_registrations`, `newsletter_subscriptions`, `contact_submissions`, `donations` and `members` to use the area helper rather than a blanket admin check. Public read access is unchanged.
- New `src/lib/permissions.ts` holds the single permission matrix + role metadata (label, description, icon) shared by the sidebar, the guard and the reference tab.
- `useAuth` returns the full `roles: AppRole[]` array plus a `can(permission)` helper; `isAdmin`/`isSuperAdmin` are kept for backwards compatibility.
- `Admin.tsx` filters `GROUPS` through `can()` and swaps the `!isAdmin` redirect for a "has any staff role" check.
- `UserRolesManagement.tsx` gains the multi-role assignment UI and the permissions matrix tab.

Note: I'll wire the guards after the migration is approved, since the new role values must exist in the database first.
