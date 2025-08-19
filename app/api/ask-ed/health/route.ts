import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getOpenAI } from '@/lib/ask-ed/openai'
import { searchDocuments } from '@/lib/ask-ed/vectorStore'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    environment: CheckResult
    openai: CheckResult
    database: CheckResult
    vectorStore: CheckResult
  }
  timestamp: string
  version: string
}

interface CheckResult {
  status: 'pass' | 'fail' | 'warn'
  message: string
  details?: any
}

export async function GET(req: NextRequest) {
  const health: HealthStatus = {
    status: 'healthy',
    checks: {
      environment: { status: 'pass', message: 'All required environment variables are set' },
      openai: { status: 'pass', message: 'OpenAI API is accessible' },
      database: { status: 'pass', message: 'Database is connected' },
      vectorStore: { status: 'pass', message: 'Vector store is operational' }
    },
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  }

  // 1. Check environment variables
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ]
  
  const missingVars = requiredEnvVars.filter(v => !process.env[v])
  if (missingVars.length > 0) {
    health.checks.environment = {
      status: 'fail',
      message: `Missing environment variables: ${missingVars.join(', ')}`
    }
    health.status = 'unhealthy'
  }

  // 2. Check OpenAI connection
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = getOpenAI()
      // Test with a minimal completion
      const test = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      })
      health.checks.openai.details = { model: 'gpt-3.5-turbo' }
    } catch (error: any) {
      health.checks.openai = {
        status: 'fail',
        message: 'OpenAI API is not accessible',
        details: { error: error.message }
      }
      health.status = health.status === 'unhealthy' ? 'unhealthy' : 'degraded'
    }
  }

  // 3. Check database connection
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const supabase = getSupabase()
      
      // Check if tables exist
      const tables = ['ask_ed_documents', 'ask_ed_conversations', 'ask_ed_analytics']
      const tableChecks: Record<string, boolean> = {}
      
      for (const table of tables) {
        const { error } = await supabase.from(table).select('count').limit(1).single()
        tableChecks[table] = !error || error.code !== 'PGRST116'
      }
      
      const missingTables = Object.entries(tableChecks)
        .filter(([_, exists]) => !exists)
        .map(([table]) => table)
      
      if (missingTables.length > 0) {
        health.checks.database = {
          status: 'fail',
          message: `Missing tables: ${missingTables.join(', ')}`,
          details: { tableChecks }
        }
        health.status = 'unhealthy'
      } else {
        // Check document count
        const { count } = await supabase
          .from('ask_ed_documents')
          .select('*', { count: 'exact', head: true })
        
        health.checks.database.details = { 
          tables: tableChecks,
          documentCount: count || 0
        }
        
        if (count === 0) {
          health.checks.vectorStore = {
            status: 'warn',
            message: 'No documents in vector store',
            details: { documentCount: 0 }
          }
          health.status = health.status === 'unhealthy' ? 'unhealthy' : 'degraded'
        }
      }
    } catch (error: any) {
      health.checks.database = {
        status: 'fail',
        message: 'Database connection failed',
        details: { error: error.message }
      }
      health.status = 'unhealthy'
    }
  }

  // 4. Check vector search functionality
  if (health.checks.database.status === 'pass' && health.checks.openai.status === 'pass') {
    try {
      // Perform a test search
      const results = await searchDocuments('test query', 1, 0.1)
      health.checks.vectorStore.details = {
        searchable: true,
        testResults: results.length
      }
    } catch (error: any) {
      health.checks.vectorStore = {
        status: 'fail',
        message: 'Vector search failed',
        details: { error: error.message }
      }
      health.status = health.status === 'unhealthy' ? 'unhealthy' : 'degraded'
    }
  }

  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'degraded' ? 200 : 503

  return new Response(JSON.stringify(health, null, 2), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
}