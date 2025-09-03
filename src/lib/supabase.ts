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
      events: {
        Row: {
          id: string
          title: string
          description: string
          tagline: string
          image_url: string | null
          rules: string | null
          schedule: string | null
          venue: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          tagline: string
          image_url?: string | null
          rules?: string | null
          schedule?: string | null
          venue?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          tagline?: string
          image_url?: string | null
          rules?: string | null
          schedule?: string | null
          venue?: string | null
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          created_at?: string
        }
      }
    }
  }
}