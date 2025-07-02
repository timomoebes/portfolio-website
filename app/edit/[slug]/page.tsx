"use client"

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditRedirectPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Redirect to the admin edit-by-slug route
    router.push(`/admin/edit-by-slug/${params.slug}`)
  }, [params.slug, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to admin...</p>
      </div>
    </div>
  )
}