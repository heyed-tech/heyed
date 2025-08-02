// Comprehensive error handling and categorization for Ask Ed

export enum ErrorCategory {
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  AUTHENTICATION = 'authentication',
  EXTERNAL_SERVICE = 'external_service',
  DATABASE = 'database',
  INTERNAL = 'internal',
  NOT_FOUND = 'not_found'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorDetails {
  category: ErrorCategory
  severity: ErrorSeverity
  code: string
  message: string
  userMessage: string
  statusCode: number
  correlationId?: string
  metadata?: Record<string, any>
}

export class AskEdError extends Error {
  public readonly category: ErrorCategory
  public readonly severity: ErrorSeverity
  public readonly code: string
  public readonly userMessage: string
  public readonly statusCode: number
  public readonly correlationId?: string
  public readonly metadata?: Record<string, any>

  constructor(details: ErrorDetails) {
    super(details.message)
    this.name = 'AskEdError'
    this.category = details.category
    this.severity = details.severity
    this.code = details.code
    this.userMessage = details.userMessage
    this.statusCode = details.statusCode
    this.correlationId = details.correlationId
    this.metadata = details.metadata
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      category: this.category,
      severity: this.severity,
      code: this.code,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
      metadata: this.metadata,
      stack: this.stack
    }
  }
}

// Predefined error templates
export const ErrorTemplates = {
  INVALID_INPUT: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    code: 'INVALID_INPUT',
    statusCode: 400
  },
  RATE_LIMIT_EXCEEDED: {
    category: ErrorCategory.RATE_LIMIT,
    severity: ErrorSeverity.MEDIUM,
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429
  },
  OPENAI_API_ERROR: {
    category: ErrorCategory.EXTERNAL_SERVICE,
    severity: ErrorSeverity.HIGH,
    code: 'OPENAI_API_ERROR',
    statusCode: 503
  },
  DATABASE_ERROR: {
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    code: 'DATABASE_ERROR',
    statusCode: 503
  },
  VECTOR_SEARCH_ERROR: {
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.MEDIUM,
    code: 'VECTOR_SEARCH_ERROR',
    statusCode: 503
  },
  ENVIRONMENT_ERROR: {
    category: ErrorCategory.INTERNAL,
    severity: ErrorSeverity.CRITICAL,
    code: 'ENVIRONMENT_ERROR',
    statusCode: 500
  },
  INTERNAL_SERVER_ERROR: {
    category: ErrorCategory.INTERNAL,
    severity: ErrorSeverity.HIGH,
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500
  }
} as const

// Helper functions for creating specific errors
export function createValidationError(message: string, userMessage?: string, metadata?: Record<string, any>): AskEdError {
  return new AskEdError({
    ...ErrorTemplates.INVALID_INPUT,
    message,
    userMessage: userMessage || 'Please check your input and try again.',
    metadata
  })
}

export function createRateLimitError(retryAfter: number): AskEdError {
  return new AskEdError({
    ...ErrorTemplates.RATE_LIMIT_EXCEEDED,
    message: `Rate limit exceeded, retry after ${retryAfter} seconds`,
    userMessage: 'Too many requests. Please wait before sending another message.',
    metadata: { retryAfter }
  })
}

export function createOpenAIError(originalError: Error): AskEdError {
  return new AskEdError({
    ...ErrorTemplates.OPENAI_API_ERROR,
    message: `OpenAI API error: ${originalError.message}`,
    userMessage: 'I\'m having trouble processing your request right now. Please try again in a moment.',
    metadata: { originalError: originalError.message }
  })
}

export function createDatabaseError(originalError: Error, operation?: string): AskEdError {
  return new AskEdError({
    ...ErrorTemplates.DATABASE_ERROR,
    message: `Database error${operation ? ` during ${operation}` : ''}: ${originalError.message}`,
    userMessage: 'I\'m experiencing technical difficulties. Please try again in a few moments.',
    metadata: { originalError: originalError.message, operation }
  })
}

export function createVectorSearchError(query: string, originalError: Error): AskEdError {
  return new AskEdError({
    ...ErrorTemplates.VECTOR_SEARCH_ERROR,
    message: `Vector search failed for query "${query}": ${originalError.message}`,
    userMessage: 'I couldn\'t find relevant information for your question. Please try rephrasing or ask about KCSiE, EYFS, or Ofsted compliance topics.',
    metadata: { query, originalError: originalError.message }
  })
}

export function createEnvironmentError(variable: string): AskEdError {
  return new AskEdError({
    ...ErrorTemplates.ENVIRONMENT_ERROR,
    message: `Missing or invalid environment variable: ${variable}`,
    userMessage: 'The service is temporarily unavailable. Please try again later.',
    metadata: { variable }
  })
}

// Error logging utility
export function logError(error: AskEdError | Error, context?: Record<string, any>) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level: error instanceof AskEdError ? 
      (error.severity === ErrorSeverity.CRITICAL ? 'error' : 
       error.severity === ErrorSeverity.HIGH ? 'error' : 'warn') : 'error',
    ...(error instanceof AskEdError ? error.toJSON() : {
      name: error.name,
      message: error.message,
      stack: error.stack
    }),
    context
  }

  // In production, this would go to a proper logging service
  console.error('Ask Ed Error:', JSON.stringify(logEntry, null, 2))
}

// Error response helper
export function createErrorResponse(error: AskEdError, correlationId?: string): Response {
  const responseBody = {
    error: error.userMessage,
    code: error.code,
    correlationId: correlationId || error.correlationId
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  // Add retry-after header for rate limiting
  if (error.category === ErrorCategory.RATE_LIMIT && error.metadata?.retryAfter) {
    headers['Retry-After'] = error.metadata.retryAfter.toString()
  }

  return new Response(
    JSON.stringify(responseBody),
    {
      status: error.statusCode,
      headers
    }
  )
}

// Utility to wrap async functions with error handling
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof AskEdError) {
        logError(error, { context })
        throw error
      }
      
      // Convert unknown errors to AskEdError
      const askEdError = new AskEdError({
        ...ErrorTemplates.INTERNAL_SERVER_ERROR,
        message: `Unexpected error${context ? ` in ${context}` : ''}: ${error instanceof Error ? error.message : String(error)}`,
        userMessage: 'Something went wrong. Please try again.',
        metadata: { 
          originalError: error instanceof Error ? error.message : String(error),
          context 
        }
      })
      
      logError(askEdError)
      throw askEdError
    }
  }
}