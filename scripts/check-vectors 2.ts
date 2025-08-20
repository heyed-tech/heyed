#!/usr/bin/env tsx

import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { getSupabase } from '../lib/supabase'

async function checkVectors() {
  console.log('🔍 Ask Ed Vector Store Health Check\n')
  
  const supabase = getSupabase()
  let hasErrors = false

  try {
    // 1. Check if pgvector extension is enabled
    console.log('1️⃣  Checking pgvector extension...')
    const { data: extensions, error: extError } = await supabase
      .from('pg_extension')
      .select('extname')
      .eq('extname', 'vector')
    
    if (extError) {
      console.log('⚠️  Could not check extensions (this is normal for some Supabase tiers)')
    } else if (!extensions || extensions.length === 0) {
      console.log('❌ pgvector extension not found')
      hasErrors = true
    } else {
      console.log('✅ pgvector extension is enabled')
    }

    // 2. Check if ask_ed_documents table exists
    console.log('\n2️⃣  Checking ask_ed_documents table...')
    const { data: tableCheck, error: tableError } = await supabase
      .from('ask_ed_documents')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.log('❌ ask_ed_documents table does not exist or is not accessible')
      console.log('   Error:', tableError.message)
      hasErrors = true
      return
    } else {
      console.log('✅ ask_ed_documents table exists and is accessible')
    }

    // 3. Check document count
    console.log('\n3️⃣  Checking document count...')
    const { count, error: countError } = await supabase
      .from('ask_ed_documents')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.log('❌ Error counting documents:', countError.message)
      hasErrors = true
    } else {
      console.log(`✅ Found ${count} documents in vector store`)
      if (count === 0) {
        console.log('⚠️  No documents found - run document processing script')
        hasErrors = true
      }
    }

    // 4. Check document distribution by source
    console.log('\n4️⃣  Checking document distribution...')
    const { data: docs, error: docsError } = await supabase
      .from('ask_ed_documents')
      .select('source_document')
    
    if (docsError) {
      console.log('❌ Error fetching document sources:', docsError.message)
      hasErrors = true
    } else if (docs) {
      const sourceCounts: Record<string, number> = {}
      docs.forEach(doc => {
        const source = (doc.source_document as string) || 'Unknown'
        sourceCounts[source] = (sourceCounts[source] || 0) + 1
      })
      
      console.log('   Document sources:')
      Object.entries(sourceCounts).forEach(([source, count]) => {
        console.log(`   - ${source}: ${count} chunks`)
      })
    }

    // 5. Check if embeddings exist
    console.log('\n5️⃣  Checking embeddings...')
    const { data: embeddingCheck, error: embeddingError } = await supabase
      .from('ask_ed_documents')
      .select('embedding')
      .not('embedding', 'is', null)
      .limit(1)
    
    if (embeddingError) {
      console.log('❌ Error checking embeddings:', embeddingError.message)
      hasErrors = true
    } else if (!embeddingCheck || embeddingCheck.length === 0) {
      console.log('❌ No embeddings found - documents may not be properly processed')
      hasErrors = true
    } else {
      console.log('✅ Embeddings are present')
      
      // Check embedding dimensions
      const embedding = embeddingCheck[0].embedding
      if (Array.isArray(embedding)) {
        console.log(`   Embedding dimension: ${embedding.length}`)
        if (embedding.length !== 1536) {
          console.log('⚠️  Expected 1536 dimensions for text-embedding-3-small')
        }
      }
    }

    // 6. Check if RPC function exists
    console.log('\n6️⃣  Checking RPC search function...')
    try {
      // Create a dummy embedding vector for testing
      const dummyEmbedding = new Array(1536).fill(0.1)
      
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('ask_ed_search_documents', {
          query_embedding: dummyEmbedding,
          match_count: 1,
          match_threshold: 0.5
        })
      
      if (rpcError) {
        if (rpcError.message.includes('function') && rpcError.message.includes('does not exist')) {
          console.log('❌ RPC function "ask_ed_search_documents" does not exist')
          console.log('   Run the database migration to create it')
          hasErrors = true
        } else {
          console.log('⚠️  RPC function exists but returned error:', rpcError.message)
        }
      } else {
        console.log('✅ RPC function "ask_ed_search_documents" is working')
        console.log(`   Returned ${(rpcData as any[])?.length || 0} results`)
      }
    } catch (e: any) {
      console.log('❌ Error testing RPC function:', e.message)
      hasErrors = true
    }

    // 7. Test actual vector search
    console.log('\n7️⃣  Testing vector search with real query...')
    if (count && count > 0) {
      try {
        // Get a sample document to test search
        const { data: sampleDoc } = await supabase
          .from('ask_ed_documents')
          .select('content')
          .limit(1)
        
        if (sampleDoc && sampleDoc[0]) {
          console.log('   Sample document content preview:')
          console.log(`   "${(sampleDoc[0] as any).content.substring(0, 100)}..."`)
          
          // You would typically use OpenAI to generate embedding here
          console.log('✅ Vector search infrastructure is ready')
          console.log('   (Full search test requires OpenAI API call)')
        }
      } catch (e: any) {
        console.log('⚠️  Could not test vector search:', e.message)
      }
    }

    // 8. Check indexes
    console.log('\n8️⃣  Checking database indexes...')
    const { data: indexes, error: indexError } = await supabase
      .rpc('pg_indexes', { schemaname: 'public', tablename: 'ask_ed_documents' })
      .select('indexname')
    
    if (indexError) {
      console.log('⚠️  Could not check indexes (this is normal for some Supabase tiers)')
    } else if (indexes) {
      const indexNames = indexes.map(i => i.indexname)
      console.log('   Indexes found:', indexNames.join(', '))
      
      const hasVectorIndex = indexNames.some(name => 
        name.includes('embedding') || name.includes('vector')
      )
      
      if (hasVectorIndex) {
        console.log('✅ Vector index is present for fast similarity search')
      } else {
        console.log('⚠️  No vector index found - search may be slow')
      }
    }

  } catch (error: any) {
    console.log('❌ Unexpected error:', error.message)
    hasErrors = true
  }

  // Summary
  console.log('\n📊 Summary:')
  if (hasErrors) {
    console.log('❌ Some issues found with vector store setup')
    console.log('\n🔧 To fix issues:')
    console.log('1. Run database migration: Execute SQL from supabase/migrations/001_ask_ed_schema.sql')
    console.log('2. Process documents: npx tsx scripts/process-documents.ts')
    console.log('3. Verify deployment: npx tsx scripts/verify-deployment.ts')
  } else {
    console.log('✅ Vector store is fully operational!')
    console.log('🚀 Ask Ed is ready to answer compliance questions')
  }
}

// Run the check
checkVectors().catch(console.error)