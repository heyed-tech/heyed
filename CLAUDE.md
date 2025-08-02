# HeyEd AI Assistant Context

## Project Overview
HeyEd is a compliance management platform for nurseries and clubs, helping them stay compliant with UK regulations like KCSiE (Keeping Children Safe in Education) and EYFS (Early Years Foundation Stage).

## Ask Ed - AI Compliance Chatbot
We are building "Ask Ed", an AI-powered chatbot that will be embedded at heyed.co.uk/ask-ed to provide instant compliance guidance.

### Key Features
- AI-powered Q&A using GPT-4 and RAG (Retrieval Augmented Generation)
- Searches through embedded versions of official compliance documents (KCSiE, EYFS, etc.)
- Clean, mobile-friendly chat interface
- Optional lead capture for marketing
- Analytics to track usage patterns

### Technical Stack
- **Frontend**: Next.js 15.2.4, React 19, Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (already configured)
- **AI/ML**: OpenAI GPT-4 API, text-embedding-3-small
- **Vector DB**: Supabase pgvector (preferred) or Pinecone
- **Document Processing**: LangChain for PDF parsing and chunking

### Implementation Priorities
1. Accuracy is critical - this is compliance guidance
2. Mobile-first design (primary users are on mobile)
3. Clear disclaimers that this is guidance, not legal advice
4. Fast response times with streaming
5. Source attribution for trust

### Common Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run linting
```

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
OPENAI_API_KEY=xxx
```

### File Structure
- `/app/ask-ed/` - Ask Ed chatbot page and components
- `/app/api/ask-ed/` - API routes for chat functionality
- `/lib/ask-ed/` - Core Ask Ed utilities (embeddings, search, etc.)
- `/scripts/` - Document processing and indexing scripts

### Testing Requirements
- Test with real compliance questions from KCSiE and EYFS
- Verify source attribution is accurate
- Ensure mobile responsiveness
- Load test for concurrent users
- Monitor API costs

### Important Constraints
1. Always include disclaimer: "This is AI-generated guidance based on official documents. For legal advice, consult a qualified professional."
2. Rate limit to prevent abuse (consider 20 questions per session)
3. Cache common questions to reduce API costs
4. Log all queries for analytics but respect user privacy
5. Keep response times under 3 seconds

### Document Updates
When regulations are updated:
1. Download new PDF versions
2. Run document processing scripts
3. Re-index in vector database
4. Test with queries about changes
5. Update version metadata

### Lead Generation Strategy
- Trigger email capture after 3-5 valuable interactions
- Offer to "Save this conversation" as value exchange
- Store leads in Supabase with appropriate consent
- Track conversion metrics

### Analytics to Track
- Most common questions
- User satisfaction (thumbs up/down)
- Session duration and question count
- Source document usage
- Error rates and timeouts

### Database Schema
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Document chunks with embeddings
CREATE TABLE ask_ed_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  source_document VARCHAR(255),
  page_number INTEGER,
  section VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat conversations
CREATE TABLE ask_ed_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lead capture
CREATE TABLE ask_ed_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  session_id VARCHAR(255),
  question_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events
CREATE TABLE ask_ed_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(255),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_embeddings ON ask_ed_documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_session_id ON ask_ed_conversations(session_id);
CREATE INDEX idx_analytics_session ON ask_ed_analytics(session_id);
```

### API Endpoints
- `POST /api/ask-ed/chat` - Main chat endpoint
  - Request: `{ message: string, sessionId: string }`
  - Response: `{ response: string, sources: Array, sessionId: string }`
- `GET /api/ask-ed/history/:sessionId` - Retrieve conversation history
- `POST /api/ask-ed/feedback` - Rate responses (thumbs up/down)
- `POST /api/ask-ed/lead` - Capture email for lead generation
- `GET /api/ask-ed/analytics` - Admin analytics dashboard data

### Error Handling
```typescript
// Standard error responses
const ErrorTypes = {
  OPENAI_API_ERROR: "Unable to process your question. Please try again.",
  RATE_LIMIT: "You've reached the question limit. Please try again later.",
  NO_RELEVANT_DOCS: "I couldn't find relevant information for your question.",
  TIMEOUT: "Response took too long. Please try a simpler question.",
  INVALID_INPUT: "Please provide a valid question about compliance."
}
```

### Prompt Engineering
```typescript
// System prompt template
const SYSTEM_PROMPT = `You are Ask Ed, a helpful AI assistant for UK nursery and club compliance.
You have access to official documents including KCSiE and EYFS.
Always cite your sources and include the disclaimer about seeking professional advice.
Be concise, accurate, and helpful. Focus on practical guidance.`;

