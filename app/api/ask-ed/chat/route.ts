import { NextRequest } from 'next/server'
import { getOpenAI, SYSTEM_PROMPT } from '@/lib/ask-ed/openai'
import { getRelevantContext } from '@/lib/ask-ed/vectorStore'
import { getSupabase } from '@/lib/supabase'
import { rateLimiter, createRateLimitResponse } from '@/lib/rateLimit'
import { validateChatRequest } from '@/lib/validation'
import { AskEdError, createValidationError, createOpenAIError, createDatabaseError, logError, createErrorResponse, withErrorHandling } from '@/lib/errors'

// Use Node.js runtime for compatibility with our dependencies

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatRequest {
  message: string
  sessionId: string
  recentMessages?: Message[]
  settingType?: 'nursery' | 'club'
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
    
    const { context, responseTemplate, confidence } = await getRelevantContext(message, settingType)
    
    // Always attempt to provide an answer - remove the error return
    // Track failed searches for analytics but don't block the response
    if (!context) {
      await trackFailedSearch(sessionId, message)
    }
    
    // Build conversation context if available
    let conversationContext = ''
    if (recentMessages.length > 0) {
      conversationContext = '\nRecent conversation:\n'
      recentMessages.forEach((msg: any) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`
      })
      conversationContext += '\n'
    }

    let prompt = ''
    const hasOfficialDocuments = context && !context.includes('[Off-topic Response]')
    
    if (hasOfficialDocuments) {
      // We have document context - use it as primary source
      prompt = `Context from official documents:
${context}${conversationContext}

Current question: ${message}

IMPORTANT INSTRUCTIONS:
1. Base your answer DIRECTLY on the specific details provided in the context above
2. If the context contains a list of changes or requirements, present them clearly as bullet points
3. Do NOT add general information not found in the provided context
4. Extract and present the EXACT information from the documents, especially:
   - Specific requirements mentioned
   - Dates and deadlines
   - New policies or procedures
   - Changes to existing practices
5. Use UK English spelling and grammar throughout

Provide a practical answer that directly addresses the question using the specific information from the documents above.`
    } else {
      // No document context - use AI knowledge with appropriate disclaimers
      let responseSource = ''
      
      if (context && context.includes('[Off-topic Response]')) {
        // Off-topic question
        responseSource = 'This question appears to be outside my scope of UK childcare compliance. '
      } else {
        // No matching documents found
        responseSource = 'I couldn\'t find specific information in the official legislation documents for this question. '
      }
      
      prompt = `You are AskEd., an AI compliance assistant specialising in UK nurseries and clubs. You help with KCSiE, EYFS, and Ofsted compliance questions.

${conversationContext}
Current question: ${message}

${responseSource}However, I can provide general guidance based on my knowledge of UK childcare compliance.

Please provide a helpful response using your knowledge of:
- Early Years Foundation Stage (EYFS) requirements
- Ofsted regulations and standards  
- Keeping Children Safe in Education (KCSiE)
- Health and safety in childcare settings
- Insurance and liability considerations
- General best practices for nurseries and clubs

IMPORTANT: 
1. Start your response with the disclaimer: "${responseSource}Based on general compliance knowledge:" and end with "For definitive guidance, please consult the official legislation documents or contact your local authority/Ofsted directly."
2. Use UK English spelling and grammar throughout (e.g., "organised" not "organized", "centre" not "center", "colour" not "color", "realise" not "realize", "specialising" not "specializing").

Provide practical, helpful guidance while making it clear this is general knowledge rather than from specific official documents.`
    }

    // Add response template if available for structured answers
    if (responseTemplate) {
      prompt += `\n\nStructure your response as follows:\n${responseTemplate}`
    }
    
    const stream = await getOpenAI().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: hasOfficialDocuments ? 0.3 : 0.5, // Higher temperature for general knowledge
      max_tokens: 400, // Increased token limit for more comprehensive answers
      stream: true,
    })
    
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
  
  await supabase
    .from('ask_ed_analytics')
    .insert({
      event_type: 'search_failed',
      session_id: sessionId,
      data: { 
        query,
        timestamp: new Date().toISOString()
      }
    })
}

async function saveConversation(sessionId: string, message: string, response: string, confidence: any) {
  const supabase = getSupabase()
  
  const { data: existing } = await supabase
    .from('ask_ed_conversations')
    .select('messages')
    .eq('session_id', sessionId)
    .single()
  
  const messages: any[] = Array.isArray(existing?.messages) ? existing.messages : []
  messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() })
  messages.push({ role: 'assistant', content: response, timestamp: new Date().toISOString() })
  
  if (existing) {
    await supabase
      .from('ask_ed_conversations')
      .update({ messages, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId)
  } else {
    await supabase
      .from('ask_ed_conversations')
      .insert({ session_id: sessionId, messages })
  }
  
  await supabase
    .from('ask_ed_analytics')
    .insert({
      event_type: 'question_answered',
      session_id: sessionId,
      data: { 
        question: message,
        confidence_score: confidence.score,
        search_method: confidence.method,
        result_count: confidence.resultCount,
        best_similarity: confidence.bestSimilarity
      }
    })
}