## What's actually broken

Your custom domain is not served by Lovable. Verified just now:

```text
https://regamosfoundation.lovable.app/about       -> 200 OK   (Lovable, works)
https://www.regamosfoundation.com.ng/about        -> 404      (server: Vercel)
https://www.regamosfoundation.com.ng/             -> 200 OK   (server: Vercel)
```

The app is a single-page React app: only `index.html` really exists. Lovable's hosting knows to serve `index.html` for any unknown path, so every route works there. The Vercel deployment does not, so anything other than `/` returns Vercel's 404 page. That's why only the homepage survives when you share a link.

## Fix: SPA rewrite for Vercel

Add a `vercel.json` at the project root that tells Vercel to serve the app for every path:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Important caveat: this only takes effect if the Vercel project is deploying **this** repository. If that Vercel site is an older copy or a separate export, the file will sit unused and links will still 404 — in that case the real fix is repointing the domain to Lovable (Project settings > Domains), which needs no config at all. After the change I'll re-test `/about` and a blog detail URL on the live domain and tell you plainly which of the two situations you're in.

I'll also add `public/_redirects` (`/* /index.html 200`) as a harmless fallback in case the domain ever moves to Netlify-style hosting.

## Full sweep

1. **Routes** — load every route in a headless browser (home, about, programs, impact, blog, blog detail, events/:id, donate, volunteer, membership, partner, contact, privacy, terms, auth) and report any that error, 404, or show a blank screen.
2. **Console/network** — collect JS errors and failed requests across those pages.
3. **Metadata & SEO** — pull the current SEO findings, verify title/description/canonical/og tags, and confirm the sitemap lists real routes. Fix what's fixable in code.
4. **Backend security** — run the security scan and database linter; report criticals and fix genuine ones (existing accepted risks in security memory stay accepted).
5. **Mobile layout** — screenshot key pages at phone width and fix overflow or unreadable spots.

I'll report findings with evidence and fix the ones that are code-level; anything that needs a decision from you I'll list rather than guess.

## Technical notes

- New files: `vercel.json`, `public/_redirects`.
- No changes to app logic, routing, or the database schema for the link fix.
- Sweep fixes will be scoped and listed individually before/as I make them.
