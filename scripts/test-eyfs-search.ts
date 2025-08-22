import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { searchDocuments, getRelevantContext } from '../lib/ask-ed/vectorStore'

async function testSearch() {
  console.log('Testing EYFS search functionality...\n')
  
  // Test direct vector search
  const testQueries = [
    'whats new in the eyfs',
    'EYFS updates September 2025',
    'safeguarding changes EYFS',
    'safer eating requirements'
  ]
  
  for (const query of testQueries) {
    console.log(`\n=== Testing query: "${query}" ===`)
    
    // Test searchDocuments
    try {
      const results = await searchDocuments(query, 5, 0.3)
      console.log(`searchDocuments: Found ${results.length} results`)
      if (results.length > 0) {
        console.log('Top result:')
        console.log('  Source:', results[0].metadata.source)
        console.log('  Similarity:', results[0].similarity)
        console.log('  Content preview:', results[0].content.substring(0, 150))
      }
    } catch (e: any) {
      console.error('searchDocuments error:', e.message)
    }
    
    // Test getRelevantContext (what the chatbot uses)
    try {
      const { context, confidence } = await getRelevantContext(query)
      console.log('\ngetRelevantContext:')
      console.log('  Confidence:', confidence)
      console.log('  Context length:', context?.length || 0)
      if (context) {
        const lines = context.split('\n')
        console.log('  First source:', lines[0])
        console.log('  Content preview:', lines[1]?.substring(0, 150))
      } else {
        console.log('  No context returned')
      }
    } catch (e: any) {
      console.error('getRelevantContext error:', e.message)
    }
  }
  
  // Check what's actually in the database
  console.log('\n=== Checking database content ===')
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data: eyfsChunks } = await supabase
    .from('ask_ed_documents')
    .select('content, metadata')
    .eq('metadata->>source', 'EYFS Updates September 2025')
    .limit(3)
    
  console.log(`Found ${eyfsChunks?.length || 0} EYFS Updates September 2025 chunks`)
  if (eyfsChunks && eyfsChunks.length > 0) {
    console.log('Sample chunk:', eyfsChunks[0].content.substring(0, 200))
  }
}

testSearch()