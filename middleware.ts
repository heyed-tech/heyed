import { NextRequest, NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://heyed.co.uk',
  'https://www.heyed.co.uk',
  // Add development origins only in development
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ] : [])
]

// Security headers to add to all responses
const SECURITY_HEADERS = {
  // Prevent XSS attacks
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.tidio.co http://code.tidio.co https://widget-v4.tidiochat.com http://widget-v4.tidiochat.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com https://code.tidio.co http://code.tidio.co",
    "img-src 'self' data: https:",
    "media-src 'self' https://*.supabase.co https://code.tidio.co http://code.tidio.co",
    "connect-src 'self' https://api.openai.com https://*.supabase.co wss://*.supabase.co https://*.tidio.co http://*.tidio.co wss://*.tidio.co ws://*.tidio.co https://*.tidiochat.com http://*.tidiochat.com wss://*.tidiochat.com ws://*.tidiochat.com",
    "frame-src 'self' https://*.tidio.co http://*.tidio.co https://*.tidiochat.com http://*.tidiochat.com",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '),
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', ')
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check if the origin is allowed
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else if (!origin) {
      // Allow same-origin requests (no origin header)
      response.headers.set('Access-Control-Allow-Origin', request.nextUrl.origin)
    }
    // If origin is not allowed, don't set CORS headers (request will be blocked)

    response.headers.set('Access-Control-Allow-Credentials', 'false')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200,
        headers: response.headers
      })
    }
  }

  // Add specific headers for AskEd. API routes
  if (request.nextUrl.pathname.startsWith('/api/ask-ed/')) {
    // Rate limiting headers (these will be set by the rate limiter, but we can add base ones)
    response.headers.set('X-RateLimit-Limit', '10')
    
    // API versioning
    response.headers.set('X-API-Version', '1.0')
    
    // Strict transport security for HTTPS
    if (request.nextUrl.protocol === 'https:') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    }
  }

  // Block requests with suspicious patterns
  const userAgent = request.headers.get('user-agent') || ''
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
  ]

  // Allow legitimate bots but block obvious scrapers for API routes
  if (request.nextUrl.pathname.startsWith('/api/ask-ed/') && 
      suspiciousPatterns.some(pattern => pattern.test(userAgent)) &&
      !userAgent.includes('Googlebot') && 
      !userAgent.includes('bingbot')) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}