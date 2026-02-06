import { getBlogPosts } from '@/lib/cms'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await getBlogPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('API blog posts error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
