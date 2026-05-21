# Public Deployment and Interactive Features

Date: 2026-05-20
Project: Industrial Design Library

This project should stay static-first for the public site, then add small server-side endpoints only where the browser cannot safely handle the work by itself.

## Phase 1: Publish the Current Site

Use Netlify for the first public version.

Recommended Netlify settings:

| Setting | Value |
| --- | --- |
| Build command | leave empty |
| Publish directory | `.` |
| Functions directory | `netlify/functions` |

Deployment flow:

1. Push this repository to GitHub.
2. Create a Netlify site from the GitHub repository.
3. Let Netlify read `netlify.toml`.
4. Deploy the production site.
5. Add a custom domain in Netlify when the public URL is ready.

The current hash routes such as `#category/works` and `#item/modular-lamp-handle-study` work without server rewrites.

## Phase 2: Move Content Behind a Stable Model

Keep the homepage and card interaction in `index.html`, but treat every article as an item with the same base shape:

```js
{
  title,
  slug,
  category,
  summary,
  coverUrl,
  body,
  tags,
  status,
  createdAt
}
```

Only `published` or `featured` items should render on the public site. New uploads and comments should start as `pending`.

## Phase 3: Add Image Uploads and Descriptions

Recommended stack:

- Netlify Functions for private API endpoints.
- Supabase Storage for uploaded images.
- Supabase Postgres for item metadata, descriptions, status, and comments.

Suggested endpoint:

```text
POST /api/submissions
```

Payload:

| Field | Purpose |
| --- | --- |
| `title` | Submitted work or note title |
| `category` | One of the five library sections |
| `summary` | Short public description |
| `body` | Longer note or case-study text |
| `image` | Uploaded image file |
| `authorName` | Optional public attribution |
| `authorEmail` | Private moderation/contact field |

The function should:

1. Validate file type and size.
2. Validate text length and required fields.
3. Upload the image to Supabase Storage.
4. Insert the item into Supabase with `status = "pending"`.
5. Return a short success response without exposing private keys.

Do not store Supabase service-role keys in browser JavaScript. Keep secrets in Netlify environment variables.

## Phase 4: Add Comments

Suggested endpoint:

```text
POST /api/comments
```

Suggested table fields:

| Field | Purpose |
| --- | --- |
| `id` | Comment ID |
| `item_slug` | Article or project being discussed |
| `author_name` | Public display name |
| `body` | Comment text |
| `status` | `pending`, `approved`, or `rejected` |
| `created_at` | Submission time |

Public pages should only fetch approved comments.

Moderation requirements:

- Escape all rendered user text.
- Limit comment length.
- Add a honeypot or Turnstile challenge before public launch.
- Rate-limit by IP or session when the site receives real traffic.
- Keep comments pending until reviewed.

## Phase 5: Add a Private Review Workflow

Start simple:

1. Review pending submissions in Supabase.
2. Change `status` from `pending` to `published` or `approved`.
3. Let the public site fetch only approved content.

Later, add a private `/admin` page protected by Supabase Auth or Netlify Identity. The admin page should support approving, rejecting, and editing submissions without redeploying the site.

## Environment Variables

Configure these in Netlify, not in committed files:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TURNSTILE_SECRET_KEY
```

Use the anon key only when browser-side access is protected by Supabase row-level security. Use the service-role key only inside Netlify Functions.

## First Implementation Target

The next practical build step is:

1. Create Supabase tables and Storage bucket.
2. Add `netlify/functions/submissions.ts`.
3. Add a small submit form below the current library content.
4. Add tests for validation and escaped rendering.
5. Deploy a Netlify preview before production.
