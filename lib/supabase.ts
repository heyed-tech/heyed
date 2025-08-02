import { createClient } from "@supabase/supabase-js"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
    // Fallback to heyed_db variables if available
    if (process.env.heyed_db_NEXT_PUBLIC_SUPABASE_URL) {
      console.log("Using fallback heyed_db_NEXT_PUBLIC_SUPABASE_URL")
    } else {
      throw new Error("No Supabase URL found in environment variables")
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
    // Fallback to heyed_db variables if available
    if (process.env.heyed_db_NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("Using fallback heyed_db_NEXT_PUBLIC_SUPABASE_ANON_KEY")
    } else {
      throw new Error("No Supabase anon key found in environment variables")
    }
  }

  // Use the standard variables if available, otherwise fall back to heyed_db variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.heyed_db_NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.heyed_db_NEXT_PUBLIC_SUPABASE_ANON_KEY

  supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
    },
  })

  return supabaseInstance
}

// For backward compatibility - lazy initialization
export const supabase = typeof window !== 'undefined' ? getSupabase() : null
