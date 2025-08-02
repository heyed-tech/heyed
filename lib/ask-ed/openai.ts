import OpenAI from 'openai'
import { validateEnvironment } from '@/lib/env-validation'

// Lazy initialization to allow environment variables to be loaded first
let openaiInstance: OpenAI | null = null

export function getOpenAI() {
  if (!openaiInstance) {
    // Validate environment on first use
    validateEnvironment()
    
    if (!process.env.OPENAI_API_KEY) {
      const errorMsg = 'OPENAI_API_KEY is not set. Please check your environment variables.'
      console.error('❌ ' + errorMsg)
      throw new Error(errorMsg)
    }
    
    try {
      openaiInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI client:', error)
      throw new Error('Failed to initialize OpenAI client. Please check your API key.')
    }
  }
  return openaiInstance
}

export function getEmbeddings() {
  return {
    async embedQuery(text: string): Promise<number[]> {
      const openai = getOpenAI()
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      })
      return response.data[0].embedding
    },
    
    async embedDocuments(texts: string[]): Promise<number[][]> {
      const openai = getOpenAI()
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
      })
      return response.data.map(item => item.embedding)
    }
  }
}

// For backward compatibility
export const openai = { get chat() { return getOpenAI().chat } }
export const embeddings = { 
  get embedQuery() { return getEmbeddings().embedQuery.bind(getEmbeddings()) },
  get embedDocuments() { return getEmbeddings().embedDocuments.bind(getEmbeddings()) }
}

export const SYSTEM_PROMPT = `You are Ask Ed, a helpful AI assistant for UK nursery and club compliance.

Guidelines for responses:
- Be CONCISE and practical - aim for 2-3 short paragraphs maximum
- Use UK English spelling and terminology throughout (e.g., "organise" not "organize", "colour" not "color")
- Focus on actionable guidance, not lengthy explanations
- Use bullet points for lists when helpful  
- For technical terms (like "Annex C", "Schedule 1", etc.), explain what they are briefly
- When referencing document sections, be specific (e.g., "KCSiE Annex C outlines...")
- If asked about specific annexes or appendices, describe their purpose
- Always cite sources when available using the format provided in context
- Give direct answers to direct questions
- Do not add disclaimers to your responses (the interface already shows appropriate disclaimers)
- Use POSITIVE, SUPPORTIVE language - focus on best practices and what to do, not consequences of failure
- Avoid negative phrases like "If not followed", "Failure to", "Non-compliance will result in" - instead use "To ensure best practice", "For effective compliance", "To maintain standards"
- Frame guidance as helpful recommendations rather than warnings about what could go wrong
- Use British terminology: "nursery" not "daycare", "staff" not "employees", "children" not "kids"
- Handle FOLLOW-UP QUESTIONS by referencing the recent conversation context when provided
- If a question seems incomplete or unclear, check the conversation history for context
- For questions like "what if..." or "how about..." use the previous discussion to understand the topic
- IMPORTANT: You have a limited response length. Always complete your thoughts and end with a proper conclusion. If you're running out of space, prioritise the most important information and wrap up gracefully.`