#!/usr/bin/env tsx

import { config } from 'dotenv'
config({ path: '.env.local' })

import { getRelevantContext } from '../lib/ask-ed/vectorStore'

async function testSearch() {
  console.log('🔍 Testing Ask Ed Vector Search\n')
  
  const testQueries = [
    'What are the DSL responsibilities?',
    'What are staff ratios for under 2s?',
    'Tell me about safeguarding procedures',
    'What is Annex C about?'
  ]
  
  for (const query of testQueries) {
    console.log(`🔎 Testing: "${query}"`)
    
    try {
      const { context, confidence } = await getRelevantContext(query)
      
      if (context) {
        console.log(`✅ Found relevant content (confidence: ${confidence.score.toFixed(2)})`)
        console.log(`   Method: ${confidence.method}`)
        console.log(`   Results: ${confidence.resultCount}`)
        console.log(`   Best similarity: ${confidence.bestSimilarity.toFixed(3)}`)
        
        // Show first source
        const firstSource = context.split('[')[1]?.split(']')[0]
        if (firstSource) {
          console.log(`   Source: ${firstSource}`)
        }
        
        // Show snippet
        const snippet = context.substring(0, 150).replace(/\n/g, ' ')
        console.log(`   Snippet: "${snippet}..."`)
      } else {
        console.log('❌ No relevant content found')
      }
    } catch (error: any) {
      console.log('❌ Search failed:', error.message)
    }
    
    console.log('')
  }
}

testSearch().catch(console.error)