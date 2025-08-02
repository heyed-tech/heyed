// Simple in-memory rate limiting for Ask Ed API
// For production, consider Redis-based rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests = 10, windowMs = 60000) { // 10 requests per minute
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }

  private getClientId(request: Request): string {
    // Try to get real IP from various headers (for proxy/CDN scenarios)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const remoteAddr = request.headers.get('x-remote-addr')
    
    if (forwarded) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      return forwarded.split(',')[0].trim()
    }
    
    return realIp || remoteAddr || 'unknown'
  }

  public checkLimit(request: Request): { allowed: boolean; remaining: number; resetTime: number } {
    const clientId = this.getClientId(request)
    const now = Date.now()
    const resetTime = now + this.windowMs

    let entry = this.store.get(clientId)

    // If no entry exists or the window has expired, create a new one
    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime }
      this.store.set(clientId, entry)
      return { allowed: true, remaining: this.maxRequests - 1, resetTime }
    }

    // Increment the count
    entry.count++

    // Check if limit is exceeded
    if (entry.count > this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime }
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter(10, 60000) // 10 requests per minute

export { rateLimiter, RateLimiter }

// Helper function to create rate limit response
export function createRateLimitResponse(resetTime: number) {
  const remainingSeconds = Math.ceil((resetTime - Date.now()) / 1000)
  
  return new Response(
    JSON.stringify({ 
      error: 'Too many requests. Please wait before sending another message.',
      retryAfter: remainingSeconds
    }),
    { 
      status: 429,
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': remainingSeconds.toString(),
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.floor(resetTime / 1000).toString()
      } 
    }
  )
}