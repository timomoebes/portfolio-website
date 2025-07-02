/**
 * Calculate reading time for blog content
 * Based on average reading speed of 200 words per minute
 */

export interface ReadingTimeResult {
  minutes: number
  words: number
  text: string
}

export function calculateReadingTime(content: string): ReadingTimeResult {
  // Strip markdown and HTML tags for accurate word count
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links (keep text)
    .replace(/#+ /g, '') // Remove headers
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  // Count words
  const words = cleanContent.split(' ').filter(word => word.length > 0).length
  
  // Calculate reading time (200 words per minute)
  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)
  
  // Generate human-readable text
  const text = minutes === 1 ? '1 min read' : `${minutes} min read`
  
  return {
    minutes,
    words,
    text
  }
}

/**
 * Auto-generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim()
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100
}