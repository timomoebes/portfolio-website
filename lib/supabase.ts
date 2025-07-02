import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For client-side operations (recommended for auth)
export const createSupabaseClient = () => createClientComponentClient()

// Database types
export interface BlogPost {
  id: string
  slug?: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  read_time: string
  published: boolean
  image_url?: string
  tags?: string[]
  created_at: string
  updated_at: string
}