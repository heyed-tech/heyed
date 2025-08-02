#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

console.log('🚀 Ask Ed Database Setup\n')

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function setupDatabase() {
  console.log('1️⃣  Creating tables...')
  
  // Note: These queries should ideally be in migration files
  // This script is for verification and quick setup
  
  const tables = [
    {
      name: 'ask_ed_documents',
      check: `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ask_ed_documents'
      )`,
      create: `
        CREATE TABLE IF NOT EXISTS ask_ed_documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content TEXT NOT NULL,
          embedding vector(1536),
          metadata JSONB,
          source_document TEXT,
          page_number INTEGER,
          section TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_ask_ed_documents_embedding 
        ON ask_ed_documents USING ivfflat (embedding vector_cosine_ops);
        
        CREATE INDEX IF NOT EXISTS idx_ask_ed_documents_source 
        ON ask_ed_documents(source_document);
      `
    },
    {
      name: 'ask_ed_conversations',
      check: `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ask_ed_conversations'
      )`,
      create: `
        CREATE TABLE IF NOT EXISTS ask_ed_conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id TEXT NOT NULL UNIQUE,
          messages JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_ask_ed_conversations_session 
        ON ask_ed_conversations(session_id);
      `
    },
    {
      name: 'ask_ed_analytics',
      check: `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ask_ed_analytics'
      )`,
      create: `
        CREATE TABLE IF NOT EXISTS ask_ed_analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type TEXT NOT NULL,
          session_id TEXT,
          data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_ask_ed_analytics_event 
        ON ask_ed_analytics(event_type);
        
        CREATE INDEX IF NOT EXISTS idx_ask_ed_analytics_session 
        ON ask_ed_analytics(session_id);
        
        CREATE INDEX IF NOT EXISTS idx_ask_ed_analytics_created 
        ON ask_ed_analytics(created_at);
      `
    }
  ]
  
  // Check and create tables
  for (const table of tables) {
    const { data: exists } = await supabase.rpc('query', { query: table.check })
    
    if (!exists?.[0]?.exists) {
      console.log(`📝 Creating table: ${table.name}`)
      const { error } = await supabase.rpc('query', { query: table.create })
      
      if (error) {
        console.error(`❌ Error creating ${table.name}:`, error.message)
        console.log('💡 You may need to run the SQL manually in Supabase dashboard')
      } else {
        console.log(`✅ Created table: ${table.name}`)
      }
    } else {
      console.log(`✅ Table exists: ${table.name}`)
    }
  }
  
  console.log('\n2️⃣  Creating RPC functions...')
  
  const rpcFunction = `
    CREATE OR REPLACE FUNCTION ask_ed_search_documents(
      query_embedding vector(1536),
      match_count int DEFAULT 5,
      match_threshold float DEFAULT 0.3
    )
    RETURNS TABLE (
      id uuid,
      content text,
      metadata jsonb,
      source_document text,
      page_number int,
      section text,
      similarity float
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        d.id,
        d.content,
        d.metadata,
        d.source_document,
        d.page_number,
        d.section,
        1 - (d.embedding <=> query_embedding) as similarity
      FROM ask_ed_documents d
      WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
      ORDER BY d.embedding <=> query_embedding
      LIMIT match_count;
    END;
    $$;
  `
  
  console.log('📝 Creating RPC function: ask_ed_search_documents')
  console.log('💡 Please run this SQL in your Supabase SQL editor:')
  console.log('\n' + rpcFunction + '\n')
  
  console.log('\n3️⃣  Checking vector extension...')
  console.log('💡 Ensure pgvector extension is enabled in Supabase:')
  console.log('   CREATE EXTENSION IF NOT EXISTS vector;')
  
  console.log('\n✅ Database setup complete!')
  console.log('\n📋 Next steps:')
  console.log('1. Run the SQL commands above in Supabase SQL editor')
  console.log('2. Enable pgvector extension if not already enabled')
  console.log('3. Run document ingestion to populate the vector store')
  console.log('4. Test with scripts/verify-deployment.ts')
}

setupDatabase().catch(console.error)