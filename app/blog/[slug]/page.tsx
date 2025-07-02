import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: { slug: string }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) {
      console.error('Blog post fetch error:', error)
      return null
    }
    
    if (!data) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Blog post fetch exception:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blogPost = await getBlogPost(params.slug)
  
  if (!blogPost) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const title = `${blogPost.title} | Timo Möbes Portfolio`
  const description = blogPost.excerpt
  const publishedTime = new Date(blogPost.date).toISOString()
  const modifiedTime = new Date(blogPost.updated_at).toISOString()
  const url = `https://your-domain.com/blog/${blogPost.slug}`
  const imageUrl = blogPost.image_url || 'https://your-domain.com/og-default.jpg'

  return {
    title,
    description,
    authors: [{ name: 'Timo Möbes' }],
    keywords: blogPost.tags?.join(', ') || blogPost.category,
    category: blogPost.category,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Timo Möbes Portfolio',
      locale: 'en_US',
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: ['Timo Möbes'],
      tags: blogPost.tags || [blogPost.category],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blogPost.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@your_twitter_handle',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blogPost = await getBlogPost(params.slug)
  
  if (!blogPost) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPost.title,
    "description": blogPost.excerpt,
    "image": blogPost.image_url || 'https://your-domain.com/og-default.jpg',
    "author": {
      "@type": "Person",
      "name": "Timo Möbes",
      "url": "https://your-domain.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Timo Möbes Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://your-domain.com/logo.png"
      }
    },
    "datePublished": new Date(blogPost.date).toISOString(),
    "dateModified": new Date(blogPost.updated_at).toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://your-domain.com/blog/${blogPost.slug}`
    },
    "keywords": blogPost.tags?.join(', ') || blogPost.category,
    "articleSection": blogPost.category,
    "wordCount": blogPost.content.split(' ').length,
    "timeRequired": blogPost.read_time
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900">
        <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link 
            href="/#blog" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          {/* Article header */}
          <header className="mb-12">
            {blogPost.image_url && (
              <div className="mb-8">
                <img 
                  src={blogPost.image_url} 
                  alt={blogPost.title}
                  className="w-full h-64 md:h-80 object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
            
            <div className="mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                {blogPost.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              {blogPost.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {blogPost.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blogPost.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogPost.read_time}</span>
              </div>
            </div>
          </header>

          {/* Article content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800 dark:text-gray-200">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-white">
                      {children}
                    </strong>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="block bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-6">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 text-gray-700 dark:text-gray-300">
                      {children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-indigo-500 pl-4 mb-4 italic text-gray-600 dark:text-gray-400">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {blogPost.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export async function generateStaticParams() {
  const supabase = createSupabaseClient()
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
    .not('slug', 'is', null)
  
  return posts?.map(post => ({ slug: post.slug })) || []
}