import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clubs: {
        Row: {
          id: string
          name: string
          description: string
          short_description: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          short_description: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          short_description?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      // ...other tables as needed
    }
  }
}
