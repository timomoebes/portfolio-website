-- Blog posts table for portfolio (run in Supabase SQL Editor or via Supabase MCP)
-- Compatible with existing app: id (text), slug, read_time, created_at, updated_at

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id text PRIMARY KEY,
  slug text UNIQUE,
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
  tags text[] DEFAULT '{}'
);

-- RLS: public read published, authenticated full access
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage posts"
  ON public.blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- Optional: grant to anon/service_role (Supabase default roles)
GRANT SELECT ON public.blog_posts TO anon;
GRANT ALL ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

COMMENT ON TABLE public.blog_posts IS 'Portfolio blog posts; RLS allows public read of published, authenticated full access.';
