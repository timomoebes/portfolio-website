import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Handle different auth types
  if (type === 'recovery') {
    // Password reset flow - redirect to reset password page
    return NextResponse.redirect(new URL('/reset-password', request.url))
  }

  // Default redirect to admin for regular login
  return NextResponse.redirect(new URL('/admin', request.url))
}