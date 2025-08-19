Ask Ed Chatbot - Production-Ready Refactoring Guide
Context
You are tasked with refactoring the "Ask Ed" AI compliance chatbot for HeyEd, a platform helping UK nurseries and clubs with KCSiE and EYFS compliance. The current implementation has good foundations but needs significant improvements to be production-ready.
Current Tech Stack

Frontend: Next.js 15.2.4, React 19, Tailwind CSS with shadcn/ui
Backend: Supabase with pgvector
AI/ML: OpenAI GPT-4 API with RAG implementation
Language: TypeScript

Critical Issues to Fix
1. Performance Optimization (Priority: HIGH)
Current Problems:

No caching mechanism for repeated queries
Loading entire conversation history on each request
Synchronous document processing
Missing database connection pooling

Required Fixes:
typescript// Implement Redis caching for common queries
// Add this to /lib/ask-ed/cache.ts
interface CacheConfig {
  ttl: number; // 1 hour for common queries
  maxSize: number; // Maximum cache entries
  keyPrefix: string; // 'ask-ed:query:'
}

// Implement connection pooling in /lib/supabase.ts
// Add conversation context limiter in route.ts (max 5 exchanges)
// Use worker threads for document processing
2. Security Enhancements (Priority: CRITICAL)
Current Problems:

Basic IP-only rate limiting (easily bypassed)
No prompt injection protection
Unencrypted conversation storage
Missing audit logs for compliance

Required Fixes:
typescript// Enhanced rate limiting in /lib/rateLimit.ts
interface EnhancedRateLimiter {
  sessionFingerprint: string; // Combine IP + user agent + session
  slidingWindow: boolean; // Use sliding window algorithm
  maxRequestsPerMinute: number; // 10 for free tier
  maxRequestsPerHour: number; // 50 for free tier
}

// Prompt injection protection in /lib/ask-ed/security.ts
interface PromptSecurity {
  detectInjection(input: string): boolean;
  sanitizeInput(input: string): string;
  validateContext(context: string): boolean;
}

// Audit logging in /lib/ask-ed/audit.ts
interface AuditLog {
  userId?: string;
  sessionId: string;
  query: string;
  response: string;
  timestamp: Date;
  complianceTopics: string[];
  ipAddress: string;
  gdprConsent: boolean;
}
3. Type Safety Improvements (Priority: HIGH)
Current Problems:

Multiple any types throughout codebase
Missing interfaces for API responses
Inconsistent error types

Required Fixes:
typescript// Replace all instances of 'any' with proper types
// Example: In /app/api/ask-ed/chat/route.ts
interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: string[];
}

// Don't use: recentMessages.forEach((msg: any) => {})
// Use: recentMessages.forEach((msg: ConversationMessage) => {})
4. Error Handling Standardization (Priority: MEDIUM)
Current Problems:

Inconsistent error handling patterns
Missing error recovery mechanisms
No circuit breaker for external services

Required Fixes:
typescript// Implement circuit breaker in /lib/ask-ed/circuitBreaker.ts
class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime?: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Implement circuit breaker logic
    // Open circuit after 5 failures in 1 minute
    // Half-open after 30 seconds
  }
}

// Wrap all external calls (OpenAI, Supabase) with circuit breaker
5. Caching Implementation (Priority: HIGH)
Current Problems:

No caching leading to high API costs
Repeated processing of identical queries

Required Fixes:
typescript// Add to /lib/ask-ed/cache.ts
import { Redis } from 'ioredis';

class QueryCache {
  private redis: Redis;
  
  async getCachedResponse(query: string, settingType?: string): Promise<CachedResponse | null> {
    const key = this.generateKey(query, settingType);
    // Check cache, return if hit
  }
  
  async setCachedResponse(query: string, response: string, metadata: ResponseMetadata): Promise<void> {
    // Cache with 1-hour TTL for common queries
    // Cache with 24-hour TTL for static compliance info
  }
  
  private generateKey(query: string, settingType?: string): string {
    // Generate consistent cache key using query normalization
  }
}
6. Monitoring & Observability (Priority: HIGH)
Current Problems:

No health check endpoints
Missing performance metrics
No error tracking

Required Fixes:
typescript// Add to /app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    openai: await checkOpenAI(),
    redis: await checkRedis(),
    vectorStore: await checkVectorStore()
  };
  
  return Response.json({
    status: allHealthy(checks) ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  });
}

// Add to /lib/monitoring.ts
interface Metrics {
  queryLatency: Histogram;
  cacheHitRate: Counter;
  errorRate: Counter;
  activeUsers: Gauge;
}
7. Document Processing Improvements (Priority: MEDIUM)
Current Problems:

Manual document updates
No version tracking
Synchronous processing blocking main thread

