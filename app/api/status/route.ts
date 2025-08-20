import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getCacheMetrics } from '@/lib/cache'

interface StatusInfo {
  service: string
  environment: string
  version: string
  timestamp: string
  uptime: number
  features: {
    rateLimit: boolean
    caching: boolean
    vectorSearch: boolean
    knowledgeBase: boolean
    offTopicDetection: boolean
  }
  statistics?: {
    totalQuestions: number
    successfulResponses: number
    failedSearches: number
    cacheHitRate: number
    topQuestionTypes: Array<{
      type: string
      count: number
    }>
  }
}

const startTime = Date.now()

async function getStatistics() {
  try {
    const supabase = getSupabase()
    
    // Get basic analytics from the last 7 days
    const { data: analytics, error } = await supabase
      .from('ask_ed_analytics')
      .select('event_type, data')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error || !analytics) {
      return null
    }

    const totalQuestions = analytics.filter(a => a.event_type === 'question_answered').length
    const failedSearches = analytics.filter(a => a.event_type === 'search_failed').length
    const successfulResponses = totalQuestions - failedSearches

    // Analyze question types (this is basic, could be more sophisticated)
    const questionTypes: Record<string, number> = {}
    analytics
      .filter(a => a.event_type === 'question_answered' && a.data && (a.data as any).question)
      .forEach(a => {
        const question = (a.data as any).question.toLowerCase()
        let type = 'general'
        
        if (question.includes('ratio') || question.includes('staff')) type = 'staffing'
        else if (question.includes('eyfs') || question.includes('learning')) type = 'eyfs'
        else if (question.includes('kcsie') || question.includes('safeguard')) type = 'safeguarding'
        else if (question.includes('ofsted') || question.includes('inspect')) type = 'inspection'
        else if (question.includes('qualif') || question.includes('training')) type = 'qualifications'
        
        questionTypes[type] = (questionTypes[type] || 0) + 1
      })

    const topQuestionTypes = Object.entries(questionTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const cacheMetrics = getCacheMetrics()
    const totalCacheRequests = cacheMetrics.embeddings.size + cacheMetrics.search.size + cacheMetrics.response.size
    const cacheHitRate = totalCacheRequests > 0 ? Math.round((totalCacheRequests / (totalQuestions + totalCacheRequests)) * 100) : 0

    return {
      totalQuestions,
      successfulResponses,
      failedSearches,
      cacheHitRate,
      topQuestionTypes
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return null
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const includeStats = url.searchParams.get('stats') === 'true'
  
  try {
    const statusInfo: StatusInfo = {
      service: 'AskEd. - AI Compliance Assistant',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - startTime,
      features: {
        rateLimit: true,
        caching: true,
        vectorSearch: true,
        knowledgeBase: true,
        offTopicDetection: true
      }
    }

    // Include statistics if requested
    if (includeStats) {
      statusInfo.statistics = await getStatistics() || undefined
    }

    return new Response(JSON.stringify(statusInfo, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30' // Cache for 30 seconds
      }
    })
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Unable to fetch status information',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}