"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'
import { createSupabaseClient, BlogPost } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

export default function EditPostPage() {
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
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const router = useRouter()
  const params = useParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const checkAuthAndFetchPost = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      await fetchPost()
    }
    checkAuthAndFetchPost()
  }, [params.id, router, supabase.auth])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
        setError('Failed to fetch blog post')
        return
      }

      if (!data) {
        setError('Blog post not found')
        return
      }

      setOriginalPost(data)
      setFormData({
        title: data.title,
        slug: data.slug || '',
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        published: data.published,
        imageUrl: data.image_url || ''
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to fetch blog post')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if it hasn't been manually modified
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
    }))
  }

  const handleSave = async (asDraft = false) => {
    try {
      setSaving(true)
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

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        read_time: `${Math.ceil(formData.content.split(' ').length / 200)} min read`,
        published: asDraft ? false : formData.published,
        image_url: formData.imageUrl || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(blogData)
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Save error:', error)
        if (error.message.includes('duplicate key value violates unique constraint')) {
          setError('A post with this slug already exists. Please choose a different slug.')
        } else {
          setError('Failed to update blog post: ' + error.message)
        }
        return
      }

      setSuccess(asDraft ? 'Draft saved successfully!' : 'Blog post updated successfully!')
      
      // Refresh the post data
      await fetchPost()

    } catch (error) {
      console.error('Save error:', error)
      setError('Failed to update blog post')
    } finally {
      setSaving(false)
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

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/blog/${formData.slug}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error && !originalPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  Back to Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
                Edit Post
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {formData.slug && (
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              )}
              <Button
                onClick={() => handleSave(true)}
                variant="outline"
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Update'}
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
                        Published
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
                        Edit your blog post content in Markdown
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
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={25}
                        className="w-full font-mono text-sm"
                        placeholder="Start writing your blog post content here..."
                      />
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