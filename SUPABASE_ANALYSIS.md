# Supabase Analysis – Portfolio Website

## 1. Imports & createClient

| Location | Import / Export | Purpose |
|----------|----------------|---------|
| **lib/supabase.ts** | `createClient` from `@supabase/supabase-js` | Server-side client (singleton) |
| **lib/supabase.ts** | `createClientComponentClient` from `@supabase/auth-helpers-nextjs` | Client-side auth (cookies) via `createSupabaseClient()` |
| **middleware.ts** | `createMiddlewareClient` from `@supabase/auth-helpers-nextjs` | Session refresh in middleware |
| **app/auth/callback/route.ts** | `createRouteHandlerClient` from `@supabase/auth-helpers-nextjs` | Exchange code for session (OAuth/password reset) |

**createClient usage:**
- `lib/supabase.ts` line 8: `export const supabase = createClient(supabaseUrl, supabaseAnonKey)` — server use only.
- Client components use `createSupabaseClient()` (wraps `createClientComponentClient()`).

---

## 2. Data Queries (Tables & Operations)

**Tables in use:** `blog_posts`, Storage bucket `blog-images`. No `gyms` or other tables.

| File | Supabase call | Alternative |
|------|----------------|-------------|
| **app/sitemap.ts** | `supabase.from('blog_posts').select('slug, updated_at, date').eq('published', true)` | Read from `content/blog/posts.json` or `getBlogPosts()` from `lib/cms.ts` |
| **app/blog/[slug]/page.tsx** | `supabase.from('blog_posts').select('*')` (by slug), `.select('slug')` (all slugs) | `getBlogPosts()` / `getBlogPost(id)` + slug lookup from `lib/cms.ts` |
| **components/BlogSection.tsx** | `supabase.from('blog_posts').select('*').eq('published', true)` | `getBlogPosts()` from `lib/cms.ts` (or pass as props from server) |
| **app/admin/page.tsx** | `supabase.from('blog_posts').select('*')`, `.delete().eq('id', postId)` | JSON file + `saveBlogPost()` / delete in `lib/cms.ts` (extend CMS with delete) |
| **app/admin/new/page.tsx** | `supabase.from('blog_posts').insert([blogData]).select()` | Append to `content/blog/posts.json` via `saveBlogPost()` |
| **app/admin/edit/[id]/page.tsx** | `supabase.from('blog_posts').select('*')`, `.update(blogData)` | `getBlogPost(id)` + `saveBlogPost()` |
| **app/admin/edit-by-slug/[slug]/page.tsx** | `supabase.from('blog_posts').select('id, slug, title')` | Find in posts array from `getBlogPosts()` by slug |
| **app/admin/edit/[id]/page.tsx** | `supabase.storage.from('blog-images').upload(...)`, `.getPublicUrl(...)` | Local/static: save under `public/blog-images/` and use path; or keep Supabase Storage only for images |
| **app/admin/new/page.tsx** | Same storage upload + getPublicUrl | Same as above |

---

## 3. Auth Usage (signIn / getSession / get user)

| File | Auth call | Alternative |
|------|-----------|-------------|
| **app/login/page.tsx** | `supabase.auth.signInWithPassword({ email, password })` | NextAuth, Auth.js, or simple env-based check (see below) |
| **app/login/page.tsx** | (reset) `supabase.auth.resetPasswordForEmail(...)` | Email link + custom reset page or Auth.js |
| **app/reset-password/page.tsx** | `supabase.auth.getSession()`, `supabase.auth.updateUser({ password })` | Session from callback + custom update; or Auth.js |
| **app/admin/page.tsx** | `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange()`, sign out | Same as above |
| **app/admin/edit/[id]/page.tsx** | `supabase.auth.getSession()` | Same |
| **app/admin/edit-by-slug/[slug]/page.tsx** | `supabase.auth.getSession()` | Same |
| **middleware.ts** | `supabase.auth.getSession()` (via middleware client) | Middleware that checks NextAuth session or custom cookie |
| **app/auth/callback/route.ts** | `createRouteHandlerClient`, `supabase.auth.exchangeCodeForSession(code)` | NextAuth/Auth.js callback or custom token handling |

---

## 4. Sitemap.ts Fix (Confirmed)

**Issue:** `sitemap.ts` runs on the server but uses `createSupabaseClient()` (i.e. `createClientComponentClient()`), which is intended for client components and relies on browser cookies. In a server context (e.g. `getServerSideProps` or route handler) this can be wrong or fragile.

