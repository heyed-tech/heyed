# Ask Ed Deployment Guide

This guide covers the complete deployment process for the Ask Ed feature in production.

## Prerequisites

1. **Vercel Account** (or your hosting platform)
2. **Supabase Project** with pgvector extension enabled
3. **OpenAI API Key** with access to GPT-4 and embeddings

## Environment Variables

Create these environment variables in your production environment:

```bash
# Required
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Optional
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

## Database Setup

### 1. Enable pgvector Extension

Run in Supabase SQL editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Run Migrations

Apply the migration from `supabase/migrations/001_ask_ed_schema.sql` or run:

```bash
npm run setup:database
```

### 3. Create RPC Function

Run this SQL in Supabase:

```sql
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
```

## Document Ingestion

Before Ask Ed can answer questions, you need to ingest documents:

1. Place PDF documents in `scripts/documents/`
2. Run the ingestion script:
   ```bash
   npm run process:documents
   ```

## Deployment Steps

### 1. Pre-deployment Verification

Run the verification script locally:
```bash
npm run verify:deployment
```

This will check:
- Environment variables
- OpenAI API connection
- Supabase connection
- Database schema
- Document count

### 2. Update Middleware

Ensure your production domain is in the `ALLOWED_ORIGINS` in `middleware.ts`:

```typescript
const ALLOWED_ORIGINS = [
  'https://heyed.co.uk',
  'https://www.heyed.co.uk',
  // Add your domain here
]
```

### 3. Deploy to Vercel

```bash
vercel --prod
```

Or use GitHub integration for automatic deployments.

### 4. Post-deployment Verification

1. Check health endpoint:
   ```
   https://your-domain.com/api/ask-ed/health
   ```

2. Check status endpoint:
   ```
   https://your-domain.com/api/status?stats=true
   ```

3. Test Ask Ed functionality:
   - Navigate to `/ask-ed`
   - Ask a test question
   - Verify response

## Monitoring

### Health Checks

The health endpoint provides real-time status:
- Environment variables
- OpenAI connectivity
- Database connection
- Vector store status

### Analytics

View usage analytics in Supabase:
```sql
-- Recent questions
SELECT * FROM ask_ed_analytics 
WHERE event_type = 'question_answered' 
ORDER BY created_at DESC 
LIMIT 20;

-- Failed searches
SELECT * FROM ask_ed_analytics 
WHERE event_type = 'search_failed' 
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY is not set"**
   - Verify environment variable in production
   - Restart application after setting

2. **"No documents found in database"**
   - Run document ingestion script
   - Check Supabase logs for errors

3. **"RPC function does not exist"**
   - Run the RPC function SQL in Supabase
   - Check function permissions

4. **CORS errors**
   - Update `ALLOWED_ORIGINS` in middleware
   - Redeploy application

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=ask-ed:*
```

## Security Considerations

1. **API Keys**: Never commit API keys to git
2. **Rate Limiting**: Configured at 10 requests/minute per IP
3. **CORS**: Only allow specific domains
4. **Input Validation**: All inputs are sanitized
5. **Error Messages**: User-facing errors don't expose internals

## Performance Optimization

1. **Caching**: Responses are cached for common queries
2. **Embeddings**: Cached to reduce API calls
3. **Database Indexes**: Ensure ivfflat index exists
4. **Document Chunking**: Optimize chunk size (default: 1000 chars)

## Maintenance

### Regular Tasks

1. **Monitor Usage**: Check analytics weekly
2. **Update Documents**: Re-ingest when policies change
3. **Review Failed Searches**: Improve knowledge base
4. **Check Costs**: Monitor OpenAI usage

### Updating Documents

```bash
# Add new documents to scripts/documents/
npm run process:documents
```

### Backup

Regular backups recommended:
```bash
# Export conversations
supabase db dump -f ask_ed_backup.sql --data-only -t ask_ed_conversations

# Export analytics
supabase db dump -f analytics_backup.sql --data-only -t ask_ed_analytics
```

## Support

For issues:
1. Check health endpoint
2. Review application logs
3. Check Supabase logs
4. Contact support with correlation ID from errors