Required Fixes:
typescript// Add to /lib/ask-ed/documentProcessor.ts
class DocumentProcessor {
  async processWithWorker(document: Buffer): Promise<ProcessedChunks> {
    // Use worker threads for CPU-intensive processing
  }
  
  async trackDocumentVersion(doc: Document): Promise<void> {
    // Store document hash and version metadata
  }
  
  async incrementalUpdate(changes: DocumentChanges): Promise<void> {
    // Only update changed sections, not full reprocess
  }
}
8. API Abstraction Layer (Priority: MEDIUM)
Current Problems:

Direct coupling to OpenAI API
No fallback providers
Vendor lock-in

Required Fixes:
typescript// Create /lib/ask-ed/ai-provider.ts
interface AIProvider {
  generateResponse(prompt: string, context: string): Promise<Stream>;
  generateEmbedding(text: string): Promise<number[]>;
  estimateCost(tokens: number): number;
}

class OpenAIProvider implements AIProvider {
  // Current OpenAI implementation
}

class AnthropicProvider implements AIProvider {
  // Fallback provider implementation
}

class AIProviderFactory {
  getProvider(preferred?: string): AIProvider {
    // Return appropriate provider with fallback logic
  }
}
9. Testing Infrastructure (Priority: HIGH)
Current Problems:

No automated tests
Missing load testing
No integration tests

Required Fixes:
typescript// Add comprehensive tests
// /tests/unit/vectorStore.test.ts
// /tests/integration/chat-api.test.ts
// /tests/load/performance.test.ts

describe('Chat API', () => {
  it('should handle rate limiting gracefully', async () => {});
  it('should return cached responses for identical queries', async () => {});
  it('should detect and block prompt injection attempts', async () => {});
  it('should recover from OpenAI API failures', async () => {});
});
10. Production Configuration (Priority: CRITICAL)
Current Problems:

Missing environment-specific configs
No feature flags
Manual deployments

Required Fixes:
yaml# Add .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  test:
    # Run all tests
  deploy:
    # Deploy with zero-downtime
    # Run database migrations
    # Update vector store if needed
    # Invalidate cache
Implementation Priority Order
Phase 1 (Week 1) - Critical Security & Performance

Fix all TypeScript any types
Implement enhanced rate limiting with session fingerprinting
Add prompt injection protection
Implement Redis caching for queries
Add health check endpoints

Phase 2 (Week 2) - Reliability & Monitoring

Implement circuit breakers for external services
Add comprehensive error handling
Set up monitoring and metrics
Add audit logging for compliance
Implement connection pooling

Phase 3 (Week 3) - Testing & Documentation

Add unit tests (minimum 80% coverage)
Add integration tests for critical paths
Perform load testing (target: 100 concurrent users)
Document all API endpoints
Create runbooks for common issues

Phase 4 (Week 4) - Deployment & Operations

Set up CI/CD pipeline
Configure staging environment
Implement feature flags
Add automated document processing
Final security audit

Success Criteria

 Response time < 3 seconds for 95% of queries
 Cache hit rate > 40% for common queries
 Zero prompt injection vulnerabilities
 99.9% uptime SLA capability
 Support for 100 concurrent users
 Automated deployment with rollback capability
 Comprehensive audit trail for compliance
 Cost reduction of 50% through caching
 All critical paths covered by tests
 Complete API documentation

File Structure After Refactoring
/lib/ask-ed/
  ├── ai-provider.ts       # AI provider abstraction
  ├── cache.ts             # Redis caching logic
  ├── circuitBreaker.ts    # Circuit breaker implementation
  ├── security.ts          # Prompt injection protection
  ├── audit.ts             # Audit logging
  ├── monitoring.ts        # Metrics and monitoring
  └── types.ts             # All TypeScript interfaces

/app/api/
  ├── ask-ed/
  │   └── chat/route.ts    # Refactored with all improvements
  └── health/
      └── route.ts         # Health check endpoints

/tests/
  ├── unit/               # Unit tests
  ├── integration/        # Integration tests
  └── load/              # Performance tests

/.github/workflows/
  ├── ci.yml             # Continuous integration
  └── deploy.yml         # Deployment pipeline
Notes for Implementation

Maintain backward compatibility during refactoring
Use feature flags to gradually roll out changes
Keep the existing disclaimer about AI guidance vs legal advice
Ensure all changes comply with GDPR requirements
Document all breaking changes
Create migration scripts for database changes
Test thoroughly with real compliance questions

Expected Outcomes
After implementing these fixes, the Ask Ed chatbot will be:

Secure: Protected against common attacks and prompt injection
Performant: Sub-3 second response times with caching
Reliable: 99.9% uptime with circuit breakers and monitoring
Compliant: Full audit trail for regulatory requirements
Scalable: Ready for 100+ concurrent users
Maintainable: Clean code with comprehensive tests and documentation