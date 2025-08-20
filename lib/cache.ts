// Simple in-memory caching for AskEd.
// For production, consider Redis or other distributed cache

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class InMemoryCache {
  private store = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL: number

  constructor(defaultTTL = 300000) { // 5 minutes default
    this.defaultTTL = defaultTTL
    
    // Clean up expired entries every 2 minutes
    setInterval(() => this.cleanup(), 2 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.store.delete(key)
      }
    }
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.timestamp + entry.ttl) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  size(): number {
    // Clean up first to get accurate count
    this.cleanup()
    return this.store.size
  }

  // Get cache statistics
  getStats() {
    this.cleanup()
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    }
  }
}

// Create cache instances for different data types
export const embeddingsCache = new InMemoryCache(30 * 60 * 1000) // 30 minutes for embeddings
export const searchCache = new InMemoryCache(5 * 60 * 1000) // 5 minutes for search results
export const responseCache = new InMemoryCache(10 * 60 * 1000) // 10 minutes for common responses

// Cache key generators
export function generateEmbeddingKey(text: string): string {
  // Create a hash of the text for consistent caching
  const hash = text.length > 100 
    ? `${text.substring(0, 50)}...${text.substring(text.length - 50)}_${text.length}`
    : text
  return `embedding:${hash}`
}

export function generateSearchKey(query: string, settingType?: string): string {
  const normalized = query.toLowerCase().trim()
  return `search:${normalized}:${settingType || 'default'}`
}

export function generateResponseKey(context: string, query: string): string {
  // Use first 200 chars of context and full query for key
  const contextSnippet = context.substring(0, 200)
  return `response:${contextSnippet}:${query}`
}

// Cache wrapper functions
export async function cachedEmbedding<T>(
  key: string,
  embedFunction: () => Promise<T>
): Promise<T> {
  const cached = embeddingsCache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const result = await embedFunction()
  embeddingsCache.set(key, result)
  return result
}

export async function cachedSearch<T>(
  key: string,
  searchFunction: () => Promise<T>
): Promise<T> {
  const cached = searchCache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const result = await searchFunction()
  searchCache.set(key, result)
  return result
}

export async function cachedResponse<T>(
  key: string,
  responseFunction: () => Promise<T>
): Promise<T> {
  const cached = responseCache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const result = await responseFunction()
  responseCache.set(key, result)
  return result
}

// Cache warming functions for common queries
export function warmSearchCache() {
  const commonQueries = [
    'what are the staff ratios for nurseries',
    'kcsie safeguarding requirements',
    'eyfs learning goals',
    'ofsted inspection preparation',
    'what qualifications do staff need',
    'how to report safeguarding concerns'
  ]

  // This would be called during app startup to pre-populate cache
  // Implementation would depend on your search function
  console.log('Cache warming initiated for', commonQueries.length, 'common queries')
}

// Cache metrics for monitoring
export function getCacheMetrics() {
  return {
    embeddings: embeddingsCache.getStats(),
    search: searchCache.getStats(),
    response: responseCache.getStats(),
    timestamp: new Date().toISOString()
  }
}

// Cache clearing utility (useful for testing or manual cache invalidation)
export function clearAllCaches() {
  embeddingsCache.clear()
  searchCache.clear()
  responseCache.clear()
  console.log('All caches cleared')
}