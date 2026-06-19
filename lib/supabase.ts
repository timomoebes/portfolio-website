import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

// Server-side client. Null when env is absent so static builds still work.
export const supabase = hasSupabaseConfig ? createClient(supabaseUrl!, supabaseAnonKey!) : null

const emptyQueryResult = { data: null, error: null }

const createMissingConfigClient = () => {
  const query: Record<string, unknown> = {}
  const chain = () => query

  Object.assign(query, {
    select: chain,
    eq: chain,
    not: chain,
    order: () => ({ data: [], error: null }),
    insert: chain,
    update: chain,
    delete: chain,
    single: () => emptyQueryResult,
  })

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: async () => ({ error: new Error("Supabase is not configured") }),
      resetPasswordForEmail: async () => ({ error: new Error("Supabase is not configured") }),
      updateUser: async () => ({ error: new Error("Supabase is not configured") }),
      signOut: async () => ({ error: null }),
    },
    from: () => query,
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error("Supabase is not configured") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  }
}

// Client-side auth helper. The fallback lets static builds pass when local env is absent.
export const createSupabaseClient = () => (hasSupabaseConfig ? createClientComponentClient() : createMissingConfigClient() as unknown as ReturnType<typeof createClientComponentClient>)

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
