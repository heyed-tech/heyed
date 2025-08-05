import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { DocumentProcessor } from '../lib/ask-ed/documentProcessor'
import { addDocuments } from '../lib/ask-ed/vectorStore'

async function processUpdates() {
  console.log('Processing Updates 2025.pdf...')
  
  const processor = new DocumentProcessor()
  
  const updateDoc = {
    path: path.join(__dirname, '../documents/Updates 2025.pdf'),
    name: 'Updates 2025'
  }
  
  try {
    console.log('Processing PDF...')
    const chunks = await processor.processPDF(updateDoc.path, updateDoc.name)
    
    console.log(`Generated ${chunks.length} chunks from Updates 2025`)
    console.log('Uploading to vector store...')
    
    const batchSize = 50
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      await addDocuments(batch)
      console.log(`Uploaded ${Math.min(i + batchSize, chunks.length)}/${chunks.length} chunks`)
    }
    
    console.log('Updates 2025 processing complete!')
    
    // Show final counts
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { count } = await supabase
      .from('ask_ed_documents')
      .select('*', { count: 'exact', head: true })
      
    console.log(`\nTotal documents in database: ${count}`)
  } catch (error) {
    console.error('Error processing Updates 2025:', error)
    process.exit(1)
  }
}

processUpdates()