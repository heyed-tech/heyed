import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { DocumentProcessor } from '../lib/ask-ed/documentProcessor'
import { addDocuments } from '../lib/ask-ed/vectorStore'
import { getSupabase } from '../lib/supabase'

async function main() {
  console.log('🔄 Updating Updates 2025 document...')
  
  const supabase = getSupabase()
  
  try {
    // Step 1: Delete existing "Updates 2025" documents
    console.log('1️⃣ Deleting existing "Updates 2025" documents...')
    const { data: deletedRows, error: deleteError } = await supabase
      .from('ask_ed_documents')
      .delete()
      .eq('source_document', 'Updates 2025')
    
    if (deleteError) {
      throw new Error(`Failed to delete existing documents: ${deleteError.message}`)
    }
    
    console.log(`✅ Deleted existing "Updates 2025" documents`)
    
    // Step 2: Process the corrected Updates 2025 document
    console.log('2️⃣ Processing corrected Updates 2025 document...')
    const processor = new DocumentProcessor()
    
    const documents = [
      { path: path.join(__dirname, '../documents/Updates 2025.pdf'), name: 'Updates 2025' }
    ]
    
    const chunks = await processor.processMultiplePDFs(documents)
    console.log(`📄 Generated ${chunks.length} chunks from corrected Updates 2025`)
    
    // Step 3: Add the new chunks to the vector store
    console.log('3️⃣ Adding corrected chunks to vector store...')
    const batchSize = 50
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      await addDocuments(batch)
      console.log(`📤 Uploaded ${Math.min(i + batchSize, chunks.length)}/${chunks.length} chunks`)
    }
    
    // Step 4: Verify the update
    console.log('4️⃣ Verifying update...')
    const { count, error: countError } = await supabase
      .from('ask_ed_documents')
      .select('*', { count: 'exact', head: true })
      .eq('source_document', 'Updates 2025')
    
    if (countError) {
      throw new Error(`Failed to verify update: ${countError.message}`)
    }
    
    console.log(`✅ Updates 2025 update complete! Now contains ${count} chunks with corrected EYFS information.`)
    console.log('🎉 Ask Ed should now provide accurate EYFS 2025 updates!')
    
  } catch (error) {
    console.error('❌ Error updating Updates 2025:', error)
    process.exit(1)
  }
}

main()