import { NextRequest } from 'next/server'
import { getOpenAI, SYSTEM_PROMPT } from '@/lib/ask-ed/openai'
import { getRelevantContext } from '@/lib/ask-ed/vectorStore'
import { getSupabase } from '@/lib/supabase'
import { rateLimiter, createRateLimitResponse } from '@/lib/rateLimit'
import { validateChatRequest } from '@/lib/validation'
import { AskEdError, createValidationError, createOpenAIError, createDatabaseError, logError, createErrorResponse } from '@/lib/errors'

// Use Node.js runtime for compatibility with our dependencies

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}


export async function POST(req: NextRequest) {
  const correlationId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  try {
    // Check rate limit first
    const rateLimit = rateLimiter.checkLimit(req)
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime)
    }

    const requestData = await req.json()
    
    // Check if request data exists
    if (!requestData || typeof requestData !== 'object') {
      const error = createValidationError(
        'Invalid request: Missing or invalid request body',
        'INVALID_REQUEST_BODY',
        { correlationId }
      )
      logError(error)
      return createErrorResponse(error, correlationId)
    }
    
    // Validate and sanitize input
    const validation = validateChatRequest(requestData)
    if (!validation.isValid) {
      const error = createValidationError(
        `Validation failed: ${validation.errors.join(', ')}`,
        validation.errors[0],
        { correlationId }
      )
      logError(error)
      return createErrorResponse(error, correlationId)
    }
    
    const { message, sessionId, settingType } = validation.sanitized!
    const recentMessages = requestData.recentMessages || []
    
    let context, responseTemplate, confidence
    try {
      const result = await getRelevantContext(message, settingType)
      context = result.context
      responseTemplate = result.responseTemplate
      confidence = result.confidence
    } catch (searchError: any) {
      console.error('Vector search error:', searchError)
      
      // If vector search fails, provide a fallback response
      if (searchError.message?.includes('OPENAI_API_KEY')) {
        return new Response(
          JSON.stringify({ 
            error: 'Search service is not configured. Please contact support.',
            code: 'SEARCH_NOT_CONFIGURED'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      } else if (searchError.message?.includes('embedding')) {
        return new Response(
          JSON.stringify({ 
            error: 'Unable to process your question. Please try rephrasing.',
            code: 'EMBEDDING_ERROR'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      // Generic search error
      return new Response(
        JSON.stringify({ 
          error: 'Search service temporarily unavailable. Please try again.',
          code: 'SEARCH_ERROR'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Track failed searches for improvement
    if (!context) {
      await trackFailedSearch(sessionId, message)
      return new Response(
        JSON.stringify({ 
          error: "I couldn't find relevant information for your question. Please try rephrasing or ask about KCSiE, EYFS, or Ofsted compliance topics." 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Build conversation context if available
    let conversationContext = ''
    if (recentMessages.length > 0) {
      conversationContext = '\nRecent conversation:\n'
      recentMessages.forEach((msg: Message) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`
      })
      conversationContext += '\n'
    }

    let prompt = `Context from official documents:
${context.substring(0, 1800)}${conversationContext}

Current question: ${message}

Provide a concise, practical answer. Focus on what the user needs to know or do. If this is a follow-up question, use the conversation context to provide a relevant response.`

    // Add response template if available for structured answers
    if (responseTemplate) {
      prompt += `\n\nStructure your response as follows:\n${responseTemplate}`
    }
    
    let stream
    try {
      stream = await getOpenAI().chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 350,
        stream: true,
      })
    } catch (openAIError: any) {
      console.error('OpenAI API Error:', openAIError)
      
      // Provide user-friendly error messages
      if (openAIError.code === 'invalid_api_key') {
        return new Response(
          JSON.stringify({ 
            error: 'Service configuration error. Please contact support.',
            code: 'INVALID_API_KEY'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      } else if (openAIError.code === 'model_not_found') {
        return new Response(
          JSON.stringify({ 
            error: 'AI model unavailable. Please try again later.',
            code: 'MODEL_NOT_FOUND'
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      } else if (openAIError.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Service is busy. Please try again in a moment.',
            code: 'RATE_LIMITED'
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      throw openAIError // Re-throw to be caught by outer catch
    }
    
    const encoder = new TextEncoder()
    let fullResponse = ''
    
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
          controller.close()
          
          // Save conversation after streaming is complete
          try {
            await saveConversation(sessionId, message, fullResponse, confidence)
          } catch (saveError) {
            // Log error but don't break the response
          }
        } catch (error) {
          controller.error(error)
        }
      },
    })
    
    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Correlation-ID': correlationId
      },
    })
  } catch (error) {
    if (error instanceof AskEdError) {
      logError(error, { correlationId })
      return createErrorResponse(error, correlationId)
    }
    
    // Handle OpenAI API errors specifically
    if (error && typeof error === 'object' && 'code' in error) {
      const openAIError = createOpenAIError(error as unknown as Error)
      logError(openAIError, { correlationId })
      return createErrorResponse(openAIError, correlationId)
    }
    
    // Generic error fallback
    const genericError = new AskEdError({
      category: 'internal' as any,
      severity: 'high' as any,
      code: 'INTERNAL_SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      userMessage: 'Unable to process your question. Please try again.',
      statusCode: 500,
      correlationId,
      metadata: { originalError: error instanceof Error ? error.message : String(error) }
    })
    
    logError(genericError, { correlationId })
    return createErrorResponse(genericError, correlationId)
  }
}

async function trackFailedSearch(sessionId: string, query: string) {
  const supabase = getSupabase()
  
  try {
    const { error } = await supabase
      .from('ask_ed_analytics')
      .insert({
        event_type: 'search_failed',
        session_id: sessionId,
        data: { 
          query,
          timestamp: new Date().toISOString()
        }
      })
    
    if (error) {
      console.error('Database error tracking failed search:', error)
      // Don't throw - analytics failures shouldn't break the user experience
    }
  } catch (error) {
    console.error('Failed to track search failure:', error)
    // Analytics failures are non-critical, just log and continue
  }
}

async function saveConversation(sessionId: string, message: string, response: string, confidence: any) {
  const supabase = getSupabase()
  
  try {
    // Retrieve existing conversation with proper error handling
    const { data: existing, error: selectError } = await supabase
      .from('ask_ed_conversations')
      .select('messages')
      .eq('session_id', sessionId)
      .single()
    
    // Handle specific "not found" error vs actual database errors
    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected for new conversations
      console.error('Database error retrieving conversation:', selectError)
      throw createDatabaseError(selectError, 'retrieving conversation')
    }
  
    const messages = (existing?.messages as Array<{role: string, content: string, timestamp: string}>) || []
    messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() })
    messages.push({ role: 'assistant', content: response, timestamp: new Date().toISOString() })
    
    // Update or insert conversation with error handling
    if (existing) {
      const { error: updateError } = await supabase
        .from('ask_ed_conversations')
        .update({ messages, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)
      
      if (updateError) {
        console.error('Database error updating conversation:', updateError)
        throw createDatabaseError(updateError, 'updating conversation')
      }
    } else {
      const { error: insertError } = await supabase
        .from('ask_ed_conversations')
        .insert({ session_id: sessionId, messages, updated_at: new Date().toISOString() })
      
      if (insertError) {
        console.error('Database error creating conversation:', insertError)
        throw createDatabaseError(insertError, 'creating conversation')
      }
    }
    
    // Insert analytics with error handling
    const { error: analyticsError } = await supabase
      .from('ask_ed_analytics')
      .insert({
        event_type: 'question_answered',
        session_id: sessionId,
        data: { 
          question: message,
          confidence_score: confidence?.score ?? 0,
          search_method: confidence?.method ?? 'none',
          result_count: confidence?.resultCount ?? 0,
          best_similarity: confidence?.bestSimilarity ?? 0
        }
      })
    
    if (analyticsError) {
      // Analytics failures are less critical, log but don't throw
      console.error('Database error saving analytics:', analyticsError)
    }
    
  } catch (error) {
    // Log the error but don't break the chat flow
    console.error('Failed to save conversation:', error)
    // In production, you might want to send this to an error tracking service
  }
}