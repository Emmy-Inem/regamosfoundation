

# Fix: Make Links Clickable in Blog Posts

## Problem
Links inserted via the rich text editor in blog post content are not clickable. The Tailwind CSS `prose` class styles links but doesn't guarantee they're interactive — and there's no CSS ensuring links in the rendered HTML have proper styling (underline, color, cursor) or that they open correctly. Additionally, the `prose` classes may be overridden by global styles.

## Root Cause
The blog content div uses `dangerouslySetInnerHTML` with Tailwind's `prose` classes, but:
1. There are no explicit styles ensuring links (`a` tags) inside blog content are clickable, underlined, and visually distinct
2. Links need `target="_blank"` and `rel="noopener noreferrer"` for external URLs — the editor doesn't add these by default

## Plan

### 1. Add CSS styles for blog content links
**File: `src/index.css`** — Add styles after the rich text editor section to ensure links in rendered blog content are always clickable and visually distinct:
- Color, underline, cursor pointer
- Hover effects
- Ensure `pointer-events: auto` and proper `z-index`

### 2. Post-process blog HTML to add link attributes
**File: `src/pages/BlogDetail.tsx`** — Add a helper function that processes the HTML content before rendering to:
- Add `target="_blank"` and `rel="noopener noreferrer"` to all `<a>` tags so external links open in new tabs
- Add appropriate classes for styling

### 3. Add CTA button support in the rich text editor
**File: `src/components/ui/rich-text-editor.tsx`** — The editor already supports links. No changes needed for basic link functionality — the toolbar already has a "link" button.

### Files to Modify
| File | Change |
|------|--------|
| `src/index.css` | Add explicit styles for `a` tags inside `.prose` blog content |
| `src/pages/BlogDetail.tsx` | Add HTML post-processing to make links open in new tabs |

