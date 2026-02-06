/**
 * Merges content/blog/posts_from_backup.json into content/blog/posts.json.
 * - Removes broken image_url from backup posts (old Supabase URL).
 * - Puts backup posts first, then existing posts that are not duplicates (by id/slug).
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const backupPath = join(process.cwd(), 'content', 'blog', 'posts_from_backup.json')
const postsPath = join(process.cwd(), 'content', 'blog', 'posts.json')

const backup = JSON.parse(readFileSync(backupPath, 'utf8'))
const current = JSON.parse(readFileSync(postsPath, 'utf8'))

// Normalize backup posts: remove broken image_url, ensure id/slug for links
const backupPosts = backup.posts.map((p) => {
  const { image_url, slug, ...rest } = p
  const post = { ...rest, slug: slug || p.id }
  // Remove image_url so we don't show broken image (old Supabase URL is dead)
  delete post.image_url
  return post
})

const backupIds = new Set(backupPosts.map((p) => p.id))
const backupSlugs = new Set(backupPosts.map((p) => p.slug || p.id))

// Keep existing posts that are not in backup (by id or slug)
const existingOnlyCorrect = current.posts.filter(
  (p) => !backupIds.has(p.id) && !backupSlugs.has(p.slug || p.id)
)

// Merge: backup first, then existing
const merged = [...backupPosts, ...existingOnlyCorrect]

const out = { posts: merged }
writeFileSync(postsPath, JSON.stringify(out, null, 2), 'utf8')
console.log('Merged', backupPosts.length, 'backup posts +', existingOnlyCorrect.length, 'existing =', merged.length, 'total')
console.log('Written to', postsPath)
