"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EditBySlugPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const router = useRouter()
  const params = useParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const redirectToEdit = async () => {
      try {
        setLoading(true)
        setError('')
        
        console.log('Looking for slug:', params.slug)
        setDebugInfo(`Looking for slug: ${params.slug}`)

        // Check auth first
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('No session, redirecting to login')
          router.push('/login')
          return
        }

        // Find the post by slug and redirect to the ID-based edit page
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, slug, title')
          .eq('slug', params.slug)
          .single()

        console.log('Query result:', { data, error })
        setDebugInfo(`Query result: ${JSON.stringify({ data, error })}`)

        if (error) {
          console.error('Error finding post by slug:', error)
          setError(`Post not found with slug: ${params.slug}. Error: ${error.message}`)
          setLoading(false)
          return
        }

        if (!data) {
          console.error('No data returned for slug:', params.slug)
          setError(`No post found with slug: ${params.slug}`)
          setLoading(false)
          return
        }

        console.log('Redirecting to edit page with ID:', data.id)
        // Redirect to the correct edit page
        router.replace(`/admin/edit/${data.id}`)
      } catch (error) {
        console.error('Error:', error)
        setError(`Unexpected error: ${error.message}`)
        setLoading(false)
      }
    }

    if (params.slug) {
      redirectToEdit()
    }
  }, [params.slug, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to editor...</p>
          <p className="mt-2 text-xs text-gray-500">{debugInfo}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Link href="/admin">
            <Button className="w-full">Go to Admin Dashboard</Button>
          </Link>
          <p className="text-xs text-gray-500 text-center">{debugInfo}</p>
        </div>
      </div>
    </div>
  )
}