import { getSupabase } from '@/lib/supabase'
import { getEmbeddings } from './openai'
import { enhanceQuery } from './queryProcessor'
import { searchKnowledgeBase } from './knowledgeBase'
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
  
  console.log(`Processing ${chunks.length} chunks for embedding...`)
  
  // Check for existing documents to avoid duplicates
  const existingSources = new Set()
  const { data: existing, error: existingError } = await supabase
    .from('ask_ed_documents')
    .select('source_document')
    .in('source_document', Array.from(new Set(chunks.map(c => c.metadata.source))))
  
  if (existingError) {
    console.error('Database error checking for existing documents:', existingError)
    throw new Error(`Failed to check for existing documents: ${existingError.message}`)
  }
  
  if (existing) {
    existing.forEach(doc => existingSources.add(doc.source_document))
  }
  
  // Filter out chunks from documents that already exist
  const newChunks = chunks.filter(chunk => !existingSources.has(chunk.metadata.source))
  
  if (newChunks.length === 0) {
    console.log('All documents already exist in the database. Skipping processing.')
    return
  }
  
  if (newChunks.length < chunks.length) {
    console.log(`Skipping ${chunks.length - newChunks.length} chunks from existing documents`)
  }
  
  console.log(`Processing ${newChunks.length} new chunks for embedding...`)
  
  // Generate embeddings in batches to avoid memory issues
  const embeddings: number[][] = []
  const batchSize = 10
  
  for (let i = 0; i < newChunks.length; i += batchSize) {
    const batch = newChunks.slice(i, i + batchSize)
    console.log(`Generating embeddings for chunks ${i + 1}-${Math.min(i + batchSize, newChunks.length)}...`)
    
    const batchEmbeddings = await Promise.all(
      batch.map(chunk => getEmbeddings().embedQuery(chunk.content))
    )
    embeddings.push(...batchEmbeddings)
  }
  
  // Prepare batch insert data
  const insertData = newChunks.map((chunk, index) => ({
    content: chunk.content,
    embedding: embeddings[index],
    metadata: chunk.metadata,
    source_document: chunk.metadata.source,
    page_number: chunk.metadata.page,
    section: chunk.metadata.section,
  }))
  
  // Insert in batches to avoid database limits
  const dbBatchSize = 50
  for (let i = 0; i < insertData.length; i += dbBatchSize) {
    const batch = insertData.slice(i, i + dbBatchSize)
    console.log(`Inserting batch ${Math.floor(i / dbBatchSize) + 1}/${Math.ceil(insertData.length / dbBatchSize)}...`)
    
    const { error } = await supabase
      .from('ask_ed_documents')
      .insert(batch)
    
    if (error) {
      console.error('Error inserting document batch:', error)
      throw error
    }
  }
  
  console.log(`Successfully inserted ${newChunks.length} document chunks`)
}

export async function searchDocuments(
  query: string,
  matchCount: number = 5,
  matchThreshold: number = 0.3
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
  
  if (!data) {
    return []
  }
  
  return data.map((result: any) => ({
    content: result.content,
    metadata: result.metadata,
    similarity: 1.0, // Keyword matches get high similarity
  }))
}

function calculateConfidence(results: SearchResult[], method: 'semantic' | 'keyword' | 'fuzzy' | 'none'): SearchConfidence {
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
  let searchMethod: 'semantic' | 'keyword' | 'fuzzy' | 'none' = 'none'
  
  // First, check if the query is within scope
  if (!isTopicInScope(query)) {
    const result = {
      context: `[Off-topic Response]\n${getOffTopicResponse()}`,
      responseTemplate: undefined,
      confidence: { score: 1.0, method: 'semantic' as const, resultCount: 1, bestSimilarity: 1.0 }
    }
    
    // Cache off-topic responses for a shorter time
    searchCache.set(contextCacheKey, result, 60000) // 1 minute
    return result
  }
  
  // Next, check knowledge base for common edge cases
  const knowledgeBaseResults = searchKnowledgeBase(query, settingType)
  if (knowledgeBaseResults.length > 0) {
    const kbContext = knowledgeBaseResults
      .slice(0, 2) // Take top 2 knowledge base matches
      .map(entry => `[Knowledge Base - ${entry.source || 'Expert Guidance'}]\n${entry.answer}`)
      .join('\n\n---\n\n')
    
    return {
      context: kbContext,
      responseTemplate: undefined,
      confidence: { score: 0.9, method: 'semantic', resultCount: knowledgeBaseResults.length, bestSimilarity: 1.0 }
    }
  }
  
  // Enhance the query with preprocessing
  const { processedQuery, variations, responseTemplate } = enhanceQuery(query)
  
  // Try semantic search with processed query first
  results = await searchDocuments(processedQuery, 5, 0.3)
  if (results.length > 0) searchMethod = 'semantic'
  
  // If no results, try variations
  if (results.length === 0) {
    for (const variation of variations.slice(0, 3)) { // Try top 3 variations
      results = await searchDocuments(variation, 5, 0.3)
      if (results.length > 0) {
        searchMethod = 'semantic'
        break
      }
    }
  }
  
  // If no results, try with lower threshold
  if (results.length === 0) {
    results = await searchDocuments(processedQuery, 5, 0.2)
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
        const { data, error } = await supabase
          .from('ask_ed_documents')
          .select('*')
          .ilike('content', `%${term}%`)
          .limit(5)
        
        if (error) {
          console.error('Database error in fallback search:', error)
          continue // Try next search term
        }
        
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
  
  // Sort by similarity and take top results
  results.sort((a, b) => b.similarity - a.similarity)
  
  const context = results
    .slice(0, 5)
    .map((result) => {
      const source = `[${result.metadata.source}${
        result.metadata.page ? `, p.${result.metadata.page}` : ''
      }${result.metadata.section ? `, ${result.metadata.section}` : ''}]`
      
      return `${source}\n${result.content}`
    })
    .join('\n\n---\n\n')
  
  const result = { context, responseTemplate, confidence }
  
  // Cache successful results for longer
  const cacheTTL = (confidence?.score ?? 0) > 0.7 ? 600000 : 300000 // 10 min for high confidence, 5 min for lower
  searchCache.set(contextCacheKey, result, cacheTTL)
    
  return result
}