**Fix:** Use the server client in `sitemap.ts`:

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'  // server client

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com'

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, date')
    .eq('published', true)
    .not('slug', 'is', null)
  // ... rest unchanged
}
```

So: **File** = `app/sitemap.ts`, **Supabase call** = `from('blog_posts').select(...)`, **Fix** = use `supabase` from `@/lib/supabase` instead of `createSupabaseClient()`.

---

## 5. Dependency Count & “Just Replace” Assessment

**Supabase-related packages:**

- `@supabase/supabase-js` – core client
- `@supabase/auth-helpers-nextjs` – deprecated, recommends `@supabase/ssr`
- `@supabase/auth-ui-react` – optional UI (login form, etc.)
- `@supabase/auth-ui-shared` – shared for auth-ui

**Usage count (rough):**

- **Data (blog_posts):** 8 call sites (sitemap, blog slug page x2, BlogSection, admin list, admin new, admin edit x2, admin edit-by-slug).
- **Storage (blog-images):** 2 files (admin new, admin edit) – upload + public URL.
- **Auth:** 6 files (login, reset-password, admin, admin edit, admin edit-by-slug, middleware, auth callback).

**Verdict: Low–medium dependency.**  
Replacing **only** the database with JSON/static is straightforward because:
- One table (`blog_posts`) and one bucket (`blog-images`).
- You already have `lib/cms.ts` and `content/blog/posts.json` with a compatible shape.

So you can “just replace” **Supabase DB** with JSON/static and keep Supabase only for auth + storage, or replace auth too (e.g. with NextAuth or a simple secret) and optionally keep or replace storage.

---

## 6. Report Table Summary

| File | Supabase call | Alternative |
|------|----------------|-------------|
| **lib/supabase.ts** | createClient, createSupabaseClient | Keep for auth/storage only, or remove and use NextAuth + JSON CMS |
| **app/sitemap.ts** | from('blog_posts').select(...) | Use server `supabase` client (fix above) **or** `getBlogPosts()` from `lib/cms.ts` + map to sitemap entries |
| **app/blog/[slug]/page.tsx** | from('blog_posts').select('*' \| 'slug') | `getBlogPosts()` / get by slug from `lib/cms.ts`; add `slug` to CMS type if missing |
| **components/BlogSection.tsx** | from('blog_posts').select('*') | Server: pass posts from `getBlogPosts()`; or call `getBlogPosts()` in client (e.g. via API route) |
| **app/admin/page.tsx** | getSession, from('blog_posts').select/delete | Auth: NextAuth or env-based; data: read/write/delete via `lib/cms.ts` (extend with delete) |
| **app/admin/new/page.tsx** | getSession, from('blog_posts').insert, storage upload | Auth as above; insert = `saveBlogPost()`; images = `public/blog-images/` or keep Supabase Storage |
| **app/admin/edit/[id]/page.tsx** | getSession, from('blog_posts').select/update, storage | Auth as above; update = `getBlogPost` + `saveBlogPost`; images as above |
| **app/admin/edit-by-slug/[slug]/page.tsx** | getSession, from('blog_posts').select('id, slug, title') | Auth as above; resolve slug from `getBlogPosts()` |
| **app/login/page.tsx** | signInWithPassword, resetPasswordForEmail | NextAuth credentials provider or simple env check |
| **app/reset-password/page.tsx** | getSession, updateUser({ password }) | Custom reset + cookie/session or Auth.js |
| **middleware.ts** | createMiddlewareClient, getSession | NextAuth middleware or custom cookie check |
| **app/auth/callback/route.ts** | createRouteHandlerClient, exchangeCodeForSession | NextAuth callback or custom handler |

---

## 7. Psql-Free DB Migration (JSON / Static)

**Goal:** No Supabase Postgres (no `psql`, no DB hosting). Keep content in repo as JSON and serve via existing CMS helpers.

### 7.1 Schema alignment

- **Current Supabase:** `blog_posts` (id, slug, title, excerpt, content, category, date, read_time, published, image_url, tags, created_at, updated_at).
- **Current JSON:** `content/blog/posts.json` has `id`, `title`, `excerpt`, `content`, `date`, `readTime`, `category`, `tags`, `published`. Missing: `slug`, `read_time` (snake_case), `image_url`, `created_at`, `updated_at`.

Add to `lib/cms.ts` (and to JSON) as needed:

- `slug` (string, optional): default `id` or derive from title.
- `read_time` or keep `readTime` and map in CMS.
- `image_url` (optional).
- `created_at` / `updated_at` (ISO strings): optional; can be added when migrating.

### 7.2 Migration steps (no psql)

1. **Export from Supabase (optional)**  
   Use Supabase Dashboard → Table Editor → `blog_posts` → export as CSV/JSON, or run a one-off script in the app that uses `supabase.from('blog_posts').select('*')` and writes the result to `content/blog/posts.json` (shape adjusted to match `CMSData`).

2. **Normalize JSON shape**  
   - Ensure each post has `id`, `slug` (or use `id` as slug), `title`, `excerpt`, `content`, `date`, `readTime`, `category`, `tags`, `published`.  
   - Add `image_url`, `created_at`, `updated_at` if you use them in the UI.

3. **Extend lib/cms.ts**  
   - `getBlogPostBySlug(slug)` – find in `data.posts` by `slug` (or `id`).  
   - `deleteBlogPost(id)` – filter out post from `data.posts`, write back to `content/blog/posts.json`.  
   - Ensure `saveBlogPost` supports both create and update (by id) and, if needed, sets `updated_at`.

4. **Wire app to CMS**  
   - **Sitemap:** Use `getBlogPosts()` and map to sitemap entries (no Supabase).  
   - **app/blog/[slug]/page.tsx:** Load post by slug via `getBlogPostBySlug(slug)`; for “all slugs” use `getBlogPosts().map(p => p.slug)`.  
   - **BlogSection:** Pass posts from server with `getBlogPosts()` or fetch from an API route that returns `getBlogPosts()`.  
   - **Admin:** Replace all `supabase.from('blog_posts')` with `getBlogPosts()`, `getBlogPost(id)`, `getBlogPostBySlug(slug)`, `saveBlogPost()`, `deleteBlogPost(id)` (and optional API routes that call these).

5. **Images**  
   - **Option A:** Keep Supabase Storage only for `blog-images`; admin uploads stay as-is, only DB is removed.  
   - **Option B:** Store images under `public/blog-images/` and save only the path in the post (e.g. `image_url`); admin upload writes to disk and updates JSON via `saveBlogPost`.

6. **Auth**  
   - Keep Supabase Auth for now (no DB migration needed), **or**  
   - Replace with NextAuth (e.g. Credentials with env user/password) or a single shared secret in env and a small middleware check. Then remove Supabase auth calls and auth callback.

7. **Cleanup**  
   - Remove Supabase from sitemap and all blog data paths.  
   - Optionally remove `@supabase/supabase-js` and auth-helpers if you also remove auth; keep them only if you retain Supabase Auth and/or Storage.

This gives you a **psql-free** setup: content is fully in `content/blog/posts.json` (and optional `public/blog-images/`), with no Supabase database dependency.

---

## 8. Restoring from a Supabase Backup (e.g. `.backup` from old project)

If you have a **plain-SQL cluster backup** (e.g. `db_cluster-26-07-2025@12-21-51.backup` from the Supabase dashboard download) and **restore with psql fails** (e.g. “missing superuser permissions”), that’s expected: the dump includes `CREATE ROLE` / `ALTER ROLE` and other objects that require superuser on the target. Supabase’s hosted Postgres does not give you superuser.

**What we did with your backup:**

- The file is **plain SQL** (not binary custom format), so it can be read and parsed.
- **`blog_posts`** table and data were extracted without touching roles or system objects.

**Option A – Use the extraction script (recommended, no psql):**

1. Put the backup file in your Downloads folder (or pass its path).
2. From the project root run:
   ```bash
   node scripts/extract-blog-from-backup.mjs
   # Or with a custom path:
   node scripts/extract-blog-from-backup.mjs "C:\path\to\your.backup"
   ```
3. This writes **`content/blog/posts_from_backup.json`** with CMS-ready posts.
4. Merge into `content/blog/posts.json` (replace or combine the `posts` array) and use the JSON/static CMS flow (see §7). No database or psql needed.

**Option B – Restore only `public.blog_posts` into a new Supabase project:**

If you want to keep using Supabase Postgres, create a **new** project and run only the **table + data** for `blog_posts`, **without** any `CREATE ROLE` / `OWNER TO` / RLS from the full dump:

1. In the new project’s SQL Editor, run a minimal schema, e.g.:
   ```sql
   CREATE TABLE public.blog_posts (
       id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
       title text NOT NULL,
       excerpt text NOT NULL,
       content text NOT NULL,
       category text NOT NULL,
       date date NOT NULL,
       read_time text NOT NULL,
       published boolean DEFAULT false,
       created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
       updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
       image_url text,
       tags text[],
       slug text UNIQUE
   );
   ```
2. Insert the rows (e.g. from `posts_from_backup.json` or by re-exporting from the backup into `INSERT` statements). Do **not** run the full backup file as-is; it will fail on roles and superuser-only operations.

**Summary:** You can give the backup file path to the extraction script; no psql or superuser is required. The script already ran successfully and produced **2 posts** in `content/blog/posts_from_backup.json`. Use that file for your JSON/static migration or to re-import into a new Supabase DB as above.
