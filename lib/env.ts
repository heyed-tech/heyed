// Environment variable validation and type safety

interface EnvironmentConfig {
  OPENAI_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  NODE_ENV: 'development' | 'production' | 'test'
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

function validateEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new EnvironmentError(
      `Missing required environment variable: ${name}. Please check your .env.local file.`
    )
  }
  return value.trim()
}

function validateEnvironment(): EnvironmentConfig {
  try {
    // Use fallback logic for Supabase variables (server/client compatibility)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    const config: EnvironmentConfig = {
      OPENAI_API_KEY: validateEnvironmentVariable('OPENAI_API_KEY', process.env.OPENAI_API_KEY),
      SUPABASE_URL: validateEnvironmentVariable('SUPABASE_URL', supabaseUrl),
      SUPABASE_ANON_KEY: validateEnvironmentVariable('SUPABASE_ANON_KEY', supabaseKey),
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
    }

    // Additional validation for specific variables
    if (!config.OPENAI_API_KEY.startsWith('sk-')) {
      throw new EnvironmentError('OPENAI_API_KEY must start with "sk-"')
    }

    if (!config.SUPABASE_URL.startsWith('https://')) {
      throw new EnvironmentError('SUPABASE_URL must be a valid HTTPS URL')
    }

    return config
  } catch (error) {
    if (error instanceof EnvironmentError) {
      console.error('❌ Environment Configuration Error:', error.message)
      throw error
    }
    throw new EnvironmentError('Failed to validate environment configuration')
  }
}

// Validate environment on module load
let environmentConfig: EnvironmentConfig

try {
  environmentConfig = validateEnvironment()
  console.log('✅ Environment validation successful')
} catch (error) {
  console.error('❌ Environment validation failed:', error)
  // In development, we might want to continue, but in production we should fail
  if (process.env.NODE_ENV === 'production') {
    process.exit(1)
  }
  throw error
}

export { environmentConfig, EnvironmentError }
export default environmentConfig