
Goal: stabilize the blog experience end-to-end by fixing the public blog list, featured cards, post detail rendering, and the editor-to-display formatting pipeline.

1. Rework the blog list page layout
- Refactor `src/pages/Blog.tsx` so featured cards and regular cards use one clean card pattern with:
  - fixed image area
  - non-overlapping text section
  - consistent title/excerpt/date spacing
  - full-card click behavior without nested click conflicts
- Remove decorative overlays on list cards that are making text/images feel broken.
- Add a safer fallback when there are no fetched posts, so the page still looks intentional instead of half-empty.

2. Fix featured articles logic
- Make featured articles derive from the same display source as the main grid, not only raw fetched posts.
- Improve sorting/fallback logic so featured posts always render cleanly even when `view_count` is low or missing.
- Prevent featured cards from showing broken metadata or awkward empty image areas.

3. Fix duplicate cover image rendering in blog detail
- Tighten the `processContent` logic in `src/pages/BlogDetail.tsx` so it only removes the actual duplicated leading content image, instead of using broad regex that can behave oddly.
- Normalize image URL comparison before removal.
- Clean up leftover empty wrappers after the duplicate image is stripped.

4. Improve blog detail content rendering
- Separate excerpt styling from full article styling so global `.prose` rules do not accidentally affect both in unwanted ways.
- Scope rich-text display styles more carefully in `src/index.css` to support:
  - blue underlined links
  - headers/subheaders/body hierarchy
  - Quill font sizes
  - images, lists, blockquotes, and spacing
- Remove CSS that currently cancels inline font sizes (`.prose [style*="font-size"] { font-size: inherit; }`), because that defeats editor formatting.

5. Align editor output with public rendering
- Update `src/components/ui/rich-text-editor.tsx` and/or display styles so what is selected in the editor matches what users see after publishing:
  - heading levels
  - font sizes
  - paragraph spacing
  - links
- Ensure blog excerpts remain simple/controlled while full content can carry richer formatting.

6. Clean up content and category handling
- Unify categories used in `Blog.tsx` and `BlogEditor.tsx` so filtering never hides valid posts because of naming mismatch.
- Sanitize displayed excerpts in admin/public views so raw HTML does not leak into card summaries.

Files to update
- `src/pages/Blog.tsx`
- `src/pages/BlogDetail.tsx`
- `src/components/ui/rich-text-editor.tsx`
- `src/pages/BlogEditor.tsx`
- `src/index.css`
- possibly `src/components/admin/BlogManagement.tsx` for cleaner excerpt previews

Technical notes
- Current issues are mostly frontend rendering/styling problems, not backend/RLS issues.
- The biggest correctness bug is the current duplicate-image removal strategy in `BlogDetail`, which is too regex-heavy and likely causing the “showing twice in a weird way” behavior.
- The biggest formatting bug is in `src/index.css`: inline font-size styling is effectively being neutralized, which explains why published content often looks like normal body text.
- The biggest UX issue on the list page is inconsistent card structure between featured posts, regular posts, and fallback posts.

Expected result
- Blog page looks consistent on mobile and desktop.
- Featured articles display cleanly and reliably.
- Cover image appears once only.
- Published content preserves headers, subheaders, body text, and link styling correctly.
- Admin formatting choices are reflected on the live site.
