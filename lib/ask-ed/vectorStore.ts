import { getSupabase } from '@/lib/supabase'
import { getEmbeddings } from './openai'
import { enhanceQuery, QueryIntent } from './queryProcessor'
import { searchKnowledgeBase, KnowledgeBaseEntry } from './knowledgeBase'
import { isTopicInScope, getOffTopicResponse } from './scopeDetector'
import { cachedEmbedding, cachedSearch, generateEmbeddingKey, generateSearchKey, searchCache } from '@/lib/cache'

export interface DocumentChunk {
  content: string
  metadata: {
    source: string
    page?: number
    section?: string
    [key: string]: any
  }
}

export interface SearchResult extends DocumentChunk {
  similarity: number
}

export interface SearchConfidence {
  score: number // 0-1 scale
  method: 'semantic' | 'keyword' | 'fuzzy' | 'none'
  resultCount: number
  bestSimilarity: number
}

export async function addDocuments(chunks: DocumentChunk[]) {
  const supabase = getSupabase()
  
  for (const chunk of chunks) {
    const embedding = await getEmbeddings().embedQuery(chunk.content)
    
    const { error } = await supabase
      .from('ask_ed_documents')
      .insert({
        content: chunk.content,
        embedding,
        metadata: chunk.metadata,
        source_document: chunk.metadata.source,
        page_number: chunk.metadata.page,
        section: chunk.metadata.section,
      })
    
    if (error) {
      console.error('Error inserting document:', error)
      throw error
    }
  }
}

export async function searchDocuments(
  query: string,
  matchCount: number = 5,
  matchThreshold: number = 0.6
): Promise<SearchResult[]> {
  const searchKey = `${generateSearchKey(query)}_${matchCount}_${matchThreshold}`
  
  return await cachedSearch(searchKey, async () => {
    const supabase = getSupabase()
    
    // Cache the embedding as well
    const embeddingKey = generateEmbeddingKey(query)
    const queryEmbedding = await cachedEmbedding(embeddingKey, async () => {
      return await getEmbeddings().embedQuery(query)
    })
    
    const { data, error } = await supabase.rpc('ask_ed_search_documents', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      match_threshold: matchThreshold,
    })
    
    if (error) {
      throw error
    }
    
    if (!data) {
      return []
    }
    
    return (data as any[]).map((result: any) => ({
      content: result.content,
      metadata: {
        source: result.source_document,
        page: result.page_number,
        section: result.section,
      },
      similarity: result.similarity,
    }))
  })
}

export async function keywordSearch(
  query: string,
  matchCount: number = 5
): Promise<SearchResult[]> {
  const supabase = getSupabase()
  
  // Search for exact phrases and keywords in document content
  const { data, error } = await supabase
    .from('ask_ed_documents')
    .select('*')
    .textSearch('content', query, {
      type: 'websearch',
      config: 'english'
    })
    .limit(matchCount)
  
  if (error) {
    throw error
  }
  
  return data.map((result: any) => ({
    content: result.content,
    metadata: {
      source: result.source_document,
      page: result.page_number,
      section: result.section,
    },
    similarity: 1.0, // Keyword matches get high similarity
  }))
}

function calculateConfidence(results: SearchResult[], method: SearchConfidence['method']): SearchConfidence {
  if (results.length === 0) {
    return { score: 0, method: 'none', resultCount: 0, bestSimilarity: 0 }
  }
  
  const bestSimilarity = Math.max(...results.map(r => r.similarity))
  let score = 0
  
  switch (method) {
    case 'semantic':
      // High confidence for semantic search with good similarity
      score = bestSimilarity > 0.7 ? 0.9 : bestSimilarity > 0.5 ? 0.7 : bestSimilarity > 0.3 ? 0.5 : 0.3
      break
    case 'keyword':
      // Medium confidence for keyword matches
      score = results.length > 3 ? 0.8 : results.length > 1 ? 0.6 : 0.4
      break
    case 'fuzzy':
      // Low confidence for fuzzy/ILIKE matches
      score = results.length > 5 ? 0.5 : results.length > 2 ? 0.3 : 0.2
      break
  }
  
  return { score, method, resultCount: results.length, bestSimilarity }
}

