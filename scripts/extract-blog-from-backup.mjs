/**
 * Extracts public.blog_posts from a Supabase plain-SQL cluster backup
 * and writes CMS-ready JSON to content/blog/posts_from_backup.json.
 *
 * Usage (from project root):
 *   node scripts/extract-blog-from-backup.mjs [path-to-backup]
 *
 * Default path: %USERPROFILE%\Downloads\db_cluster-26-07-2025@12-21-51.backup
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DEFAULT_BACKUP =
  process.platform === 'win32'
    ? join(process.env.USERPROFILE || '', 'Downloads', 'db_cluster-26-07-2025@12-21-51.backup')
    : join(process.env.HOME || '', 'Downloads', 'db_cluster-26-07-2025@12-21-51.backup')

const backupPath = process.argv[2] || DEFAULT_BACKUP

const COPY_HEADER = 'COPY public.blog_posts (id, title, excerpt, content, category, date, read_time, published, created_at, updated_at, image_url, tags, slug) FROM stdin;'
const COLUMNS = ['id', 'title', 'excerpt', 'content', 'category', 'date', 'read_time', 'published', 'created_at', 'updated_at', 'image_url', 'tags', 'slug']
const NUM_COLUMNS = COLUMNS.length

function parseRow(line) {
  const parts = line.split('\t')
  if (parts.length < NUM_COLUMNS) return null
  const id = parts[0]
  const title = parts[1]
  const excerpt = parts[2]
  const content = parts.slice(3, parts.length - (NUM_COLUMNS - 4)).join('\t')
  const tail = parts.slice(-(NUM_COLUMNS - 4))
  const category = tail[0]
  const date = tail[1]
  const read_time = tail[2]
  const published = tail[3] === 't'
  const created_at = tail[4]
  const updated_at = tail[5]
  const image_url = tail[6] === '\\N' || tail[6] === '' ? null : tail[6]
  const tagsRaw = tail[7]
  const slug = tail[8] === '\\N' || tail[8] === '' ? null : tail[8]

  let tags = null
  if (tagsRaw && tagsRaw !== '\\N') {
    if (tagsRaw.startsWith('{') && tagsRaw.endsWith('}')) {
      tags = tagsRaw.slice(1, -1).split(',').map((s) => s.trim().replace(/^"|"$/g, ''))
    } else {
      tags = [tagsRaw]
    }
  }

  return {
    id,
    title,
    excerpt,
    content: content.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t'),
    category,
    date,
    readTime: read_time,
    read_time,
    published,
    created_at,
    updated_at,
    image_url,
    tags: tags || [],
    slug: slug || id,
  }
}

function toCmsPost(row) {
  return {
    id: row.slug || row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    readTime: row.readTime,
    category: row.category,
    tags: row.tags,
    published: row.published,
    ...(row.image_url && { image_url: row.image_url }),
    ...(row.slug && { slug: row.slug }),
  }
}

function main() {
  console.log('Reading backup:', backupPath)
  const content = readFileSync(backupPath, 'utf8')
  const lines = content.split(/\r?\n/)

  let inCopy = false
  const rows = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('COPY public.blog_posts')) {
      inCopy = true
      continue
    }
    if (inCopy) {
      if (line === '\\.') break
      if (line.trim()) {
        const row = parseRow(line)
        if (row) rows.push(row)
      }
    }
  }

  const posts = rows.map(toCmsPost)
  const outPath = join(process.cwd(), 'content', 'blog', 'posts_from_backup.json')
  writeFileSync(outPath, JSON.stringify({ posts }, null, 2), 'utf8')
  console.log('Wrote', posts.length, 'posts to', outPath)
}

main()
