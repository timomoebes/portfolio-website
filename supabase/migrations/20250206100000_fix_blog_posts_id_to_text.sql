-- Fix: change blog_posts.id from uuid to text so seed script (slug-like ids) works.
-- Run this in Supabase SQL Editor if you get: invalid input syntax for type uuid "..."

-- 1. Change id column type to text (keeps existing rows; converts uuid to text)
ALTER TABLE public.blog_posts
  ALTER COLUMN id TYPE text USING id::text;

-- 2. Optional: clear table and re-seed from JSON (uncomment if you want only seed data)
-- TRUNCATE public.blog_posts;
