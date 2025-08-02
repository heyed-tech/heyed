import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getOpenAI } from '@/lib/ask-ed/openai'
import { getCacheMetrics } from '@/lib/cache'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  services: {
    database: ServiceStatus
    openai: ServiceStatus
    cache: ServiceStatus
  }
  metrics?: {
    cache: any
    memory?: {
      used: number
      total: number
      percentage: number
    }
  }
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime?: number
  error?: string
}

const startTime = Date.now()

async function checkDatabase(): Promise<ServiceStatus> {
  try {
    const start = Date.now()
    const supabase = getSupabase()
    
    // Simple query to check database connectivity
    const { data, error } = await supabase
      .from('ask_ed_documents')
      .select('id')
      .limit(1)
    
    const responseTime = Date.now() - start
    
    if (error) {
      return {
        status: 'unhealthy',
        responseTime,
        error: error.message
      }
    }
    
    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

async function checkOpenAI(): Promise<ServiceStatus> {
  try {
    const start = Date.now()
    const openai = getOpenAI()
    
    // Simple API call to check OpenAI connectivity
    // Using a minimal request to avoid unnecessary costs
    const response = await openai.models.list()
    
    const responseTime = Date.now() - start
    
    if (!response.data || response.data.length === 0) {
      return {
        status: 'degraded',
        responseTime,
        error: 'No models available'
      }
    }
    
    return {
      status: responseTime < 2000 ? 'healthy' : 'degraded',
      responseTime
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown OpenAI error'
    }
  }
}

function checkCache(): ServiceStatus {
  try {
    const metrics = getCacheMetrics()
    
    // Consider cache healthy if it's working (even if empty)
    return {
      status: 'healthy',
      responseTime: 0 // Cache is in-memory, so effectively instant
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown cache error'
    }
  }
}

function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage()
    return {
      used: Math.round(mem.heapUsed / 1024 / 1024), // MB
      total: Math.round(mem.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((mem.heapUsed / mem.heapTotal) * 100)
    }
  }
  return undefined
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const detailed = url.searchParams.get('detailed') === 'true'
  
  try {
    // Run all health checks in parallel
    const [database, openai, cache] = await Promise.all([
      checkDatabase(),
      checkOpenAI(),
      checkCache()
    ])
    
    const services = { database, openai, cache }
    
    // Determine overall status
    const statuses = Object.values(services).map(s => s.status)
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy'
    
    if (statuses.every(s => s === 'healthy')) {
      overallStatus = 'healthy'
    } else if (statuses.some(s => s === 'unhealthy')) {
      overallStatus = 'unhealthy'
    } else {
      overallStatus = 'degraded'
    }
    
    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Date.now() - startTime,
      services
    }
    
    // Add detailed metrics if requested
    if (detailed) {
      healthCheck.metrics = {
        cache: getCacheMetrics(),
        memory: getMemoryUsage()
      }
    }
    
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503
    
    return new Response(JSON.stringify(healthCheck, null, 2), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    const errorResponse: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Date.now() - startTime,
      services: {
        database: { status: 'unhealthy', error: 'Health check failed' },
        openai: { status: 'unhealthy', error: 'Health check failed' },
        cache: { status: 'unhealthy', error: 'Health check failed' }
      }
    }
    
    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}