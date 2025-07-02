"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { calculateReadingTime, generateSlug } from '@/lib/reading-time'

interface BlogPostForm {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  published: boolean
  imageUrl: string
}

export default function NewPostPage() {
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'AI Development',
    tags: [],
    published: false,
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('New post page: Checking authentication...')
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session:', session ? 'Found' : 'Not found')
        if (!session) {
          console.log('No session, redirecting to login')
          router.push('/login')
        } else {
          console.log('Authentication successful, page ready')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setError('Authentication check failed')
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  // Auto-update reading time when content changes
  const updateReadingTime = (content: string) => {
    const readingTime = calculateReadingTime(content)
    return readingTime.text
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }

  const handleSave = async (asDraft = false) => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (!formData.title || !formData.content || !formData.excerpt) {
        setError('Title, excerpt, and content are required')
        return
      }

      if (!formData.slug) {
        setError('Slug is required')
        return
      }

      const readingTime = calculateReadingTime(formData.content)
      
      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        date: new Date().toISOString().split('T')[0],
        read_time: readingTime.text,
        published: asDraft ? false : formData.published,
        image_url: formData.imageUrl || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([blogData])
        .select()
        .single()

      if (error) {
        console.error('Save error:', error)
        if (error.message.includes('duplicate key value violates unique constraint')) {
          setError('A post with this slug already exists. Please choose a different title or modify the slug.')
        } else {
          setError('Failed to save blog post: ' + error.message)
        }
        return
      }

      setSuccess(asDraft ? 'Draft saved successfully!' : 'Blog post published successfully!')
      
      setTimeout(() => {
        router.push('/admin')
      }, 1500)

    } catch (error) {
      console.error('Save error:', error)
      setError('Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (error) {
        setError('Error uploading image: ' + error.message)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, imageUrl: publicUrl }))
      setSuccess('Image uploaded successfully!')
    } catch (error) {
      setError('Error uploading image')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData(prev => ({ ...prev, tags }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Post
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleSave(true)}
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metadata Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                  <CardDescription>
                    Configure your blog post metadata and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title..."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug *
                    </label>
                    <Input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="post-url-slug"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: /blog/{formData.slug || 'post-slug'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt *
                    </label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      placeholder="Brief description of the post..."
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="AI Development">AI Development</option>
                      <option value="Career">Career</option>
                      <option value="Web Development">Web Development</option>
                      <option value="IoT">IoT</option>
                      <option value="Technology">Technology</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <Input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="AI, Python, Tutorial"
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image
                    </label>
                    
                    {formData.imageUrl && (
                      <div className="mb-3 relative">
                        <img 
                          src={formData.imageUrl} 
                          alt="Featured image preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        or
                      </div>
                      
                      <Input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Paste image URL here"
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Publish immediately
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content</CardTitle>
                      <CardDescription>
                        Write your blog post content in Markdown
                      </CardDescription>
                    </div>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === 'edit' ? (
                    <div>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        rows={25}
                        className="w-full font-mono text-sm"
                        placeholder="# Your Blog Post Title

Start writing your blog post content here using Markdown...

## Section Header

Your content here with **bold text**, *italic text*, `code snippets`, and more.

- List item 1
- List item 2

```javascript
// Code block example
const example = 'Hello World';
```"
                      />
                      
                      {/* Live Reading Time Display */}
                      {formData.content && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
                          <span>📖 {updateReadingTime(formData.content)}</span>
                          <span>📝 {calculateReadingTime(formData.content).words} words</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Supports Markdown: # Headers, **bold**, *italic*, `code`, ```code blocks```, lists, and more
                      </p>
                    </div>
                  ) : (
                    <div className="prose prose-lg dark:prose-invert max-w-none border rounded-lg p-6 bg-white dark:bg-gray-800 min-h-[600px]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.content || '*Start writing to see preview...*'}
                      </ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}