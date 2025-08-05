// Environment variable validation
export function validateEnvironment() {
  const required = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  // Allow server-side fallback to NEXT_PUBLIC_ versions
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}`
    
    // In development, log warning but continue
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️  ${errorMessage}`)
      console.warn('⚠️  Some features may not work properly')
      console.warn('⚠️  Run "npm run verify:deployment" to check setup')
    } else {
      // In production, log detailed error
      console.error(`❌ ${errorMessage}`)
      console.error('❌ Ask Ed will not function without these variables')
      console.error('❌ Please set them in your hosting platform (Vercel, etc.)')
      throw new Error(errorMessage)
    }
  }

  // Validate format of certain variables
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.warn('⚠️  OPENAI_API_KEY should start with "sk-"')
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('.supabase.co')) {
    console.warn('⚠️  SUPABASE_URL should be a valid Supabase URL')
  }

  return true
}

// Don't auto-validate - let components call this when needed
// This prevents build-time errors when env vars aren't available yet