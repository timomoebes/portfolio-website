"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeProvider } from '@/components/ThemeProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin'

  const handleLogin = async (e: React.FormEvent) => {    
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push(redirectedFrom)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`
      })

      if (error) {
        setError(error.message)
      } else {
        setResetSent(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900">
        <Card className="w-full max-w-md bg-background text-foreground shadow-lg border">
          <CardHeader>
            <CardTitle>{resetMode ? 'Reset Password' : 'Admin Login'}</CardTitle>
            <CardDescription>
              {resetMode ? 'Enter your email to reset your password' : 'Sign in to access the admin panel'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="text-green-600 font-medium">
                  Password reset email sent!
                </div>
                <p className="text-sm text-muted-foreground">
                  Check your email and click the reset link to set a new password.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => { setResetMode(false); setResetSent(false); setError(''); }}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={resetMode ? handleResetPassword : handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {!resetMode && (
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (resetMode ? 'Sending...' : 'Signing in...') : (resetMode ? 'Send Reset Email' : 'Sign In')}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setResetMode(!resetMode); setError(''); }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    {resetMode ? 'Back to Login' : 'Forgot Password?'}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}