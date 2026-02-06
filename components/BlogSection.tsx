"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createSupabaseClient, type BlogPost } from "@/lib/supabase"

export default function BlogSection({ id, posts: initialPosts }: { id?: string; posts?: BlogPost[] }) {
  const { theme } = useTheme()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialPosts ?? [])
  const [loading, setLoading] = useState(typeof initialPosts === 'undefined')

  useEffect(() => {
    if (typeof initialPosts !== 'undefined') {
      setBlogPosts(initialPosts)
      setLoading(false)
      return
    }
    const supabase = createSupabaseClient()
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
        if (!error) setBlogPosts(data ?? [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogPosts()
  }, [initialPosts])

  return (
    <section
      id={id}
      className={`py-16 min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gradient-to-br from-indigo-900 to-purple-900" : "bg-gradient-to-br from-indigo-50 to-purple-50"
      }`}
    >
      <div className="container mx-auto px-4 py-16">
        <h2 className={`text-4xl font-bold mb-4 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Blog
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Insights on AI development, technical challenges, and lessons learned from building real-world solutions.
        </p>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              No blog posts available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden ${
                theme === "dark" ? "bg-white/10 hover:bg-white/[0.15]" : "bg-white hover:bg-gray-50"
              }`}
            >
              {post.image_url && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-contain transform hover:scale-105 transition-all duration-500 ease-out"
                    style={{
                      filter: 'brightness(0.98) contrast(1.05) saturate(1.05)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              <div className="p-6">
                <div className="mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    theme === "dark" ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                  }`}>
                    {post.category}
                  </span>
                </div>
              
              <h3 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {post.title}
              </h3>
              
              <p className={`mb-4 leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {post.excerpt}
              </p>
              
              <div className={`flex items-center justify-between text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time}</span>
                  </div>
                </div>
                
                <Link
                  href={`/blog/${post.slug || post.id}`}
                  className={`flex items-center gap-1 font-medium transition-colors hover:underline ${
                    theme === "dark" ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-700"
                  }`}
                >
                  Read more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              </div>
            </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}