import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('ask_ed_conversations')
      .select('messages')
      .eq('session_id', params.sessionId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No conversation found
        return new Response(
          JSON.stringify({ messages: [] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
      throw error
    }
    
    return new Response(
      JSON.stringify({ messages: data?.messages || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch conversation history' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}