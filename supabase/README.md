# Supabase setup for blog

## 1. Create the `blog_posts` table

**Option A – Supabase Dashboard**  
1. Open your project at [supabase.com/dashboard](https://supabase.com/dashboard).  
2. Go to **SQL Editor**.  
3. Copy the contents of `migrations/20250206000000_create_blog_posts.sql` and run it.

**Option B – Supabase MCP**  
If you use Supabase MCP tools, run the same SQL (create table + RLS + grants) against your project.

## 2. Seed posts from JSON

From the project root, with `.env.local` containing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`:

```bash
node scripts/seed-supabase-blog.mjs
```

Or with explicit env file (Node 20+):

```bash
node --env-file=.env.local scripts/seed-supabase-blog.mjs
```

This reads `content/blog/posts.json` and upserts all posts into `public.blog_posts`. The app (sitemap, blog pages, BlogSection) reads from this table.
