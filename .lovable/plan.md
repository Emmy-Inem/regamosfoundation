## Goal

1. Swap the clearly AI-generated images on the site for free, royalty-free stock photos (Unsplash/Pexels), keeping the real event photos you've uploaded.
2. Share a high-level list of missing features worth adding next (no implementation in this pass).

## Image audit — what gets replaced

Confirmed AI-generated decorative assets in `src/assets/` (these were created with the image model during the initial build):

- `hero-bg.jpg` — homepage hero background
- `community.jpg` — Mission/Programs section
- `education.jpg` — Programs section
- `empowerment.jpg` — Programs/About section
- `impact-digital-library.jpg`
- `impact-medical-outreach.jpg`
- `impact-financial-literacy.jpg`
- `impact-palm-seedlings.jpg`
- `impact-menstrual-hygiene.jpg`
- `impact-community-outreach.jpg`
- `impact-child-protection.jpg`
- `impact-life-skills.jpg`
- `impact-hp-donation.jpg`
- `impact-computer-training.jpg`
- `impact-childrens-day.jpg`
- `impact-roco-orphanage.jpg`
- `impact-peculiar-saint.jpg`

Kept as-is:
- `logo.png`, `regamos-academy-logo.png`
- All event flyers uploaded to the `content-uploads` bucket (YEP 2026, Family Day 2026, etc.)
- Any real photos stored in DB (`impact_stories.image_url`, `team_members.avatar_url`, `blog_posts.cover_image`)

## How the swap works

1. For each asset above, pick a topical, high-quality Unsplash photo (African women's empowerment, youth training, classroom, medical outreach, community gathering, hygiene/health, children at school, computer lab, etc.).
2. Download into the same `src/assets/` paths (same filenames) so no imports change.
3. Quick visual QA in the preview at mobile + desktop to confirm composition still reads well behind overlays.
4. Add a short `CREDITS.md` in `src/assets/` listing each photo's Unsplash author + URL (Unsplash license doesn't require attribution but it's good practice).

I will also re-check `impact_stories` rows in the database; any row whose `image_url` points to an obviously AI-rendered asset will be flagged in chat for you to decide whether to replace.

## Missing features — high-level list

Donor experience
- Recurring/monthly giving (Monnify subscription or Paystack Plans)
- Auto-emailed PDF donation receipts + annual giving statements
- Donor wall / "Thank you" page with opt-in public names
- Dedication / in-honor-of / in-memory-of giving option
- Multi-currency display (NGN, USD, GBP)

Engagement & content
- Site-wide search (blog + programs + impact stories)
- Newsletter archive page (already sending — surface past issues)
- Comment moderation queue UI in admin (currently guest comments are allowed)
- Related posts + reading-time on blog detail
- Volunteer hours tracker / volunteer portal login

Programs & events
- Online event registration with calendar (.ics) download
- Post-event photo galleries linked from past events
- Ticketing / paid workshop support
- Sponsor logos carousel on event pages

Admin & operations
- Dashboard KPIs (donations this month, new members, blog views) — already partial, expand
- CSV export with date filters on all tables
- Audit-log search & filters
- Two-factor auth for admin accounts
- Scheduled blog publishing

Trust, compliance & SEO
- Annual report / financial transparency page (downloadable PDFs)
- Accreditation / partner-logo strip
- Cookie consent banner (GDPR/NDPR)
- Schema.org `NGO` + `DonateAction` structured data on Donate page
- Open Graph image per blog post (auto-generated)

Accessibility & performance
- Skip-to-content already exists — add language switcher (EN/Pidgin/French) groundwork
- Image `srcset` + AVIF variants via a build step
- Lighthouse CI in publish flow

## Out of scope this round
- No backend schema changes, no new pages, no auth changes.
- Feature suggestions are advisory only — pick which ones you want and I'll plan them separately.
