/**
 * Seeds the Supabase blog_posts table from content/blog/posts.json.
 * Uses Supabase REST API (no @supabase/supabase-js import), so run with: node scripts/seed-supabase-blog.mjs
 *
 * Usage (from project root, with .env.local present):
 *   node --env-file=.env.local scripts/seed-supabase-blog.mjs
 * Or: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run.
 */

import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'

// Deterministic UUID from slug so seed works with uuid column and upsert is stable
function slugToUuid(slug) {
  const hex = createHash('sha256').update(slug).digest('hex').slice(0, 32)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

// Load .env.local so SUPABASE_SERVICE_ROLE_KEY is available (needed for insert with RLS)
try {
  const envPath = join(process.cwd(), '.env.local')
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) {
      const k = m[1].trim()
      const v = m[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[k]) process.env[k] = v
    }
  }
} catch (_) {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
// Service role bypasses RLS (required for seed); fallback to anon (will fail on insert if RLS blocks)
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY). Add SUPABASE_SERVICE_ROLE_KEY to .env.local for seeding (bypasses RLS).')
  process.exit(1)
}

const postsPath = join(process.cwd(), 'content', 'blog', 'posts.json')
const { posts } = JSON.parse(readFileSync(postsPath, 'utf8'))

const now = new Date().toISOString()
const rows = posts.map((p) => {
  const slug = p.slug || p.id
  return {
  id: slugToUuid(slug),
  slug,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  date: p.date,
  read_time: p.readTime || p.read_time || '5 min read',
  published: !!p.published,
  created_at: now,
  updated_at: now,
  image_url: p.image_url || null,
  tags: Array.isArray(p.tags) ? p.tags : [],
  }
})

const restUrl = `${url.replace(/\/$/, '')}/rest/v1/blog_posts?on_conflict=slug`
const headers = {
  'Content-Type': 'application/json',
  apikey: key,
  Authorization: `Bearer ${key}`,
  Prefer: 'resolution=merge-duplicates',
}

async function main() {
  const res = await fetch(restUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('Seed failed:', res.status, text)
    process.exit(1)
  }
  console.log('Seeded', rows.length, 'posts into Supabase blog_posts.')
}

main()
