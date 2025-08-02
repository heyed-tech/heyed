#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

async function verifyDeployment() {
  console.log('🔍 Ask Ed Production Deployment Verification\n')

  let hasErrors = false
  const errors: string[] = []
  const warnings: string[] = []

  // 1. Check environment variables
  console.log('1️⃣  Checking environment variables...')

  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    hasErrors = true
    errors.push(`❌ Missing required environment variable: ${envVar}`)
  } else {
    console.log(`✅ ${envVar} is set`)
  }
}

// 2. Test OpenAI connection
console.log('\n2️⃣  Testing OpenAI connection...')
if (process.env.OPENAI_API_KEY) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.models.list()
    console.log('✅ OpenAI API key is valid')
    
    // Check if required models are available
    const models = response.data.map(m => m.id)
    if (!models.includes('gpt-4-turbo-preview')) {
      warnings.push('⚠️  gpt-4-turbo-preview model not available, may need to update model selection')
    }
    if (!models.some(m => m.includes('text-embedding-3-small'))) {
      warnings.push('⚠️  text-embedding-3-small model not available, embeddings may fail')
    }
  } catch (error: any) {
    hasErrors = true
    errors.push(`❌ OpenAI API error: ${error.message}`)
  }
} else {
  console.log('⏭️  Skipping OpenAI test (no API key)')
}

  // 3. Test Supabase connection
  console.log('\n3️⃣  Testing Supabase connection...')
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Test basic connection
    const { error: pingError } = await supabase.from('ask_ed_documents').select('count').limit(1)
    if (pingError) {
      if (pingError.message.includes('relation "public.ask_ed_documents" does not exist')) {
        hasErrors = true
        errors.push('❌ Database table "ask_ed_documents" does not exist')
      } else {
        hasErrors = true
        errors.push(`❌ Supabase connection error: ${pingError.message}`)
      }
    } else {
      console.log('✅ Supabase connection successful')
      
      // Check for required tables
      const tables = ['ask_ed_documents', 'ask_ed_conversations', 'ask_ed_analytics']
      for (const table of tables) {
        const { error } = await supabase.from(table).select('count').limit(1)
        if (error) {
          hasErrors = true
          errors.push(`❌ Table "${table}" is missing or inaccessible`)
        } else {
          console.log(`✅ Table "${table}" exists`)
        }
      }
      
      // Check for RPC function
      try {
        const { error: rpcError } = await supabase.rpc('ask_ed_search_documents', {
          query_embedding: new Array(1536).fill(0), // Dummy embedding
          match_count: 1,
          match_threshold: 0.5
        })
        
        if (rpcError) {
          if (rpcError.message.includes('function') && rpcError.message.includes('does not exist')) {
            hasErrors = true
            errors.push('❌ RPC function "ask_ed_search_documents" does not exist')
          } else if (!rpcError.message.includes('empty')) {
            warnings.push(`⚠️  RPC function error (may be normal if no documents): ${rpcError.message}`)
          }
        } else {
          console.log('✅ RPC function "ask_ed_search_documents" exists')
        }
      } catch (e: any) {
        warnings.push(`⚠️  Could not test RPC function: ${e.message}`)
      }
      
      // Check if documents exist
      const { count, error: countError } = await supabase
        .from('ask_ed_documents')
        .select('*', { count: 'exact', head: true })
      
      if (!countError) {
        if (count === 0) {
          hasErrors = true
          errors.push('❌ No documents found in database - need to run document ingestion')
        } else {
          console.log(`✅ Found ${count} documents in database`)
        }
      }
    }
  } catch (error: any) {
    hasErrors = true
    errors.push(`❌ Supabase setup error: ${error.message}`)
  }
} else {
  console.log('⏭️  Skipping Supabase test (missing credentials)')
}

// 4. Check CORS configuration
console.log('\n4️⃣  Checking CORS configuration...')
const prodDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://heyed.co.uk'
console.log(`ℹ️  Production domain: ${prodDomain}`)
console.log('✅ Ensure this domain is in ALLOWED_ORIGINS in middleware.ts')

// 5. Generate deployment checklist
console.log('\n5️⃣  Deployment Checklist:')
console.log('□ Set all required environment variables in production')
console.log('□ Run database migrations (supabase/migrations/)')
console.log('□ Deploy RPC functions to Supabase')
console.log('□ Ingest documents into vector store')
console.log('□ Update ALLOWED_ORIGINS in middleware.ts')
console.log('□ Test /api/status endpoint after deployment')
console.log('□ Test /api/ask-ed/chat endpoint with a sample query')

// Summary
console.log('\n📊 Summary:')
if (errors.length > 0) {
  console.log('\n❌ Errors found:')
  errors.forEach(e => console.log(`   ${e}`))
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:')
  warnings.forEach(w => console.log(`   ${w}`))
}

  if (!hasErrors) {
    console.log('\n✅ All critical checks passed!')
  } else {
    console.log('\n❌ Fix the errors above before deploying to production')
    process.exit(1)
  }
}

// Run the verification
verifyDeployment().catch(console.error)