import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { addDocuments } from '../lib/ask-ed/vectorStore'

async function processEYFSUpdates() {
  console.log('Processing EYFS Updates September 2025...')
  
  const filePath = path.join(__dirname, '../documents/EYFS Updates September 2025.txt')
  
  try {
    // Read the text file
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Split content into chunks (by main bullet points)
    const sections = content.split('\n\n•').map((section, index) => {
      if (index > 0) section = '•' + section // Re-add bullet for sections after first
      return section.trim()
    })
    
    // Create document chunks for vector store
    const chunks = sections.map((section, index) => ({
      content: section,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'eyfs-framework',
        year: '2025',
        chunk_index: index,
        total_chunks: sections.length
      }
    }))
    
    console.log(`Generated ${chunks.length} chunks from EYFS Updates`)
    console.log('Uploading to vector store...')
    
    // Upload in batches
    const batchSize = 50
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      await addDocuments(batch)
      console.log(`Uploaded ${Math.min(i + batchSize, chunks.length)}/${chunks.length} chunks`)
    }
    
    console.log('EYFS Updates September 2025 processing complete!')
    
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
    console.error('Error processing EYFS Updates:', error)
    process.exit(1)
  }
}

processEYFSUpdates()