// Context injection format
const createPrompt = (question: string, context: string[]) => {
  return `Based on the following official guidance:
  ${context.join('\n\n')}
  
  Question: ${question}
  
  Provide a clear, practical answer with source citations.`;
};
```

### Cost Management
- **GPT-4 Turbo**: ~$0.01 per 1K input tokens, $0.03 per 1K output tokens
- **Embeddings**: $0.0001 per 1K tokens
- **Estimated per query**: $0.02-0.05
- **Monthly budget example**: 
  - 1000 queries/month = ~$50
  - 5000 queries/month = ~$250
- **Cost optimization**:
  - Cache common questions
  - Limit context window to 2000 tokens
  - Use GPT-3.5 for simple queries

### Security Measures
1. **Input Sanitization**
   - Strip HTML/scripts from user input
   - Limit message length to 500 characters
   - Validate session IDs

2. **Prompt Injection Prevention**
   - Pre-process user input to escape special characters
   - Use structured prompts with clear boundaries
   - Monitor for suspicious patterns

3. **API Security**
   - Store OpenAI key in environment variables only
   - Implement request signing for internal APIs
   - Use Supabase RLS for data access

### Current Implementation Status
✅ Core utilities created (`/lib/ask-ed/`)
✅ Document processing pipeline ready
✅ API route implemented (`/api/ask-ed/chat`)
✅ Frontend chat interface created (`/app/ask-ed`)
✅ Footer link added

### Next Steps to Make Ask Ed Live
1. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

2. Download compliance PDFs to `/documents/`:
   - kcsie-2024.pdf
   - eyfs-framework.pdf

3. Run document processing:
   ```bash
   npx tsx scripts/process-documents.ts
   ```

4. Test the chat at http://localhost:3000/ask-ed

### External Setup Requirements

#### 1. OpenAI Account
- Sign up at [platform.openai.com](https://platform.openai.com)
- Generate API key (starts with `sk-`)
- Add payment method and set up billing
- Set usage limits ($100/month recommended to start)
- Create separate keys for dev/staging/production

#### 2. Supabase Configuration
```sql
-- Run in Supabase SQL editor
CREATE EXTENSION IF NOT EXISTS vector;
-- Then create tables from Database Schema section above
```

#### 3. Environment Variables
```bash
# .env.local
OPENAI_API_KEY=sk-...your-key...
OPENAI_ORG_ID=org-...optional...

# Also add to Vercel/hosting platform
```

#### 4. Document Collection
Download and store in `/documents/`:
- [KCSiE 2024](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2)
- [EYFS Framework](https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2)
- [Ofsted Inspection Framework](https://www.gov.uk/government/publications/education-inspection-framework)
- Working Together to Safeguard Children
- Prevent Duty Guidance

#### 5. Analytics Setup (Optional)
- Option 1: Plausible - Add script to Ask Ed page
- Option 2: PostHog - Install SDK and configure
- Option 3: Custom analytics using Supabase

#### 6. Legal Preparations
- **Disclaimer text**: "Ask Ed provides guidance based on official documents but is not a substitute for professional legal advice. Always consult qualified professionals for specific compliance matters."
- **Privacy Policy additions**: Explain AI data processing, no PII storage in queries
- **Terms updates**: Liability limitations for AI-generated advice

#### 7. Testing Setup
- Create OpenAI test key with $10 limit
- Set up staging environment variables
- Prepare test questions covering:
  - Safeguarding procedures
  - EYFS requirements
  - Staff ratios
  - Record keeping
  - Ofsted preparation