export async function getRelevantContext(query: string, settingType?: 'nursery' | 'club'): Promise<{ 
  context: string
  responseTemplate?: string
  confidence: SearchConfidence
}> {
  // Try to get from cache first (for common queries)
  const contextCacheKey = generateSearchKey(`context_${query}`, settingType)
  const cachedContext = searchCache.get<{context: string, responseTemplate?: string, confidence: SearchConfidence}>(contextCacheKey)
  
  if (cachedContext) {
    return cachedContext
  }

  let results: SearchResult[] = []
  let searchMethod: SearchConfidence['method'] = 'none'
  
  // Only block obviously off-topic queries (greetings, weather, etc.)
  // Let vector search handle edge cases rather than being overly restrictive
  const obviouslyOffTopic = query.toLowerCase().match(/^(hi|hello|hey|good morning|what('s| is) the weather|who is the prime minister|what year is it)/)
  
  if (obviouslyOffTopic) {
    const result = {
      context: `[Off-topic Response]\n${getOffTopicResponse()}`,
      responseTemplate: undefined,
      confidence: { score: 1.0, method: 'semantic' as const, resultCount: 1, bestSimilarity: 1.0 }
    }
    
    // Cache off-topic responses for a shorter time
    searchCache.set(contextCacheKey, result, 60000) // 1 minute
    return result
  }
  
  // Enhance the query with preprocessing
  const { processedQuery, intent, variations, responseTemplate } = enhanceQuery(query)
  
  // For EYFS-related queries, start with lower threshold to get more detailed content
  const isEyfsQuery = query.toLowerCase().includes('eyfs') || 
                     query.toLowerCase().includes('early years') ||
                     query.toLowerCase().includes('updates') ||
                     query.toLowerCase().includes('changes') ||
                     query.toLowerCase().includes('safeguarding') ||
                     query.toLowerCase().includes('requirements')
  
  // Check if this is an annex-related query that needs higher precision
  const isAnnexQuery = query.toLowerCase().includes('annex') ||
                       query.toLowerCase().includes('appendix')
  
  // Determine if this query should prioritize vector search
  const prioritizeVectorSearch = 
    // Questions about updates, changes, or new requirements
    (query.toLowerCase().includes('new') || 
     query.toLowerCase().includes('update') || 
     query.toLowerCase().includes('change') ||
     query.toLowerCase().includes('latest') ||
     query.toLowerCase().includes('2025') ||
     query.toLowerCase().includes('september')) ||
    // Questions asking for detailed information
    (query.toLowerCase().includes('what are') ||
     query.toLowerCase().includes('list of') ||
     query.toLowerCase().includes('all the') ||
     query.toLowerCase().includes('tell me about')) ||
    // Annex queries need vector search priority
    isAnnexQuery
  
  // For simple/edge-case queries, check knowledge base first
  if (!prioritizeVectorSearch) {
    const knowledgeBaseResults = searchKnowledgeBase(query, settingType)
    // Only use KB if it's a strong match (not just any keyword match)
    if (knowledgeBaseResults.length > 0) {
      // Check if it's a really good KB match (multiple keywords or exact query match)
      const strongMatch = knowledgeBaseResults.some(entry => {
        const normalizedQuery = query.toLowerCase()
        const matchCount = entry.keywords.filter(k => 
          normalizedQuery.includes(k.toLowerCase())
        ).length
        return matchCount >= 2 || entry.query.toLowerCase() === normalizedQuery
      })
      
      if (strongMatch) {
        const kbContext = knowledgeBaseResults
          .slice(0, 2)
          .map(entry => `[Knowledge Base - ${entry.source || 'Expert Guidance'}]\n${entry.answer}`)
          .join('\n\n---\n\n')
        
        return {
          context: kbContext,
          responseTemplate: undefined,
          confidence: { score: 0.9, method: 'semantic', resultCount: knowledgeBaseResults.length, bestSimilarity: 1.0 }
        }
      }
    }
  }
  
  // Set appropriate threshold based on query type
  let initialThreshold = 0.6 // default
  if (isEyfsQuery) initialThreshold = 0.5 // lower for EYFS to get more content
  if (isAnnexQuery) initialThreshold = 0.7 // higher for annex queries for precision
  
  // Try semantic search with processed query first
  results = await searchDocuments(processedQuery, 5, initialThreshold)
  if (results.length > 0) searchMethod = 'semantic'
  
  // If no results, try variations
  if (results.length === 0) {
    for (const variation of variations.slice(0, 3)) { // Try top 3 variations
      results = await searchDocuments(variation, 5, initialThreshold)
      if (results.length > 0) {
        searchMethod = 'semantic'
        break
      }
    }
  }
  
  // If no results, try with even lower threshold
  if (results.length === 0) {
    results = await searchDocuments(processedQuery, 5, 0.4)
    if (results.length > 0) searchMethod = 'semantic'
  }
  
  // If still no results, try keyword search with original query
  if (results.length === 0) {
    try {
      results = await keywordSearch(query, 5)
      if (results.length > 0) searchMethod = 'keyword'
    } catch (error) {
      // Keyword search might fail if full-text search isn't enabled
      console.log('Keyword search failed, trying simple text search')
      
      // Try both original and processed query
      const supabase = getSupabase()
      const searchTerms = [query, processedQuery, ...variations.slice(0, 2)]
      
      for (const term of searchTerms) {
        const { data } = await supabase
          .from('ask_ed_documents')
          .select('*')
          .ilike('content', `%${term}%`)
          .limit(5)
        
        if (data && data.length > 0) {
          results = data.map((result: any) => ({
            content: result.content,
            metadata: {
              source: result.source_document,
              page: result.page_number,
              section: result.section,
            },
            similarity: 0.8,
          }))
          searchMethod = 'fuzzy'
          break
        }
      }
    }
  }
  
  const confidence = calculateConfidence(results, searchMethod)
  
  if (results.length === 0) {
    const result = { context: '', responseTemplate, confidence }
    searchCache.set(contextCacheKey, result, 30000) // Cache empty results for 30 seconds
    return result
  }
  
  // For EYFS queries, prioritize EYFS Updates content and include more results
  const prioritizeUpdates = isEyfsQuery && results.some(r => 
    r.metadata.source.includes('EYFS Updates') || r.metadata.source.includes('Updates 2025')
  )
  
  if (prioritizeUpdates) {
    // Separate EYFS Updates from other results
    const updatesResults = results.filter(r => 
      r.metadata.source.includes('EYFS Updates') || r.metadata.source.includes('Updates 2025')
    )
    const otherResults = results.filter(r => 
      !r.metadata.source.includes('EYFS Updates') && !r.metadata.source.includes('Updates 2025')
    )
    
    // Sort each group by similarity
    updatesResults.sort((a, b) => b.similarity - a.similarity)
    otherResults.sort((a, b) => b.similarity - a.similarity)
    
    // Combine with Updates first, take more total results
    results = [...updatesResults.slice(0, 4), ...otherResults.slice(0, 2)]
  } else {
    // Standard sorting for non-EYFS queries
    results.sort((a, b) => b.similarity - a.similarity)
  }
  
  const contextResultCount = prioritizeUpdates ? 6 : 5
  
  const context = results
    .slice(0, contextResultCount)
    .map((result) => {
      const source = `[${result.metadata.source}${
        result.metadata.page ? `, p.${result.metadata.page}` : ''
      }${result.metadata.section ? `, ${result.metadata.section}` : ''}]`
      
      return `${source}\n${result.content}`
    })
    .join('\n\n---\n\n')
  
  const result = { context, responseTemplate, confidence }
  
  // Cache successful results for longer
  const cacheTTL = confidence.score > 0.7 ? 600000 : 300000 // 10 min for high confidence, 5 min for lower
  searchCache.set(contextCacheKey, result, cacheTTL)
    
  return result
}