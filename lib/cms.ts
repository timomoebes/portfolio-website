'use server'

import { promises as fs } from 'fs'
import path from 'path'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
  published: boolean
  slug?: string
  image_url?: string
}

export interface Project {
  id: string
  title: string
  tech: string
  description: string
  githubUrl?: string
  demoUrl?: string
  featured: boolean
}

export interface CMSData {
  posts: BlogPost[]
}

export interface ProjectsData {
  projects: Project[]
}

// Get blog posts from CMS
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const filePath = path.join(process.cwd(), 'content/blog/posts.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data: CMSData = JSON.parse(fileContents)
    
    // Filter published posts and sort by date (newest first)
    return data.posts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

// Get a single blog post by ID
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts()
    return posts.find(post => post.id === id) || null
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

// Get a single blog post by slug (for /blog/[slug] URLs)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(process.cwd(), 'content/blog/posts.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data: CMSData = JSON.parse(fileContents)
    const post = data.posts.find(
      (p) => (p.slug || p.id) === slug && p.published
    )
    return post || null
  } catch (error) {
    console.error('Error loading blog post by slug:', error)
    return null
  }
}

// Get all slugs for static params / sitemap (published only)
export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts()
  return posts.map((p) => p.slug || p.id)
}

// Get projects from CMS (fallback to hardcoded data if file doesn't exist)
export async function getProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), 'content/projects/projects.json')
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      console.warn('Projects file not found, using default projects')
      return defaultProjects
    }
    
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data: ProjectsData = JSON.parse(fileContents)
    
    // Return featured projects first
    return [
      ...data.projects.filter(p => p.featured),
      ...data.projects.filter(p => !p.featured)
    ]
  } catch (error) {
    console.error('Error loading projects:', error)
    return defaultProjects
  }
}


// For future use: save blog post (would need write permissions)
export async function saveBlogPost(post: BlogPost): Promise<boolean> {
  try {
    const filePath = path.join(process.cwd(), 'content/blog/posts.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data: CMSData = JSON.parse(fileContents)
    
    // Update or add post
    const postIndex = data.posts.findIndex(p => p.id === post.id)
    if (postIndex >= 0) {
      data.posts[postIndex] = post
    } else {
      data.posts.push(post)
    }
    
    // Save back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error saving blog post:', error)
    return false
  }
}

const defaultProjects = [
  {
    id: "ai-research-agent",
    title: "AI Research Agent",
    tech: "Python, LangGraph, OpenAI GPT-4, Firecrawl, Pydantic, REST APIs",
    githubUrl: "https://github.com/timomoebes/ai-research-agent-langgraph",
    description: "Developed an intelligent AI research agent that automatically discovers, analyzes, and compares developer tools and technologies through advanced web scraping and LLM-powered analysis.",
    featured: true
  },
  // Add other projects here as needed
]