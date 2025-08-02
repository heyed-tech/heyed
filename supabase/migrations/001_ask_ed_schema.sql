-- Ask Ed Database Schema
-- Creates all necessary tables and functions for the Ask Ed compliance chatbot

-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for storing document chunks with embeddings
CREATE TABLE IF NOT EXISTS ask_ed_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI text-embedding-3-small dimension
    metadata JSONB DEFAULT '{}',
    source_document TEXT NOT NULL,
    page_number INTEGER,
    section TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS ask_ed_documents_embedding_idx ON ask_ed_documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS ask_ed_documents_source_idx ON ask_ed_documents (source_document);
CREATE INDEX IF NOT EXISTS ask_ed_documents_created_at_idx ON ask_ed_documents (created_at);

-- Enable full-text search on content
CREATE INDEX IF NOT EXISTS ask_ed_documents_content_fts_idx ON ask_ed_documents 
USING gin(to_tsvector('english', content));

-- Table for storing conversations
CREATE TABLE IF NOT EXISTS ask_ed_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ask_ed_conversations_session_id_idx ON ask_ed_conversations (session_id);
CREATE INDEX IF NOT EXISTS ask_ed_conversations_created_at_idx ON ask_ed_conversations (created_at);

-- Table for analytics and tracking
CREATE TABLE IF NOT EXISTS ask_ed_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    session_id TEXT,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ask_ed_analytics_event_type_idx ON ask_ed_analytics (event_type);
CREATE INDEX IF NOT EXISTS ask_ed_analytics_session_id_idx ON ask_ed_analytics (session_id);
CREATE INDEX IF NOT EXISTS ask_ed_analytics_created_at_idx ON ask_ed_analytics (created_at);

-- Function for vector similarity search with error handling
CREATE OR REPLACE FUNCTION ask_ed_search_documents(
    query_embedding vector(1536),
    match_count int DEFAULT 5,
    match_threshold float DEFAULT 0.3
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    metadata JSONB,
    source_document TEXT,
    page_number INTEGER,
    section TEXT,
    similarity float
)
LANGUAGE sql STABLE
AS $$
    SELECT 
        ask_ed_documents.id,
        ask_ed_documents.content,
        ask_ed_documents.metadata,
        ask_ed_documents.source_document,
        ask_ed_documents.page_number,
        ask_ed_documents.section,
        1 - (ask_ed_documents.embedding <=> query_embedding) as similarity
    FROM ask_ed_documents
    WHERE 1 - (ask_ed_documents.embedding <=> query_embedding) > match_threshold
    ORDER BY ask_ed_documents.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Function to clean up old analytics data (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void
LANGUAGE sql
AS $$
    DELETE FROM ask_ed_analytics 
    WHERE created_at < NOW() - INTERVAL '90 days';
$$;

-- Function to clean up old conversations (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS void
LANGUAGE sql
AS $$
    DELETE FROM ask_ed_conversations 
    WHERE created_at < NOW() - INTERVAL '30 days';
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_ask_ed_documents_updated_at 
    BEFORE UPDATE ON ask_ed_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ask_ed_conversations_updated_at 
    BEFORE UPDATE ON ask_ed_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE ask_ed_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_ed_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_ed_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for ask_ed_documents (read-only for anon users)
CREATE POLICY "Allow read access to documents" ON ask_ed_documents
    FOR SELECT USING (true);

-- Policy for ask_ed_conversations (allow users to manage their own sessions)
CREATE POLICY "Allow conversation access by session" ON ask_ed_conversations
    FOR ALL USING (true); -- In production, you might want to restrict this based on auth

-- Policy for ask_ed_analytics (allow inserting analytics data)
CREATE POLICY "Allow analytics insert" ON ask_ed_analytics
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions to anon role (adjust as needed for your setup)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ask_ed_documents TO anon;
GRANT ALL ON ask_ed_conversations TO anon;
GRANT INSERT ON ask_ed_analytics TO anon;
GRANT EXECUTE ON FUNCTION ask_ed_search_documents TO anon;

-- Optional: Create a view for analytics dashboard
CREATE OR REPLACE VIEW ask_ed_analytics_summary AS
SELECT 
    event_type,
    DATE(created_at) as date,
    COUNT(*) as count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM ask_ed_analytics
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_type, DATE(created_at)
ORDER BY date DESC, event_type;

-- Grant access to the view
GRANT SELECT ON ask_ed_analytics_summary TO anon;